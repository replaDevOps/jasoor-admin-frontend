import React, { useState } from "react"
import { Badge, Button, Image } from "antd"
import NotificationsDrawer from "./NotificationsDrawer"
import {GET_NOTIFICATIONS} from '../../../graphql/query'
import {NEW_NOTIFICATION_SUBSCRIPTION} from '../../../graphql/subscription'
import { useQuery,useSubscription } from '@apollo/client';


export const Notifications = () => {
    const userId = localStorage.getItem("userId"); 

     // State to keep track of notifications
    const [notifications, setNotifications] = useState([]);
    const [visible, setVisible] = useState(false);

    // Fetch existing notifications
    const { data, loading: isLoading, refetch } = useQuery(GET_NOTIFICATIONS, {
        variables: { userId },
        skip: !userId,
        fetchPolicy: "network-only",
        onCompleted: (fetchedData) => {
            if (fetchedData?.getNotifications?.notifications) {
                setNotifications(fetchedData.getNotifications.notifications);
            }
        }
    });

    // Subscribe to new notifications
    const { data: subscriptionData } = useSubscription(NEW_NOTIFICATION_SUBSCRIPTION, {
        onSubscriptionData: ({ subscriptionData }) => {
            const newNotif = subscriptionData.data?.newNotification;
            if (newNotif) {
                setNotifications((prev) => [newNotif, ...prev]); // prepend to show latest first
            }
        }
    });
    // Count unread notifications
    const count = data?.getNotifications?.count

    return (
        <>
            <div>
                <Badge count={count} overflowCount={count} className="">
                    <Button shape='circle' size='large' className='bg-transparent border-0 p-0' onClick={()=> setVisible(true)}>
                        <Image 
                            src='/assets/icons/notify.png' 
                            width={'20px'} 
                            preview={false}
                            alt="jusoor" 
                            className="up"
                        />
                    </Button>
                </Badge>
            </div>
            <NotificationsDrawer
                visible={visible}
                onClose={()=> setVisible(false)}
            />
        </>
    )
}