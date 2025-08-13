import { gql } from "@apollo/client";

const GET_CATEGORIES = gql`
    query GetAllCategories {
  getAllCategories {
    id
    isDigital
    name
  }
}
`
const GET_CATEGORY = gql`
    query GetCategoryById($getCategoryByIdId: ID!) {
  getCategoryById(id: $getCategoryByIdId) {
    id
    isDigital
    name
  }
}
`
const GET_ALL_BUSINESSES = gql`
    query GetAllBusinesses($limit: Int, $offSet: Int, $filter: BusinessFilterInput, $sort: BusinessSortInput) {
  getAllBusinesses(limit: $limit, offSet: $offSet, filter: $filter, sort: $sort) {
  
    businesses {
    id
      category {
      name
    }
    businessTitle
    description
    revenue
    profit
    price
    recoveryTime
    savedBy {
      id
    }
    }
    totalCount
  }
}
`
const GET_BUSINESS = gql`
    query GetBusinessById($getBusinessByIdId: ID!) {
  getBusinessById(id: $getBusinessByIdId) {
    id
    businessTitle
    category {
      id
      name
    }
    isSupportVerified
    reference
    district
    city
    description
    foundedDate
    growthOpportunities
    isByTakbeer
    multiple
    numberOfEmployees
    price
    profit
    profitMargen
    profittime
    reason
    recoveryTime
    revenue
    revenueTime
    seller {
      name
      email
    }
    supportSession
    suppportDuration
    url
    
    assets {
      id
      name
      price
      purchaseYear
      quantity
      isActive
    }
    documents {
      id
      title
      fileName
      fileType
      filePath
    }
    inventoryItems {
      id
      name
      price
      purchaseYear
      quantity
      isActive
    }
    liabilities {
      id
      name
      price
      purchaseYear
      quantity
      isActive
    }
  }
}
`
const GET_RANDOM_BUSINESSES = gql`
query GetRandomBusinesses($getRandomBusinessesId: ID!) {
  getRandomBusinesses(id: $getRandomBusinessesId) {
    id
    category {
      name
    }
    businessTitle
    description
    revenue
    profit
    price
    recoveryTime
    isSaved
    multiple
    seller {
      name
    }
  }
}
`
const GET_BUSINESS_BY_CATEGORY = gql`
query GetAllBusinessesByCategory($category: String!, $limit: Int, $offSet: Int) {
  getAllBusinessesByCategory(category: $category, limit: $limit, offSet: $offSet) {
    businesses {
      id
      businessTitle
      description
      revenue
      profit
      price
      recoveryTime
      multiple
      savedBy {
        id
      }
      category {
        name
      }
      seller {
        name
      }
    }
    totalCount
  }
}
`
const GET_BUSINESS_BY_CITY = gql`
query GetAllBusinessesByCity($city: String!, $limit: Int, $offSet: Int) {
  getAllBusinessesByCity(city: $city, limit: $limit, offSet: $offSet) {
    businesses {
      id
      businessTitle
      description
      revenue
      profit
      price
      recoveryTime
      multiple
      savedBy {
        id
      }
      category {
        name
      }
      seller {
        name
      }
    }
    totalCount
  }
}
`
const GET_BUSINESS_BY_DISTRICT = gql`
query getAllBusinessesByDistrict($district: String!, $limit: Int, $offSet: Int) {
  getAllBusinessesByDistrict(district: $district, limit: $limit, offSet: $offSet) {
    businesses {
      id
      businessTitle
      description
      revenue
      profit
      price
      recoveryTime
      multiple
      savedBy {
        id
      }
      category {
        name
      }
      seller {
        name
      }
    }
    totalCount
  }
}
`
const GET_BUSINESS_BY_PROFIT = gql`
query GetAllBusinessesByProfit($profit: [Float]!, $limit: Int, $offSet: Int) {
  getAllBusinessesByProfit(profit: $profit, limit: $limit, offSet: $offSet) {
    businesses {
      id
      businessTitle
      description
      revenue
      profit
      price
      recoveryTime
      multiple
      savedBy {
        id
      }
      category {
        name
      }
      seller {
        name
      }
    }
    totalCount
  }
}
`
const GET_BUSINESS_BY_REVENUE = gql`
query GetAllBusinessesByRevenue($revenue: [Float]!, $limit: Int, $offSet: Int) {
  getAllBusinessesByRevenue(revenue: $revenue, limit: $limit, offSet: $offSet) {
    businesses {
      id
      businessTitle
      description
      revenue
      profit
      price
      recoveryTime
      multiple
      savedBy {
        id
      }
      category {
        name
      }
      seller {
        name
      }
    }
    totalCount
  }
}
`
export {
    GET_CATEGORIES,
    GET_CATEGORY,
    GET_ALL_BUSINESSES,
    GET_BUSINESS,
    GET_RANDOM_BUSINESSES,
    GET_BUSINESS_BY_CATEGORY,
    GET_BUSINESS_BY_CITY,
    GET_BUSINESS_BY_PROFIT,
    GET_BUSINESS_BY_REVENUE,
    GET_BUSINESS_BY_DISTRICT
}
