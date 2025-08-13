import { gql } from "@apollo/client";

const SENTMEETINGS = gql`
query GetMySentMeetingRequests($search: String) {
  getMySentMeetingRequests(search: $search) {
    id
    createdAt
    requestedBy {
      name
    }
    business {
      businessTitle
      price
    }
    offer {
      id
      price
    }
  }
}
`
const RECEIVEDMEETINGS = gql`
query GetReceivedMeetingRequests($search: String) {
  getReceivedMeetingRequests(search: $search) {
    id
    createdAt
    requestedBy {
      name
    }
    business {
      id
      businessTitle
      price
    }
    offer {
      id
      price
    }
  }
}
`


const READYSCHEDULEDMEETINGS = gql`
query GetMeetingsReadyForScheduling($search: String) {
  getMeetingsReadyForScheduling(search: $search) {
    id
    createdAt
    requestedDate
    ownerAvailabilityDate
    requestedBy {
      name
    }
    business {
      businessTitle
      price
    }
    offer {
      id
      price
    }
  }
}
`
const SCHEDULEDMEETINGS = gql`
query GetScheduledMeetings($search: String) {
  getScheduledMeetings(search: $search) {
    id
    createdAt
    requestedDate
    ownerAvailabilityDate
    requestedBy {
      name
    }
    business {
      businessTitle
      price
    }
    offer {
      id
      price
    }
  }
}
`

export {
    SENTMEETINGS,
    RECEIVEDMEETINGS,
    READYSCHEDULEDMEETINGS,
    SCHEDULEDMEETINGS
}
