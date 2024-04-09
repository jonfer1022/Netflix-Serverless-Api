import { users } from "../models";
const usersAttributes = {};
Object.entries(users).forEach(
  (att) => (usersAttributes[`${att[0]}`] = { type: att[1] })
);

export default {
  type: "object",
  description: "Get users output model",
  properties: {
    result: {
      type: "array",
      items: {
        type: "object",
        properties: {
          ...usersAttributes
        }
      }
    }
  }
};
