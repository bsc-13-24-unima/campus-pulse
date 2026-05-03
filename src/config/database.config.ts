import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECTION_STRING,
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 1,
  poolTimeout: 60,
}));