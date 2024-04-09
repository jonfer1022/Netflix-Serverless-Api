export default {
  type: "object",
  description: "Error by default",
  required: ["error"],
  properties: {
    error: {
      type: "string",
      description: "Error message",
    },
  },
};
