export default {
  type: "object",
  title: "AddNewProfileInputModel",
  properties: {
    fullName: { type: "string" },
  },
  required: ["fullName"],
} as const;
