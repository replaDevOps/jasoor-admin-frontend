import { Button, Col, Dropdown, Flex, Form, Row, Table,Typography,Modal,Input } from 'antd';
import { NavLink } from "react-router-dom";
import { SearchInput } from '../../Forms';
import { useState,useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { meetingItems } from '../../../shared';
import { CustomPagination } from '../../Ui';
import { UPDATE_BUSINESS_MEETING,UPDATE_OFFER } from '../../../graphql/mutation'
import { GETADMINSCHEDULEMEETINGS } from '../../../graphql/query/meeting'
import { useQuery,useMutation } from '@apollo/client'
import { Spin } from "antd";
import { t } from 'i18next';

const { Text } = Typography
export function calculateCommission(price) {
    let commission = 0;
  
    // Bracket 1: 0 - 100K → 4%
    if (price > 0) {
      commission += Math.min(price, 100000) * 0.04;
    }
  
    // Bracket 2: 100K - 500K → 3%
    if (price > 100000) {
      commission += Math.min(price - 100000, 400000) * 0.03;
    }
  
    // Bracket 3: 500K - 2M → 2.5%
    if (price > 500000) {
      commission += Math.min(price - 500000, 1500000) * 0.025;
    }
  
    // Bracket 4: 2M+ → 1.5%
    if (price > 2000000) {
      commission += (price - 2000000) * 0.015;
    }
  
    // Minimum commission rule
    if (price < 50000 && commission < 2000) {
      commission = 2000;
    }
  
    return commission;
  }
  
const ScheduleMeetingTable = () => {
    const [form] = Form.useForm();
    const [selectedStatus, setSelectedStatus] = useState('Status');
    const [visible, setVisible] = useState(false);
    const [deleteItem, setDeleteItem] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [selectedOffer, setSelectedOffer] = useState(null);

    const [updateMeeting,{ loading: updating }] = useMutation(UPDATE_BUSINESS_MEETING);
    const [updateOffer,{ loading: onUpdating }] = useMutation(UPDATE_OFFER,
        { refetchQueries: [ { query: GETADMINSCHEDULEMEETINGS} ], 
        awaitRefetchQueries: true, }
    );
    const schedulemeetingColumn = ( setVisible, setDeleteItem ) =>  [
        {
            title: t('Business Title'),
            dataIndex: 'businessTitle',
        },
        {
            title: t('Buyer Name'),
            dataIndex: 'buyerName',
        },
        {
            title: t('Email'),
            dataIndex: 'email',
        },
        {
            title: t('Phone Number'),
            dataIndex: 'phoneNumber',
        },
        {
            title: t('Seller Name'),
            dataIndex: 'sellerName',
        },
        {
            title: t('Email'),
            dataIndex: 'sellerEmail',
        },
        {
            title: t('Phone Number'),
            dataIndex: 'sellerPhoneNumber',
        },
        {
            title: t('Schedule Date & Time'),
            dataIndex: 'scheduleDateTime',
        },
        {
            title: t('Business Price'),
            dataIndex: 'businessPrice',
        },
        {
            title: t('Offer Price'),
            dataIndex: 'offerPrice',
        },
        {
            title: t('Meet Link'),
            dataIndex: 'meetLink',
            render: (meetLink) => <NavLink to={meetLink}>{meetLink}</NavLink>
        },
        {
            title: t('Status'),
            dataIndex: 'status',
            render: (status) => { 
                return ( 
                    status === 'APPROVED' ? (
                        <Text className="btnpill fs-12 pending">Approved</Text>
                      ) : status === 'HELD' ? (
                        <Text className="btnpill fs-12 inactive">Held</Text>
                      ) : (
                        <Text className="btnpill fs-12 cancelled">Cancelled</Text>
                      )
            ) }
        },
        {
            title: t('Action'),
            key: 'action',
            fixed: 'right',
            width: 100,
            render: (_, row) => (
              <Dropdown
                menu={{
                  items: [
                    {
                      label: (
                        <NavLink
                          onClick={(e) => {
                            e.preventDefault();
                            setVisible(true);
                            setSelectedOffer({
                              id: row.offerId,
                              price: row.offerPrice,
                              commission: row.offerCommission,
                              meetingId: row.key,
                            });
                          }}
                        >
                          {t('Open Deal')}
                        </NavLink>
                      ),
                      key: '1',
                    },
                    {
                      label: (
                        <NavLink
                          onClick={async (e) => {
                            e.preventDefault();
                            setDeleteItem(true);
                            try {
                              await updateMeeting({
                                variables: {
                                  input: {
                                    id: row.key,
                                    status: 'HELD',
                                  },
                                },
                              });
                              await refetch();
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                        >
                          {t('Schedule New Meeting')}
                        </NavLink>
                      ),
                      key: '2',
                    },
                  ],
                }}
                trigger={['click']}
              >
                <Button aria-labelledby="action button" className="bg-transparent border0 p-0">
                  <img
                    src="/assets/icons/dots.png"
                    alt="dot icon"
                    width={16}
                    fetchPriority="high"
                  />
                </Button>
              </Dropdown>
            ),
          },
    ];
    // Apollo query
    const { data, loading, refetch } = useQuery(GETADMINSCHEDULEMEETINGS, {
        variables: {
            limit: pageSize,
            offset: (current - 1) * pageSize,
            search: searchValue,
            status: selectedStatus !== 'Status' ? selectedStatus.toUpperCase() : null
        },
        fetchPolicy: 'network-only'
    });
    const schedulemeetingData = (data?.getAdminScheduledMeetings?.items || []).map((item, index) => ({
        key: item.id,
        offerId:item?.offer?.id,
        offerPrice: item?.offer?.price,
        offerCommission: item?.offer?.commission,
        status:item?.status,
        businessTitle: item.business?.businessTitle || '-',
        email: item.requestedTo?.email || '-',
        phoneNumber: item.requestedTo?.phone || '-',
        sellerName: item.business?.seller?.name || '-',
        sellerEmail: item.business?.seller?.email || '-',
        sellerPhoneNumber: item.business?.seller?.phone || '-',
        scheduleDateTime: item.requestedDate
            ? new Date(item.requestedDate).toLocaleString()
            : '-',
        businessPrice: item.business?.price
            ? item.business.price
            : '-',
        meetLink: item.meetingLink || '',
    }));

    const total = data?.getAdminPendingMeetings?.totalCount || 0;

    const handlePageChange = (page, size) => {
        setCurrent(page);
        setPageSize(size);
    };
    
    const handleStatusClick = ({ key }) => {
        const selectedItem = meetingItems.find(item => item.key === key);
        if (selectedItem) {
            setSelectedStatus(selectedItem.label);
            if( selectedItem.label === 'Pending' ){
                refetch({ status: 'APPROVED' });
            }
            else if (selectedItem.label === 'Cancel Meeting' ){
                refetch({ status: 'CANCELED', search: searchValue });
            }else if (selectedItem.label === 'All') {
                refetch({ status: null });
            }
            // refetch({ status: selectedItem.label.toUpperCase(), search: searchValue });
        }
    };

    const handleSearch = (value) => {
        setSearchValue(value);
        refetch({ status: selectedStatus !== 'Status' ? selectedStatus.toUpperCase() : null, search: value });
    };

    const handleDealSubmit = async () => {
        try {
          const values = await form.validateFields();
    
          // update offer price and status
          await updateOffer({
            variables: {
              input: {
                id: selectedOffer.id,
                price: parseFloat(values.offerPrice),
                status: 'ACCEPTED',
              },
            },
          });
    
          // update meeting status to HELD
          await updateMeeting({
            variables: {
              input: {
                id: selectedOffer.meetingId,
                status: 'HELD',
              },
            },
          });
    
          setVisible(false);
          setSelectedOffer(null);
          refetch();
        } catch (err) {
          console.error(err);
        }
    };
    const handlePriceChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        const commission = calculateCommission(value);
        form.setFieldsValue({
          commission: `SAR ${commission.toLocaleString()}`,
        });
      };
    
    useEffect(() => {
    if (selectedOffer) {
        const priceValue = parseFloat(
        String(selectedOffer.price).replace("SAR", "").trim()
        ) || 0;
    
        const commission = calculateCommission(priceValue);
        form.setFieldsValue({
        offerPrice: priceValue,
        commission: `SAR ${commission.toLocaleString()}`,
        });
    } else {
        // Reset form when modal closes
        form.resetFields();
    }
    }, [selectedOffer, form]);
    

    if (loading || updating || onUpdating) {
        return (
          <Flex justify="center" align="center" className='h-200'>
            <Spin size="large" />
          </Flex>
        );
    }

    return (
        <>
            <Flex vertical gap={20}>
                <Form form={form} layout="vertical">
                    <Row gutter={[16, 16]} align={'middle'} justify={'space-between'}>
                        <Col lg={24} md={24} sm={24} xs={24}>
                            <Flex gap={5} wrap>
                                <SearchInput
                                    name='name'
                                    placeholder={t('Search')}
                                    prefix={<img src='/assets/icons/search.png' width={14} alt='search icon' fetchPriority="high"/>}
                                    className='border-light-gray pad-x ps-0 radius-8 fs-13'
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                <Dropdown 
                                    menu={{ 
                                        items: meetingItems.map((item) => ({
                                    ...item,
                                    label: t(item.label), 
                                    })),
                                        onClick: handleStatusClick
                                    }} 
                                    trigger={['click']}
                                >
                                    <Button aria-labelledby='filter status' className="btncancel px-3 filter-bg fs-13 text-black">
                                        <Flex justify='space-between' align='center' gap={30}>
                                            {t(selectedStatus)}
                                            <DownOutlined />
                                        </Flex>
                                    </Button>
                                </Dropdown>
                            </Flex>
                        </Col>
                    </Row>
                </Form>
                <Table
                    size='large'
                    columns={schedulemeetingColumn(setVisible,setDeleteItem)}
                    dataSource={schedulemeetingData}
                    className='pagination table-cs table'
                    showSorterTooltip={false}
                    scroll={{ x: 2300 }}
                    rowHoverable={false}
                    pagination={false}
                />
                <CustomPagination 
                    total={total}
                    current={current}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                />
            </Flex>
            <Modal
                open={visible}
                title="Offer Details"
                onCancel={() => {
                    setVisible(false);
                    setSelectedOffer(null);
                    form.resetFields();
                }}
                onOk={handleDealSubmit}
                okText="Confirm Deal"
                cancelText="Cancel"
                >
                {selectedOffer && (
                    <Form form={form} layout="vertical">
                    <Form.Item
                        label="Offer Price"
                        name="offerPrice"
                        rules={[{ required: true, message: "Enter Offer Price" }]}
                    >
                        <Input
                        type="number"
                        prefix="SAR"
                        placeholder="Enter offer price"
                        onChange={handlePriceChange}
                        />
                    </Form.Item>

                    <Form.Item label="Commission" name="commission">
                        <Input disabled />
                    </Form.Item>
                    </Form>
                )}
            </Modal>
        </>
    );
};

export { ScheduleMeetingTable };