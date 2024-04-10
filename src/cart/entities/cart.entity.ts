export interface Item {
  id: string;
  price: number;
}

export class Cart {
  userId: number;
  items: Item[];
  total: number;
}
