import { Button, Col, Flex, Row } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { UPDATE_DEAL} from '../../../graphql/mutation/mutations';
import { useMutation } from '@apollo/client';
import { message,Spin } from "antd";

const FinalDeal = ({details}) => {
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
                    <Button
                            type="primary"
                            className="btnsave bg-brand"
                            disabled={details?.status !== "WAITING"} // ✅ enable only if status = WAITING
                        >
                            Mark Deal as Completed
                        </Button>
                    </Flex>
                </Flex>
            </Col>
        </Row>
    )
}

export {FinalDeal}