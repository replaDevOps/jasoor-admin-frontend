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
const GET_BUSINESSES = gql`
  query GetAdminBusinesses($limit: Int, $offSet: Int, $filter: BusinessFilterInput, $sort: BusinessSortInput, $search: String) {
  getAdminBusinesses(limit: $limit, offSet: $offSet, filter: $filter, sort: $sort, search: $search) {
    businesses {
      id
      isByTakbeer
      isSaved
      createdAt
      businessStatus
      businessTitle
      description
      revenue
      profit
      price
      isStatsVerified
      capitalRecovery
      category {
        name
      }
      savedBy {
        id
      }
    }
    totalCount
    totalActiveCount
    totalPendingCount
  }
}
`
const GET_BUSINESSES_STATS_BY_ID = gql`
query GetBusinessById($getBusinessByIdId: ID!) {
  getBusinessById(id: $getBusinessByIdId) {
    numberOfFavorites
    numberOfOffers
    totalViews
    business {
      id
    businessTitle
    description
    price
    createdAt
    businessStatus
    revenue
    revenueTime
    capitalRecovery
    profit
    profittime
    numberOfEmployees
    profitMargen
    capitalRecovery
    multiple
    growthOpportunities
    reason
    supportSession
    supportDuration
    isSupportVerified
    isStatsVerified
    foundedDate
    district
    category {
    id
      name
    }
    }
  }
}
`
const GET_BUSINESSES_ASSETS_BY_ID = gql`
query GetBusinessById($getBusinessByIdId: ID!) {
  getBusinessById(id: $getBusinessByIdId) {
    numberOfFavorites
    numberOfOffers
    totalViews
    business {
      id
    assets {
      id
      isActive
      name
      price
      purchaseYear
      quantity
    }
    liabilities {
      id
      isActive
      name
      price
      purchaseYear
      quantity
    }
    inventoryItems {
      id
      isActive
      name
      price
      purchaseYear
      quantity
    }
    }
  }
}
`
const GET_BUSINESSES_DOCUMENT_ID = gql`
query GetBusinessById($getBusinessByIdId: ID!) {
  getBusinessById(id: $getBusinessByIdId) {
    numberOfFavorites
    numberOfOffers
    totalViews
    business {
      id
      documents {
      id
      title
      fileName
      filePath
    }
    }
  }
}
`
const GET_CATEGORIES = gql`
query GetAllCategories($limit: Int, $offSet: Int, $filter: CategoryFilter) {
  getAllCategories(limit: $limit, offSet: $offSet, filter: $filter) {
    totalcount
    categories {
      id
    icon
    isDigital
    name
    arabicName
    status
    }
  }
}
`

const GET_CATEGORIES_BY_ID = gql`
query GetCategoryById($getCategoryByIdId: ID!) {
  getCategoryById(id: $getCategoryByIdId) {
    id
    isDigital
    name
    status
    icon
    growthRecords {
      id
      industryDemand
      regionName
      populationDensity
      years {
        id
        localBusinessGrowth
        year
      }
    }
  }
}
`
const GET_FINANCE_COUNT = gql`
query GetFinanceCount {
  getFinanceCount {
    totalPrice
    revenueGenerated
    thisMonthRevenue
  }
}
`
const GET_FINANCE_GRAPH = gql`
query GetRenenueGraph($year: Int) {
  getRenenueGraph(year: $year) {
    month
    revenue
  }
}
`
const GET_COMPLETED_DEALS = gql`
query GetCompletedDeals($limit: Int, $offset: Int, $filter: DealFilter) {
  getCompletedDeals(limit: $limit, offset: $offset, filter: $filter) {
    totalCount
    deals {
      id
      business {
        businessTitle
        seller {
          name
        }
      }
      buyer {
        name
      }
      price
      commission
      createdAt
    }
  }
}
`
const SIMILER_BUSINESS_CATEGORY_GRAPH = gql`
query SimilerBusinessAvgAnualProfit($similerBusinessAvgAnualProfitId: ID) {
  similerBusinessAvgAnualProfit(id: $similerBusinessAvgAnualProfitId) {
    totalProfit
    graph {
      profit
      year
    }
  }
}
`
export {
  GET_BUSINESS_STATS,
  GET_BUSINESS_STATS_GRAPH,
  GET_BUSINESS_PRICE_TIER,
  GET_BUSINESS_REVENUE_TIER,
  GET_BUSINESS_CATEGORY_COUNT,
  GET_BUSINESSES,
  GET_CATEGORIES,
  GET_CATEGORIES_BY_ID,
  GET_FINANCE_COUNT,
  GET_FINANCE_GRAPH,
  GET_COMPLETED_DEALS,
  GET_BUSINESSES_STATS_BY_ID,
  GET_BUSINESSES_ASSETS_BY_ID,
  GET_BUSINESSES_DOCUMENT_ID,
  SIMILER_BUSINESS_CATEGORY_GRAPH
}
