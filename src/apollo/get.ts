import { gql } from '@apollo/client'

export const GET_LATEST_EXPO = gql`
  query getLatestExpo {
    getLatestExpo {
      id
    }
  }
`

export const GET_CASHBACK_BALANCE = gql`
  query getCashbackBalance($input: ExhibitionInput!) {
    getCashbackBalance(input: $input) {
      balanceAmount
      day
      date
      instantCashpool
    }
  }
`
