
import React,{useState,useEffect} from 'react'
import { Button, Card, Checkbox, Col, Flex, Image, Row, Typography, message,Spin } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { UPDATE_DEAL,} from '../../../graphql/mutation/mutations';
import { useMutation } from '@apollo/client';

const { Text } = Typography
const DigitalSaleAgreement = ({form,details}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const checked = details?.status !== 'DSA_FROM_SELLER_PENDING' && details?.status !== 'DSA_FROM_BUYER_PENDING';
    const [isCheckedDetails, setIsCheckedDetails] = useState(false); // first checkbox
    const [isCheckedTerms, setIsCheckedTerms] = useState(false); // second checkbox
    const DSA = details?.status

    const [updateDeals, { loading: updating }] = useMutation(UPDATE_DEAL, {
        onCompleted: () => {
            messageApi.success("Status changed successfully!");
        },
        onError: (err) => {
            messageApi.error(err.message || "Something went wrong!");
        },
    });

    // Set initial state when details change
    useEffect(() => {
        setIsCheckedDetails(checked);
        setIsCheckedTerms(checked);
    }, [checked, details]);

    // Function to handle second checkbox change and trigger update
    const handleTermsChange = (e) => {
        setIsCheckedTerms(e.target.checked);

        if (e.target.checked) {
            let newStatus;
            if (details?.status === 'DSA_FROM_BUYER_PENDING') {
                newStatus = 'DSA_FROM_SELLER_PENDING';
            } else if (details?.status === 'DSA_FROM_SELLER_PENDING') {
                newStatus = 'DSA_FROM_BUYER_PENDING';
            } else {
                newStatus = 'BANK_DETAILS_FROM_SELLER_PENDING';
            }

            updateDeals({
                variables: {
                    input: {
                        id: details?.key || null,
                        status: newStatus
                    }
                }
            });
        }
    };
    if (updating) {
        return (
          <Flex justify="center" align="center" style={{ height: '200px' }}>
            <Spin size="large" />
          </Flex>
        );
    }
    return (
        <>
        {contextHolder}
        <Row gutter={[16, 24]}>
            <Col span={24}>
                <Flex vertical gap={0} className='mb-3'>
                    <Text className='fw-600 text-medium-gray fs-13'>Downloads Digital Sale Agreement</Text>
                    <Text className='fs-13 text-gray'>
                        This agreement outlines the final terms of the business transfer. Please review the details carefully before proceeding.
                    </Text>
                </Flex>
                <Card className='card-cs border-gray rounded-12' >
                    <Flex justify='space-between' align='center'>
                        <Flex gap={15}>
                            <Image src={'/assets/icons/file.png'} fetchPriority="high" alt='file-image' preview={false} width={20} />
                            <Flex vertical>
                                <Text className='fs-13 text-gray'>
                                    Digital Sale Agreement.pdf
                                </Text>
                                <Text className='fs-13 text-gray'>
                                    5.3 MB
                                </Text>
                            </Flex>
                        </Flex>
                        <Image src={'/assets/icons/download.png'} fetchPriority="high" alt='download-icon' preview={false} width={20} />
                    </Flex>
                </Card>
            </Col>
            <Col span={24}>
                <Flex vertical gap={3}>
                    <Checkbox
                        className='fit-content'
                        checked={isCheckedDetails}
                        disabled={isCheckedDetails}
                        onChange={e => setIsCheckedDetails(e.target.checked)}
                    >
                        I confirm the business details are correct.
                    </Checkbox>
                    <Checkbox
                        className='fit-content'
                        checked={isCheckedTerms}
                        disabled={isCheckedTerms}
                        onChange={handleTermsChange} // only this triggers the mutation
                    >
                        I accept the terms of the agreement and agree to proceed.
                    </Checkbox>
                </Flex>
            </Col>
            <Col span={24}>
                {(DSA === 'DSA_FROM_SELLER_PENDING' || DSA === 'DSA_FROM_BUYER_PENDING') && (
                    <Flex vertical gap={10}>
                    {DSA === 'DSA_FROM_SELLER_PENDING' && (
                        <>
                        <Flex gap={5} className='badge-cs pending fs-12 fit-content' align='center'>
                            <CheckCircleOutlined className='fs-14' /> Waiting for seller to sign the sales agreement
                        </Flex>
                        <Flex gap={5} className='badge-cs success fs-12 fit-content' align='center'>
                            <CheckCircleOutlined className='fs-14' /> Buyer accepted the "Sale Agreement"
                        </Flex>
                        </>
                    )}

                    {DSA === 'DSA_FROM_BUYER_PENDING' && (
                        <>
                        <Flex gap={5} className='badge-cs pending fs-12 fit-content' align='center'>
                            <CheckCircleOutlined className='fs-14' /> Waiting for buyer to sign the sales agreement
                        </Flex>
                        <Flex gap={5} className='badge-cs success fs-12 fit-content' align='center'>
                            <CheckCircleOutlined className='fs-14' /> Seller accepted the "Sale Agreement"
                        </Flex>
                        </>
                    )}
                    </Flex>
                )}
            </Col>
            </Row>
        </>
        
    )
}

export {DigitalSaleAgreement}