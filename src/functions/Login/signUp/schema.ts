export default {
  type: "object",
  title: "SignUpInputModel",
  properties: {
    phone: { type: "string" },
    password: { type: "string" },
    fullName: { type: "string" },
  },
  required: ["phone", "password", "fullName"],
} as const;
