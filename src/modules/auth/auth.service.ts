import { Injectable, ConflictException, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { OracleService } from '../../config/oracle.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private oracleService: OracleService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto, ip: string) {
    const { name, email, password } = registerDto;

    const existing = await this.oracleService.queryOne(
      'SELECT user_id FROM users WHERE email = :email',
      { email }
    );
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.oracleService.execute(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES (:name, :email, :pwd, 'student')`,
      { name, email, pwd: hashedPassword }
    );

    const user = await this.oracleService.queryOne(
      'SELECT user_id FROM users WHERE email = :email',
      { email }
    );
    const userId = user?.USER_ID;

    await this.oracleService.execute(
      `INSERT INTO audit_log (user_id, action, ip_address)
       VALUES (:userId, 'REGISTER', :ip)`,
      { userId, ip }
    );

    const token = this.jwtService.sign({ id: userId, role: 'student' });
    return {
      message: 'Account created successfully',
      token,
    
    };
  }

  async login(loginDto: LoginDto, ip: string) {
    const { email, password } = loginDto;

    const user = await this.oracleService.queryOne(
      'SELECT user_id, full_name, email, password_hash, role, is_active FROM users WHERE email = :email',
      { email }
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.PASSWORD_HASH);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.IS_ACTIVE) {
      throw new UnauthorizedException('Account deactivated. Contact admin.');
    }

    await this.oracleService.execute(
      `INSERT INTO audit_log (user_id, action, ip_address)
       VALUES (:userId, 'LOGIN', :ip)`,
      { userId: user.USER_ID, ip }
    );

    const token = this.jwtService.sign({ id: user.USER_ID, role: user.ROLE });
    return {
      token,
     
    };
  }

  async logout(userId: number, ip: string) {
    if (userId) {
      await this.oracleService.execute(
        `INSERT INTO audit_log (user_id, action, ip_address)
         VALUES (:userId, 'LOGOUT', :ip)`,
        { userId, ip }
      );
    }
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.oracleService.queryOne(
      'SELECT user_id FROM users WHERE email = :email',
      { email }
    );
    if (!user) {
      throw new NotFoundException('No account found with that email');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.oracleService.execute(
      `INSERT INTO password_resets (user_id, token, expires_at)
       VALUES (:userId, :token, :expiresAt)`,
      { userId: user.USER_ID, token, expiresAt }
    );

    return {
      message: 'Password reset token generated',
      reset_token: token,
      expires_in: '1 hour'
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const reset = await this.oracleService.queryOne(
      `SELECT r.reset_id, r.user_id FROM password_resets r
       WHERE r.token = :token
       AND r.used = 0
       AND r.expires_at > CURRENT_TIMESTAMP`,
      { token }
    );
    if (!reset) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.oracleService.execute(
      'UPDATE users SET password_hash = :pwd WHERE user_id = :userId',
      { pwd: hashedPassword, userId: reset.USER_ID }
    );

    await this.oracleService.execute(
      'UPDATE password_resets SET used = 1 WHERE reset_id = :resetId',
      { resetId: reset.RESET_ID }
    );

    return { message: 'Password reset successfully' };
  }
}
