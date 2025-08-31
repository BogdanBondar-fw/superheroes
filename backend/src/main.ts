import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('[Bootstrap] Starting application...');
    console.log('[Bootstrap] Environment check:');
    console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`  PORT: ${process.env.PORT}`);
    console.log(
      `  DATABASE_URL: ${process.env.DATABASE_URL ? 'set (' + process.env.DATABASE_URL.substring(0, 50) + '...)' : 'not set'}`
    );

    const app = await NestFactory.create(AppModule);
    console.log('[Bootstrap] NestJS app created successfully');

    // No global prefix - let each controller define its own path

    // Log all incoming requests for debugging
    app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(
        `[REQUEST] ${req.method} ${req.url} from ${req.ip || req.socket?.remoteAddress || 'unknown'}`
      );
      next();
    });

    // Global error handler for better debugging
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error('[GLOBAL ERROR]:', err);
      if (!res.headersSent) {
        res.status(500).json({ statusCode: 500, message: 'Internal server error' });
      }
      next();
    });

    // Simple CORS configuration for debugging
    app.enableCors({
      origin: ['https://superher0s.netlify.app', 'http://localhost:5173', 'http://localhost:3000'],
      methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type,Authorization',
      credentials: true,
    });
    console.log('[Bootstrap] CORS configured');

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true, forbidUnknownValues: false })
    );
    console.log('[Bootstrap] Global pipes configured');

    const port = process.env.PORT ?? 3000;
    const host = '0.0.0.0'; // Bind to all interfaces for Render
    console.log(`[Bootstrap] About to listen on ${host}:${port}`);
    console.log(`[Bootstrap] Render Environment Variables:`);
    console.log(`  PORT: ${process.env.PORT}`);
    console.log(`  RENDER_SERVICE_ID: ${process.env.RENDER_SERVICE_ID || 'not set'}`);
    console.log(`  RENDER_SERVICE_NAME: ${process.env.RENDER_SERVICE_NAME || 'not set'}`);
    console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`  DATABASE_URL: ${process.env.DATABASE_URL ? 'set' : 'not set'}`);

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
    console.log(`  RENDER_SERVICE_ID: ${process.env.RENDER_SERVICE_ID || 'not set'}`);
  } catch (error) {
    console.error('[Bootstrap] Fatal error during startup:', error);
    process.exit(1);
  }
}
void bootstrap();
