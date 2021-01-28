<template>
  <q-page class="flex flex-center">
    <h1>Customer {{ user.name }}</h1>
  </q-page>
</template>

<script>
// import { mapGetters } from "vuex";
export default {
  name: "CustomerDashboard",
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
  // computed: mapGetters(["user"]),
  created() {
    this.$emit("title", "Home");

    if (this.user.type !== "customer") this.redirect(this.user.type);
  }
};
</script>
