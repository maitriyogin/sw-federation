import { Charger, ICharger } from "./models/Charger";
import data from "./models/data.json";
import * as chargerService from "../../utils/service";

export const resolvers = {
  Query: {
    chargers: () => {
      return chargerService.list();
    },
  },
  Mutation: {
    addCharger: async (_: undefined, { charger }: { charger: ICharger }) => {
      const c = chargerService.create(charger);
      console.log("----- charger", { c });
      return c;
    },
    updateCharger: async (_: undefined, { charger }: { charger: ICharger }) => {
      if (charger.id === undefined) {
        return charger;
      }
      console.log("---- update", { charger });
      const newCharger = await chargerService.update(charger);
      return newCharger;
    },
    deleteCharger: async (_: undefined, { id }: { id: string }) => {
      await chargerService.remove(id);
      return id;
    },
  },
  User: {
    chargers: async (user: { id: string }) => {
      return await chargerService.indexedEntities("UserIndex", {
        userId: user.id,
      });
    },
  },
  Charger: {
    user(charger: ICharger) {
      console.log("@@@@@@ Charger.user", charger);
      return {
        __typename: "User",
        id: charger.userId,
      };
    },
    __resolveReference: async (reference: ICharger) => {
      console.log("####### Resolve Charger", reference);
      return await chargerService.get(reference.id);
    },
  },
};
