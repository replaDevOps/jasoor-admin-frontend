import { useState } from 'react'
import { Breadcrumb, Flex, Typography, Steps, Button,Spin,message } from 'antd'
import { CheckOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { CREATE_BUSINESS } from "../../../graphql/mutation";
import { useMutation } from '@apollo/client';
import { BusinessDetailStep } from './BusinessDetailStep';
import { FinancialInfoStep } from './FinancialInfoStep';
import { BusinessVisionStep } from './BusinessVisionStep';
import { UploadSupportDocStep } from './UploadSupportDocStep';
import { BusinesslistingReviewModal, CancelModal } from '../modals';
import { t } from 'i18next';

const { Text } = Typography
const LOCAL_STORAGE_KEY = 'sellBusinessDraft';

const CreateBusinessList = ({ addstep }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [current, setCurrent] = useState(0);
    const [iscancel, setIsCancel] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [reviewmodal, setReviewModal] = useState(false);
    const navigate = useNavigate();
    const [createBusiness, { loading, error }] = useMutation(CREATE_BUSINESS);

    const [businessData, setBusinessData] = useState(() => {
        const draft = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (draft) {
            const parsed = JSON.parse(draft);
            // Convert date strings to Day.js
            return {
                ...parsed,
                foundedDate: parsed.foundedDate ? dayjs(parsed.foundedDate) : null,
                // repeat for other date fields if any
            };
        }
        return draft ? JSON.parse(draft) : {
        isByTakbeer: null,
        businessTitle: null,
        createdBy:null,
        categoryId: null,
        district: null,
        city: null,
        foundedDate: null,
        numberOfEmployees: null,
        description: null,
        url: null,
      
        // Financial info
        revenueTime: null,
        revenue: null,
        profittime: null,
        profit: null,
        price: null,
        profitMargen: null,
        capitalRecovery: null,
        multiple: null,
        assets: [
          { name: null, price: null, purchaseYear: null, quantity: null },
        ],
        liabilities: [
          { name: null, price: null, purchaseYear: null, quantity: null },
        ],
        inventoryItems: [
          { name: null, price: null, purchaseYear: null, quantity: null },
        ],
      
        // Business vision
        supportDuration: null,
        supportSession: null,
        growthOpportunities: null,
        reason: null,
      
        // Documents
        documents: [
          {
            title: null,
            fileName: null,
            fileType: null,
            filePath: null,
            description: null,
          },
        ],
        };
      });

    const steps = [
        { title: t('Business Details'), content: <BusinessDetailStep data={businessData} setData={setBusinessData} /> },
        { title: t('Financial & Growth Information'), content: <FinancialInfoStep data={businessData} setData={setBusinessData} /> },
        { title: t('Business Vision'), content: <BusinessVisionStep data={businessData} setData={setBusinessData} /> },
        { title: t('Document Uploads'), content: <UploadSupportDocStep data={businessData} setData={setBusinessData} /> },
    ];

    const onChange = (value) => {
        setCurrent(value);
        // setIsPreview(false);
    };

    const next = () => {
        if (current < steps.length - 1) {
            setCurrent(current + 1);
            // setIsPreview(false);
        }
    };

    const prev = () => {
        if (current === 0) {
            setIsCancel(true);
        } else if (current === steps.length - 1 && isPreview) {
            setIsPreview(false);
        } else {
            setCurrent(current - 1);
            setIsPreview(false);
        }
    };

    const items = steps.map((item, index) => ({
        key: item.title,
        title: (
            <span className={`custom-step-title ${current >= index ? 'completed' : ''}`}>
                {item.title}
            </span>
        ),
    }));
    const handleCreateListing = async () => {
        try {
            const variables = {
                input: {
                    isByTakbeer: businessData.isByTakbeer,
                    businessTitle: businessData.businessTitle,
                    categoryId: businessData.categoryId,
                    district: businessData.district,
                    city: businessData.city,
                    foundedDate: businessData.foundedDate,
                    numberOfEmployees: businessData.numberOfEmployees,
                    description: businessData.description,
                    url: businessData.url,
    
                    // Financial info
                    revenueTime: businessData.revenueTime === 1
                        ? "Last 6 Months"
                        : businessData.revenueTime === 2
                        ? "Last Year"
                        : "Last 6 Months", // fallback
                    revenue: parseFloat(businessData.revenue),
                    // if businessData.profittime === 1 then "Last 6 Months" if 2 then Last year
                    profittime: businessData.profittime === 1
                        ? "Last 6 Months"
                        : businessData.profittime === 2
                        ? "Last Year"
                        : "Last 6 Months", // fallback
                    profit: parseFloat(businessData.profit),
                    price: parseFloat(businessData.price),
                    profitMargen: parseFloat(businessData.profitMargen),
                    capitalRecovery: parseFloat(businessData.capitalRecovery),
                    multiple: parseFloat(businessData.multiple),
    
                    assets: businessData.assets.map(asset => ({
                        name: asset.name,
                        price: parseFloat(asset.price),
                        purchaseYear: parseInt(asset.purchaseYear),
                        quantity: parseInt(asset.quantity),
                    })),
    
                    liabilities: businessData.liabilities.map(liability => ({
                        name: liability.name,
                        price: parseFloat(liability.price),
                        purchaseYear: parseInt(liability.purchaseYear),
                        quantity: parseInt(liability.quantity),
                    })),
    
                    inventoryItems: businessData.inventoryItems.map(item => ({
                        name: item.name,
                        price: parseFloat(item.price),
                        purchaseYear: parseFloat(item.purchaseYear),
                        quantity: parseInt(item.quantity),
                    })),
    
                    // Business vision
                    supportDuration: parseInt(businessData.supportDuration),
                    supportSession: parseInt(businessData.supportSession),
                    growthOpportunities: businessData.growthOpportunities,
                    reason: businessData.reason,
    
                    // Documents
                    documents: businessData.documents.map(doc => ({
                        title: doc.title,
                        fileName: doc.fileName,
                        fileType: doc.fileType,
                        filePath: doc.filePath,
                        description: doc.description,
                    }))
                }
            };
            const { data } = await createBusiness({ variables });
            if (data?.createBusiness?.id) {
                messageApi.success('Business listing created successfully!');
                setReviewModal(true);
          
                // Clear draft from local storage
                localStorage.removeItem(LOCAL_STORAGE_KEY);
            } else {
                // Handle unexpected empty response
                messageApi.error('Failed to create business listing: No ID returned');
                console.error('Unexpected response:', data);
            }
    
        } catch (err) {
            console.error(err);
            messageApi.error('Failed to create business listing');
        }
    };
    const handleSaveDraft = () => {
        const draft = JSON.stringify(businessData);
        localStorage.setItem(LOCAL_STORAGE_KEY, draft);
        messageApi.success(t('Draft saved locally!'));
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" className='h-200'>
                <Spin size="large" />
            </Flex>
        );
    }

    return (
        <>
         {contextHolder}
         <div className='padd mb-2'>
            <div className='container'>
                <Flex vertical gap={25} className='mt-3'>
                    <Breadcrumb
                        separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
                        items={[
                            {
                                title: <Text className='fs-13 text-gray' onClick={() => navigate('/')}>{t("Home")}</Text>,
                            },
                            {
                                title: <Text className='fw-500 fs-13 text-black'>{t("Create a List")}</Text>,
                            },
                        ]}
                    />
                    <Steps
                        current={current}
                        onChange={onChange}
                        items={items}
                        progressDot={(dot, { status, index }) => (
                            <span className={`custom-dot ${current > index ? 'completed' : ''} ${current === index ? 'active' : ''}`}>
                                {current > index ? (
                                    <CheckOutlined />
                                ) : (
                                    dot
                                )}
                            </span>
                        )}
                        className='mt-3 steps-create'
                    />

                    {/* <div className="step-content">
                        {isPreview &&
                            // ? isPreview
                                 <PreviewStep data={businessData} />
                                // : <UploadSupportDocStep />
                            // : steps[current].content
                        }
                    </div> */}
                    <div className="step-content">{steps[current].content}</div>

                    <Flex justify={'space-between'} gap={5} align='center'>
                        {current === 0 ? (
                                <Button aria-labelledby='Cancel' type="button" className='btncancel text-black border-gray' onClick={()=>setIsCancel(true)}>
                                    {t("Cancel")}
                                </Button>
                            )
                            :
                            (
                                <Button aria-labelledby='Previous' type="button" className='btncancel text-black border-gray' onClick={prev}>
                                    {t("Previous")}
                                </Button>
                            )  
                        }
                        <Flex gap={10} justify='end'>
                            <Button
                                className='btncancel text-black border-gray'
                                onClick={handleSaveDraft}
                                aria-labelledby='Save as Draft'
                            >
                                {t("Save as Draft")}
                            </Button>

                            {current < steps.length - 1 && (
                                <Button aria-labelledby='Next' type="primary" className='btnsave border0 text-white brand-bg' onClick={next}>
                                    {t("Next")}
                                </Button>
                            )}

                            {current === steps.length - 1 && (
                                <Button aria-labelledby='Publish' type="primary" className='btnsave border0 text-white brand-bg' onClick={handleCreateListing}>
                                    {t("Publish")}
                                </Button>
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            </div>

            <CancelModal
                visible={iscancel}
                onClose={() => setIsCancel(false)}
            />
            <BusinesslistingReviewModal 
                visible={reviewmodal}
                onClose={()=>setReviewModal(false)}
                onCreate={handleCreateListing}
            />
        </div>
         </>
       
    )
}

export { CreateBusinessList }
