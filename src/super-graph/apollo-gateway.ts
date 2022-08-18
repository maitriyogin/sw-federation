import { ApolloServer } from "apollo-server-lambda";
import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

let urls = [
  { name: "cars", url: "http://localhost:3000/dev/cars" },
  { name: "chargers", url: "http://localhost:3000/dev/chargers" },
  { name: "users", url: "http://localhost:3000/dev/users" },
];
if (!process.env.IS_OFFLINE) {
  const url = process.env.URL;
  urls = [
    { name: "cars", url: `${url}/cars` },
    { name: "chargers", url: `${url}/chargers` },
    { name: "users", url: `${url}/users` },
  ];
}
console.log("-------- SUBGRAPHS ", {
  isOffline: process.env.IS_OFFLINE,
  urls: JSON.stringify(urls),
});

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: urls,
    introspectionHeaders: {
      Authorization: "Bearer abc123",
    },
  }),
});

export const server = new ApolloServer({
  gateway,
  csrfPrevention: true,
  cache: "bounded",
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});
