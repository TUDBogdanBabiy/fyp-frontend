import {
  loginService,
  registerService,
  googleLoginService,
  userService
} from "../../api/AuthService";

const SET_USER = "SET_USER";

const state = {
  user: null
};

const getters = {
  user: state => state.user
};

const actions = {
  async signIn(context, user) {
    const { username, user_type, _id, token } = await loginService.create(user);
    context.commit(SET_USER, { name: username, type: user_type, _id });
    localStorage.token = token;
  },
  async signOut(context) {
    context.commit(SET_USER, "");
    localStorage.removeItem("token");
  },
  async signUp(context, user) {
    const { username, user_type, _id, token } = await registerService.create(
      user
    );
    context.commit(SET_USER, { name: username, type: user_type, _id });
    localStorage.token = token;
  },
  async signInWithGoogle(context, id_token) {
    const {
      username,
      user_type,
      _id,
      token
    } = await googleLoginService._request({
      method: "post",
      headers: { id_token: id_token }
    });
    context.commit(SET_USER, { name: username, type: user_type, _id });
    localStorage.token = token;
  },
  async getUser(context) {
    const { username, user_type, _id, token } = await userService.list();
    context.commit(SET_USER, { name: username, type: user_type, _id });
    localStorage.token = token;
  }
};

const mutations = {
  [SET_USER](state, user) {
    state.user = user;
  }
};

export default {
  state,
  actions,
  getters,
  mutations
};
