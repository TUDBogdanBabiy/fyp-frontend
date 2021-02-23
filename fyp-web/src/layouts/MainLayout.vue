<template>
  <q-layout view="lHh lpr lff">
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
      v-if="show"
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
        <EssentialLink
          v-for="link in links()"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-if="show" @title="setTitle" :user="user" />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "MainLayout",
  components: { EssentialLink },
  data() {
    return {
      page: null,
      leftDrawerOpen: false,
      show: false,
      customerLinks: [
        {
          title: "Customer Home",
          caption: "View and Book into Attractions",
          link: "/home"
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
          link: "/admin/dashboard"
        },
        {
          title: "Attractions",
          caption: "View & configure all attractions",
          link: "/admin/attractions"
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
          title: " Staff Dashboard",
          caption: "Manage Attraction Bookings",
          link: "/dashboard"
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
      this.show = true;
    } else {
      try {
        await this.getUser();
        this.show = true;
      } catch (error) {
        this.$router.push("/login");
      }
    }
  }
};
</script>
