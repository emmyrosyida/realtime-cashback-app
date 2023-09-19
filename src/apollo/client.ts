import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { AuthOptions, createAuthLink } from "aws-appsync-auth-link";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";

const region = "ap-southeast-1";

//Operation
const keyOpr = process.env.REACT_APP_KEY_OPERATION;
if (!keyOpr) throw new Error("noKeyOperation");

const linkOpr = process.env.REACT_APP_URL_OPERATION;
if (!linkOpr) throw new Error("noKeyOperation");

const urlOpr = linkOpr;

const httpLinkOpr = new HttpLink({
  uri: urlOpr,
});

const authOpr: AuthOptions = {
  type: "API_KEY",
  apiKey: keyOpr,
};

const operationEndpoint = ApolloLink.from([
  createAuthLink({ url: linkOpr, region, auth: authOpr }),
  createSubscriptionHandshakeLink(
    { url: linkOpr, region, auth: authOpr },
    httpLinkOpr
  ),
]);
//

//Expo
const keyExpo = process.env.REACT_APP_KEY_EXPO;
if (!keyExpo) throw new Error("noKeyEXPO");

const linkExpo = process.env.REACT_APP_URL_EXPO;
if (!linkExpo) throw new Error("noKeyEXPO");

const urlExpo = linkExpo;

const httpLinkExpo = new HttpLink({
  uri: urlExpo,
});

const authExpo: AuthOptions = {
  type: "API_KEY",
  apiKey: keyExpo,
};

const expoEndpoint = ApolloLink.from([
  createAuthLink({ url: linkExpo, region, auth: authExpo }),
  createSubscriptionHandshakeLink(
    { url: linkExpo, region, auth: authExpo },
    httpLinkExpo
  ),
]);
//

export const apolloClient = new ApolloClient({
  link: ApolloLink.split(
    (operation) => operation.getContext().clientName === "operation",
    operationEndpoint,
    expoEndpoint
  ),
  cache: new InMemoryCache(),
});
