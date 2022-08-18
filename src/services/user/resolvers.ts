import { IUser, User } from "./models/User";
import * as service from "../../utils/service";
export const resolvers = {
  Query: {
    users: () => {
      console.log("----- USER RESOLVER - QUERY USERS");
      return service.list();
    },
  },
  Mutation: {
    addUser: async (_: undefined, { user }: { user: IUser }) => {
      const u = service.create(user);
      return u;
    },
    updateUser: async (_: undefined, { user }: { user: IUser }) => {
      if (user.id === undefined) {
        return user;
      }
      const newUser = service.update(user);
      return newUser;
    },
    deleteUser: async (_: undefined, { id }: { id: string }) => {
      await service.remove(id);
      return id;
    },
  },
  User: {
    __resolveReference: async (reference: IUser) => {
      console.log("####### USER RESOLVER - Resolve User", reference);
      // throw "Users is down!";
      return await service.get(reference.id);
    },
  },
};
