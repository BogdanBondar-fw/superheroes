import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as express from 'express';
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

    // Enable JSON parsing middleware BEFORE any routes
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    console.log('[Bootstrap] JSON parsing middleware configured');

    // (Removed global prefix to avoid duplicate /api/api paths – controllers already include 'api/' where needed)

    // Log all incoming requests for debugging (very lightweight)
    app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`[REQ] ${req.method} ${req.url}`);
      console.log(`[REQ] Headers:`, JSON.stringify(req.headers, null, 2));
      if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        console.log(`[REQ] Raw Body:`, req.body);
        console.log(`[REQ] Body Type:`, typeof req.body);
        console.log(
          `[REQ] Body Keys:`,
          req.body ? Object.keys(req.body as Record<string, unknown>) : []
        );
        console.log(`[REQ] Content-Type:`, req.headers['content-type']);
        console.log(`[REQ] Content-Length:`, req.headers['content-length']);
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

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    console.log('[Bootstrap] Global pipes configured');

    const port = process.env.PORT ?? 3000;
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'; // 0.0.0.0 для продакшна
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

// Process-level safety nets for visibility
process.on('unhandledRejection', (reason) => {
  console.error('[Process] Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[Process] Uncaught Exception:', err);
});
