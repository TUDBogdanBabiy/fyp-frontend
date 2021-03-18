<template>
  <q-page>
    <div class="q-pa-md">
      <h2 class="q-my-md q-pl-md">{{ attraction.title }} Time-slots</h2>

      <div v-if="show" class="row justify-center q-gutter-sm">
        <q-intersection
          v-for="(slot, index) in time_slots"
          :key="index"
          once
          class="q-pl-sm-md"
        >
          <q-item style="min-width: 300px">
            <q-item-section>
              <p class="text-h6 q-mb-none">
                {{ slot.start_time }}
              </p>

              <q-linear-progress
                rounded
                stripe
                size="25px"
                :value="slot.bookings"
                :color="[slot, currentTime] | progressBarColor"
                class="q-mt-sm"
              >
                <div class="absolute-full flex flex-center">
                  <q-badge
                    color="white"
                    text-color="primary"
                    :label="[slot, currentTime] | progressBarMessage"
                  />
                </div>
              </q-linear-progress>
              <q-btn
                @click="showDialog(index)"
                class="q-mt-md full-width"
                :disable="[slot, currentTime] | buttonDisabledState"
                :color="[slot, currentTime] | buttonColor"
                >{{ [slot, currentTime] | buttonMessage }}</q-btn
              >
            </q-item-section>
          </q-item>
          <q-dialog :ref="`dialog-${index}`" persistent>
            <q-card>
              <q-card-section class="row items-center">
                This time slot will start at {{ slot.start_time }} and expire at
                {{ slot.end_time }}. <br />Are you sure you want to choose this
                time slot?
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn
                  @click="chooseTimeslot(slot.start_time, slot.end_time)"
                  flat
                  label="Confirm"
                  color="primary"
                  v-close-popup
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-intersection>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import _ from "lodash";
import bookings from "src/store/modules/bookings";

export default {
  name: "CustomerTimeslots",
  components: {},
  props: {
    user: Object
  },
  data() {
    return {
      attraction: {},
      attraction_id: null,
      time_slots: [],
      confirmChoice: false,
      currentTime: null,
      formatTimeslotsInterval: null,
      currentTimeInterval: setInterval(() => {
        const now = new Date();
        let minutes = now.getMinutes();
        if (minutes < 10) minutes = `0${minutes}`;
        this.currentTime = now.getHours() + ":" + minutes;
      }),
      show: true
    };
  },
  methods: {
    ...mapActions(["listAttractions", "getAttractionBookings", "addBooking"]),
    isExpired({ end_time, date_booked }) {
      // Parse the string date_booked into a new Date
      date_booked = new Date(date_booked);
      // Convert the date date_booked to a date string that excludes time
      let date_booked_string = date_booked.toDateString();
      // Parse the string back to date, the time will be 00:00:00
      date_booked = new Date(date_booked_string);

      let today = new Date();
      let today_string = today.toDateString();
      today = new Date(today_string);

      let expired = false;

      if (today > date_booked) expired = true;

      return expired;
    },
    formatTimeslots(
      attraction_id = this.attraction_id,
      time_slots = this.time_slots
    ) {
      this.time_slots = [];
      let currentBookings = _.filter(this.bookings, [
        "attraction_id",
        attraction_id
      ]);

      currentBookings = _.filter(currentBookings, booking => {
        if (!this.isExpired(booking)) return booking;
      });

      time_slots.forEach(slot => {
        const start_time = slot.start_time;
        const end_time = slot.end_time;
        let numberOfCurrentBookings = _.filter(currentBookings, [
          "start_time",
          start_time
        ]).length;

        if (!numberOfCurrentBookings) {
          numberOfCurrentBookings = 0;
        }
        let val = numberOfCurrentBookings / this.attraction.max_customers;
        this.time_slots.push({
          start_time: start_time,
          bookings: val,
          end_time
        });
      });
      this.show = false;
      this.show = true;
    },
    async chooseTimeslot(start_time, end_time) {
      try {
        await this.addBooking({
          start_time,
          end_time,
          attraction_id: this.attraction_id,
          customer_id: this.user._id
        });

        this.time_slots = [];
        await this.formatTimeslots(
          this.attraction_id,
          this.attraction.time_slots
        );
      } catch (error) {}
    },
    showDialog(index) {
      this.$refs[`dialog-${index}`][0].show();
    },
    redirect(user_type) {
      const routes = {
        customer: "/home",
        admin: "/admin/dashboard",
        staff: "/staff/dashboard"
      };
      this.$router.push(routes[user_type]);
    }
  },
  filters: {
    statusColor(status) {
      if (status >= 0.5 && status < 1) return "orange";
      if (status >= 1) return "negative";

      return "green";
    },
    progressBarMessage([{ end_time, bookings }, now]) {
      if (end_time <= now) return "Expired at " + end_time;
      if (bookings > 0 && bookings < 1)
        return `${Math.round(bookings * 100)}% Full`;
      if (bookings >= 1) return "Fully Booked";
      return "Available";
    },
    progressBarColor([{ end_time, bookings }, now]) {
      if (end_time <= now) return "grey";
      if (bookings >= 1) return "negative";
      if (bookings > 0.5) return "orange";
      return "green";
    },
    buttonMessage([{ end_time, bookings }, now]) {
      if (end_time <= now || bookings >= 1) return "Unavailable";
      return "Choose";
    },
    buttonColor([{ end_time, bookings }, now]) {
      if (end_time <= now) return "grey";
      if (bookings >= 1) return "negative";
      return "primary";
    },
    buttonDisabledState([{ end_time, bookings }, now]) {
      if (end_time <= now || bookings >= 1) return true;
      return false;
    }
  },
  computed: {
    ...mapGetters(["attractions", "bookings"])
  },
  async created() {
    this.$emit("title", "Make a Booking");
    this.attraction_id = this.$route.params.attraction_id;
    try {
      await this.listAttractions();
      await this.getAttractionBookings(this.attraction_id);

      this.attraction = _.find(this.attractions, ["_id", this.attraction_id]);

      this.formatTimeslots(this.attraction_id, this.attraction.time_slots);
    } catch (error) {
      console.error(error);
    }
    this.formatTimeslotsInterval = setInterval(this.formatTimeslots, 1000);
  },
  beforeDestroy() {
    clearTimeout(localStorage.timeout);
    clearInterval(this.currentTimeInterval);
    clearInterval(this.formatTimeslotsInterval);
  }
};
</script>
