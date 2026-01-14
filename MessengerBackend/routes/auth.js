const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const { saveUserSession, destroyUserSession, activeSessions } = require('../utils/sessionHelper');
const { incrementLoginFail, getLoginFailCount, resetLoginFail } = require('../utils/loginfalse'); // ✅ 분리된 함수 가져오기
const router = express.Router();
const redisClient = require('../utils/redisClient');

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { id, password, captchaToken } = req.body;

    // 현재 실패 횟수 확인
    const failCount = await getLoginFailCount(id);

    // 5회 이상 실패 시 캡차 필수
    if (failCount >= 5) {
      if (!captchaToken) {
        return res.status(403).json({
          message: '캡차 인증이 필요합니다.',
          requireCaptcha: true,
          failCount,
          isAuthSuccess: false,
        });
      }

      // 캡차 검증
      const captchaValid = await redisClient.get(`captcha_verified:${captchaToken}`);
      if (!captchaValid) {
        return res.status(403).json({
          message: '캡차 인증이 유효하지 않습니다. 다시 시도해주세요.',
          requireCaptcha: true,
          failCount,
          isAuthSuccess: false,
        });
      }

      // 캡차 토큰 일회용 처리
      await redisClient.del(`captcha_verified:${captchaToken}`);
    }

    // 사용자 조회
    const user = await User.findOne({ id });

    if (!user) {
      const newCount = await incrementLoginFail(id);
      return res.status(403).json({
        isAuthSuccess: false,
        message: '잘못된 아이디 또는 비밀번호입니다.',
        failCount: newCount,
        requireCaptcha: newCount >= 5,   
      });
    }

    if (user.platform !== 'Messenger') {
      return res.status(403).json({
        message: '이 계정은 Messenger로 가입된 계정이 아닙니다.',
        requireCaptcha: failCount >= 5, 
      });
    }

    // 비밀번호 확인
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      const newCount = await incrementLoginFail(id);
      return res.status(403).json({
        message: `잘못된 아이디 또는 비밀번호입니다. ( 현재 ${newCount}회 실패 )`,
        failCount: newCount,
        isAuthSuccess: false,
        requireCaptcha: newCount >= 5, 
      });
    }
    // 로그인 성공 실패 횟수 초기화
    await resetLoginFail(id);
    await saveUserSession(req, user);

    return res.json({
      isAuthSuccess: true,
      message: '로그인 성공',
      user: { id: user.id, name: user.name },
      requireCaptcha: false, 
    });
  } catch (error) {
    res.status(500).json({ message: '로그인 서버 오류' });
  }
});


// 로그아웃
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    await destroyUserSession(req, res);
    res.json({ message: '로그아웃 성공' });
  } catch (error) {
    res.status(500).json({ message: '로그아웃 실패' });
  }
});

// 현재 사용자 정보 가져오기
router.get('/me', authMiddleware, async (req, res) => {
  try {
    if (!req.session.isAuthenticated) {
      return res.status(403).json({ message: '인증되지 않았습니다.' });
    }
    const user = await User.findById(req.session.userObjectId).select('-password');
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    //  혹시 누락된 경우 대비 (이중 체크)
    if (user.online && !activeSessions.has(user._id.toString())) {
      activeSessions.add(user._id.toString());
    }
    res.json({
      message:"내 정보",
      isLoggedIn: true,
      user: {
        name: user.name,
        uuid: user.uuid,
        profileImageUrl: user.profileImage?.url || "",
        userObjectId: user._id,
        email:user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: '로그인 서버 오류' });
  }
});

module.exports = router;
module.exports.activeSessions = activeSessions;
