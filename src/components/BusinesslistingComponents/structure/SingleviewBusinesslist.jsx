import { Button, Card, Col, Flex, Image, Row, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { basicInfoData, businesslisttableData } from '../../../data';
import { PendingUnverifiedTabs } from './PendingUnverifiedTabs';

const { Text, Title } = Typography;

const SingleviewBusinesslist = () => {
    const navigate = useNavigate()
    const { id } = useParams();

    const data = businesslisttableData?.find((item) => item.key === id);
    return (
        <>
            <Flex vertical gap={25}>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: (
                                <Text className="cursor fs-13 text-gray" onClick={() => navigate("/businesslist")}>
                                    Business listing
                                </Text>
                            ),
                        },
                        {
                            title: <Text className="fw-500 fs-14 text-black">{data?.title}</Text>,
                        },
                    ]}
                />
                <Flex gap={10} align="center">
                    <Flex gap={10} align="center">
                        <Button className="border0 p-0 bg-transparent" onClick={() => navigate("/businesslist")}>
                            <ArrowLeftOutlined />
                        </Button>
                        <Title level={4} className="fw-500 m-0">{data?.title}</Title>
                    </Flex>
                    <Button className="bg-transparent border0 p-0">
                        <Image src='/assets/icons/edit.png' width={24} />        
                    </Button>
                </Flex>
                <Card className="radius-12 border-gray">
                    <Row gutter={[24, 14]}>
                        <Col span={24}>
                            <Flex justify='space-between' align='center' gap={5}>
                                <Flex gap={5}>
                                    <Title level={5} className="m-0">
                                        Identity Verification
                                    </Title>
                                    {
                                        data?.verified === 1 ? (
                                            <Image src='/assets/icons/verified-user.png' width={20} preview={false} />
                                        ) : null
                                    }
                                </Flex>
                                {
                                    data?.verified === 0 ? (
                                        <Flex gap={10}>
                                            <Button className="btncancel">
                                                Reject      
                                            </Button>
                                            <Button className="btnsave border0 bg-green text-white">
                                                Accept       
                                            </Button>
                                        </Flex>
                                    ) : null
                                }
                            </Flex>
                        </Col>
                        {
                            basicInfoData?.map((list,index)=>
                                <Col xs={24} sm={12} md={6} lg={6} key={index}>
                                    <Flex vertical gap={0}>
                                        <Text className='fw-600 fs-14'>{list?.title}</Text>
                                        {Array.isArray(list?.desc) ? (
                                            <Flex gap={10}>
                                                {list.desc.map((imageUrl, imgIndex) => (
                                                    <div key={imgIndex} className='mt-2'>
                                                        <img src={imageUrl} width={100} height={'auto'} className='object-contain object-p-top border-gray 
                                                        p-1' />
                                                    </div>
                                                ))}
                                            </Flex>
                                        ) : (
                                            <Text className='fs-14 fw-normal text-gray'>{list?.desc}</Text>
                                        )}
                                    </Flex>
                                </Col>
                            )
                        }                        
                    </Row>
                </Card>
                <Flex justify='space-between' align='center' gap={5}>
                    <Title level={5} className="m-0">
                        Business Verification
                    </Title>
                    {
                        
                        data?.status === 1 ? (
                            <Button className="btnsave border0 bg-green text-white">
                                Activate Business       
                            </Button>
                        ) :
                        data?.status === 2 ? ( <Button className="btnsave border0 bg-red text-white">
                                Inactivate Business       
                            </Button>
                        )
                        :
                        <Flex gap={10}>
                            <Button className="btncancel">
                                Reject      
                            </Button>
                            <Button className="btnsave border0 bg-green text-white">
                                Accept       
                            </Button>
                        </Flex>
                    }
                </Flex>
                <Card className="radius-12 border-gray">
                    <Row gutter={[24, 14]}>
                        <Col span={24}>
                            <Flex vertical gap={20}>
                                <Flex vertical gap={10}>
                                    <Flex gap={5} align='center'>
                                        <Text className='fs-12 text-gray border-gray p-2 radius-8'>{data?.category}</Text>
                                        <Text className='fs-12 text-gray border-gray p-2 radius-8'>Founded on 12/2023</Text>
                                    </Flex>
                                    <Flex justify='space-between' align='center' gap={5}>
                                        <Title level={4} className="m-0 fw-600">
                                            {data?.title}
                                        </Title>
                                        <Flex gap={5} align='center'>
                                            <Image src='/assets/icons/reyal-b.png' preview={false} width={20} />
                                            <Title level={3} className='m-0 text-brand'>
                                                {data?.businessprice}
                                            </Title>
                                        </Flex>
                                    </Flex>
                                </Flex>
                                <Flex gap={5} align='center'>
                                    <Image preview={false} src="/assets/icons/loc.svg" width={10} alt="" />
                                    <Text className='fs-10 text-gray pt-1x'>City, District</Text>
                                </Flex>
                                <Flex vertical gap={10}>
                                    <Text className='fs-14 text-gray'>
                                        Al Madinah Coffee Shop is a well-established café located in the heart of Al-Malaz, Riyadh. Operating for over 3 years, it has built a strong reputation among local residents and office workers for its premium coffee, cozy seating, and consistent service. The business runs from a fully furnished commercial unit with a stylish interior, dedicated staff, and all necessary licenses in place.
                                    </Text>
                                    <Text className='fs-14 text-gray'>
                                        This café averages SAR 250,000 in annual revenue with a healthy annual profit of SAR 75,000. Its location offers strong foot traffic, especially during morning and late evening hours. Key assets include high-end espresso machines, seating furniture, POS system, and a fully branded visual identity. The owner is willing to offer 30 days of post-sale support, including supplier contacts, staff training, and marketing handover.
                                    </Text>
                                </Flex>
                            </Flex>
                        </Col>                      
                    </Row>
                </Card>
                <PendingUnverifiedTabs status={data?.status} />
            </Flex>
        </>
    );
};

export { SingleviewBusinesslist };
