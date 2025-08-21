import React, { useState } from 'react';
import { Flex, Typography, Steps, Collapse, Form, Tabs } from 'antd';
import { CheckOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { DigitalSaleAgreement } from './DigitalSaleAgreement';
import { BankAccountDetails } from './BankAccountDetails';
import { DocumentPaymentConfirmation } from './DocumentPaymentConfirmation';
import { FinalDeal } from './FinalDeal';
import { CommissionReceiptBuyer } from './CommissionReceiptBuyer';
import { BusinessAmountReceiptBuyer } from './BusinessAmountReceiptBuyer';
import { FinalDealBuyer } from './FinalDealBuyer';

const { Title, Text } = Typography;

const SingleInprogressSteps = ({ details }) => {
    const [form] = Form.useForm();
    const [activeStep, setActiveStep] = useState(details ? 3 : 0);
    const [activeTab, setActiveTab] = useState('seller');
    const [openPanels, setOpenPanels] = useState(details ? ['1', '2', '3', '4'] : ['1']);

    const sellerSteps = [
        {
            key: '1',
            label: 'Digital Sale Agreement',
            content: <DigitalSaleAgreement form={form} details={details} />,
            status: 'Pending',
            emptytitle: 'DSA Pending!',
            emptydesc: 'Waiting for the seller to sign the digital sale agreement.',
        },
        {
            key: '2',
            label: 'Bank Account Details',
            content: <BankAccountDetails details={details} />,
            status: 'Signed',
            emptytitle: 'Bank Details Pending!',
            emptydesc: 'Waiting for the seller to choose the bank account.',
        },
        {
            key: '3',
            label: 'Document & Payment Confirmation',
            content: <DocumentPaymentConfirmation details={details} />,
            status: 'Jusoor verification pending',
            emptytitle: 'Payment Confirmation Pending!',
            emptydesc: 'Waiting for the buyer to transfer the payment.',
        },
        {
            key: '4',
            label: 'Finalize Deal',
            content: <FinalDeal details={details} />,
            status: 'Deal Closed',
            emptytitle: 'Deal Pending!',
            emptydesc: 'Waiting for the buyer to transfer the payment so that seller uploads the document.',
        },
    ];

    const buyerSteps = [
        {
            key: '1',
            label: 'Commission Receipt',
            content: <CommissionReceiptBuyer details={details} />,
            status: 'Jusoor verification pending',
            emptytitle: 'Commission Pending!',
            emptydesc: 'Waiting for the buyer to pay the platform commission.',
        },
        {
            key: '2',
            label: 'Digital Sale Agreement',
            content: <DigitalSaleAgreement details={details} />,
            status: 'Signed',
            emptytitle: 'DSA Pending!',
            emptydesc: 'Waiting for the buyer to sign the digital sale agreement.',
        },
        {
            key: '3',
            label: 'Pay Business Amount',
            content: <BusinessAmountReceiptBuyer details={details} />,
            status: 'Waiting for jasoor to verify',
            emptytitle: 'Business Amount Pending!',
            emptydesc: 'Waiting for the buyer to pay the seller business amount.',
        },
        {
            key: '4',
            label: 'Finalize Deal',
            content: <FinalDealBuyer details={details} />,
            status: 'Completed',
            emptytitle: 'Deal Pending!',
            emptydesc: 'Waiting for the buyer to transfer the payment so that seller uploads the document and finalize the deal.',
        },
    ];


    const getStepItems = (steps) =>
        steps.map((item) => ({
        key: item.key,
        label: (
            <Flex justify='space-between' align='center'>
                <span className='custom-step-title fw-600 fs-15'>{item.label}</span>
                <span className='collapse-indicator'>
                    {openPanels.includes(item.key) ? (
                    <Flex align='center' gap={5}>
                        {(item.status.toLowerCase()?.includes('pending') || item.status.toLowerCase()?.includes('waiting'))  ? (
                        <Text className='pending fs-10 sm-pill fw-500 fit-content'>{item?.status}</Text>
                        ) : (
                        <Text className='success fs-10 sm-pill fw-500 fit-content'>{item?.status}</Text>
                        )}
                        <UpOutlined />
                    </Flex>
                    ) : (
                    <DownOutlined />
                    )}
                </span>
            </Flex>
        ),
        children: (
            item?.content === null || item?.content === '' ? (
            <Flex className='text-center' vertical justify='center' align='center'>
                <Title level={5} className='fw-500 m-0 fs-14'>{item?.emptytitle}</Title>
                <Text className='fs-14 text-gray'>{item?.emptydesc}</Text>
            </Flex>
            ) : (
            <div className="step-content">{item.content}</div>
            )
        ),
        showArrow: false,
        extra: null,
    }));

    const stepsProgress = sellerSteps.map((item, index) => ({
        key: item.label,
        title: (
        <span className={`custom-step-title ${activeStep >= index ? 'completed' : ''}`}>
            {item.label}
        </span>
        ),
    }));

    return (
        <Flex vertical gap={25} className='mt-3'>
            <Steps
                className='mt-3'
                current={activeStep}
                items={stepsProgress}
                progressDot={(dot, { index }) => (
                    <span className={`custom-dot ${activeStep > index ? 'completed' : ''} ${activeStep === index ? 'active' : ''}`}>
                        {activeStep > index ? <CheckOutlined /> : dot}
                    </span>
                )}
                onChange={(current) => {
                    setActiveStep(current);
                    setOpenPanels([sellerSteps[current].key]);
                }}
            />
            <Tabs
                className='tabs-fill'
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    {
                        key: 'seller',
                        label: 'Seller',
                        children: (
                        <Form form={form} layout='vertical'>
                            <Collapse
                                activeKey={openPanels}
                                onChange={(keys) => handleCollapseChange(keys, sellerSteps)}
                                items={getStepItems(sellerSteps)}
                                className='collapse-cs1'
                                expandIconPosition="end"
                                ghost
                            />
                        </Form>
                        ),
                    },
                    {
                        key: 'buyer',
                        label: 'Buyer',
                        children: (
                        <Form form={form} layout='vertical'>
                            <Collapse
                                activeKey={openPanels}
                                onChange={(keys) => handleCollapseChange(keys, buyerSteps)}
                                items={getStepItems(buyerSteps)}
                                className='collapse-cs1'
                                expandIconPosition="end"
                                ghost
                            />
                        </Form>
                        ),
                    },
                ]}
            />
        </Flex>
    );

    // Modified to accept specific step list
    function handleCollapseChange(keys, stepsList) {
            setOpenPanels(keys);
                if (keys.length > 0) {
                    const lastKey = keys[keys.length - 1];
                    const stepIndex = stepsList.findIndex(step => step.key === lastKey);
                if (stepIndex !== -1) {
                    setActiveStep(stepIndex);
                }
            }
        }
    };

export { SingleInprogressSteps };
