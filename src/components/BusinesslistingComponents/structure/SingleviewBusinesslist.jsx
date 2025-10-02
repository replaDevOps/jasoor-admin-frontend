import { Button, Card, Col, Flex, Image, Row, Typography,Spin,message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { PendingUnverifiedTabs } from './PendingUnverifiedTabs';
import {GET_BUSINESSES_STATS_BY_ID} from '../../../graphql/query'
import { UPDATE_BUSINESS } from '../../../graphql/mutation'
import { useMutation,useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;

const SingleviewBusinesslist = () => {
    const navigate = useNavigate()
    const {t} = useTranslation()
    const { id } = useParams();
    const [messageApi, contextHolder] = message.useMessage();

    const { loading, error, data:business } = useQuery(GET_BUSINESSES_STATS_BY_ID, {
        variables: { getBusinessByIdId: id },
        skip: !id, // skip if no id
    });
    
    const data = business?.getBusinessById?.business;
    const [updateBusiness,{ loading: updating }] = useMutation(UPDATE_BUSINESS, {
        refetchQueries: [
          {
            query: GET_BUSINESSES_STATS_BY_ID,
            variables: { getBusinessByIdId: id }, // make sure you pass the current business id
          },
        ],
        awaitRefetchQueries: true,
        onCompleted: () => {
            messageApi.success(t("Stats changed successfully!"));
          },
          onError: (err) => {
            messageApi.error(err.message || t("Something went wrong!"));
          },
    });
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
            <Flex vertical gap={25}>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: (
                                <Text className="cursor fs-13 text-gray" onClick={() => navigate("/businesslist")}>
                                    {t("Business listing")}
                                </Text>
                            ),
                        },
                        {
                            title: <Text className="fw-500 fs-14 text-black">{data?.businessTitle}</Text>,
                        },
                    ]}
                />
                <Flex gap={10} align="center">
                    <Flex gap={10} align="center">
                        <Button aria-labelledby='Arrow left' className="border0 p-0 bg-transparent" onClick={() => navigate("/businesslist")}>
                            <ArrowLeftOutlined />
                        </Button>
                        <Title level={4} className="fw-500 m-0">{data?.businessTitle}</Title>
                    </Flex>
                    <Button aria-labelledby='edit button' className="bg-transparent border0 p-0">
                        <Image src='/assets/icons/edit.png' fetchPriority="high" alt='edit-icon' width={24} preview={false}/>        
                    </Button>
                </Flex>
                <Flex justify='space-between' align='center' gap={5}>
                <Title level={5} className="m-0">
                   {t("Business Verification")}
                </Title>
                
                {data?.businessStatus === 'UNDER_REVIEW' ? (
                <Flex gap={10}>
                    <Button
                        className="btncancel"
                        loading={updating}
                        onClick={() =>
                            updateBusiness({
                                variables: {
                                    input: { id, businessStatus: 'REJECT' },
                                },
                            })
                        }
                        aria-labelledby='Reject'
                    >
                        {t("Reject")}
                    </Button>
                    <Button
                        className="btnsave border0 bg-green text-white"
                        loading={updating}
                        onClick={() =>
                            updateBusiness({
                                variables: {
                                    input: { id, businessStatus: 'ACTIVE' },
                                },
                            })
                        }
                        aria-labelledby='Accept'
                    >
                        {t("Accept")}
                    </Button>
                </Flex>
                ) : data?.businessStatus === 'ACTIVE' ? (
                    <Button
                        className="btnsave border0 bg-red text-white"
                        loading={updating}
                        onClick={() =>
                            updateBusiness({
                                variables: {
                                    input: { id, businessStatus: 'INACTIVE' },
                                },
                            })
                        }
                        aria-labelledby='Inactivate'
                    >
                        {t("Inactivate")}
                    </Button>
                ) : data?.businessStatus === 'INACTIVE' ? (
                    <Button
                        className="btnsave border0 bg-green text-white"
                        loading={updating}
                        onClick={() =>
                            updateBusiness({
                                variables: {
                                    input: { id, businessStatus: 'ACTIVE', },
                                },
                            })
                        }
                        aria-labelledby='Activate'
                    >
                        {t("Activate")}
                    </Button>
                ) : null}
                </Flex>
                <Card className="radius-12 border-gray">
                    <Row gutter={[24, 14]}>
                        <Col span={24}>
                            <Flex vertical gap={20}>
                                <Flex vertical gap={10}>
                                    <Flex gap={5} align='center'>
                                        <Text className='fs-12 text-gray border-gray p-2 radius-8'>{data?.category.name}</Text>
                                        <Text className='fs-12 text-gray border-gray p-2 radius-8'>{data?.foundedDate}</Text>
                                    </Flex>
                                    <Flex justify='space-between' align='center' gap={5}>
                                        <Title level={4} className="m-0 fw-600">
                                            {data?.businessTitle}
                                            {/* TODO: implemnt verification tag data?.businessStatus */}
                                        </Title>
                                        <Flex gap={5} align='center'>
                                            <Image src='/assets/icons/reyal-b.png' fetchPriority="high" alt='currency symbol' preview={false} width={20} />
                                            <Title level={3} className='m-0 text-brand'>
                                                {data?.price}
                                            </Title>
                                        </Flex>
                                    </Flex>
                                </Flex>
                                <Flex gap={5} align='center'>
                                    <Image preview={false} src="/assets/icons/loc.svg" fetchPriority="high" width={10} alt="location-icon" />
                                    <Text className='fs-10 text-gray pt-1x'>{data?.district}</Text>
                                </Flex>
                                <Flex vertical gap={10}>
                                    <Text className='fs-14 text-gray'>
                                        {data?.description}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Col>                      
                    </Row>
                </Card>
                <PendingUnverifiedTabs data={data} />
            </Flex>
        </>
    );
};

export { SingleviewBusinesslist };
