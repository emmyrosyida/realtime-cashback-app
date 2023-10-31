import { gql } from "@apollo/client";

export const GET_LATEST_EXPO = gql`
  query getLatestExpo {
    getLatestExpo {
      id
    }
  }
`;

export const GET_CASHBACK_BALANCE = gql`
  query getCashbackBalance($input: ExhibitionInput!) {
    getCashbackBalance(input: $input) {
      balanceAmount
      day
      date
      instantCashpool
    }
  }
`;

export const GET_LIST_EXPO = gql`
  query listLatestExpo($input: ListExpoInput) {
    listLatestExpo(input: $input) {
      id
      status #passed,active,upcoming
      slug
      name
      venue {
        name
        image
        shortName
        halls {
          label
          slug
        }
        address {
          country
        }
      }
      days {
        day
        date
        startTime
        endTime
        timezone
      }
      hasCashback
      isCurrentlyActive
      showYhelloHunt
      showGWP
      showStarbuys
      showDirectory
      showHighlights
      gwpTnc
      yhelloHuntTnc
      yhelloHuntBanner
      yhelloHuntMap
      gwpTnc
      gwpBanner
      mapDirectory
      mapDirectoryPDF
    }
  }
`;
