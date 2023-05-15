import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update({
      id: entity.id,
      customer_id: entity.customerId,
      total: entity.total(),
      items: entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
      })),
    },
    {
      where: {
        id: entity.id,
      },
    });
    await OrderItemModel.create({
      id: entity.items[1].id,
      name: entity.items[1].name,
      price: entity.items[1].price,
      product_id: entity.items[1].productId,
      quantity: entity.items[1].quantity,
      order_id: entity.id,
    })
  }

  async find(id: string): Promise<Order> {
    const foundOrder = await OrderModel.findOne({
      where: {
        id
      },
      include: [{ all: true }]
    });

    const items = foundOrder.items.map(item => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity))
    const order = new Order(foundOrder.id, foundOrder.customer_id, items);
    return order;
  }

  findAll(): Promise<Order[]> {
    throw new Error("Method not implemented.");
  }
}
