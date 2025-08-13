import { gql } from "@apollo/client";

const GET_BUSINESS_STATS = gql`
   query GetBusinessStats {
  getBusinessStats {
    totalBusinesses
    todaysMeetings
    scheduleMeetings
    requestMeetings
    completedDeals
  }
}
`
const GET_BUSINESS_STATS_GRAPH = gql`
   query GetBusinessStatsGraph($year: Int) {
  getBusinessStatsGraph(year: $year) {
    totalBusinesses
    monthlyStats {
      businessCount
      month
    }
  }
}
`
const GET_BUSINESS_PRICE_TIER = gql`
query GetBusinessByPriceTier {
  getBusinessByPriceTier {
    count
    priceTier
  }
}
`
const GET_BUSINESS_REVENUE_TIER = gql`
query GetBusinessByRevenueTier {
  getBusinessByRevenueTier {
    count
    priceTier
  }
}
`
const GET_BUSINESS_CATEGORY_COUNT = gql`
query GetCountByEachCategory {
  getCountByEachCategory {
    category
    count
  }
}
`
export {
  GET_BUSINESS_STATS,
  GET_BUSINESS_STATS_GRAPH,
  GET_BUSINESS_PRICE_TIER,
  GET_BUSINESS_REVENUE_TIER,
  GET_BUSINESS_CATEGORY_COUNT
}
