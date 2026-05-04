import { useState, useEffect } from "react";
import { Badge, Button, Image } from "antd";
import NotificationsDrawer from "./NotificationsDrawer";
import { GET_NOTIFICATION_COUNT } from "../../../graphql/query";
import { NEW_NOTIFICATION_SUBSCRIPTION } from "../../../graphql/subscription";
import { useQuery, useSubscription } from "@apollo/client";

export const Notifications = () => {

  // Count API
  const { data: countData, refetch: refetchCount } = useQuery(
    GET_NOTIFICATION_COUNT,
    {
      fetchPolicy: "network-only",
    }
  );

  const [visible, setVisible] = useState(false);

  // Subscribe to new notifications — refetch real count from server on each arrival
  useSubscription(NEW_NOTIFICATION_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      const newNotif = subscriptionData.data?.newNotification;
      if (newNotif) {
        refetchCount();
      }
    },
  });

  useEffect(() => {
    if (visible) {
      refetchCount();
    }
  }, [visible]);

  return (
    <>
      <div>
        <Badge
          count={countData?.getNotificationCount}
          overflowCount={99}
          className=""
        >
          <Button
            aria-labelledby="notification button"
            shape="circle"
            size="large"
            className="bg-transparent border-0 p-0"
            onClick={() => setVisible(true)}
          >
            <Image
              src="/assets/icons/notify.webp"
              width={"20px"}
              preview={false}
              alt="notification-icon"
              className="up"
              fetchPriority="high"
            />
          </Button>
        </Badge>
      </div>
      <NotificationsDrawer
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </>
  );
};
