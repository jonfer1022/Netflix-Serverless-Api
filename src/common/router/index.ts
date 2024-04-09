const GET = "get",
  PUT = "put",
  POST = "post",
  DELETE = "delete";

const origin = process.env.ORIGIN_CLIENT || "*";

export default {
  login: {
    confirmSignUp: {
      name: "confirmSignUp",
      method: POST,
      path: "confirm-sign-up",
      origin
    },
    signIn: {
      name: "signIn",
      method: POST,
      path: "sign-in",
      origin
    },
    signUp: {
      name: "signUp",
      method: POST,
      path: "sign-up",
      origin
    },
  },
  Profile: {
    getProfiles: {
      name: "getProfiles",
      method: GET,
      path: "profiles",
      origin
    },
    newProfile: {
      name: "newProfile",
      method: POST,
      path: "profiles",
      origin
    },
  },
  Home: {
    getMainContent: {
      name: "getMainContent",
      method: GET,
      path: "content",
      origin
    },
  },
};
