import { Button, Card, Col, Flex, Image, Row, Typography, message,Spin } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { UPDATE_DEAL} from '../../../graphql/mutation/mutations';
import { useMutation } from '@apollo/client';

const { Text } = Typography
const FinalDeal = ({details}) => {
    
    const [messageApi, contextHolder] = message.useMessage();
    const [updateDeals, { loading: updating }] = useMutation(UPDATE_DEAL, {
        onCompleted: () => {
            messageApi.success("Status changed successfully!");
        },
        onError: (err) => {
            messageApi.error(err.message || "Something went wrong!");
        },
    });
    const handleMarkVerified = async () => {
        if (!details?.key) return;
        await updateDeals({
            variables: {
                input: {
                    id: details.key,
                    status: "COMPLETED", 
                },
            },
        });
    };
    return (
        <>
            <contextHolder />
            <Row gutter={[16, 16]}>
                {
                    ['Commercial Registration (CR).png','Notarized Ownership Transfer Letter.png']?.map((items,index)=>
                    <Col span={24}>
                        <Card className='card-cs border-gray rounded-12' key={index} >
                            <Flex justify='space-between' align='center'>
                                <Flex gap={15}>
                                    <Image src={'/assets/icons/file.png'} preview={false} width={20} />
                                    <Flex vertical>
                                        <Text className='fs-13 text-gray'>
                                            {items}
                                        </Text>
                                        <Text className='fs-13 text-gray'>
                                            5.3 MB
                                        </Text>
                                    </Flex>
                                </Flex>
                                <Image src={'/assets/icons/download.png'} preview={false} width={20} />
                            </Flex>
                        </Card>
                    </Col>
                    )
                }
                <Col span={24}>
                    <Flex vertical gap={10}>
                        <Col span={24}>
                            <Flex vertical gap={10}>
                                {details?.isDocVedifiedSeller ? (
                                <>
                                    <Flex gap={5} className="badge-cs success fs-12 fit-content" align="center">
                                        <CheckCircleOutlined className="fs-14" /> Buyer marked the deal as "Finalized"
                                    </Flex>
                                    <Flex gap={5} className="badge-cs pending fs-12 fit-content" align="center">
                                        <CheckCircleOutlined className="fs-14" /> Waiting for admin to mark the deal as "Finalized"
                                    </Flex>
                                </>
                                ) : (
                                <>
                                    <Flex gap={5} className="badge-cs pending fs-12 fit-content" align="center">
                                        <CheckCircleOutlined className="fs-14" /> Waiting for seller to mark the deal as "Finalized"
                                    </Flex>
                                    <Flex gap={5} className="badge-cs pending fs-12 fit-content" align="center">
                                        <CheckCircleOutlined className="fs-14" /> Waiting for admin to mark the deal as "Finalized"
                                    </Flex>
                                </>
                                )}
                            </Flex>
                        </Col>
                        <Flex>
                            <Button
                                type="primary"
                                className="btnsave bg-brand"
                                disabled={!details?.isDocVedifiedAdmin}
                                onClick={handleMarkVerified}
                            >
                                Mark Deal as Completed
                            </Button>
                        </Flex>
                    </Flex>
                </Col>
            </Row>
        </>
    )
}

export {FinalDeal}