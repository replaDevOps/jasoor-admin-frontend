import { Button, Dropdown, Flex, Image, Space, Switch, Tooltip, Typography } from "antd";
import { NavLink } from "react-router-dom";
import { MyInput, MySelect } from "../components";
import { priorityItems } from "../shared";

const { Text } = Typography

const businesslistmaincolumn= [
    {
        title: 'Business Title',
        dataIndex: 'title',
    },
    {
        title: 'Seller Name',
        dataIndex: 'sellername',
    },
    {
        title: 'Category',
        dataIndex: 'category',
        render:(category)=> <Text className='fs-12 badge-cs border-gray'>{category}</Text>
    },
    {
        title: 'Business Price',
        dataIndex: 'businessprice',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        render: (status) => {
            return (
                status === 0 ? (
                    <Space align='center'>
                        <Text className='btnpill fs-12 pending'>Pending</Text>
                    </Space>
                ) : status === 1 ? (
                    <Text className='btnpill fs-12 inactive'>Inactive</Text>
                ) : status === 2 ? (
                    <Text className='btnpill fs-12 success'>Completed</Text>
                ) : null
            );
        }
    },
    {
        title: 'Date',
        dataIndex: 'date',
    },
];

const postsaleColumn = [
    {
        title: 'Support Period',
        dataIndex: 'supportperiod',
    },
    {
        title: 'Number of Session',
        dataIndex: 'nosession',
    },
]

const outstandliabColumn = [
    {
        title: 'Liabilities name',
        dataIndex: 'liabilitiesname',
    },
    {
        title: 'Number of Items',
        dataIndex: 'noitems',
    },
    {
        title: 'Purchase Year',
        dataIndex: 'purchaseyear',
    },
    {
        title: 'Price',
        dataIndex: 'price',
    },
    {
        title: 'Verify',
        dataIndex: 'verify',
        render:(_,row)=>{
            return(
                <Switch 
                    checked={row.verify === 1 ? true : false}
                    size="small"
                />
            )
        }
    },
]

const keyassetColumn = [
    {
        title: 'Asset Name',
        dataIndex: 'assetname',
    },
    {
        title: 'Number of Items',
        dataIndex: 'noitems',
    },
    {
        title: 'Purchase Year',
        dataIndex: 'purchaseyear',
    },
    {
        title: 'Price',
        dataIndex: 'price',
    },
    {
        title: 'Verify',
        dataIndex: 'verify',
        render:(_,row)=>{
            return(
                <Switch 
                    checked={row.verify === 1 ? true : false}
                    size="small"
                />
            )
        }
    },
]

const inventoryColumn = [
    {
        title: 'Inventory Name',
        dataIndex: 'inventoryname',
    },
    {
        title: 'Number of Items',
        dataIndex: 'noitems',
    },
    {
        title: 'Purchase Year',
        dataIndex: 'purchaseyear',
    },
    {
        title: 'Price',
        dataIndex: 'price',
    },
    {
        title: 'Verify',
        dataIndex: 'verify',
        render:(_,row)=>{
            return(
                <Switch 
                    checked={row.verify === 1 ? true : false}
                    size="small"
                />
            )
        }
    },
]

const offertableColumn = [
    {
        title: 'Buyer Name',
        dataIndex: 'buyername',
        render: (buyername)=>{
            return(
                <Text>{buyername.substring(0, 5)}{'*'.repeat(buyername.length - 5)}</Text>
            )
        }
    },
    {
        title: 'Business Price',
        dataIndex: 'businessprice',
    },
    {
        title: 'Offer Price',
        dataIndex: 'offerprice',
        render:(_,row)=> {
            return(
                <>
                    <Flex gap={10} align="center">
                        {row?.offerprice}
                        {
                            row?.priceType === 1 ?
                                <Tooltip title="CO - Counteroffer">
                                    <Text className='brand-bg radius-4 p-1 fs-11 text-white'>CO</Text>
                                </Tooltip>
                            :
                                <Tooltip title="PP - Proceed to Purchase">
                                    <Text className='bg-orange bg radius-4 p-1 fs-11 text-white'>PP</Text>
                                </Tooltip>
                        }                    
                    </Flex>
                </>

            )
        }
    },
    {
        title: 'Status',
        dataIndex: 'status',
        render: (status) => {
            return (
                status === 0 ? (
                    <Space align='center'>
                        <Text className='btnpill fs-12 pending'>Send</Text>
                    </Space>
                ) : status === 1 ? (
                    <Text className='btnpill fs-12 inactive'>Reject</Text>
                ) : status === 2 ? (
                    <Text className='btnpill fs-12 success'>Received</Text>
                ) : null
            );
        }
    },
    {
        title: 'Offer Date',
        dataIndex: 'offerdate',
    },
]

