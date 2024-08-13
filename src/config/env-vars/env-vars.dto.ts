import { IsDefined, IsIn, IsNumber, IsString } from 'class-validator';

export enum EnvObj {
  APP = 'App',
  POSTGRESQL = 'PostgreSQL',
}

export enum EEnvironment {
  LOCAL = 'local',
  DEV = 'develop',
  PROD = 'production',
  TEST = 'test',
}

export class EnvironmentVariables {
  @IsDefined()
  @IsNumber()
  PORT: number;

  @IsDefined()
  @IsIn(Object.values(EEnvironment))
  NODE_ENV: EEnvironment;

  @IsDefined()
  @IsString()
  PG_DB_HOST: string;

  @IsDefined()
  @IsString()
  PG_DB_PORT: string;

  @IsDefined()
  @IsString()
  PG_DB_USER: string;

  @IsDefined()
  @IsString()
  PG_DB_PASS: string;

  @IsDefined()
  @IsString()
  PG_DB_NAME: string;
}

export class IApp {
  PORT: number;
  ENV: EEnvironment;
}

export class IPostgreSQL {
  HOST: string;
  PORT: number;
  USER: string;
  PASS: string;
  NAME: string;
}

export interface IEnvVars {
  App: IApp;
  PostgreSQL: IPostgreSQL;
}
