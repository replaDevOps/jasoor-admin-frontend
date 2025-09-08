import { Button, Col, Divider, Flex, Form, Modal, Row, Typography,Dropdown } from 'antd'
import { MyInput, MySelect } from '../../Forms'
import { CloseOutlined } from '@ant-design/icons'
import { useEffect,useState } from 'react'
import { GETROLES,GETSTAFFMEMBERS } from '../../../graphql/query';
import { CREATE_USER } from '../../../graphql/mutation';
import { useQuery,useMutation } from '@apollo/client';

const { Title } = Typography
const AddEditStaffMember = ({visible,onClose,edititem,refetchStaff}) => {
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
        refetchQueries: [ {
            query: GETSTAFFMEMBERS 
          },
        ],
        awaitRefetchQueries: true,
        onCompleted: () => {
          // maybe show success toast
          if (typeof refetchStaff === 'function') {
            refetchStaff();
          }
          onClose();
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
                    <Button aria-labelledby='Cancel' type='button' onClick={onClose} className='btncancel text-black border-gray'>
                        Cancel
                    </Button>
                    <Button aria-labelledby='Save' className={`btnsave border0 text-white brand-bg`} onClick={()=>form.submit()}>
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
                            label="Assign Role"
                            name="assignRole"
                            options={roles.map(role => ({ name: role.name, id: role.id }))}
                            value={selectedRole}
                            onChange={handleRoleChange}   // ✅ correct
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