const categoryColumn = ( setDeleteItem, navigate ) =>  [
    {
        title: 'Category Icon',
        dataIndex: 'categoryicon',
        render:(categoryicon)=> <Image src={categoryicon} preview={false} width={25} />
    },
    {
        title: 'Category Name',
        dataIndex: 'categoryname',
    },
    {
        title: 'Business Type',
        dataIndex: 'businesstype',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        render: (status) => {
            return (
                status === 'UNDER_REVIEW' ? (
                    <Text className='btnpill fs-12 pending'>Pending</Text>
                ) : status === 'INACTIVE' ? (
                    <Text className='btnpill fs-12 inactive'>Inactive</Text>
                ) : status === 'ACTIVE' ? (
                    <Text className='btnpill fs-12 success'>Completed</Text>
                ) : null
            );
        }
    },
    {
        title: 'Action',
        key: "action",
        fixed: "right",
        width: 100,
        render: (_,row) => (
            <Dropdown
                menu={{
                    items: [
                        { label: <NavLink onClick={(e) => {e.preventDefault(); navigate('/addnewcategory/detail/'+row?.key)}}>Edit</NavLink>, key: '1' },
                        { label: <NavLink onClick={() => { setDeleteItem(true) }}>Delete</NavLink>, key: '2' },
                    ],
                }}
                trigger={['click']}
            >
                <Button className="bg-transparent border0 p-0">
                    <img src="/assets/icons/dots.png" alt="" width={16} />
                </Button>
            </Dropdown>
        ),
    },
];

const categoryStatsProfColumn = (handleInputChange) => [
    {
        title: 'Region Name',
        dataIndex: 'regionname',
    },
    {
        title: '2024',
        dataIndex: 'value2024',
        render: (value, record, index) => (
            <MyInput
                withoutForm
                placeholder="Enter avg profit"
                value={value}
                onChange={(e) => handleInputChange(e.target.value, index, 'value2024')}
                addonBefore={<img src="/assets/icons/reyal-g.png" width={14} />}
                className="w-100"
            />
        ),
    },
    {
        title: '2023',
        dataIndex: 'value2023',
        render: (value, record, index) => (
            <MyInput
                withoutForm
                placeholder="Enter avg profit"
                value={value}
                onChange={(e) => handleInputChange(e.target.value, index, 'value2023')}
                addonBefore={<img src="/assets/icons/reyal-g.png" width={14} />}
                className="w-100"
            />
        ),
    },
    {
        title: '2022',
        dataIndex: 'value2022',
        render: (value, record, index) => (
            <MyInput
                withoutForm
                placeholder="Enter avg profit"
                value={value}
                onChange={(e) => handleInputChange(e.target.value, index, 'value2022')}
                addonBefore={<img src="/assets/icons/reyal-g.png" width={14} />}
                className="w-100"
            />
        ),
    },
    {
        title: '2021',
        dataIndex: 'value2021',
        render: (value, record, index) => (
            <MyInput
                withoutForm
                placeholder="Enter avg profit"
                value={value}
                onChange={(e) => handleInputChange(e.target.value, index, 'value2021')}
                addonBefore={<img src="/assets/icons/reyal-g.png" width={14} />}
                className="w-100"
            />
        )
    },
    {
        title: 'Local Business Growth',
        dataIndex: 'localbusinessgrowth',
        render: (value, record, index) => (
            <MyInput
                withoutForm
                placeholder="Enter avg profit"
                value={value}
                onChange={(e) => handleInputChange(e.target.value, index, 'localbusinessgrowth')}
                addonBefore={<img src="/assets/icons/reyal-g.png" width={14} />}
                className="w-100"
            />
        )
    },
    {
        title: 'Population Density',
        dataIndex: 'populationdensity',
        render: (value, record, index) => (
            <MySelect
                withoutForm
                placeholder="Select Density"
                value={value}
                onChange={(value) => handleInputChange(value, index, 'populationdensity')}
                options={priorityItems}
            />
        )
    },
    {
        title: 'Industry Demand',
        dataIndex: 'industrydemand',
        render: (value, record, index) => (
            <MySelect
                withoutForm
                placeholder="Select Demand"
                value={value}
                onChange={(value) => handleInputChange(value, index, 'industrydemand')}
                options={priorityItems}
            />
        )
    },
]

