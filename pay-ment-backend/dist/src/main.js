"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = require("connect-redis");
const dotenv_1 = __importDefault(require("dotenv"));
const consumer_1 = require("../kafka/consumer");
const redis_1 = require("../util/redis");
dotenv_1.default.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    await (0, redis_1.connectRedis)();
    redis_1.redisClient.on('error', (err) => {
        console.error('❌ Redis Error:', err);
    });
    app.use((0, express_session_1.default)({
        store: new connect_redis_1.RedisStore({
            client: redis_1.redisClient,
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
    }));
    await (0, consumer_1.startPaymentConsumer)();
    console.log('Kafka Payment Consumer 시작');
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });
    await app.listen(4000);
    console.log('🚀 NestJS 서버 실행 (4000)');
}
bootstrap();
//# sourceMappingURL=main.js.map