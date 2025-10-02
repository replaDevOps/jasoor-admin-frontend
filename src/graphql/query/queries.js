import { gql } from "@apollo/client";

const GETARTICLES = gql`
query GetArticles($search: String) {
  getArticles(search: $search) {
    totalCount
    articles {
      id
      title
      arabicTitle
      image
      arabicBody
      body
    }
  }
}
`
const GETARTICLE = gql`
query GetArticle($getArticleId: ID!) {
  getArticle(id: $getArticleId) {
    id
    title
    arabicTitle
    image
    body
    arabicBody
    createdAt
  }
}
`
const GETFAQ = gql`
query GetFAQs($search: String) {
  getFAQs(search: $search) {
    totalCount
    faqs {
      id
      question
      answer
    }
  }
}
`
const GETTERMSOFUSE = gql`
query GetTerms {
  getTerms {
    id
    term
    arabicTerm
  }
}
`
const GETENDATERMS = gql`
query GetNDATerms {
  getNDATerms {
    id
    ndaTerm
    arabicNdaTerm
  }
}
`
const GETDSATERMS = gql`
query GetDSATerms {
  getDSATerms {
    id
    dsaTerms
    arabicNdaTerm
  }
}
`
const GETPRIVACYPOLICY = gql`
query GetPrivacyPolicy {
  getPrivacyPolicy {
    id
    policy
    arabicPolicy
  }
}
`
export {
    GETARTICLES,
    GETARTICLE,
    GETFAQ,
    GETTERMSOFUSE,
    GETENDATERMS,
    GETDSATERMS,
    GETPRIVACYPOLICY
}