const usermanageColumn = ( setVisible,SetViewState ) =>  [
    {
        title: 'Full Name',
        dataIndex: 'fullname',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'District',
        dataIndex: 'district',
    },
    {
        title: 'City',
        dataIndex: 'city',
    },
    {
        title: 'Mobile Number',
        dataIndex: 'mobileno',
    },
    {
        title: 'Type',
        dataIndex: 'type',
         render: (type) => {
            return (
                type === 'New' ? (
                    <Text className='btnpill fs-12 branded'>New</Text>
                ) : (
                    <Text className='btnpill fs-12 pending'>Old</Text>
                ) 
            )
        }
    },
    {
        title: 'Status',
        dataIndex: 'status',
        render: (status) => {
            return (
                status === 1 ? (
                    <Space align='center'>
                        <Text className='btnpill fs-12 success'>Active</Text>
                    </Space>
                ) : (
                    <Text className='btnpill fs-12 inactive'>Inactive</Text>
                )
            )
        }
    },
    {
        title: 'Action',
        key: "action",
        fixed: "right",
        width: 100,
        render: (_,row) => (
            <Dropdown
                menu={{
                    items: [
                        { label: <NavLink onClick={(e) => {e.preventDefault(); }}>Inactive</NavLink>, key: '1' },
                        { label: <NavLink onClick={(e) => {e.preventDefault();setVisible(true),SetViewState(row) }}>View Passport & National ID</NavLink>, key: '2' },
                    ],
                }}
                trigger={['click']}
            >
                <Button className="bg-transparent border0 p-0">
                    <img src="/assets/icons/dots.png" alt="" width={16} />
                </Button>
            </Dropdown>
        ),
    },
];

const meetingreqColumn = ( setVisible, setDeleteItem ) =>  [
    {
        title: 'Business Title',
        dataIndex: 'businessTitle',
    },
    {
        title: 'Buyer Name',
        dataIndex: 'buyerName',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Phone Number',
        dataIndex: 'phoneNumber',
    },
    {
        title: 'Seller Name',
        dataIndex: 'sellerName',
    },
    {
        title: 'Email',
        dataIndex: 'sellerEmail',
    },
    {
        title: 'Phone Number',
        dataIndex: 'sellerPhoneNumber',
    },
    {
        title: 'Preferred Date & Time',
        dataIndex: 'scheduleDateTime',
    },
    {
        title: 'Business Price',
        dataIndex: 'businessPrice',
    },
    {
        title: 'Offer Price',
        dataIndex: 'offerPrice',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        render: (status) => {
            return (
                status === 'REQUESTED' ? (
                    <Text className='btnpill fs-12 pending'>Pending</Text>
                ) : (
                    <Text className='btnpill fs-12 inactive'>Cancel Meeting</Text>
                )
            )
        }
    },
    {
        title: 'Action',
        key: "action",
        fixed: "right",
        width: 100,
        render: (_,row) => (
            <Dropdown
                menu={{
                    items: [
                        { label: <NavLink onClick={(e) => {e.preventDefault(); setVisible(true) }}>Schedule Meeting</NavLink>, key: '1' },
                        { label: <NavLink onClick={(e) => {e.preventDefault(); setDeleteItem(true) }}>Cancel</NavLink>, key: '2' },
                    ],
                }}
                trigger={['click']}
            >
                <Button className="bg-transparent border0 p-0">
                    <img src="/assets/icons/dots.png" alt="" width={16} />
                </Button>
            </Dropdown>
        ),
    },
];

