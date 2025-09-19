import { Drawer, Button, Avatar, List, Typography } from "antd"
import {
    DeleteOutlined
} from '@ant-design/icons'
import { MARK_AS_READ } from '../../../graphql/mutation';
import {GET_NOTIFICATIONS} from '../../../graphql/query'
import { useMutation,useQuery } from '@apollo/client';

const { Text } = Typography
const NotificationsDrawer= ({visible, onClose})=>{
    const userId = localStorage.getItem("userId"); 
    const { data, loading } = useQuery(GET_NOTIFICATIONS, {
        variables: { userId },
        skip: !userId,
        fetchPolicy: "network-only",
    });
    
    const [markAsRead] = useMutation(MARK_AS_READ, {
      refetchQueries: [{ query: GET_NOTIFICATIONS, variables: { userId } }],
      awaitRefetchQueries: true,
    } );
    
      // Mark single notification as read
      const handleMarkAsRead = (id) => {
        markAsRead({ variables: { markNotificationAsReadId: id } });
      };
    
      // Mark all notifications as read
      const handleClearAll = () => {
        if (data?.getNotifications?.count) {
          data.getNotifications?.notifications.forEach((notif) =>
            markAsRead({ variables: { markNotificationAsReadId: notif.id } })
          );
        }
      };
    
    return (
        <Drawer
            title='Notifications'
            onClose={onClose}
            open={visible}
            destroyOnClose
            width={500}
            footer={
                <Button 
                    block 
                    className="btnsave py-2"
                    type="primary"
                    onClick={handleClearAll}
                    aria-labelledby='Clear all'
                >
                    Clear All
                </Button>
            }
        >
         <List
            itemLayout="horizontal"
            dataSource={data?.getNotifications?.notifications || []}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => handleMarkAsRead(item.id)}
                    aria-labelledby='Delete button'
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={"/assets/images/av-1.png"} />}
                  title={<Text strong>{item.name}</Text>}
                  description={<Text>{item.message}</Text>}
                />
              </List.Item>
            )}
          />
        </Drawer>
    )
}
export default NotificationsDrawer