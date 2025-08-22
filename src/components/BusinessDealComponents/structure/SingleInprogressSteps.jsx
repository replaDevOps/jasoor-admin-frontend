import { useState } from 'react';
import { Flex, Typography, Steps, Collapse, Form } from 'antd';
import { CheckCircleOutlined, CheckOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { DigitalSaleAgreement } from './DigitalSaleAgreement';
import { BankAccountDetails } from './BankAccountDetails';
import { DocumentPaymentConfirmation } from './DocumentPaymentConfirmation';
import { FinalDeal } from './FinalDeal';
import { CommissionReceiptBuyer } from './CommissionReceiptBuyer';
import { BusinessAmountReceiptBuyer } from './BusinessAmountReceiptBuyer';

const { Title, Text } = Typography;

const SingleInprogressSteps = ({ details }) => {
    const [form] = Form.useForm();
    const [activeStep, setActiveStep] = useState(completedeal ? 5 : 0);
    const [openPanels, setOpenPanels] = useState(completedeal ? ['1', '2', '3', '4','5','6'] : ['1']);

    const allSteps = [
        {
            key: '1',
            label: 'Commission Receipt',
            content: <CommissionReceiptBuyer />,
            status: 'Jusoor verification pending',
            emptytitle: 'Commission Pending!',
            emptydesc: 'Waiting for the buyer to pay the platform commission.',
        },
        {
            key: '2',
            label: 'Digital Sale Agreement',
            content: <DigitalSaleAgreement form={form} details={details} />,
            status: 'Pending',
            emptytitle: 'DSA Pending!',
            emptydesc: 'Waiting for the seller & buyer to sign the digital sale agreement.',
        },
        {
            key: '3',
            label: 'Bank Account Details',
            content: <BankAccountDetails details={details} />,
            status: 'Signed',
            emptytitle: 'Bank Details Pending!',
            emptydesc: 'Waiting for the seller to choose the bank account.',
        },
        {
            key: '4',
            label: 'Pay Business Amount',
            content: <BusinessAmountReceiptBuyer />,
            status: 'Pending',
            emptytitle: 'Business Amount Pending!',
            emptydesc: 'Waiting for the buyer to pay the seller business amount.',
        },
        {
            key: '5',
            label: 'Document & Payment Confirmation',
            content: <DocumentPaymentConfirmation />,
            status: 'Jusoor verification pending',
            emptytitle: 'Payment Confirmation Pending!',
            emptydesc: 'Waiting for the seller to transfer the document & approve the payment.',
        },
        {
            key: '6',
            label: 'Finalize Deal',
            content: <FinalDeal />,
            status: 'Pending',
            emptytitle: 'Deal Pending!',
            emptydesc: 'Waiting for the buyer & seller to finalized the deal.',
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
                                {(item.status.toLowerCase()?.startsWith('pending')) ? (
                                    <Text className='pending fs-10 sm-pill fw-500 fit-content'>{item?.status}</Text>
                                ) : (item.status.toLowerCase()?.includes('verification')) ? (
                                    <Text className='branded fs-10 sm-pill fw-500 fit-content'>{item?.status}</Text>
                                )                                
                                : (
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
                    <>
                        <Flex className='text-center' vertical justify='center' align='center'>
                            <Title level={5} className='fw-500 m-0 fs-14'>{item?.emptytitle}</Title>
                            <Text className='fs-14 text-gray'>{item?.emptydesc}</Text>
                        </Flex>
                        {
                            item?.key === '2' &&
                            <Flex vertical gap={5} className='mt-2'>
                                <Flex gap={5} className='badge-cs pending fs-12 fit-content' align='center'>
                                    <CheckCircleOutlined className='fs-14' /> Waiting for seller to sign the sales agreement
                                </Flex>
                                <Flex gap={5} className='badge-cs pending fs-12 fit-content' align='center'>
                                    <CheckCircleOutlined className='fs-14' /> Waiting for buyer to sign the sales agreement
                                </Flex>
                            </Flex> 
                        }
                    </>
                ) : (
                    <div className="step-content">{item.content}</div>
                )
            ),
            showArrow: false,
            extra: null,
        }));

    const stepsProgress = allSteps.map((item, index) => ({
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
                    setOpenPanels([allSteps[current].key]);
                }}
            />
            <Form form={form} layout='vertical'>
                <Collapse
                    activeKey={openPanels}
                    onChange={(keys) => handleCollapseChange(keys, allSteps)}
                    items={getStepItems(allSteps)}
                    className='collapse-cs1'
                    expandIconPosition="end"
                    ghost
                />
            </Form>
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
