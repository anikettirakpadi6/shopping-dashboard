export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;

  user?: {
    name: string;
    email?: string;
  };

  items: OrderItem[];

  totalAmount: number;

  status:
    | "pending"
    | "processing"
    | "completed"
    | "cancelled";

  paymentStatus:
    | "pending"
    | "paid"
    | "failed";

  address: string;

  createdAt: string;
}