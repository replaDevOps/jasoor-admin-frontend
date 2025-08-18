import { Button, Card, Col, Dropdown, Flex, Form, Row, Table } from 'antd';
import { SearchInput } from '../../Forms';
import { rolepermissionData, rolepermissionColumn } from '../../../data';
import { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { CustomPagination, DeleteModal } from '../../Ui';
import { GETROLES } from '../../../graphql/query/user';
import { useQuery } from '@apollo/client';

const RolePermissionTable = () => {
    const [form] = Form.useForm();
  const [selectedStatus, setSelectedStatus] = useState("Status");
  const navigate = useNavigate();
  const [deleteItem, setDeleteItem] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [searchText, setSearchText] = useState("");

  const { loading, data, refetch } = useQuery(GETROLES, {
    variables: {
        limit: pageSize,
        offset: (current - 1) * pageSize,
        search: searchText || null,
    },
    fetchPolicy: "network-only"
});

  const statusItems = [
    { key: "1", label: "All" },
    { key: "2", label: "Active" },
    { key: "3", label: "Inactive" },
  ];

  const rolepermissionData = (data?.getRoles || []).map((role, index) => ({
    key: role.id || index,             // Use API id or fallback to index
    rolename: role.name,               // Matches your table's 'rolename'
    status: role.isActive ? 0 : 1      // 2 for Completed/Active, 1 for Inactive — adjust if you want Pending logic
  }));

  const handleStatusClick = ({ key }) => {
    const selectedItem = statusItems.find((item) => item.key === key);
    console.log("Selected Status:", selectedItem);
    if (selectedItem) {
      setSelectedStatus(selectedItem.label);
        refetch({
            limit: pageSize,
            offset: 0,
            search: searchText || null,
            isActive: selectedItem.key === "2" ? true 
                      : selectedItem.key === "3" ? false 
                      : selectedItem.key === "1" ?  null
                        : null, // Adjust logic for 'All' or other statuses
        });
    }
  };

  // filter by status
  let tableData = data?.getRoles || [];
  if (selectedStatus === "Active") {
    tableData = tableData.filter((role) => role.isActive);
  } else if (selectedStatus === "Inactive") {
    tableData = tableData.filter((role) => !role.isActive);
  }

  const total = tableData.length;

  const handlePageChange = (page, size) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    refetch({
        limit: pageSize,
        offset: 0,
        search: value || null,
    });
};

    return (
        <>
            <Card className='radius-12 border-gray'>
                <Flex vertical gap={20}>
                    <Form form={form} layout="vertical">
                        <Row gutter={[16, 16]} align={'middle'} justify={'space-between'}>
                            <Col lg={24} md={12} sm={24} xs={24}>
                                <Flex gap={5} wrap>
                                    <SearchInput
                                        name='name'
                                        placeholder='Search'
                                        prefix={<img src='/assets/icons/search.png' width={14} />}
                                        className='border-light-gray pad-x ps-0 radius-8 fs-13'
                                        onChange={(e) => handleSearch(e.target.value.trim())}
                                    />
                                    <Dropdown 
                                        menu={{ 
                                            items: statusItems,
                                            onClick: handleStatusClick
                                        }} 
                                        trigger={['click']}
                                    >
                                        <Button className="btncancel px-3 filter-bg fs-13 text-black">
                                            <Flex justify='space-between' align='center' gap={30}>
                                                {selectedStatus}
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
                        columns={rolepermissionColumn(setDeleteItem, navigate)}
                        dataSource={rolepermissionData.slice((current - 1) * pageSize, current * pageSize)}
                        className='pagination table-cs table'
                        showSorterTooltip={false}
                        scroll={{ x: 1000 }}
                        rowHoverable={false}
                        pagination={false}
                        // loading={
                        //     {
                        //         ...TableLoader,
                        //         spinning: loading
                        //     }
                        // }
                    />
                    <CustomPagination 
                        total={total}
                        current={current}
                        pageSize={pageSize}
                        onPageChange={handlePageChange}
                    />
                </Flex>
            </Card>
            <DeleteModal 
                visible={deleteItem}
                onClose={()=>setDeleteItem(false)}
                title='Are you sure?'
                subtitle='This action cannot be undone. Are you sure you want to delete this Role?'
                type='danger'
            />
        </>
    );
};

export { RolePermissionTable };