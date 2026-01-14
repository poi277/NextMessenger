// backend/db/mongodb.js
const mongoose = require('mongoose');

const uri = 'mongodb+srv://poi:123@cluster0.ddplv1p.mongodb.net/next-first-app?appName=Cluster0';

async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    // 0이면 연결 안 된 상태
    await mongoose.connect(uri, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // dbName: 'next-first-app', // DB 이름 명시
    });
  }
  return mongoose.connection;
}

module.exports = { connectToDatabase };
