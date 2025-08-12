import React, { useState } from "react"
import { Drawer, Button, Avatar, List, theme, Typography} from "antd"
import "./index.css"
import {
    DeleteOutlined
} from '@ant-design/icons'
const { useToken } = theme;
const { Text } = Typography
const NotificationsDrawer= ({visible, onClose})=>{
    const { token } = useToken();
    const [ closedraw, setCloseDraw ] = useState(false)
    const data = [
        {   
            img:'av-1.png',
            title: 'Josph Smart',
            desc:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer."
        },
        {
            img:'av-1.png',
            title: 'Sarah Beauty',
            desc: 'Took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting.'
        },
        {
            img:'av-1.png',
            title: 'Zainab Shabir',
            desc:"Remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
        },
    ];
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
                    onClick={() => setCloseDraw(true)}
                >
                    Clear All
                </Button>
            }
        >

                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                        avatar={<Avatar src={'/assets/images/'+item?.img} />}
                        title={<a href="" >{item?.title}</a>}
                        description={<Text >{item?.desc}</Text>}
                        />
                        <div className="nofitication">
                            <Avatar size={28} style={{background: 'transparent',color:'red',borderColor:'red'}} src={<DeleteOutlined />} />
                        </div>
                    </List.Item>
                    )}
                />
        </Drawer>
    )
}
export default NotificationsDrawer