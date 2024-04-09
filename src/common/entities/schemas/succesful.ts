export default {
  type: "object",
  description: "Succesful operation",
  properties: {
    message: { type: "string" },
    statusCode: { type: "integer", default: 200 },
  },
};
