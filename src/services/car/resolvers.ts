import { Car, ICar } from "./models/Car";
import * as carService from "../../utils/service";
import { indexedEntities } from "../../utils/service";

export const resolvers = {
  Query: {
    cars: () => {
      console.log("----- CAR RESOLVER - QUERY CARS");
      return carService.list();
    },
  },
  Car: {
    user(car: ICar) {
      console.log("@@@@@@ CAR RESOLVER - Resolve simple User, Car.user", car);
      return {
        __typename: "User",
        id: car.userId,
      };
    },
    charger(car: ICar) {
      console.log("@@@@@@ CAR RESOLVER - Resolve simple Car, Car.charger", car);
      return {
        __typename: "Charger",
        id: car.chargerId,
      };
    },
  },
  Mutation: {
    addCar: async (_: undefined, { car }: { car: ICar }) => {
      const c = carService.create(car);
      console.log("----- car", { c });
      return c;
    },
    updateCar: async (_: undefined, { car }: { car: ICar }) => {
      if (car.id === undefined) {
        return car;
      }
      const newCar = await carService.update(car);
      console.log("---- update", { car, newCar });
      return newCar;
    },
    deleteCar: async (_: undefined, { id }: { id: string }) => {
      await carService.remove(id);
      return id;
    },
  },
  User: {
    cars: (user: { id: string }) => {
      console.log("###### CAR RESOLVER - extend User, resolve Car", { user });
      return indexedEntities("UserIndex", { userId: user.id });
    },
  },
  Charger: {
    cars: (charger: { id: string }) => {
      console.log("###### CAR RESOLVER - extend Charger, resolve Car", {
        charger,
      });
      return indexedEntities("ChargerIndex", { chargerId: charger.id });
    },
  },
};
