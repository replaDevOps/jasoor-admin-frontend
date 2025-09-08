import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, Flex, Row, Typography } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { SingleInprogressSteps } from './SingleInprogressSteps'
import { UPDATE_DEAL } from '../../../graphql/mutation/mutations';
import {GETDEAL} from '../../../graphql/query'
import { useMutation,useQuery } from '@apollo/client';
import { message,Spin } from "antd";

const statusMap = {
    COMMISSION_TRANSFER_FROM_BUYER_PENDING: 'Buyer Commission Transfer Pending',
    COMMISSION_VERIFIED: 'Commission Verified by Admin',
    DSA_FROM_SELLER_PENDING: 'Seller DSA Pending',
    DSA_FROM_BUYER_PENDING: 'Buyer DSA Pending',
    BANK_DETAILS_FROM_SELLER_PENDING: 'Bank Details Pending from Seller',
    SELLER_PAYMENT_VERIFICATION_PENDING: 'Seller Payment Verification Pending',
    PAYMENT_APPROVAL_FROM_SELLER_PENDING: 'Payment Approval Pending from Seller',
    DOCUMENT_PAYMENT_CONFIRMATION: 'Document Payment Confirmation Pending',
    WAITING: 'Waiting for Seller Document Upload',
    PENDING: 'Pending Jasoor Verification',
    BUYERCOMPLETED: 'Buyer Completed',
    SELLERCOMPLETED: 'Seller Completed',
    COMPLETED: 'Deal Completed by Admin',
  };

  const inProgressStatuses = [
    'Buyer Commission Transfer Pending',
    'Seller DSA Pending',
    'Buyer DSA Pending',
    'Bank Details Pending from Seller',
    'Seller Payment Verification Pending',
    'Payment Approval Pending from Seller',
    'Document Payment Confirmation Pending',
    'Waiting for Seller Document Upload',
    'Pending Jasoor Verification'
];

const { Title, Text } = Typography
const BusinessDealsDetails = ({completedeal}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const {id} = useParams();
    const navigate = useNavigate()
    // const details = inprogressdealData?.find((item) => item.key == id);
    const { loading, error, data } = useQuery(GETDEAL, {
        variables: { getDealId: id },
        skip: !id, // skip if no id
    });
    const details = data?.getDeal
    ? {
        key: data.getDeal.id, // use actual id from API
        businessTitle: data.getDeal.business?.businessTitle || '-',
        buyerName: data.getDeal.buyer?.name || '-',
        sellerName: data.getDeal.business?.seller?.name || '-',
        finalizedOffer: data.getDeal.offer?.price ? `SAR ${data.getDeal.offer.price.toLocaleString()}` : '-',
        status: data.getDeal.status || 0,
        date: data.getDeal.createdAt ? new Date(data.getDeal.createdAt).toLocaleDateString() : '-',
        busines: data.getDeal.business || '-',
        banks: data.getDeal.buyer?.banks || '-',
    }
    : null;
    const buyerdealsData = [
        {
            title:'Seller Name',
            desc:details?.sellerName
        },
        {
            title:'Buyer Name',
            desc:details?.buyerName
        },
        {
            title:'Finalized Offer',
            desc:details?.finalizedOffer
        },
        {
            title:'Status',
            desc:statusMap[details?.status] || 'Unknown',
        },
    ]
    
    return (
        <Flex vertical gap={20}>
            <Flex vertical gap={25}>
                <Breadcrumb
                    separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
                    items={[
                        {
                            title: <Text className='fs-13 text-gray cursor' onClick={() => navigate('/businessdeal')}>Business Deals</Text>,
                        },
                        {
                            title: <Text className='fw-500 fs-13 text-black'>{details?.businessTitle}</Text>,
                        },
                    ]}
                />
            </Flex>
            <Flex justify='space-between' align='center'>
                <Flex gap={15} align='center'>
                    <Button aria-labelledby='Arrow left' className='border0 p-0 bg-transparent' onClick={() => navigate('/businessdeal')}>
                        <ArrowLeftOutlined />
                    </Button>
                    <Title level={4} className='m-0'>
                        {details?.businessTitle}
                    </Title>
                </Flex>
                <Button aria-labelledby='Cancel Deal' type='button' className='btnsave border0 text-white bg-red'>
                    Cancel Deal
                </Button>
            </Flex>
            <Card className='radius-12 border-gray'>
                <Flex vertical gap={40}>
                    <div className='deals-status'>
                        <Row gutter={[16, 16]}>
                            {
                                buyerdealsData?.map((list,index)=>
                                    <Col xs={24} sm={12} md={6} lg={6} key={index}>
                                        <Flex vertical gap={3}>
                                            <Text className='text-gray fs-14'>{list?.title}</Text>
                                            {
                                            (list?.title === 'Status') ? (
                                                list.desc === 'In-progress' ?
                                                <Text className='brand-bg text-white fs-12 sm-pill'>{list?.desc}</Text>:
                                                <Text className='bg-green text-white fs-12 sm-pill'>{list?.desc}</Text>
                                            ) : (
                                                <Text className='fs-12 fw-500'>{list?.desc}</Text>
                                            )}
                                        </Flex>
                                    </Col>
                                )
                            }
                        </Row>
                    </div>
                    <SingleInprogressSteps details={details} completedeal={completedeal} />
                </Flex>
            </Card>
        </Flex>
    )
}

export {BusinessDealsDetails}