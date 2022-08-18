import { server } from "./apollo-gateway";

export const graphql = server.createHandler();