const schedulemeetingColumn = ( setVisible, setDeleteItem ) =>  [
    {
        title: 'Business Title',
        dataIndex: 'businessTitle',
    },
    {
        title: 'Buyer Name',
        dataIndex: 'buyerName',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Phone Number',
        dataIndex: 'phoneNumber',
    },
    {
        title: 'Seller Name',
        dataIndex: 'sellerName',
    },
    {
        title: 'Email',
        dataIndex: 'sellerEmail',
    },
    {
        title: 'Phone Number',
        dataIndex: 'sellerPhoneNumber',
    },
    {
        title: 'Schedule Date & Time',
        dataIndex: 'scheduleDateTime',
    },
    {
        title: 'Business Price',
        dataIndex: 'businessPrice',
    },
    {
        title: 'Offer Price',
        dataIndex: 'offerPrice',
    },
    {
        title: 'Meet Link',
        dataIndex: 'meetLink',
        render: (meetLink) => <NavLink to={meetLink}>{meetLink}</NavLink>
    },
    {
        title: 'Action',
        key: "action",
        fixed: "right",
        width: 100,
        render: (_,row) => (
            <Dropdown
                menu={{
                    items: [
                        { label: <NavLink onClick={(e) => {e.preventDefault(); setVisible(true) }}>Finalized deal</NavLink>, key: '1' },
                        { label: <NavLink onClick={(e) => {e.preventDefault(); setDeleteItem(true) }}>No Deal</NavLink>, key: '2' },
                    ],
                }}
                trigger={['click']}
            >
                <Button className="bg-transparent border0 p-0">
                    <img src="/assets/icons/dots.png" alt="" width={16} />
                </Button>
            </Dropdown>
        ),
    },
];

const inprogressdealColumn = [
    {
        title: 'Business Title',
        dataIndex: 'businessTitle',
    },
    {
        title: 'Buyer Name',
        dataIndex: 'buyerName',
    },
    {
        title: 'Seller Name',
        dataIndex: 'sellerName',
    },
    {
        title: 'Finalized Offer',
        dataIndex: 'finalizedOffer',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        render: (status) => {
            return (
                status === 'DOCUMENT_PAYMENT_CONFIRMATION' ? (
                    <Text className='btnpill fs-12 branded'>Document & Payment Confirmation</Text>
                ) : 
                status === 'COMMISSION_VERIFICATION_PENDING' ? (
                    <Text className='btnpill fs-12 pending'>Commission Verification Pending</Text>
                )
                :
                status === 'SELLER_PAYMENT_VERIFICATION_PENDING' ? (
                    <Text className='btnpill fs-12 sellerpendingstatus'>Seller Payment Verification Pending</Text>
                )
                :
                status === 'PAYMENT_APPROVAL_FROM_SELLER_PENDING' ? (
                    <Text className='btnpill fs-12 paymentapprovalpending'>Payment Approval From Seller Pending</Text>
                )
                :
                status === 'BANK_DETAILS_FROM_SELLER_PENDING' ? (
                    <Text className='btnpill fs-12 bankdetailpending'>Bank Details  From Seller Pending</Text>
                )
                :
                status === 'COMMISSION_TRANSFER_FROM_BUYER_PENDING' ? (
                    <Text className='btnpill fs-12 commissiontransferbuyer'>Commission Transfer From Buyer Pending</Text>
                )
                :
                status === 'DSA_FROM_SELLER_PENDING' ? (
                    <Text className='btnpill fs-12 dsasellerpending'>DSA From Seller Pending</Text>
                )
                :
                status === 'DSA_FROM_BUYER_PENDING' ? (
                    <Text className='btnpill fs-12 dsabuyerpending'>DSA From Buyer Pending</Text>
                )
                :
                (
                    <Text className='btnpill fs-12 inactive'>Closed Deal Verification Pending</Text>
                )
            )
        }
    },
    {
        title: 'Date',
        dataIndex: 'date',
    },
];

const completedealColumn = [
    {
        title: 'Business Title',
        dataIndex: 'businessTitle',
    },
    {
        title: 'Buyer Name',
        dataIndex: 'buyerName',
    },
    {
        title: 'Seller Name',
        dataIndex: 'sellerName',
    },
    {
        title: 'Finalized Offer',
        dataIndex: 'finalizedOffer',
    },
    {
        title: 'Date',
        dataIndex: 'date',
    },
]

