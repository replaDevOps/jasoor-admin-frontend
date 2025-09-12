import { gql } from "@apollo/client";

const GETARTICLES = gql`
query GetArticles($search: String) {
  getArticles(search: $search) {
    totalCount
    articles {
      id
      title
      image
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
    image
    body
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
export {
    GETARTICLES,
    GETARTICLE,
    GETFAQ
}