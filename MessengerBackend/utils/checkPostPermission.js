// backend/utils/checkPostPermission.js
const Post = require('../models/Post');
const friends = require('../models/friends');

/**
 * 게시글 조회 권한 체크
 */
async function checkPostPermission(postId, userObjectId, isLogin) {
  const post = await Post.findById(postId)
    .populate('authorId', '_id name profileImage')
    .lean();

  if (!post) {
    return { 
      hasPermission: false, 
      status: 404, 
      message: '게시물을 찾을 수 없습니다.' 
    };
  }

  // 1. 공개 게시글
  if (post.visibility === 'public') {
    return { hasPermission: true, post };
  }

  // 2. 로그인 안 됨
  if (!isLogin) {
    return { 
      hasPermission: false, 
      status: 403, 
      message: '로그인이 필요합니다.' 
    };
  }

  // 3. 본인 게시글
  if (post.authorId._id.equals(userObjectId)) {
    return { hasPermission: true, post };
  }

  // 4. 친구공개 게시글
  if (post.visibility === 'friends') {
    const isFriend = await friends.findOne({
      $or: [
        { requester: userObjectId, recipient: post.authorId._id, status: 'accepted' },
        { requester: post.authorId._id, recipient: userObjectId, status: 'accepted' }
      ]
    });

    if (isFriend) {
      return { hasPermission: true, post };
    }
  }

  // 5. 권한 없음
  return { 
    hasPermission: false, 
    status: 403, 
    message: '이 게시물을 볼 권한이 없습니다.' 
  };
}

/**
 * 친구 목록 조회
 */
async function getFriendIds(userObjectId) {
  const friendships = await friends.find({
    $or: [
      { requester: userObjectId, status: 'accepted' },
      { recipient: userObjectId, status: 'accepted' }
    ]
  }).lean();

  return friendships.map(f =>
    f.requester.equals(userObjectId) ? f.recipient : f.requester
  );
}

/**
 * 게시글 필터 생성
 */
function createPostFilter(isLogin, userObjectId, friendIds, additionalFilter = {}) {
  let filter = { ...additionalFilter };

  if (isLogin) {
    filter.$or = [
      { visibility: 'public' },
      { visibility: 'friends', authorId: { $in: friendIds } },
      { authorId: userObjectId }
    ];
  } else {
    filter.visibility = 'public';
  }

  return filter;
}

module.exports = { 
  checkPostPermission, 
  getFriendIds,
  createPostFilter
};