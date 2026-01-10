const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { authMiddleware } = require('../middleware/auth');

router.post('/input', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userObjectId;
    const { productId, amount } = req.body.product;

    if (!productId || !amount) {
      return res.status(400).json({ message: '상품 ID와 수량이 필요합니다.' });
    }

    //Cart 가져오기(없으면 새로 생성)
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, amount }]
      });
      await cart.save();
      return res.json({ message: '상품이 추가되었습니다.', cart });
    }

    // 이미 장바구니에 있는지 확인
    const exists = cart.items.find(item => item.productId.toString() === productId);

    if (exists) {
      exists.amount += amount;   // 수량 증가
    } else {
      cart.items.push({ productId, amount });
    }

    await cart.save();

    res.json({ message: '장바구니에 담았습니다!', cart });

  } catch (error) {
    res.status(500).json({ message: '장바구니 서버 오류' });
  }
});


router.get('/get', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userObjectId;

    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      return res.json({ items: [] }); // 신규 유저 빈 장바구니
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "장바구니 불러오기 실패" });
  }
});

// 장바구니 상품 삭제
router.delete('/:productId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userObjectId;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "장바구니 없음" });

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();
    res.json({ message: "상품 삭제 완료", cart });

  } catch (err) {
    res.status(500).json({ message:"상품 담기 에러" });
  }
});

// 수량 변경
router.put('/:productId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userObjectId;
    const { productId } = req.params;
    const { amount } = req.body;

    if (amount < 1)
      return res.status(400).json({ message: "수량은 1 이상" });
    
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "장바구니 없음" });

    const item = cart.items.find(
      item => item.productId.toString() === productId
    );

    if (!item)
      return res.status(404).json({ message: "상품이 장바구니에 없음" });

    item.amount = amount;

    await cart.save();
    res.json({ message: "수량 변경 완료", cart });

  } catch (err) {
    res.status(500).json({ message: "장바구니 서버 오류"});
  }
});



module.exports = router;
