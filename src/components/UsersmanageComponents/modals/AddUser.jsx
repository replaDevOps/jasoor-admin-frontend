import { Button, Col, Divider, Flex, Form, Modal, Radio, Row, Select, Space, Typography, Upload } from 'antd'
import { MyInput, MySelect } from '../../Forms'
import { CloseOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { cities, district } from '../../../data'

const { Title } = Typography
const AddUser = ({visible,onClose,edititem}) => {

    const [form] = Form.useForm()
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [idType, setIdType] = useState("national_id");
    const [frontFileName, setFrontFileName] = useState("");
    const [backFileName, setBackFileName] = useState("");
    const [passportFileName, setPassportFileName] = useState("");

    useEffect(()=>{
        if(visible && edititem){
            form.setFieldsValue({
                id:edititem.key,
                fullName: edititem?.fullname,
                email: edititem?.email,
                district: edititem?.district,
                city: edititem?.city,
                phoneNo: edititem?.mobileno
            })
        }
    },[visible,edititem])

    const onFinish = (values) => {
        console.log('All values',values)
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
                    <Button aria-labelledby='submit button' className={`btnsave border0 text-white brand-bg`} onClick={()=>form.submit()}>
                        {edititem? 'Update':'Save'}
                    </Button>
                </Flex>
            }
            width={600}
        > 

            <div>
                <Flex justify='space-between' className='mb-3' gap={6}>
                    <Title level={5} className='m-0'>
                        {
                            edititem ? 'Update user' : 'Add new user'
                        }
                    </Title>
                    <Button aria-labelledby='Close' type='button' onClick={onClose} className='p-0 border-0 bg-transparent'>
                        <CloseOutlined className='fs-18' />
                    </Button>
                </Flex> 
                <Form
                    layout='vertical'
                    form={form}
                    requiredMark={false}
                    onFinish={onFinish}
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
                            <MySelect
                                label="District"
                                name="district"
                                required
                                message="Please select district"
                                placeholder="Select district"
                                options={district}
                                onChange={(val) => setSelectedDistrict(val)}
                            />
                        </Col>
                        <Col span={24}>
                            <MySelect
                                label="City"
                                name="city"
                                required
                                message="Please select city"
                                options={selectedDistrict ? cities[selectedDistrict.toLowerCase()] || [] : []}
                                placeholder="Select city"
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                name="phoneNo"
                                label="Mobile Number"
                                required
                                message="Please enter a valid phone number"
                                addonBefore={
                                    <Select
                                        defaultValue="SA"
                                        style={{ width: 80 }}
                                        onChange={(value) => form.setFieldsValue({ countryCode: value })}
                                    >
                                        <Select.Option value="sa">SA</Select.Option>
                                        <Select.Option value="ae">AE</Select.Option>
                                    </Select>
                                }
                                placeholder="3445592382"
                                value={form.getFieldValue("phoneNo") || ""}
                                className='w-100'
                            />
                        </Col>
                        <Col span={24}>
                            <Row gutter={8}>
                                <Col span={24}>
                                    <Form.Item label="Upload National ID or Passport" className='m-0' required>
                                        <Radio.Group 
                                            value={idType} 
                                            onChange={(e) => {
                                                setIdType(e.target.value);
                                                setFrontFileName("");
                                                setBackFileName("");
                                                setPassportFileName("");
                                            }}
                                        >
                                            <Space>
                                                <Radio value="national_id">National ID</Radio>
                                                <Radio value="passport">Passport</Radio>
                                            </Space>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>

                                {idType === "national_id" ? (
                                    <>
                                        <Col span={24}>
                                            <Row gutter={8}>
                                                <Col flex="auto">
                                                    <MyInput 
                                                        withoutForm 
                                                        size={'large'} 
                                                        className='m-0' 
                                                        placeholder="Upload Front Side" 
                                                        readOnly 
                                                        value={frontFileName} 
                                                    />
                                                </Col>
                                                <Col>
                                                    <Upload 
                                                        beforeUpload={() => false} 
                                                        showUploadList={false} 
                                                        maxCount={1} 
                                                        // onChange={(info) => handleUpload({ file: info.file, title: 'front' })}
                                                    >
                                                        <Button aria-labelledby='Upload' className='btncancel pad-x bg-gray-2 text-black border-gray'>Upload</Button>
                                                    </Upload>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span={24}>
                                            <Row gutter={8}>
                                                <Col flex="auto">
                                                    <MyInput 
                                                        withoutForm 
                                                        size={'large'} 
                                                        className='m-0' 
                                                        placeholder="Upload Back Side" 
                                                        readOnly 
                                                        value={backFileName} 
                                                    />
                                                </Col>
                                                <Col>
                                                    <Upload 
                                                        beforeUpload={() => false} 
                                                        showUploadList={false} 
                                                        maxCount={1} 
                                                        // onChange={(info) => handleUpload({ file: info.file, title: 'back' })}
                                                    >
                                                        <Button aria-labelledby='Upload' className='btncancel pad-x bg-gray-2 text-black border-gray'>Upload</Button>
                                                    </Upload>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </>
                                ) : (
                                    <Col span={24}>
                                        <Row gutter={8}>
                                            <Col flex="auto">
                                                <MyInput 
                                                    withoutForm 
                                                    size={'large'} 
                                                    className='m-0' 
                                                    placeholder="Upload Passport" 
                                                    readOnly 
                                                    value={passportFileName} 
                                                />
                                            </Col>
                                            <Col>
                                                <Upload 
                                                    beforeUpload={() => false} 
                                                    showUploadList={false} 
                                                    maxCount={1} 
                                                    // onChange={(info) => handleUpload({ file: info.file, title: 'passport' })}
                                                >
                                                    <Button aria-labelledby='Upload' className='btncancel pad-x bg-gray-2 text-black border-gray'>Upload</Button>
                                                </Upload>
                                            </Col>
                                        </Row>
                                    </Col>
                                )}
                            </Row>
                        </Col>
                        <Col span={24}>
                            <MyInput
                                label="New Password"
                                type="password"
                                name="password"
                                size='large'
                                required
                                message={()=>{}}
                                placeholder={'Enter Password'}
                                validator={({ getFieldValue }) => ({
                                    validator: (_, value) => {
                                        const reg = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/;
                                        if (!reg.test(value)) {
                                            return Promise.reject(new Error('Password should contain at least 8 characters, one uppercase letter, one number, one special character'));
                                        } else {
                                            return Promise.resolve();
                                        }
                                    }
                                })}
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                label="Re-Type Password"
                                type="password"
                                name="confirmationPassword"
                                size='large'
                                dependencies={['password']}
                                required
                                message='Please enter confirm password'
                                placeholder={'Enter Confirm Password'}
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The password that you entered do not match!'));
                                        },
                                    }),
                                ]}
                            />
                        </Col>
                    </Row>
                </Form>
            </div>
            <Divider className='my-2 bg-light-brand' />
        </Modal>
    )
}

export {AddUser}