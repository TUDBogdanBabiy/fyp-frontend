<template>
  <q-page>
    <div class="q-pa-md">
      <h2 class="q-my-none q-pl-md">Attractions</h2>
      <q-table
        id="attractions__table"
        grid
        :loading="loading"
        :data="attractions"
        row-key="name"
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
              <q-card-section horizontal>
                <q-card-section class="col-sm-6 col-md-8">
                  <h6 class="q-my-none">
                    {{ row.title }}
                  </h6>
                  <q-badge
                    outline
                    class="q-my-sm"
                    :color="row.status | statusColor"
                    :label="row.status"
                  />
                  <p class="overflow-hidden" style="text-overflow: ellipsis">
                    {{ row.description }}
                  </p>
                </q-card-section>
                <q-img
                  class="col-sm-6 col-md-4"
                  src="https://cdn.quasar.dev/img/parallax1.jpg"
                />
              </q-card-section>

              <q-separator />

              <q-card-actions align="around">
                <q-btn
                  v-if="row.status == 'open'"
                  :to="{
                    name: timeslotsPage,
                    params: {
                      attraction_id: row._id
                    }
                  }"
                  no-caps
                  class="full-width"
                  flat
                  color="primary"
                >
                  Book Now - €{{ row.price }}/pp
                </q-btn>
                <q-btn
                  v-if="row.status == 'closed'"
                  no-caps
                  disable
                  class="full-width"
                  flat
                  color="negative"
                >
                  Booking Unavailable
                </q-btn>
                <q-btn
                  v-if="row.status == 'full'"
                  no-caps
                  disable
                  class="full-width"
                  flat
                  color="accent"
                >
                  Booking Unavailable
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
import { CUSTOMER_TIMESLOTS } from "app/src/router/routes";

export default {
  name: "CustomerHome",
  components: {},
  props: {
    user: Object
  },
  data() {
    return {
      timeslotsPage: CUSTOMER_TIMESLOTS,
      filter: "",
      loading: true
    };
  },
  methods: {
    ...mapActions(["listAttractions"]),
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
      const colors = {
        open: "positive",
        closed: "negative",
        full: "accent"
      };
      return colors[status];
    }
  },
  computed: mapGetters(["attractions"]),
  async created() {
    this.$emit("title", "Home");
    if (this.user.type !== "customer") this.redirect(this.user.type);
    try {
      await this.listAttractions();
    } catch (error) {
      console.error(error);
    }
    this.loading = false;
  }
};
</script>
