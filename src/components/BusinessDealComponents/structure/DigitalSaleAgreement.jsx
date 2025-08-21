import React,{useState,useEffect} from 'react'
import { Card, Checkbox, Col, Flex, Image, Row, Typography } from 'antd'
import { UPDATE_DEAL,} from '../../../graphql/mutation/mutations';
import { useMutation } from '@apollo/client';
import { message,Spin } from "antd";

const { Text } = Typography
const DigitalSaleAgreement = ({form,details}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const checked = details?.status !== 'DSA_FROM_SELLER_PENDING' && details?.status !== 'DSA_FROM_BUYER_PENDING';
    const [isCheckedDetails, setIsCheckedDetails] = useState(false); // first checkbox
    const [isCheckedTerms, setIsCheckedTerms] = useState(false); // second checkbox

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
                    <Text className='fw-600 fs-14'>Downloads Digital Sale Agreement</Text>
                    <Text className='fs-13 text-gray'>
                        This agreement outlines the final terms of the business transfer. Please review the details carefully before proceeding.
                    </Text>
                </Flex>
                <Card className='card-cs border-gray rounded-12' >
                    <Flex justify='space-between' align='center'>
                        <Flex gap={15}>
                            <Image src={'/assets/icons/file.png'} preview={false} width={20} />
                            <Flex vertical>
                                <Text className='fs-13 text-gray'>
                                    Digital Sale Agreement.pdf
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
            <Col span={24}>
            <Flex vertical gap={3}>
                        <Checkbox
                            className='fit-content'
                            checked={isCheckedDetails}
                            onChange={e => setIsCheckedDetails(e.target.checked)}
                        >
                            I confirm the business details are correct.
                        </Checkbox>
                        <Checkbox
                            className='fit-content'
                            checked={isCheckedTerms}
                            onChange={handleTermsChange} // only this triggers the mutation
                        >
                            I accept the terms of the agreement and agree to proceed.
                        </Checkbox>
                    </Flex>
            </Col>
            {/* <>
                {
                    !completedeal && (
                        <>
                            <Col span={24}>
                                <Flex vertical gap={3}>
                                    <Checkbox>
                                        I have read and agree to the terms of the sale agreement.
                                    </Checkbox>
                                    <Checkbox>
                                        I agree to pay the Jusoor platform commission.
                                    </Checkbox>
                                </Flex>
                            </Col>
                            <Col span={24}>
                                <Flex>
                                    <Button type="primary" className='btn bg-brand'>
                                        Mark as Accepted
                                    </Button>
                                </Flex>
                            </Col>
                        </>
                    )
                }
            </> */}
        </Row>
        </>
        
    )
}

export {DigitalSaleAgreement}