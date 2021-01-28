import ApiService from "./ApiService";

const loginService = new ApiService({ resource: "auth/login" });
const registerService = new ApiService({ resource: "auth/register" });
const googleLoginService = new ApiService({resource: 'auth/login/google'});
const userService = new ApiService({resource: 'auth/user'});
export { loginService, registerService, googleLoginService,userService};
