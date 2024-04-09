export default {
  type: "object",
  title: "SignInInputModel",
  properties: {
    phone: { type: "string" },
    password: { type: "string" },
  },
  required: ["phone", "password"],
} as const;
