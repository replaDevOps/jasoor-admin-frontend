import React, { useEffect, useState } from 'react';
import { Button, Card, Checkbox, Col, Flex, Form, Row, Space, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { MyInput } from '../../Forms';
import { permissionsData, rolepermissionData } from '../../../data';
import { CREATE_ROLE } from '../../../graphql/mutation/login';
import { useMutation } from '@apollo/client';

const { Text, Title } = Typography;

const AddRolePermission = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [selectedPermissions, setSelectedPermissions] = useState({});
    const { id } = useParams()
    const detail = rolepermissionData?.find((items)=> items?.key === Number(id))
    const [createRole] = useMutation(CREATE_ROLE);
    
    useEffect(() => {
        if (id && detail) {
          form.setFieldsValue({ roleName: detail?.rolename });
          setSelectedPermissions(detail?.permissions || {});
        } else {
          form.resetFields();
          setSelectedPermissions({});
        }
      }, [id, detail]);
    
      const handleCategoryChange = (category, checked) => {
        setSelectedPermissions(prev => {
            const newCategory = {};
            permissionsData.find(g => g.category === category).options.forEach(opt => {
                newCategory[opt] = checked;
            });
            return {
                ...prev,
                [category]: newCategory
            };
        });
    };
    
    const handleOptionChange = (category, option, checked) => {
        setSelectedPermissions(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [option]: checked
            }
        }));
    };
    
    const isCategoryChecked = (category) => {
        const options = permissionsData.find(g => g.category === category).options;
        return options.every(opt => selectedPermissions[category]?.[opt]);
    };
    const transformPermissionsForBackend = (selectedPermissions) => {
        const map = {
          "Dashboard": { "View Dashboard": "viewDashboard" },
          "Business Listing": {
            "View Listings": "viewListings",
            "Edit Listings": "editListings",
            "Approve/Reject Listings": "approveRejectListings"
          },
          "Meeting Request": {
            "View Meeting Requests": "viewMeetingRequests",
            "Schedule Meetings": "scheduleMeetings",
            "Edit Meeting Details": "editMeetingDetails",
            "Cancel Meetings": "cancelMeetings"
          },
          "Deals": {
            "View Deals": "viewDeals",
            "Track Deal Progress": "trackDealProgress",
            "Verify Documents": "verifyDocuments",
            "Finalize Deal": "finalizeDeal"
          },
          "Finance": {
            "View Finance Dashboard": "viewFinanceDashboard",
            "Download Financial Reports": "downloadFinancialReports"
          },
          "Website Pages": {
            "View Website Pages": "viewWebsitePages",
            "Edit Article": "editArticle",
            "Delete Article": "deleteArticle",
            "Publish Article": "publishArticle"
          },
          "Alerts": { "View Alerts": "viewAlerts" },
          "Admin Setting": { "Add/Edit/Delete Roles": "manageRoles" }
        };
      
        const flat = {};
        Object.keys(selectedPermissions).forEach(category => {
          Object.keys(selectedPermissions[category]).forEach(option => {
            const key = map[category][option];
            if (key) flat[key] = selectedPermissions[category][option];
          });
        });
        return flat;
      };
      
      const onFinish = (values) => {
        const input = {
          name: values.roleName,
          ...transformPermissionsForBackend(selectedPermissions)
        };
      
        createRole({ variables: { input } });
        // redirect to /rolepermission
        navigate("/rolepermission");
      };   


    return (
        <Flex vertical gap={25}>
            <Breadcrumb
                separator=">"
                items={[
                    {
                        title: (
                            <Text className="cursor fs-13 text-gray" onClick={() => navigate("/rolepermission")}>
                                Role & Permission
                            </Text>
                        ),
                    },
                    {
                        title: <Text className="fw-500 fs-14 text-black">
                            { detail?.rolename ? detail?.rolename: 'Add Roles' } 
                        </Text>,
                    },
                ]}
            />
            
            <Flex gap={10} justify='space-between' align="center">
                <Flex gap={10} align="center">
                    <Button className="border0 p-0 bg-transparent" onClick={() => navigate("/rolepermission")}>
                        <ArrowLeftOutlined />
                    </Button>
                    <Title level={4} className="fw-500 m-0">
                        { detail?.rolename ? detail?.rolename: 'Add New Role' } 
                    </Title>
                </Flex>
                <Flex gap={10}>
                    <Button className="btncancel" onClick={() => navigate("/rolepermission")}>
                        Cancel
                    </Button>
                    <Button 
                        className="btnsave brand-bg border0 text-white" 
                        onClick={() => form.submit()}
                    >
                        {id ? 'Update':'Save' }
                    </Button>
                </Flex>
            </Flex>
            <Card>
                <Form layout='vertical' form={form} onFinish={onFinish}>
                    <Row gutter={[24, 14]}>
                        <Col span={24}>
                            <Title level={5} className="m-0">
                                Role Details
                            </Title>
                        </Col>
                        <Col span={24}>
                            <MyInput
                                label="Role Name"
                                size='large'
                                name='roleName'
                                className='w-100'
                                placeholder={'Enter Role Name'}
                                rules={[{ required: true, message: 'Please enter role name' }]}
                            />
                        </Col>
                        <Col span={24}>
                            <Text strong>Permissions</Text>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="permissions">
                                <Flex vertical gap={20}>
                                    {permissionsData.map((permission, index) => (
                                        <Flex vertical gap={10} key={index}>
                                            <Checkbox
                                                checked={isCategoryChecked(permission.category)}
                                                onChange={e => handleCategoryChange(permission.category, e.target.checked)}
                                            >
                                                {permission.category}
                                            </Checkbox>
                                            <Space direction='vertical' className="px-3">
                                                {permission.options.map((option, _) => (
                                                    <Checkbox 
                                                        key={option}
                                                        checked={!!selectedPermissions[permission.category]?.[option]}
                                                        onChange={e => handleOptionChange(permission.category, option, e.target.checked)}
                                                    >
                                                        {option}
                                                    </Checkbox>
                                                ))}
                                            </Space>
                                        </Flex>
                                    ))}
                                </Flex>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </Flex>
    );
};

export { AddRolePermission };