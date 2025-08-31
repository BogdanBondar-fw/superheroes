import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- CORS --------------------------------------------------------------
  // Some hosting platforms (or intermediaries returning error pages) may omit
  // CORS headers on failure responses causing the frontend to see
  // "No 'Access-Control-Allow-Origin'". We configure CORS explicitly.
  // FRONTEND_ORIGIN may contain a single origin or a comma-separated list.
  const originsEnv = process.env.FRONTEND_ORIGIN;
  const explicitOrigins = originsEnv
    ? originsEnv
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean)
    : [];

  app.enableCors(
    explicitOrigins.length
      ? {
          origin: (
            origin: string | undefined,
            cb: (err: Error | null, allow?: boolean) => void
          ) => {
            if (!origin || explicitOrigins.includes(origin)) {
              cb(null, true);
              return;
            }
            cb(null, false);
          },
          methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
          allowedHeaders: 'Content-Type,Authorization',
        }
      : {
          // Fallback: allow all origins if FRONTEND_ORIGIN not configured.
          origin: true,
          methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
          allowedHeaders: 'Content-Type,Authorization',
        }
  );
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidUnknownValues: false })
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
