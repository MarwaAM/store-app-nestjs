import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';

import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('user/:userId/cart')
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Get()
	getCart() {
		return this.cartService.findAll();
	}

	@Patch()
	updateCart(@Param('userId') userId: string, @Body() updateCartDto: UpdateCartDto) {
		return this.cartService.update(+userId, updateCartDto);
	}

	@Delete()
	removeItemFromCart(@Query('id') id: string) {
		return this.cartService.remove(+id);
	}
}
