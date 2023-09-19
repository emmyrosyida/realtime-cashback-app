import { gql } from "@apollo/client";

export const SUBSCRIPTION_GET_BALANCE = gql`
  subscription getBalance {
    getBalance {
      originalAmount
    }
  }
`;
