export default {
  type: "object",
  description: "Login succesful",
  properties: {
    AccessToken: { type: "string" },
    RefreshToken: { type: "string" }
  },
  required: ["AccessToken", "RefreshToken"]
};
