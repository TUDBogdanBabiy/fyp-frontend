<template>
  <q-page class="flex flex-center">
    <h1>Staff Dashboard</h1>
  </q-page>
</template>

<script>
export default {
  name: "StaffDashboard",
  components: {},
  props: {
    user: Object
  },
  data() {
    return {};
  },
  methods: {
    redirect(user_type) {
      const routes = {
        customer: "/",
        admin: "/admin",
        staff: "/staff"
      };
      this.$router.push(routes[user_type]);
    }
  },
  created() {
    this.$emit("title", "Staff Dashboard");
    if (this.user.type !== "staff") this.redirect(this.user.type);
  }
};
</script>
