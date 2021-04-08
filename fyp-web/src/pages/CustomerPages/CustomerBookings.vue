<template>
  <q-page>
    <div class="q-pa-md">
      <h2 class="q-my-none q-pl-md">My Bookings</h2>
      <q-table
        id="bookings__table"
        grid
        :loading="loading"
        :data="bookings"
        :columns="columns"
        row-key="start_time"
        :filter="filter"
        hide-header
      >
        <template v-slot:top-left>
          <q-input
            borderless
            debounce="300"
            v-model="filter"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:item="{ row }">
          <div class="col-xs-11 col-sm-5 col-md-3  q-ma-md">
            <q-card>
              <q-card-section horizontal> </q-card-section>
              <h6
                :class="
                  `q-pa-sm q-ma-none text-center ${
                    isExpired(row) ? 'text-grey' : ''
                  }`
                "
              >
                {{ row.attraction_name }}
              </h6>
              <p
                :class="
                  `q-pa-sm q-ma-none text-center ${
                    isExpired(row) ? 'text-grey' : ''
                  }`
                "
              >
                Booked on {{ row.date_booked | formatDate }}
              </p>
              <q-separator />

              <p
                :class="
                  `q-pa-sm q-ma-none text-center ${
                    isExpired(row) ? 'text-grey' : ''
                  }`
                "
              >
                <strong>Start Time</strong> {{ row.start_time }}
              </p>
              <p
                :class="
                  `q-pa-sm q-ma-none text-center ${
                    isExpired(row) ? 'text-grey' : ''
                  }`
                "
              >
                <strong>Expiry Time</strong> {{ row.end_time }}
              </p>
              <q-separator />

              <q-card-actions class="row" align="around">
                <q-btn
                  v-if="isExpired(row)"
                  disable
                  class="full-width col"
                  flat
                  color="grey"
                >
                  Expired
                </q-btn>
                <q-btn
                  v-if="!isExpired(row)"
                  @click="showQrCode(row)"
                  class="full-width col"
                  flat
                  color="primary"
                >
                  Show QR Code
                  <q-dialog
                    :ref="`dialog-qr-${row._id}`"
                    persistent
                    :maximized="maximizedToggle"
                    transition-show="slide-up"
                    transition-hide="slide-down"
                  >
                    <q-card class="bg-primary text-white text-center">
                      <q-bar>
                        <q-space />
                        <q-btn dense flat icon="close" v-close-popup>
                          <q-tooltip content-class="bg-white text-primary"
                            >Close</q-tooltip
                          >
                        </q-btn>
                      </q-bar>

                      <q-card-section>
                        <div class="text-h6">Scan the QR Code</div>
                      </q-card-section>

                      <q-card-section>
                        <div class="row">
                          <div
                            :id="`canvas-${row._id}`"
                            class="col full-width"
                          ></div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </q-dialog>
                </q-btn>
                <q-btn
                  v-if="!isExpired(row)"
                  @click="showDialog(row)"
                  class="full-width col"
                  flat
                  color="negative"
                >
                  Remove
                  <q-dialog :ref="`dialog-rm-${row._id}`" persistent>
                    <q-card id="delete_attraction__dialog">
                      <q-card-section>
                        <span class="q-ml-sm">
                          Are you sure you want to remove this booking?</span
                        >
                      </q-card-section>

                      <q-card-actions align="right">
                        <q-btn flat label="Cancel" color="grey" v-close-popup />
                        <q-btn
                          @click="removeBooking(row)"
                          flat
                          label="Remove"
                          color="negative"
                          v-close-popup
                        />
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import QRCodeStyling from "qr-code-styling";

const columns = [
  {
    name: "attraction",
    field: "attraction_name"
  },
  {
    name: "customer",
    field: "customer_name"
  },
  {
    name: "start",
    field: "start_time"
  },
  {
    name: "end",
    field: "end_time"
  }
];

export default {
  name: "CustomerBookings",
  components: {},
  props: {
    user: Object
  },
  data() {
    return {
      columns: columns,
      filter: "",
      loading: true,
      maximizedToggle: true,
      currentTime: null,
      currentTimeInterval: setInterval(() => {
        const now = new Date();
        let minutes = now.getMinutes();
        if (minutes < 10) minutes = `0${minutes}`;
        this.currentTime = now.getHours() + ":" + minutes;
      })
    };
  },
  methods: {
    ...mapActions(["getCustomerBookings", "deleteBooking"]),
    redirect(user_type) {
      const routes = {
        customer: "/home",
        admin: "/admin/dashboard",
        staff: "/staff/dashboard"
      };
      this.$router.push(routes[user_type]);
    },
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
      else if (this.currentTime > end_time) expired = true;

      return expired;
    },
    showDialog({ _id }) {
      this.$refs[`dialog-rm-${_id}`].show();
    },
    async showQrCode({ _id }) {
      await this.$refs[`dialog-qr-${_id}`].show();
      const qrCode = new QRCodeStyling({
        width: 340,
        height: 340,
        margin: 5,
        data: _id,
        dotsOptions: {
          color: "#ffffff",
          type: "dots"
        },
        backgroundOptions: {
          color: "#07518a"
        }
      });

      const canvas = document.getElementById(`canvas-${_id}`);
      qrCode.append(canvas);
    },
    async removeBooking({ _id }) {
      this.loading = true;
      this.showRemoveDialog = false;
      try {
        await this.deleteBooking({ id: _id, customerId: this.user._id });
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    }
  },
  computed: {
    ...mapGetters(["bookings"])
  },
  filters: {
    formatDate(date) {
      date = new Date(date);
      return date.toDateString();
    }
  },
  async created() {
    this.$emit("title", "My Bookings");
    if (this.user.type !== "customer") this.redirect(this.user.type);
    try {
      await this.getCustomerBookings(this.user._id);
    } catch (error) {
      console.error(error);
    }
    this.loading = false;
  }
};
</script>
