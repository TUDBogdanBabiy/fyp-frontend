<template>
  <q-layout view="lHh LpR fFf">
    <q-header class="bg-accent text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          :icon="leftDrawerOpen ? 'menu_open' : 'menu'"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          {{ page }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="show && user"
      v-model="leftDrawerOpen"
      show-if-above
      elevated
      content-class="bg-grey-1"
    >
      <q-img
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 150px"
      >
        <div class="bg-transparent full-width">
          <q-avatar size="56px" class="q-mb-sm float-right">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div
            class="text-h4"
            style="text-shadow: 2px 1px 4px rgba(86,86,86,0.94);"
          >
            {{ user.name }}
          </div>
          <div
            class="text-subtitle1"
            style="text-shadow: 2px 1px 4px rgba(86,86,86,0.94);"
          >
            {{ user.type }}
          </div>
        </div>
      </q-img>
      <q-list>
        <SideLink v-for="link in links()" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-if="show" @title="setTitle" :user="user" />
    </q-page-container>
  </q-layout>
</template>

<script>
import SideLink from "src/components/SideLink.vue";
import { mapGetters, mapActions } from "vuex";
import {
  CUSTOMER_HOME,
  CUSTOMER_BOOKINGS,
  STAFF_DASHBOARD,
  ADMIN_DASHBOARD,
  ADMIN_ATTRACTIONS,
  ADMIN_BOOKINGS
} from "app/src/router/routes";

export default {
  name: "MainLayout",
  components: { SideLink },
  data() {
    return {
      page: null,
      leftDrawerOpen: false,
      show: false,
      customerLinks: [
        {
          title: "Home",
          caption: "View and Book into Attractions",
          link: CUSTOMER_HOME
        },
        {
          title: "My Bookings",
          caption: "Manage current bookings",
          link: CUSTOMER_BOOKINGS
        },
        {
          title: "Logout",
          caption: "Sign out of the system",
          onClick: () => {
            localStorage.token = null;
            location.reload();
          }
        }
      ],
      adminLinks: [
        {
          title: "Admin Dashboard",
          caption: "Overview of the running system",
          link: ADMIN_DASHBOARD
        },
        {
          title: "Attractions",
          caption: "View & configure all attractions",
          link: ADMIN_ATTRACTIONS
        },
        {
          title: "Bookings",
          caption: "Manage all existing bookings",
          link: ADMIN_BOOKINGS
        },
        {
          title: "Logout",
          caption: "Sign out of the system",
          onClick: () => {
            localStorage.token = null;
            location.reload();
          }
        }
      ],
      staffLinks: [
        {
          title: "Staff Dashboard",
          caption: "Manage Attraction Bookings",
          link: STAFF_DASHBOARD
        },
        {
          title: "Logout",
          caption: "Sign out of the system",
          onClick: () => {
            localStorage.token = null;
            location.reload();
          }
        }
      ]
    };
  },
  methods: {
    ...mapActions(["getUser"]),
    setTitle(title) {
      this.page = title;
    },
    links() {
      const links = {
        customer: this.customerLinks,
        admin: this.adminLinks,
        staff: this.staffLinks
      };
      return links[this.user.type];
    }
  },
  computed: {
    ...mapGetters(["user"])
  },
  async created() {
    if (this.user) {
      await this.getUser();
    } else {
      try {
        await this.getUser();
      } catch (error) {
        this.$router.push("/login");
      }
    }
    this.show = true;
  }
};
</script>
