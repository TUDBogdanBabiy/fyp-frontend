<template>
  <div class="row q-mt-xl q-ma-md">
    <div class="col-12 col-sm-4 offset-sm-4">
      <q-card class="q-pa-lg">
        <h3 class="q-mt-none text-primary"><strong>Register</strong></h3>
        <q-form id="register__form" @submit="onSubmit" class="q-gutter-md">
          <q-input
            rounded
            outlined
            dense
            v-model="firstname"
            label="First name *"
            hint="Enter your first name"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Required!']"
          />
          <q-input
            rounded
            outlined
            dense
            v-model="surname"
            label="Surname *"
            hint="Enter your surname"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Required!']"
          />
          <q-input
            rounded
            outlined
            dense
            type="email"
            v-model="email"
            label="Email *"
            hint="Enter Email"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Required!']"
          />
          <q-input
            rounded
            outlined
            dense
            type="password"
            v-model="password"
            label="Password *"
            hint="Enter Password"
            lazy-rules
            :rules="[
              val => (val && val.length > 0) || 'Required',
              val =>
                val.length >= 8 ||
                'Password must be at least 8 characters long!'
            ]"
          />
          <q-input
            rounded
            outlined
            dense
            type="password"
            v-model="confirmPassword"
            label="Confirm Password *"
            hint="Enter Password Again"
            lazy-rules
            :rules="[
              val => (val && val.length > 0) || 'Required',
              val => val === password || 'Passwords must be the same!'
            ]"
          />

          <div>
            <q-btn
              id="register__btn"
              rounded
              class="full-width"
              label="Register"
              type="submit"
              color="primary"
            />
          </div>
        </q-form>
      </q-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Register",
  components: {},
  data() {
    return {
      firstname: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: ""
    };
  },
  methods: {
    ...mapActions(["signUp"]),
    async onSubmit() {
      await this.signUp({
        firstname: this.firstname,
        surname: this.surname,
        email: this.email,
        password: this.password
      });
      this.redirect(this.user.type);
    },
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
    if (this.user) this.redirect(this.user.type);
  },
  computed: mapGetters(["user"])
};
</script>
