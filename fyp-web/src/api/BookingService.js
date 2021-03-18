import ApiService from "./ApiService";

const bookingService = new ApiService({ resource: "bookings" });
const customerBookingsService = new ApiService({
  resource: "bookings/customer"
});
const attractionBookingsService = new ApiService({
  resource: "bookings/attraction"
});
export { bookingService, customerBookingsService, attractionBookingsService };
