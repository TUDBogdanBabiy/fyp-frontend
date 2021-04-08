import {
  bookingService,
  customerBookingsService,
  attractionBookingsService
} from "../../api/BookingService";

const SET_BOOKINGS = "SET_BOOKINGS";

const state = {
  bookings: []
};

const getters = {
  bookings: state => state.bookings
};

const actions = {
  async updateBooking(context, { id, data }) {
    await bookingService.update(id, data);
    return await context.dispatch("getAllBookings");
  },
  async deleteBooking(context, { id, customerId }) {
    await bookingService.delete(id);
    return await context.dispatch("getCustomerBookings", customerId);
  },
  async addBooking(context, data) {
    await bookingService.create(data);
    return await context.dispatch("getAllBookings");
  },
  async getAllBookings(context) {
    const bookings = await bookingService.list();
    context.commit(SET_BOOKINGS, bookings);
  },
  async getCustomerBookings(context, id) {
    const bookings = await customerBookingsService.get(id);
    context.commit(SET_BOOKINGS, bookings);
  },
  async getAttractionBookings(context, id) {
    const bookings = await attractionBookingsService.get(id);
    context.commit(SET_BOOKINGS, bookings);
    localStorage.timeout = setTimeout(async function() {
      await context.dispatch("getAttractionBookings", id);
    }, 5000);
  }
};

const mutations = {
  [SET_BOOKINGS](state, bookings) {
    state.bookings = bookings;
  }
};

export default {
  state,
  actions,
  getters,
  mutations
};
