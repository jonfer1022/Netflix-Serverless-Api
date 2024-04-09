export default {
  type: "object",
  title: "ConfirmPreSignUpInputModel",
  properties: {
    phone: { type: "string" },
    code: { type: "string" },
    password: { type: "string" },
  },
  required: ["phone", "code", "password"],
} as const;
