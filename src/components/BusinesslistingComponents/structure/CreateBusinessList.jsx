import React, { useState } from 'react'
import { Breadcrumb, Flex, Typography, Steps, Button } from 'antd'
import { CheckOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
// import { CREATE_BUSINESS } from "../graphql/mutation/mutations";
// import { useMutation } from '@apollo/client';
import { message } from "antd";
import { BusinessDetailStep } from './BusinessDetailStep';
import { FinancialInfoStep } from './FinancialInfoStep';
import { BusinessVisionStep } from './BusinessVisionStep';
import { UploadSupportDocStep } from './UploadSupportDocStep';
import { BusinesslistingReviewModal, CancelModal } from '../modals';

const { Text } = Typography

const CreateBusinessList = ({ addstep }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [current, setCurrent] = useState(0);
    const [iscancel, setIsCancel] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [reviewmodal, setReviewModal] = useState(false);
    const navigate = useNavigate();
    // const [createBusiness, { loading, error }] = useMutation(CREATE_BUSINESS);

    const [businessData, setBusinessData] = useState({
        isByTakbeer: null,
        businessTitle: null,
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
        recoveryTime: null,
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
    });

    const steps = [
        { title: 'Business Details', content: <BusinessDetailStep data={businessData} setData={setBusinessData} /> },
        { title: 'Financial & Growth Information', content: <FinancialInfoStep data={businessData} setData={setBusinessData} /> },
        { title: 'Business Vision', content: <BusinessVisionStep data={businessData} setData={setBusinessData} /> },
        { title: 'Document Uploads', content: <UploadSupportDocStep data={businessData} setData={setBusinessData} /> },
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

            // try {
            //     const variables = {
            //         input: {
            //             isByTakbeer: businessData.isByTakbeer,
            //             businessTitle: businessData.businessTitle,
            //             categoryId: businessData.categoryId,
            //             district: businessData.district,
            //             city: businessData.city,
            //             foundedDate: businessData.foundedDate,
            //             numberOfEmployees: businessData.numberOfEmployees,
            //             description: businessData.description,
            //             url: businessData.url,
        
            //             // Financial info
            //             revenueTime: businessData.revenueTime === 1
            //                 ? "Last 6 Months"
            //                 : businessData.revenueTime === 2
            //                 ? "Last Year"
            //                 : "Last 6 Months", // fallback
            //             revenue: parseFloat(businessData.revenue),
            //             // if businessData.profittime === 1 then "Last 6 Months" if 2 then Last year
            //             profittime: businessData.profittime === 1
            //                 ? "Last 6 Months"
            //                 : businessData.profittime === 2
            //                 ? "Last Year"
            //                 : "Last 6 Months", // fallback
            //             profit: parseFloat(businessData.profit),
            //             price: parseFloat(businessData.price),
            //             profitMargen: parseFloat(businessData.profitMargen),
            //             recoveryTime: parseFloat(businessData.recoveryTime),
            //             multiple: parseFloat(businessData.multiple),
        
            //             assets: businessData.assets.map(asset => ({
            //                 name: asset.name,
            //                 price: parseFloat(asset.price),
            //                 purchaseYear: parseInt(asset.purchaseYear),
            //                 quantity: parseInt(asset.quantity),
            //             })),
        
            //             liabilities: businessData.liabilities.map(liability => ({
            //                 name: liability.name,
            //                 price: parseFloat(liability.price),
            //                 purchaseYear: parseInt(liability.purchaseYear),
            //                 quantity: parseInt(liability.quantity),
            //             })),
        
            //             inventoryItems: businessData.inventoryItems.map(item => ({
            //                 name: item.name,
            //                 price: parseFloat(item.price),
            //                 purchaseYear: parseFloat(item.purchaseYear),
            //                 quantity: parseInt(item.quantity),
            //             })),
        
            //             // Business vision
            //             suppportDuration: parseInt(businessData.supportDuration),
            //             supportSession: parseInt(businessData.supportSession),
            //             growthOpportunities: businessData.growthOpportunities,
            //             reason: businessData.reason,
        
            //             // Documents
            //             documents: businessData.documents.map(doc => ({
            //                 title: doc.title,
            //                 fileName: doc.fileName,
            //                 fileType: doc.fileType,
            //                 filePath: doc.filePath,
            //                 description: doc.description,
            //             }))
            //         }
            //     };
            //     console.log("variable",variables)
            //     const { data } = await createBusiness({ variables });
            //     messageApi.success('Business listing created successfully!');
            //     setReviewModal(true);
        
            // } catch (err) {
            //     console.error(err);
            //     messageApi.error('Failed to create business listing');
            // }
            setReviewModal(true);
    };

    return (
        <>
         {contextHolder}
            <Flex vertical gap={25} className='mt-3'>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: (
                                <Text className="cursor fs-13 text-gray" onClick={() => navigate("/")}>
                                    Business Listing
                                </Text>
                            ),
                        },
                        {
                            title: <Text className="fw-500 fs-14 text-black">
                                Create New Business
                            </Text>,
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
                    className='mt-2 steps-create'
                />

                <div className="step-content">{steps[current].content}</div>

                <Flex justify={'space-between'} gap={5} align='center'>
                    {current === 0 ? (
                            <Button type="button" className='btncancel text-black border-gray' onClick={()=>setIsCancel(true)}>
                                Cancel
                            </Button>
                        )
                        :
                        (
                            <Button type="button" className='btncancel text-black border-gray' onClick={prev}>
                                Previous
                            </Button>
                        )  
                    }
                    <Flex gap={10} justify='end'>
                        <Button
                            className='btncancel text-black border-gray'
                            onClick={prev}
                            disabled={current === 0 ? true: false}
                        >
                            Save as Draft
                        </Button>

                        {current < steps.length - 1 && (
                            <Button type="primary" className='btnsave border0 text-white brand-bg' onClick={next}>
                                Next
                            </Button>
                        )}

                        {current === steps.length - 1 && (
                            <Button type="primary" className='btnsave border0 text-white brand-bg' onClick={handleCreateListing}>
                                Publish
                            </Button>
                        )}
                    </Flex>
                </Flex>
            </Flex>
            <CancelModal
                visible={iscancel}
                onClose={() => setIsCancel(false)}
            />
            <BusinesslistingReviewModal 
                visible={reviewmodal}
                onClose={()=>setReviewModal(false)}
                onCreate={handleCreateListing}
            />
         </>
       
    )
}

export { CreateBusinessList }
