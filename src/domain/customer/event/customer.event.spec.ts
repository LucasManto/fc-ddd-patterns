import EventDispatcher from "../../@shared/event/event-dispatcher"
import EventDispatcherInterface from "../../@shared/event/event-dispatcher.interface"
import Address from "../value-object/address";
import AddressChangedEvent from "./address-changed.event";
import CustomerCreatedEvent from "./customer-created.event";
import LogWhenCustomerIsCreatedHandler from "./handler/log-when-customer-is-created.handler";
import LogWhenCustomersAddressIsChanged from "./handler/log-when-customers-address-is-changed.handler";
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

  describe('AddressChanged', () => {
    it('should fire event when customers\' address is changed', () => {
      const eventData = {
        id: 111111,
        name: "Test",
        address: new Address("St. One", 1, "1111-22", "City")
      }
      const logHandler = new LogWhenCustomersAddressIsChanged();
      eventDispatcher.register("AddressChangedEvent", logHandler);
      const addressChangedEvent = new AddressChangedEvent(eventData);
      const logSpy = jest.spyOn(console, "log");

      eventDispatcher.notify(addressChangedEvent);

      expect(logSpy).toBeCalledWith("Endereço do cliente: 111111, Test alterado para: St. One, 1, 1111-22 City");
    });
  });
})