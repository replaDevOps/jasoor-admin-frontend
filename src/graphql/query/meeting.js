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
  query GetAdminPendingMeetings($search: String, $status: MeetingFilterType, $limit: Int, $offset: Int) {
    getAdminPendingMeetings(search: $search, status: $status, limit: $limit, offset: $offset) {
      totalCount
      items {
        id
        business {
          businessTitle
          price
          seller {
            id
            name
            email
            phone
          }
        }
        requestedTo {
          name
          email
          phone
          id
        }
        requestedBy {
          name
          id
        }
        requestedDate
        requestedEndDate
        receiverAvailabilityDate
        offer {
          price
        }
        status
      }
    }
  }
`

const GETADMINSCHEDULEMEETINGS = gql`
query GetAdminScheduledMeetings($search: String, $status: MeetingFilterType,$limit: Int, $offset: Int) {
  getAdminScheduledMeetings(search: $search, status: $status,limit: $limit, offset: $offset) {
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
      adminAvailabilityDate
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
        commission
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
