const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { RedisStore } = require('connect-redis');
const { connectToDatabase } = require('./db/db');
const http = require('http');
const WebSocket = require('ws');
const redisClient = require('./utils/redisClient');
const { startChatConsumer } = require('./kafka/consumer');


const postsRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
const registerRoutes = require('./routes/register');
const oauthRoutes = require('./routes/OauthRegister');
const s3Router = require('./routes/s3');
const postlikesRoutes = require('./routes/postlike');
const userinfo = require('./routes/userinfo');
const comments = require('./routes/comments');
const friends = require('./routes/friends');
const mail = require('./routes/mailsender');
const profile = require('./routes/profile');
const header = require('./routes/header');
const chat = require('./routes/chat');
const captcha = require('./routes/captcha');
const { restoreOnlineSessions } = require('./utils/sessionHelper');
const https = require('https');
const fs = require('fs');
const app = express();

// const server = https.createServer(
//   {
//     key: fs.readFileSync('../localhost-key.pem'),
//     cert: fs.readFileSync('../localhost.pem'),
//   },
//   app
// );
//https 설정이지만 검증용, 프론트랑 백엔드는 https를 ssl을 Nginx/ALB을 사용할것
const server = http.createServer(app);
const isProduction = process.env.NODE_ENV === 'production';
console.log(`${process.env.NODE_ENV} 환경에서 실행중`)
if (isProduction) {
  app.set('trust proxy', 1);
}

// CORS 설정
app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

// 세션 설정 (RedisStore 적용)
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new RedisStore({   
    client: redisClient,
    prefix: "nextlogin:", // (선택사항) Redis 키 앞에 붙을 접두사
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAMESITE || 'lax',
  }
});

app.use(sessionMiddleware);

// WebSocket 서버 생성
const wss = new WebSocket.Server({ server, path: '/ws' });
const clients = new Map(); // userId -> ws
const onlineUsers = new Set();

// WebSocket을 라우트에서 사용할 수 있도록 전달
app.set('onlineUsers', onlineUsers); // ✅ 추가
app.set('wss', wss);
app.set('wsClients', clients);
app.set('sessionMiddleware', sessionMiddleware);


//기존 app, ws, session 세팅 이후
startChatConsumer(app).catch((err) => {
  console.error('Kafka Consumer 시작 실패', err);
});


// MongoDB 연결 (비즈니스 데이터용)
connectToDatabase()
  .then(() => {
    console.log('MongoDB 연결 성공! (데이터 저장소)');
    return restoreOnlineSessions(); 
  })
  .then(() => {
    console.log('온라인 세션 복구 시도 완료');
  })
  .catch(err => {
    console.error('초기화 실패:', err);
  });

// Express 라우트
app.use('/api/s3', s3Router);
app.use('/api/posts', postsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/postlike', postlikesRoutes);
app.use('/api/userinfo', userinfo);
app.use('/api/comments', comments);
app.use('/api/friends', friends);
app.use('/api/mail', mail);
app.use('/api/profile', profile);
app.use('/api/header', header);
app.use('/api/chat', chat);
app.use('/api/captcha', captcha);

// WebSocket 초기화 (라우트 등록 후)
chat.initializeWebSocket(app);

// 서버 시작
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 서버 실행중: http://localhost:${PORT}`);
  console.log(`WebSocket: ws://localhost:${PORT}/ws`);
});
module.exports = { redisClient };