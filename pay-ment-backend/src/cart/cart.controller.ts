import { Controller, Post, Get, Delete, Put, Body, Param, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service'
import { AuthGuard } from '../../middleware/authMiddleware';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}


@Post('input')
async addToCart(@Req() req, @Body() body) {
  const user = req.user;
  const cart = await this.cartService.addToCart(
    user.userObjectId,
    body.product,
  );
  return {
    success: true,
    message: '장바구니에 담았습니다!',
    cart,
  };
}


  @Get('get')
  async getCart(@Req() req) {
    const user = req.user;
    return this.cartService.getCart(user.userObjectId);
  }

  @Delete(':productId')
  async deleteItem(
    @Req() req,
    @Param('productId') productId: string
  ) {
    const user = req.user;
    return this.cartService.deleteItem(user.userObjectId, Number(productId));
  }

  @Put(':productId')
  async updateAmount(
    @Req() req,
    @Param('productId') productId: string,
    @Body() body
  ) {
    const user = req.user;
    return this.cartService.updateAmount(user.userObjectId, Number(productId), body.amount);
  }
}
