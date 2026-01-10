import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import session from 'express-session';
import { RedisStore } from 'connect-redis';
import dotenv from 'dotenv';

import { startPaymentConsumer } from 'kafka/consumer';
import { connectRedis, redisClient } from 'util/redis';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // 🔥 Redis 연결 (단 한 번)
  await connectRedis();

  redisClient.on('error', (err) => {
    console.error('❌ Redis Error:', err);
  });

  // 🔐 session도 같은 Redis 사용
  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
        prefix: 'nextlogin:',
      }),
      secret: 'your-secret-key-change-this',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      },
    }),
  );

  // 🔥 Kafka Consumer 시작
  await startPaymentConsumer();
  console.log('Kafka Payment Consumer 시작');

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(4000);
  console.log('🚀 NestJS 서버 실행 (4000)');
}

bootstrap();
