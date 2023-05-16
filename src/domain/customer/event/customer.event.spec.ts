import EventDispatcher from "../../@shared/event/event-dispatcher"
import EventDispatcherInterface from "../../@shared/event/event-dispatcher.interface"
import CustomerCreatedEvent from "./customer-created.event";
import LogWhenCustomerIsCreatedHandler from "./handler/log-when-customer-is-created.handler";
import Log2WhenCustomerIsCreatedHandler from "./handler/log2-when-customer-is-created.handler";

describe('Customer events', () => {
  let eventDispatcher: EventDispatcherInterface

  beforeEach(() => {
    eventDispatcher = new EventDispatcher()
  });

  afterEach(() => {
    eventDispatcher = null;
  })

  describe('CustomerCreated', () => {
    it('should fire event when customer is created', () => {
      const logHandler1 = new LogWhenCustomerIsCreatedHandler();
      const logHandler2 = new Log2WhenCustomerIsCreatedHandler();
      eventDispatcher.register("CustomerCreatedEvent", logHandler1);
      eventDispatcher.register("CustomerCreatedEvent", logHandler2);
      const customerCreatedEvent = new CustomerCreatedEvent({ id: 111111 });
      const logSpy = jest.spyOn(console, "log");

      eventDispatcher.notify(customerCreatedEvent);

      expect(logSpy).toBeCalledWith("Esse é o primeiro console.log do evento: CustomerCreated");
      expect(logSpy).toBeCalledWith("Esse é o segundo console.log do evento: CustomerCreated");
    });
  });
})