import React, { useEffect } from 'react'
import { Button, Card, Col, Flex, Image, Row, Typography, message,Spin  } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { UPDATE_DEAL} from '../../../graphql/mutation/mutations';
import { useMutation } from '@apollo/client';
import { GETDEAL } from '../../../graphql/query';

const { Text } = Typography
const DocumentPaymentConfirmation = ({details}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const uploadDocs = [
        {
            title: "Updated Commercial Registration (CR)",
            ...details?.busines?.documents?.find(doc => doc.title === "Updated Commercial Registration (CR)")
        },
        {
            title: "Notarized Ownership Transfer Letter",
            ...details?.busines?.documents?.find(doc => doc.title === "Notarized Ownership Transfer Letter")
        }
    ];
    const [updateDeals, { loading: updating, data, error }] = useMutation(UPDATE_DEAL, {
        refetchQueries: [ { query: GETDEAL, variables: { getDealId: details?.key } } ],
        awaitRefetchQueries: true,
    });

    useEffect(() => {
        if (data?.updateDeal?.id) {
            messageApi.success("Commission verified successfully!");
        }
    }, [data?.updateDeal?.id]);

    useEffect(() => {
        if (error) {
            messageApi.error(error.message || "Something went wrong!");
        }
    }, [error]);
    

    const handleMarkVerified = async () => {
        if (!details?.key) return;
        await updateDeals({
            variables: {
                input: {
                    id: details.key,
                    status: "WAITING", 
                    isDocVedifiedAdmin: true, 
                },
            },
        });
    };

    if (updating) {
        return (
            <Flex justify="center" align="center" className='h-200'>
                <Spin size="large" />
            </Flex>
        );
    }

    return (
        <>
            {contextHolder}
            <Row gutter={[16, 24]}>
                {uploadDocs.map((item, index) => (
                    <Col span={24} key={index}>
                        <Text className="fw-600 text-medium-gray fs-13">{item.title}</Text>
                        <Card className="card-cs border-gray rounded-12 mt-2">
                            <Flex justify="space-between" align="center">
                                <Flex gap={15}>
                                    <Image src={"/assets/icons/file.png"} fetchPriority="high" alt='file-image' preview={false} width={20} />
                                    <Flex vertical>
                                        <Text className="fs-13 text-gray">{item?.title}</Text>
                                        <Text className="fs-13 text-gray">5.3 MB</Text>
                                    </Flex>
                                </Flex>
                                <a href={''} target="_blank" rel="noopener noreferrer">
                                    <Image src={"/assets/icons/download.png"} fetchPriority="high" alt='download-icon' preview={false} width={20} />
                                </a>
                            </Flex>
                        </Card>
                    </Col>
                ))}

                {/* Seller final confirmation */}
                <Col span={24}>
                    <Flex vertical gap={10}>
                        {/* Dynamic Badge */}
                        <Flex
                            gap={5}
                            className={details?.isDocVedifiedAdmin ? "badge-cs success fs-12 fit-content" : "badge-cs pending fs-12 fit-content"}
                            align="center"
                        >
                        <CheckCircleOutlined className="fs-14" />
                            {details?.isDocVedifiedAdmin
                                ? 'Seller marked "Payment Received"'
                                : '"Payment Received" Seller Confirmation pending'}
                        </Flex>

                        {/* Single Button */}
                        <Flex>
                            <Button
                                type="primary"
                                className="btnsave bg-brand"
                                onClick={handleMarkVerified}
                                disabled={details?.isDocVedifiedAdmin} // disable if already verified
                                aria-labelledby='Mark as Verified'
                            >
                                Mark as Verified
                            </Button>
                        </Flex>
                    </Flex>
                </Col>
            </Row>
        </>
    )
}

export {DocumentPaymentConfirmation}