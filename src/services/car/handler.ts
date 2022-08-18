import { server } from "./apollo-server";

export const graphql = server.createHandler();
