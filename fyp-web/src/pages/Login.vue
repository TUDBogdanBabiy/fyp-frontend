<template>
  <div class="row q-mt-xl q-ma-md">
    <div class="col-12 col-sm-4 offset-sm-4">
      <q-card class="q-pa-lg">
        <h3 class="q-mt-none text-primary"><strong>Log In</strong></h3>
        <q-form id="login__form" @submit="onSubmit" class="q-gutter-md">
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

          <div>
            <q-btn
              id="login__btn"
              rounded
              class="full-width"
              label="Login"
              type="submit"
              color="primary"
            />
          </div>
          <div>
            <q-btn
              id="register__btn"
              rounded
              to="/register"
              class="full-width"
              label="Register"
              color="green-6"
            />
          </div>
        </q-form>
        <div class="row q-mt-md"></div>
        <div class="row q-mt-md">
          <div class="col-4 q-pt-sm"><q-separator horizontal /></div>
          <div class="col-4 text-center">Or</div>
          <div class="col-4 q-pt-sm"><q-separator horizontal /></div>
        </div>
        <div class="row q-mt-md">
          <GoogleLogin
            class="google-btn"
            :params="params"
            :onSuccess="onSuccess"
            :onFailure="onFailure"
            ><strong>Log in with Google</strong></GoogleLogin
          >
        </div>
      </q-card>
    </div>
  </div>
</template>

<script>
import GoogleLogin from "vue-google-login";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Login",
  components: {
    GoogleLogin
  },
  data() {
    return {
      // client_id is the only required property but you can add several more params, full list down bellow on the Auth api section
      params: {
        client_id:
          "433115111806-ec7fhtkp6php1fkq8ug323736gn6bq28.apps.googleusercontent.com"
      },
      email: "",
      password: ""
    };
  },
  methods: {
    ...mapActions(["signIn", "signInWithGoogle"]),
    async onSuccess(googleUser) {
      var id_token = googleUser.getAuthResponse().id_token;
      await this.signInWithGoogle(id_token);
      this.$router.push("/");
    },
    onFailure() {
      console.error();
      ("Failed to retrieve Google account information");
    },
    async onSubmit() {
      await this.signIn({ email: this.email, password: this.password });
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

<style scoped lang="scss">
.google-btn {
  color: floralwhite;
  background-color: $red-6;
  border: none;
  border-radius: 20px;
  width: 100%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.144),
    0 3px 10px 0 rgba(0, 0, 0, 0.096);
  text-align: center;
  font-size: 15px;
  padding: 10px;
  cursor: pointer;
}
.google-btn:hover {
  background-color: $red-5;
}
.google-btn:focus {
  outline: none;
}
</style>
