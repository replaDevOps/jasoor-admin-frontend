import { Button, Col, Flex, Row } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'

const FinalDeal = () => {

    return (
        <Row gutter={[16, 24]}>
            <Col span={24}>
                <Flex vertical gap={10}>
                    <Flex gap={5} className='badge-cs success fs-12 fit-content' align='center'>
                        <CheckCircleOutlined className='fs-14' /> Buyer mark the deal as "Finalized".
                    </Flex>
                    <Flex gap={5} className='badge-cs pending fs-12 fit-content' align='center'>
                        <CheckCircleOutlined className='fs-14' /> Waiting for seller to mark the deal as "Finalized".
                    </Flex>
                    <Flex>
                        <Button type="button" className='btnsave bg-gray border0 text-white'>
                            Mark Deal as Completed
                        </Button>
                    </Flex>
                </Flex>
            </Col>
        </Row>
    )
}

export {FinalDeal}