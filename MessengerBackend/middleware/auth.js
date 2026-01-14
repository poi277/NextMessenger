function authMiddleware(req, res, next) {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ message: '인증이 필요합니다.' });
  }
  // req에 사용자 정보 추가
  req.user = {
    name: req.session.userName, 
    userObjectId: req.session.userObjectId
  };

  next();
}

function isLogin(req, res, next) {
  const isAuthenticated = req.session?.isAuthenticated || false;
  req.auth = {
    isLogin: isAuthenticated,
    userObjectId: isAuthenticated ? req.session.userObjectId : null
  };
  next();
}


module.exports = {authMiddleware,isLogin};
