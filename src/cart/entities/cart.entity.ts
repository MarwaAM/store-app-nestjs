export class ItemInCart {
	id: number;
	name: string;
	price: number;
	seller: string;
}

export class CartItem {
	user_id: number;
	item: ItemInCart;
	quantity: number;
	created_at: string
}
