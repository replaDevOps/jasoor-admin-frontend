import { useState } from 'react';
import { Flex, Typography, Steps, Collapse, Form } from 'antd';
import { CheckCircleOutlined, CheckOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { DigitalSaleAgreement } from './DigitalSaleAgreement';
import { DocumentPaymentConfirmation } from './DocumentPaymentConfirmation';
import { FinalDeal } from './FinalDeal';
import { CommissionReceiptBuyer } from './CommissionReceiptBuyer';
import { BusinessAmountReceiptBuyer } from './BusinessAmountReceiptBuyer';
import { useTranslation } from 'react-i18next';

// Calculate current step based on boolean flags instead of status string
const calculateCurrentStep = (details) => {
    if (!details) return 0;
    
    // Step 5: Finalize Deal - Both buyer and seller completed
    if (details.isBuyerCompleted && details.isSellerCompleted) {
        return 4; // Index 4 = Step 5
    }
    
    // Step 4: Document Confirmation - Payment verified by both seller and admin
    if (details.isDocVedifiedSeller && details.isDocVedifiedAdmin) {
        return 4; // Index 4 = Step 5 (moved to final)
    }
    
    // Step 3: Pay Business Amount - Payment verified by both seller and admin
    if (details.isPaymentVedifiedSeller && details.isPaymentVedifiedAdmin) {
        return 3; // Index 3 = Step 4
    }
    
    // Step 2: Digital Sale Agreement - Both DSA signed
    if (details.isDsaSeller && details.isDsaBuyer) {
        return 2; // Index 2 = Step 3
    }
    
    // Step 1: Commission Receipt - Commission verified
    if (details.isCommissionVerified) {
        return 1; // Index 1 = Step 2
    }
    
    // Default: Step 0 (Commission Receipt pending)
    return 0;
};

const { Title, Text } = Typography;

const SingleInprogressSteps = ({ details }) => {
    const {t}= useTranslation()
    const [form] = Form.useForm();
    const initialStep = calculateCurrentStep(details);
    const [activeStep, setActiveStep] = useState(initialStep);

    const allSteps = [
        {
            key: '1',
            label: t('Commission Receipt'),
            content: <CommissionReceiptBuyer details={details} />,
            status: details?.isCommissionVerified ? t('Verified') : t('Jusoor verification pending'),
            emptytitle: t('Commission Pending!'),
            emptydesc: t('Waiting for the buyer to pay the platform commission.'),
        },
        {
            key: '2',
            label: t('Digital Sale Agreement'),
            content: <DigitalSaleAgreement form={form} details={details} />,
            status: !details?.isDsaSeller && details?.isDsaBuyer
                ? t('Seller DSA Pending')
                : details?.isDsaSeller && !details?.isDsaBuyer
                ? t('Buyer DSA Pending')
                : details?.isDsaSeller && details?.isDsaBuyer
                ? t('Verified')
                : t('DSA Pending'),
            emptytitle: t('DSA Pending!'),
            emptydesc: t('Waiting for the seller & buyer to sign the digital sale agreement.'),
        },
        {
            key: '3',
            label: t('Pay Business Amount'),
            content: <BusinessAmountReceiptBuyer details={details} />,
            status: details?.isPaymentVedifiedSeller && details?.isPaymentVedifiedAdmin ? t('Verified') : details?.isPaymentVedifiedSeller ? t('Jusoor verification pending') : t('Seller verification Pending'),
            emptytitle: t('Business Amount Pending!'),
            emptydesc: t('Waiting for the buyer to pay the seller business amount.'),
        },
        {
            key: '4',
            label: t('Document Confirmation'),
            content: <DocumentPaymentConfirmation details={details} />,
            status: details?.isDocVedifiedAdmin && details?.isDocVedifiedSeller ? t("Verified") : details?.isDocVedifiedSeller ? t('Jusoor verification pending'): t('Seller verification pending'),
            emptytitle: t('Payment Confirmation Pending!'),
            emptydesc: t('Waiting for the seller to transfer the document & approve the payment.'),
        },
        {
            key: '5',
            label: t('Finalize Deal'),
            content: <FinalDeal details={details} />,
            status: details?.isDocVedifiedAdmin ? t("Verified") : t('Pending'),
            emptytitle: t('Deal Pending!'),
            emptydesc: 'Waiting for the buyer & seller to finalized the deal.',
        },
    ];
    const [openPanels, setOpenPanels] = useState(
        details ? allSteps.slice(0, initialStep + 1).map(step => step.key) : ['1']
    );

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
                                    <Text className='pending fs-10 sm-pill fw-500 fit-content'>{(item?.status)}</Text>
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
                                    <CheckCircleOutlined className='fs-14' /> {t("Waiting for seller to sign the sales agreement")}
                                </Flex>
                                <Flex gap={5} className='badge-cs pending fs-12 fit-content' align='center'>
                                    <CheckCircleOutlined className='fs-14' /> {t("Waiting for buyer to sign the sales agreement")}
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
                className='mt-3 responsive-steps'
                current={activeStep}
                items={stepsProgress}
                responsive={true}
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