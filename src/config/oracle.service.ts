import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';

@Injectable()
export class OracleService implements OnModuleInit, OnModuleDestroy {
  private pool: oracledb.Pool;

  constructor(private configService: ConfigService) {
    oracledb.autoCommit = false;
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
  }

  async onModuleInit() {
    try {
      // Read config values with debug
      const host = this.configService.get<string>('DB_HOST');
      const port = this.configService.get<string>('DB_PORT');
      const serviceName = this.configService.get<string>('DB_SERVICE_NAME');
      const user = this.configService.get<string>('DB_USER');
      const password = this.configService.get<string>('DB_PASSWORD');

      console.log('🔍 Debug - Config values:');
      console.log(`  DB_HOST: ${host}`);
      console.log(`  DB_PORT: ${port}`);
      console.log(`  DB_SERVICE_NAME: ${serviceName}`);
      console.log(`  DB_USER: ${user}`);
      console.log(`  DB_PASSWORD: ${password ? '***' : 'NOT SET'}`);

      if (!host || !port || !serviceName) {
        console.error('❌ Missing database configuration. Please check your .env file');
        return;
      }

      const connectString = `${host}:${port}/${serviceName}`;
      console.log(`📡 Connection string: ${connectString}`);

      this.pool = await oracledb.createPool({
        user: user,
        password: password,
        connectString: connectString,
        poolMin: 1,
        poolMax: 5,
        poolIncrement: 1,
        poolTimeout: 60,
      });
      
      console.log('✅ Oracle connection pool created');
      
      const conn = await this.pool.getConnection();
      const result = await conn.execute('SELECT 1 FROM DUAL');
      console.log('✅ Database connected successfully');
      await conn.close();
    } catch (err) {
      console.error('❌ Oracle connection failed:', err);
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.close();
      console.log('Connection pool closed');
    }
  }

  async getConnection() {
    return await this.pool.getConnection();
  }

  async query(sql: string, params: any = {}): Promise<any[]> {
    let conn;
    try {
      conn = await this.getConnection();
      const result = await conn.execute(sql, params);
      return result.rows || [];
    } finally {
      if (conn) await conn.close();
    }
  }

  async queryOne(sql: string, params: any = {}): Promise<any> {
    const rows = await this.query(sql, params);
    return rows && rows.length > 0 ? rows[0] : null;
  }

  async execute(sql: string, params: any = {}): Promise<any> {
    let conn;
    try {
      conn = await this.getConnection();
      const result = await conn.execute(sql, params);
      await conn.commit();
      return result;
    } catch (err) {
      if (conn) await conn.rollback();
      throw err;
    } finally {
      if (conn) await conn.close();
    }
  }
}
