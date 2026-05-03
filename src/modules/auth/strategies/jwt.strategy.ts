
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { OracleService } from '../../../config/oracle.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private oracleService: OracleService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const userId = payload.id;
    const user = await this.oracleService.queryOne(
      'SELECT user_id, full_name, email, role, is_active FROM users WHERE user_id = :id',
      { id: userId }
    );
    if (!user || user.IS_ACTIVE === 0) {
      throw new UnauthorizedException('User not found or inactive');
    }
    return {
      id: user.USER_ID,
      name: user.FULL_NAME,
      email: user.EMAIL,
      role: user.ROLE,
    };
  }
}
