// backend/utils/sessionHelper.js
const User = require('../models/User');

// activeSessions import (DB 방식 선택 시 제거 가능)
const activeSessions = new Set();

/**
 * 세션 저장 및 online 상태 업데이트
 */
async function saveUserSession(req, user) {
  return new Promise((resolve, reject) => {
    req.session.isAuthenticated = true;
    req.session.userName = user.name;
    req.session.userObjectId = user._id;

    req.session.save(async (err) => {
      if (err) {
        console.error('Session save error:', err);
        return reject(err);
      }

      try {
        //메모리에 추가
        activeSessions.add(user._id.toString());

        // DB에도 저장 (선택사항)
        await User.findByIdAndUpdate(user._id, {
          online: true,
          lastSeen: new Date()
        });

        resolve();
      } catch (dbError) {
        console.error('DB update error:', dbError);
        reject(dbError);
      }
    });
  });
}

/**
 * 세션 종료 및 online 상태 업데이트
 */
async function destroyUserSession(req, res) {
  const userId = req.session.userObjectId?.toString();

  return new Promise((resolve, reject) => {
    req.session.destroy(async (err) => {
      if (err) {
        return reject(err);
      }

      if (userId) {
        // 메모리에서 제거
        activeSessions.delete(userId);

        // DB 업데이트
        try {
          await User.findByIdAndUpdate(userId, {
            online: false,
            lastSeen: new Date()
          });
        } catch (dbError) {
          console.error('DB update error:', dbError);
        }
      }

      res.clearCookie('connect.sid');
      resolve();
    });
  });
}

async function restoreOnlineSessions() {
  try {
    const onlineUsers = await User.find({ online: true }).select('_id');
    onlineUsers.forEach(user => {
      activeSessions.add(user._id.toString());
    });
    console.log(`${onlineUsers.length}명의 온라인 사용자 복구 완료`);
  } catch (error) {
    console.error('온라인 세션 복구 실패:', error);
  }
}



module.exports = {
  saveUserSession,
  destroyUserSession,
  activeSessions,
  restoreOnlineSessions
};