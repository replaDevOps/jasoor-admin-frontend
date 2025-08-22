import { Button, Col, Divider, Flex, Form, Image, Modal, Row, Typography } from 'antd'
import { MyInput, MySelect } from '../../Forms'
import { CloseOutlined } from '@ant-design/icons'
import { useEffect } from 'react'

const { Title } = Typography
const ViewIdentity = ({visible,onClose,viewstate}) => {


    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onClose}
            closeIcon={false}
            centered
            footer={null}
        > 

            <div>
                <Flex justify='space-between' className='mb-3' gap={6}>
                    <Title level={5} className='m-0'>
                        View Passport & National Identity
                    </Title>
                    <Button type='button' onClick={onClose} className='p-0 border-0 bg-transparent'>
                        <CloseOutlined className='fs-18' />
                    </Button>
                </Flex> 
                <Flex gap={10}>
                    {
                        // if you want to show dynamic data then you can add (viewstate) state before map method
                        ['idcardback.png','idcardback.png']?.map((img,index)=>
                            <div className='viewimg'>
                                <Image key={index} src={'/assets/images/'+img} width={100} height={80} className='object-cover' />
                            </div>
                        )
                    }   
                </Flex>
            </div>
            <Divider className='my-2 bg-light-brand' />
        </Modal>
    )
}

export {ViewIdentity}