import { useState, useEffect } from "react"
import { Badge, Button, Image } from "antd"
import NotificationsDrawer from "./NotificationsDrawer"
import {GET_NOTIFICATIONS} from '../../../graphql/query'
import {NEW_NOTIFICATION_SUBSCRIPTION} from '../../../graphql/subscription'
import { useQuery, useSubscription } from '@apollo/client';


export const Notifications = () => {
    const userId = localStorage.getItem("userId"); 

    // State to keep track of unread count
    const [unreadCount, setUnreadCount] = useState(0);
    const [visible, setVisible] = useState(false);

    // Fetch existing notifications count
    const { data } = useQuery(GET_NOTIFICATIONS, {
        variables: { userId },
        skip: !userId,
        fetchPolicy: "network-only",
        onCompleted: (fetchedData) => {
            if (typeof fetchedData?.getNotifications?.count === 'number') {
                setUnreadCount(fetchedData.getNotifications.count);
            }
        }
    });

    // Subscribe to new notifications
    useSubscription(NEW_NOTIFICATION_SUBSCRIPTION, {
        onSubscriptionData: ({ subscriptionData }) => {
            const newNotif = subscriptionData.data?.newNotification;
            if (newNotif) {
                // Increment unread count when new notification arrives
                setUnreadCount((prev) => prev + 1);
            }
        }
    });

    // Update unread count when data changes
    useEffect(() => {
        if (typeof data?.getNotifications?.count === 'number') {
            setUnreadCount(data.getNotifications.count);
        }
    }, [data]);

    return (
        <>
            <div>
                <Badge count={unreadCount} overflowCount={99} className="">
                    <Button aria-labelledby='notification button' shape='circle' size='large' className='bg-transparent border-0 p-0' onClick={()=> setVisible(true)}>
                        <Image 
                            src='/assets/icons/notify.webp' 
                            width={'20px'} 
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
                onClose={()=> setVisible(false)}
            />
        </>
    )
}