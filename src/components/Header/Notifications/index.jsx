import React, { useState } from "react"
import { Badge, Button, Image } from "antd"
import NotificationsDrawer from "./NotificationsDrawer"

export const Notifications = () => {
    
    const [visible, setVisible]= useState(false)
    return (
        <>
            <div>
                <Badge count={9} overflowCount={9} className="">
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