import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { EEnvironment, EnvironmentVariables, IEnvVars } from './env-vars.dto';

export const envConfig = (): IEnvVars => {
  return {
    App: {
      PORT: parseInt(process.env.PORT, 10),
      ENV: EEnvironment[process.env.NODE_ENV.toUpperCase()],
    },
    PostgreSQL: {
      HOST: process.env.PG_DB_HOST,
      PORT: parseInt(process.env.PG_DB_PORT),
      USER: process.env.PG_DB_USER,
      PASS: process.env.PG_DB_PASS,
      NAME: process.env.PG_DB_NAME,
    },
  };
};

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
