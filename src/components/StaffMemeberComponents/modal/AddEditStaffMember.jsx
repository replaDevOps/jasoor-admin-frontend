import { Button, Col, Divider, Flex, Form, Modal, Row, Typography,Dropdown } from 'antd'
import { MyInput, MySelect } from '../../Forms'
import { CloseOutlined } from '@ant-design/icons'
import { useEffect,useState } from 'react'
import { GETROLES } from '../../../graphql/query';
import { CREATE_USER } from '../../../graphql/mutation';
import { useQuery,useMutation } from '@apollo/client';
import { groupselectItem } from '../../../shared'


const { Title } = Typography
const AddEditStaffMember = ({visible,onClose,edititem}) => {
    const [selectedRole, setSelectedRole] = useState(null);
    const { loading, data } = useQuery(GETROLES, {
        variables: {
            limit: null,
            offset: null,
            search: null,
            isActive: true
        },
        fetchPolicy: "network-only",
        skip: !visible // 👈 Skip until modal is visible
    });
    const roles = data?.getRoles || [];

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

    const [createUser, { loading: creating }] = useMutation(CREATE_USER, {
        onCompleted: () => {
          // maybe show success toast
          onClose();
        },
        onError: (err) => {
          console.error(err);
          // maybe show error toast
        }
    });
    const handleRoleChange = (key) => {
        setSelectedRole(key)
      };
    const handleFinish = (values) => {
        createUser({
          variables: {
            input: {
              name: values.fullName,
              email: values.email,
              phone: values.phoneNo || null,
              password: values.password,
              roleId: selectedRole // this will now be the role id
            }
          }
        });
      };
    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onClose}
            closeIcon={false}
            centered
            footer={
                <Flex justify='end' gap={5}>
                    <Button type='button' onClick={onClose} className='btncancel text-black border-gray'>
                        Cancel
                    </Button>
                    <Button className={`btnsave border0 text-white brand-bg`} onClick={()=>form.submit()}>
                        Save
                    </Button>
                </Flex>
            }
        > 

            <div>
                <Flex justify='space-between' className='mb-3' gap={6}>
                    <Title level={5} className='m-0'>
                        {edititem ? 'Edit Staff Member' : 'Add Staff Member'}
                    </Title>
                    <Button type='button' onClick={onClose} className='p-0 border-0 bg-transparent'>
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
                                label='Full Name'
                                name='fullName'
                                required
                                message='Please enter your full name'
                                placeholder='Enter full name'
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                label='Email Address'
                                name='email'
                                required
                                message='Please enter your email address'
                                placeholder='Enter email address'
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                // type='number'
                                label='Phone Number (Optional)'
                                name='phoneNo'
                                placeholder='Enter phone number'
                            />
                        </Col>
                        <Col span={24}>
                            <MySelect
                                label='Assign Role'
                                name='assignRole'
                                required
                                message='Please choose a role'
                                options={roles.map(role => ({
                                    name: role.name,
                                    id: role.id
                                }))}
                                placeholder='Select a role'
                                value={selectedRole}
                                onChange={handleRoleChange}
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                type='password'
                                label='Password'
                                name='password'
                                required
                                message='Enter password'
                                placeholder='Enter password'
                            />
                        </Col>
                    </Row>
                </Form>
            </div>
            <Divider className='my-2 bg-light-brand' />
        </Modal>
    )
}

export {AddEditStaffMember}