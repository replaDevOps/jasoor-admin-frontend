import { useContext, useState } from "react"
import { Space, Typography, Avatar, Flex} from "antd"
import UserProfileDrawer from "./UserProfileDrawer"
import { AuthContext } from "../../../context/AuthContext"
const { Text }= Typography

export const UserProfile = () => {
    const [visible, setVisible]= useState(false)
    const { userData } = useContext(AuthContext)
    const displayName = userData?.name || userData?.email || "Admin"
    const displayEmail = userData?.email || ""
    return (
        <>
          <Space 
            className="cursor"
            onClick={()=> setVisible(true)}
            size={10}
          >
            <Avatar
              size={36}
              icon={<img src="/assets/images/av-1.png" alt="user image" fetchPriority="high" />}
            />
            <Flex vertical gap={0}>
              <Text className="fs-12" strong>
                {displayName}
              </Text>
              <Text className="fs-10 text-gray">
                {displayEmail}
              </Text>
            </Flex>
          </Space>
          <UserProfileDrawer
            visible={visible}
            onClose={()=> setVisible(false)}
          />
        </>
    )
}
