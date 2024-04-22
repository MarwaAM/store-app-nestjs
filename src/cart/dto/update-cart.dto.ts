import { ItemInCart } from '../entities/cart.entity';

export class UpdateCartDto {
	item: ItemInCart;
	quantity: number;
}
