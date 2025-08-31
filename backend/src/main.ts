import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // No global prefix - let each controller define its own path

  // Log all incoming requests for debugging
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(
      `[REQUEST] ${req.method} ${req.url} from ${req.ip || req.socket?.remoteAddress || 'unknown'}`
    );
    next();
  });

  // Global error handler for better debugging
  app.use((err: any, req: Request, res: Response) => {
    console.error('[GLOBAL ERROR]:', err);
    if (!res.headersSent) {
      res.status(500).json({ statusCode: 500, message: 'Internal server error' });
    }
  });

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
  const host = '0.0.0.0'; // Bind to all interfaces for Railway
  console.log(`[Bootstrap] About to listen on ${host}:${port}`);
  console.log(`[Bootstrap] Railway Environment Variables:`);
  console.log(`  PORT: ${process.env.PORT}`);
  console.log(`  RAILWAY_DEPLOYMENT_ID: ${process.env.RAILWAY_DEPLOYMENT_ID || 'not set'}`);
  console.log(`  RAILWAY_ENVIRONMENT: ${process.env.RAILWAY_ENVIRONMENT || 'not set'}`);
  console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);

  await app.listen(port, host);
  console.log(`[Bootstrap] ✅ Successfully listening on ${host}:${port}`);
  console.log(`[Bootstrap] Application is ready to receive requests`);
  console.log(`[Bootstrap] Available routes:`);
  console.log(`  GET  ${host}:${port}/health`);
  console.log(`  GET  ${host}:${port}/api/health`);
  console.log(`  GET  ${host}:${port}/api/heroes`);

  // Log environment info
  console.log(`[Bootstrap] Environment info:`);
  console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`  PORT: ${process.env.PORT}`);
  console.log(`  RAILWAY_DEPLOYMENT_ID: ${process.env.RAILWAY_DEPLOYMENT_ID || 'not set'}`);
}
void bootstrap();
