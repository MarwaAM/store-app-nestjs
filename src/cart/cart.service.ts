import { Injectable } from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  findAll() {
    return `This action returns all cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    console.log(updateCartDto);
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
