import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  const port = process.env.PORT ?? 3000;
  const host = '0.0.0.0'; // Bind to all interfaces
  await app.listen(port, host);
  console.log(`[Nest] Application is running on ${host}:${port}`);
}
void bootstrap();
