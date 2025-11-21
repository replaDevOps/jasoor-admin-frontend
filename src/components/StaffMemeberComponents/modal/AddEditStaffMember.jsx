import { Button, Col, Divider, Flex, Form, message, Modal, Row, Typography } from 'antd'
import { MyInput, MySelect } from '../../Forms'
import { CloseOutlined } from '@ant-design/icons'
import { useEffect,useState } from 'react'
import { GETROLES,GETSTAFFMEMBERS } from '../../../graphql/query';
import { CREATE_STAFF_MEMBER, UPDATE_USER } from '../../../graphql/mutation';
import { useQuery,useMutation } from '@apollo/client';
import { t } from 'i18next';

const { Title } = Typography
const AddEditStaffMember = ({visible,onClose,edititem}) => {

    const [messageApi, contextHolder] = message.useMessage();
    const [selectedRole, setSelectedRole] = useState(null);
    const { data } = useQuery(GETROLES, {
        variables: {
            limit: null,
            offset: null,
            search: null,
            isActive: true
        },
        fetchPolicy: "network-only",
        skip: !visible
    });
    const roles = data?.getRoles?.roles || [];

    const [form] = Form.useForm()
    useEffect(()=>{
        if(visible && edititem){
            form.setFieldsValue({
                fullName: edititem?.name,
                email: edititem?.email,
                phoneNo: edititem?.phone,
                assignRole: edititem?.role,
            })
        } else {
            form.resetFields()
        }
    },[visible,edititem])
    const [ updateUser, { loading: updating } ] = useMutation(UPDATE_USER, {
        refetchQueries: [ GETSTAFFMEMBERS ],
        onCompleted: () => {
            setTimeout(() => {
                messageApi.success(t('Staff member updated successfully!'));
                onClose();
            }, 0);
        },
        onError: (err) => {
          console.error(err);
          // maybe show error toast
        }
    })
    const [createUser, { loading: creating }] = useMutation(CREATE_STAFF_MEMBER, {
        refetchQueries: [ GETSTAFFMEMBERS ],
        onCompleted: () => {
            setTimeout(() => {
                messageApi.success(t('Staff member created successfully!'));
                onClose();
            }, 0);
        },
        onError: (err) => {
          console.error(err);
          // maybe show error toast
        }
    });
    const handleRoleChange = (selectedName) => {
        // Find the role object by name
        const role = roles.find(r => r.name === selectedName);
        const id = role?.id;
        setSelectedRole(id);
      };
      
    const handleFinish = (values) => {
        const roleId = values.assignRole;

        if (edititem) {
        updateUser({
            variables: {
            input: {
                id: edititem.key,
                name: values.fullName,
                email: values.email,
                phone: values.phoneNo || null,
                roleId,
                ...(values.password ? { password: values.password } : {}),
            },
            },
        });
        form.resetFields();
        } else {
        createUser({
            variables: {
            input: {
                name: values.fullName,
                email: values.email,
                phone: values.phoneNo || null,
                password: values.password,
                roleId,
            },
            },
        });
        form.resetFields();
        }
    };
    return (
        <>
        {contextHolder}
        <Modal
            title={null}
            open={visible}
            onCancel={onClose}
            closeIcon={false}
            centered
            footer={
                <Flex justify='end' gap={5}>
                    <Button aria-labelledby='Cancel' type='button' onClick={onClose} className='btncancel text-black border-gray'>
                        {t("Cancel")}
                    </Button>
                    <Button aria-labelledby='Save' className={`btnsave border0 text-white brand-bg`} onClick={()=>form.submit()} loading={creating} >
                        {t("Save")}
                    </Button>
                </Flex>
            }
        > 

            <div>
                <Flex justify='space-between' className='mb-3' gap={6}>
                    <Title level={5} className='m-0'>
                        {edititem ? t('Edit Staff Member') : t('Add Staff Member')}
                    </Title>
                    <Button aria-labelledby='Close' type='button' onClick={onClose} className='p-0 border-0 bg-transparent'>
                        <CloseOutlined className='fs-18' />
                    </Button>
                </Flex> 
                <Form
                    layout='vertical'
                    form={form}
                    requiredMark={false}
                    onFinish={handleFinish}
                >
                    <Row>
                        <Col span={24}>
                            <MyInput
                                label={t('Full Name')}
                                name='fullName'
                                required
                                message={t('Please enter your full name')}
                                placeholder={t('Enter full name')}
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                label={t('Email Address')}
                                name='email'
                                required
                                message={t('Please enter your email address')}
                                placeholder={t('Enter email address')}
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                // type='number'
                                label={t('Phone Number (Optional)')}
                                name='phoneNo'
                                placeholder={t('Enter phone number')}
                            />
                        </Col>
                        <Col span={24}>
                        <MySelect
                            label={t("Assign Role")}
                            name="assignRole"
                            options={roles.map(role => ({ name: t(role.name), id: role.id }))}
                            value={selectedRole}
                            required
                            message={t('Select role')}
                            onChange={handleRoleChange}   // ✅ correct
                        />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                type='password'
                                label={t('Password')}
                                name='password'
                                required={!edititem}
                                message={t('Enter password')}
                                placeholder={t('Enter password')}
                            />
                        </Col>
                    </Row>
                </Form>
            </div>
            <Divider className='my-2 bg-light-brand' />
        </Modal>
        </>
    )
}

export {AddEditStaffMember}