const rolepermissionColumn = (setDeleteItem, navigate) => [
    {
      title: "Role Name",
      dataIndex: "rolename",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (isActive) => {
        return 1 ? (
          <Text className="btnpill fs-12 success">Active</Text>
        ) : (
          <Text className="btnpill fs-12 inactive">Inactive</Text>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
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
                      navigate("/addrolepermission/" + row.id);
                    }}
                  >
                    Edit
                  </NavLink>
                ),
                key: "1",
              },
              {
                label: (
                  <NavLink
                    onClick={() => {
                      setDeleteItem(true);
                    }}
                  >
                    Delete
                  </NavLink>
                ),
                key: "2",
              },
              {
                label: (
                  <NavLink
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    {row.isActive ? "Deactivate" : "Activate"}
                  </NavLink>
                ),
                key: "3",
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button className="bg-transparent border0 p-0">
            <img src="/assets/icons/dots.png" alt="" width={16} />
          </Button>
        </Dropdown>
      ),
    },
  ];
  

const staffmemberColumn = (setVisible,setDeleteItem,setEditItem) =>  [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Phone',
        dataIndex: 'phone',
    },
    {
        title: 'Role',
        dataIndex: 'role',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        render: (status) => {
            return (
                status === 1 ? (
                    <Text className='btnpill fs-12 success'>Active</Text>
                ) : (
                    <Text className='btnpill fs-12 inactive'>Inactive</Text>
                )
            )
        }
    },
    {
        title: 'Action',
        key: "action",
        fixed: "right",
        width: 100,
        render: (_,row) => (
            <Dropdown
                menu={{
                    items: [
                        { label: <NavLink onClick={(e) => {e.preventDefault(); setVisible(true); setEditItem(row) }}>Edit</NavLink>, key: '1' },
                        { label: <NavLink onClick={(e) => {e.preventDefault(); }}>Inactive</NavLink>, key: '2' },
                        { label: <NavLink onClick={(e) => {e.preventDefault(); setDeleteItem(true) }}>Delete</NavLink>, key: '3' },
                    ],
                }}
                trigger={['click']}
            >
                <Button className="bg-transparent border0 p-0">
                    <img src="/assets/icons/dots.png" alt="" width={16} />
                </Button>
            </Dropdown>
        ),
    },
];

const contactrequestColumn = (setVisible,setSendView,setViewItem) =>  [
    {
        title: 'Full Name',
        dataIndex: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Massage Preview',
        dataIndex: 'msgPreview',
        render: (msgPreview) => {
            const words = msgPreview?.split(' ') || [];
            const previewText = words.slice(0, 5).join(' ');
            const showEllipsis = words.length > 5;

            return (
                <Tooltip title={msgPreview}>
                    <Text>
                        {previewText}{showEllipsis ? '...' : ''}
                    </Text>
                </Tooltip>
            );
        }
    },
    {
        title: 'Date',
        dataIndex: 'date',
    },
    {
        title: 'Reply Status',
        dataIndex: 'status',
        render: (status) => {
            return (
                status === 1 ? (
                    <Text className='btnpill fs-12 success'>Sent</Text>
                ) : (
                    <Text className='btnpill fs-12 inactive'>Pending</Text>
                )
            )
        }
    },
    {
        title: 'Action',
        key: "action",
        fixed: "right",
        width: 100,
        render: (_,row) => (
            <Dropdown
                menu={{
                    items: [
                        { label: <NavLink onClick={(e) => {e.preventDefault(); setVisible(true); setViewItem(row)}}>Sent View</NavLink>, key: '1' },
                        { label: <NavLink onClick={(e) => {e.preventDefault(); setVisible(true); setSendView(true); setViewItem(row) }}>Pending View</NavLink>, key: '1' },
                    ],
                }}
                trigger={['click']}
            >
                <Button className="bg-transparent border0 p-0">
                    <img src="/assets/icons/dots.png" alt="" width={16} />
                </Button>
            </Dropdown>
        ),
    },
];

