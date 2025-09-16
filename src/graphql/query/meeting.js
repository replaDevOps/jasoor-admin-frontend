import { gql } from "@apollo/client";

const GETMEETINGSCOUNT = gql`
query GetAdminMeetingCounts {
  getAdminMeetingCounts {
    todayMeetings
    totalPendingMeetings
    totalScheduleMeetings
  }
}
`
const GETADMINPENDINGMEETINGS = gql`
query GetAdminPendingMeetings($search: String, $status: MeetingFilterType) {
  getAdminPendingMeetings(search: $search, status: $status) {
    totalCount
    items {
      id
      business {
        businessTitle
        price
        seller {
          name
          email
          phone
        }
      }
      requestedTo {
        name
        email
        phone
      }
      requestedDate
      offer {
        price
      }
      status
    }
  }
}
`
const GETADMINSCHEDULEMEETINGS = gql`
query GetAdminScheduledMeetings($search: String, $status: MeetingFilterType) {
  getAdminScheduledMeetings(search: $search, status: $status) {
    totalCount
    items {
      id
      meetingLink
      business {
        businessTitle
        price
        
        seller {
          name
          email
          phone
        }
      }
      requestedTo {
        id
        name
        email
        phone
      }
      requestedDate
      offer {
        id
        price
      }
      status
    }
  }
}
`
const GETDEALS = gql`
query GetDeals($limit: Int, $offset: Int, $search: String, $status: String, $isCompleted: Boolean) {
  getDeals(limit: $limit, offset: $offset, search: $search, status: $status, isCompleted: $isCompleted) {
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
    createdAt
    status
    offer {
      price
    }
    }
  }
}
`

export {
  GETMEETINGSCOUNT,
  GETADMINSCHEDULEMEETINGS,
  GETADMINPENDINGMEETINGS,
  GETDEALS
}
