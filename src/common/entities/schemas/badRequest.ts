export default {
  type: "object",
  description: "Bad Request",
  required: ["error"],
  properties: {
    error: {
      type: "string",
      description: "Error message",
    },
  },
};