const pushnotifyColumn = ({setVisible,setViewNotify ,setEditItem,setDeleteItem}) =>  [
    {
        title: 'Title',
        dataIndex: 'title',
    },
    {
        title: 'Description',
        dataIndex: 'description',
        render: (description) => {
            const words = description?.split(' ') || [];
            const previewText = words.slice(0, 5).join(' ');
            const showEllipsis = words.length > 5;

            return (
                <Tooltip title={description}>
                    <Text>
                        {previewText}{showEllipsis ? '...' : ''}
                    </Text>
                </Tooltip>
            );
        }
    },
    {
        title: 'Group',
        dataIndex: 'group',
        render: (group) => {
            return (
                group === 'New' ? (
                    <Text className='btnpill fs-12 branded'>{group}</Text>
                ) 
                :
                group === 'Old' ? (
                    <Text className='btnpill fs-12 inactive'>{group}</Text>
                ) 
                : 
                (
                    <Text className='btnpill fs-12 success'>{group}</Text>
                )
            )
        }
    },
    {
        title: 'District',
        dataIndex: 'district',
        render: (district) => {
            return (
                Array.isArray(district) ?
                <Flex gap={5} align="center" wrap>
                    {
                        district?.map((list,i)=>
                            <Text key={i} className='sm-pill border-gray fs-12 '>{list?.item}</Text>
                        )
                    }
                </Flex>
                :
                null
            )
        }
    },
    {
        title:'Date',
        dataIndex: 'date'
    },
    {
        title: 'Reply Status',
        dataIndex: 'status',
        render: (status) => {
            return (
                status === 1 ? (
                    <Text className='btnpill fs-12 success'>Sent</Text>
                ) : (
                    <Text className='btnpill fs-12 inactive'>Schedule</Text>
                )
            )
        }
    },
    {
        title: 'Action',
        key: "action",
        fixed: "right",
        width: 100,
        render: (_,row) => (
            <Dropdown
                menu={{
                    items: [
                        row?.status === 1 && { label: <NavLink onClick={(e) => {e.preventDefault(); setVisible(true); setViewNotify(row) }}>View</NavLink>, key: '1' },
                        row?.status !== 1 && { label: <NavLink onClick={(e) => {e.preventDefault(); setVisible(true); setEditItem(row) }}>Edit</NavLink>, key: '2' },
                        row?.status !== 1 && { label: <NavLink onClick={(e) => {e.preventDefault(); setDeleteItem(true) }}>Delete</NavLink>, key: '3' },
                    ],
                }}
                trigger={['click']}
            >
                <Button className="bg-transparent border0 p-0">
                    <img src="/assets/icons/dots.png" alt="" width={16} />
                </Button>
            </Dropdown>
        ),
    },
];

const faqsColumn = ( setVisible, setEditItem, setDeleteItem ) =>  [
    {
        title: 'Questions',
        dataIndex: 'question',
    },
    {
        title: 'Action',
        key: "action",
        fixed: "right",
        width: 100,
        render: (_,row) => (
            <Dropdown
                menu={{
                    items: [
                        { label: <NavLink onClick={(e) =>{e.preventDefault(); setVisible(true); setEditItem(row)}}>Edit</NavLink>, key: '1' },
                        { label: <NavLink onClick={(e) =>{e.preventDefault(); setDeleteItem(true) }}>Delete</NavLink>, key: '2' },
                    ],
                }}
                trigger={['click']}
            >
                <Button className="bg-transparent border0 p-0">
                    <img src="/assets/icons/dots.png" alt="" width={16} />
                </Button>
            </Dropdown>
        ),
    },
];

const financeColumn =  [
    {
        title: 'Business Title',
        dataIndex: 'businessTitle',
    },
    {
        title: 'Seller Name',
        dataIndex: 'sellerName',
    },
    {
        title: 'Buyer Name',
        dataIndex: 'buyerName',
    },
    {
        title: 'Deal Amount',
        dataIndex: 'dealAmount',
    },
    {
        title: 'Commission Earned',
        dataIndex: 'commissionEarn',
    },
    {
        title: 'Date & Time',
        dataIndex: 'dateTime',
    },
];



export {
    businesslistmaincolumn,
    postsaleColumn,
    outstandliabColumn,
    keyassetColumn,
    inventoryColumn,
    offertableColumn,
    categoryColumn,
    categoryStatsProfColumn,
    usermanageColumn,
    meetingreqColumn,
    schedulemeetingColumn,
    inprogressdealColumn,
    completedealColumn,
    rolepermissionColumn,
    staffmemberColumn,
    contactrequestColumn,
    pushnotifyColumn,
    faqsColumn,
    financeColumn,
}