import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth.js";
import attractions from "./modules/attractions.js";
import bookings from "./modules/bookings.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    attractions,
    bookings
  }
});
