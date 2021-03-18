<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        id="bookings__table"
        :loading="loading"
        :data="bookings"
        :columns="columns"
        :filter="filter"
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

        <template v-slot:top-right>
          <q-btn
            id="remove__expired__btn"
            icon="delete_sweep"
            color="negative"
            :disable="loading"
            label="Remove Expired Bookings"
            @click="removeAllExpiredBookings()"
          />
        </template>

        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body-cell-status="{ row }"
          ><q-td
            ><q-badge :color="[row, isExpired] | statusColor">
              {{ [row, isExpired] | formatStatus }}
            </q-badge></q-td
          ></template
        >
        <template v-slot:body-cell-date_booked="{ row }"
          ><q-td> {{ row.date_booked | formatDate }}</q-td></template
        >
        <template v-slot:body-cell-actions="{ row }"
          ><q-td style="width:5px;padding-right:0"
            ><q-btn-dropdown
              id="actions__dropdown"
              flat
              dropdown-icon="more_vert"
              color="primary"
              ><q-list>
                <q-item
                  id="delete__item"
                  clickable
                  @click="showDeleteDialog = true"
                >
                  <q-item-section>
                    <q-icon color="negative" name="delete" size="20px" />
                    <q-item-label class="text-negative">Delete</q-item-label>
                    <q-dialog v-model="showDeleteDialog" persistent>
                      <q-card id="delete_attraction__dialog">
                        <q-card-section class="row items-center">
                          <q-avatar
                            icon="delete"
                            color="negative"
                            text-color="white"
                          />
                          <span class="q-ml-sm"
                            >Are you sure you want to delete this booking?</span
                          >
                        </q-card-section>

                        <q-card-actions align="right">
                          <q-btn
                            flat
                            label="Cancel"
                            color="grey"
                            @click="showDeleteDialog = false"
                          />
                          <q-btn
                            @click="removeBooking(row)"
                            flat
                            label="Delete"
                            color="negative"
                            v-close-popup
                          />
                        </q-card-actions>
                      </q-card>
                    </q-dialog>
                  </q-item-section>
                </q-item> </q-list
            ></q-btn-dropdown> </q-td
        ></template>
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
    field: "attraction_name",
    label: "Attraction",
    sortable: true,
    align: "left"
  },
  {
    name: "customer",
    field: "customer_name",
    label: "Customer",
    sortable: true,
    align: "left"
  },
  {
    name: "start",
    field: "start_time",
    label: "Start Time",
    sortable: true,
    align: "left"
  },
  {
    name: "end",
    field: "end_time",
    label: "End Time",
    sortable: true,
    align: "left"
  },
  {
    name: "date_booked",
    field: "date_booked",
    label: "Date Booked",
    sortable: true,
    align: "left"
  },
  { name: "status", label: "Status", align: "left" },
  { name: "actions", align: "right" }
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
      showDeleteDialog: false,
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
    ...mapActions(["getAllBookings", "deleteBooking"]),
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
    removeAllExpiredBookings() {
      this.bookings.forEach(booking => {
        if (this.isExpired(booking)) {
          try {
            this.removeBooking(booking);
          } catch (error) {
            console.error(error);
          }
        }
      });
    },
    showDialog(index) {
      this.$refs[`dialog-${index}`].show();
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
        await this.deleteBooking(_id);
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
    },
    formatStatus([booking, isExpired]) {
      if (isExpired(booking)) return "Expired";
      return "valid";
    },
    statusColor([booking, isExpired]) {
      if (isExpired(booking)) return "grey";
      return "green";
    }
  },
  async created() {
    this.$emit("title", "Bookings");
    if (this.user.type !== "admin") this.redirect(this.user.type);
    try {
      await this.getAllBookings();
    } catch (error) {
      console.error(error);
    }
    this.loading = false;
  }
};
</script>
