import React from 'react'
import { useState } from 'react'
import { Row, Col, Flex, Button } from 'antd'
import { AddEditFaqs, FaqsTable, ModuleTopHeading } from '../../components'
import { PlusOutlined } from '@ant-design/icons'

const FaqsPage = () => {

    const [visible, setVisible] = useState(false)
    const [ edititem, setEditItem ] = useState(null)
    return (
        <>
            <Row gutter={[24,24]}>
                <Col span={24}>
                    <Flex justify='space-between'>
                        <ModuleTopHeading level={4} name='FAQs'/>
                        <Button aria-labelledby='Add a Question' type='primary' className='btnsave' onClick={() => setVisible(true)}>
                            <PlusOutlined /> Add A Question
                        </Button>
                    </Flex>
                </Col>
                <Col span={24}>
                    <FaqsTable
                        {...{setVisible,setEditItem}}
                    />
                </Col>
            </Row>
            <AddEditFaqs 
                visible={visible} 
                edititem={edititem}
                onClose={()=>{setVisible(false);setEditItem(null)}}
            />
        </>
    )
}

export {FaqsPage} 
