import { Button, Col, Divider, Flex, Form, Modal, Radio, Row, Select, Space, Typography, Upload,message } from 'antd'
import { MyInput, MySelect } from '../../Forms'
import { CloseOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { cities } from '../../../data'
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../../../graphql/mutation/login";
import imageCompression from 'browser-image-compression';
import { t } from 'i18next'

const { Title } = Typography
const AddUser = ({visible,onClose,edititem}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm()
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [idType, setIdType] = useState("national_id");
    const [frontFileName, setFrontFileName] = useState("");
    const [backFileName, setBackFileName] = useState("");
    const [passportFileName, setPassportFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [createUser, { loading:userLoading, error }] = useMutation(CREATE_USER);

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


    const onFinish = async () => {
        try {
            const formData = form.getFieldsValue(true);
            const input = {
                name: formData.fullName,
                email: formData.email.toLowerCase(),
                district: formData.district,
                city: formData.city,
                phone: formData.phoneNo,
                password: formData.password,
                documents: documents.length > 0 ? documents : undefined,
            };
    
            const { data } = await createUser({ variables: { input } });
    
            messageApi.success(t("Account created successfully!"));
            // redirect or reset form
            form.resetFields();
        } catch (err) {
            messageApi.error(t("Failed to create user. Please try again."));
        }finally {
            onClose();
        }
    };

    const handleUpload = async ({ file,title }) => {
        try {
            setLoading(true); 
            let compressedFile = file;
            if (file.type.startsWith('image/')) {
                compressedFile = await imageCompression(file, {
                  maxSizeMB: 1,
                  maxWidthOrHeight: 1024,
                  useWebWorker: true,
                });
            }
            const formData = new FormData();
            formData.append('file', file);
        
            // Call your upload API
            const res = await fetch('https://verify.jusoor-sa.co/upload', {
                method: 'POST',
                body: formData,
            });
        
            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
        
            // Update documents state for front side
            setDocuments(prevDocs => {
                // Remove existing 'front' doc if any
                // Add new
                const filtered = prevDocs.filter(doc => doc.title !== title);
                return [...filtered, {
                title: 'front',
                fileName: data.fileName,
                filePath: data.fileUrl,
                fileType: data.fileType,
                }];
            });

            if (title === 'front') setFrontFileName(data.fileName);
            else if (title === 'back') setBackFileName(data.fileName);
            else if (title === 'passport') setPassportFileName(data.fileName);
      
        } catch (err) {
          console.error(err);
          messageApi.error('Failed to upload front file');
        }finally {
            setLoading(false); // Stop loading
        }
    };

    const district = [
    {
        id: 1,
        name: t('Riyadh'),
        value: 'riyadh'
    },
    {
        id: 2,
        name: t('Jeddah'),
        value: 'jeddah'
    },
    {
        id: 3,
        name: t('Dammam'),
        value: 'dammam'
    },
    {
        id: 4,
        name: t('Khobar'),
        value: 'khobar'
    },
    {
        id: 5,
        name: t('Makkah'),
        value: 'makkah'
    },
    {
        id: 6,
        name: t('Medina'),
        value: 'medina'
    },
    {
        id: 7,
        name: t('Taif'),
        value: 'taif'
    },
    {
        id: 8,
        name: t('Tabuk'),
        value: 'tabuk'
    },
    {
        id: 9,
        name: t('Hail'),
        value: 'hail'
    },
    {
        id: 10,
        name: t('Najran'),
        value: 'najran'
    }
]
    
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
                    <Button aria-labelledby='submit button' className={`btnsave border0 text-white brand-bg`} onClick={()=>form.submit()}>
                        {edititem? t('Update'):t('Save')}
                    </Button>
                </Flex>
            }
            width={600}
        > 

            <div>
                <Flex justify='space-between' className='mb-3' gap={6}>
                    <Title level={5} className='m-0'>
                        {
                            edititem ? t('Update user') : t('Add new user')
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
                            <MySelect
                                label={t("District")}
                                name="district"
                                required
                                message={t("Please select district")}
                                placeholder={t("Select district")}
                                options={district}
                                onChange={(val) => setSelectedDistrict(val)}
                            />
                        </Col>
                        <Col span={24}>
                            <MySelect
                                label={t("City")}
                                name="city"
                                required
                                message={t("Please select city")}
                                options={selectedDistrict ? cities[selectedDistrict.toLowerCase()] || [] : []}
                                placeholder={t("Select city")}
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                name="phoneNo"
                                label={t("Mobile Number")}
                                required
                                message={t("Please enter a valid phone number")}
                                addonBefore={
                                    <Select
                                        defaultValue={t("SA")}
                                        className='w-80'
                                        onChange={(value) => form.setFieldsValue({ countryCode: value })}
                                    >
                                        <Select.Option value="sa">{t("SA")}</Select.Option>
                                        <Select.Option value="ae">{t("AE")}</Select.Option>
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
                                    <Form.Item label={t("Upload National ID or Passport")}className='m-0' required>
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
                                                <Radio value="national_id">{t("National ID")}</Radio>
                                                <Radio value="passport">{t("Passport")}</Radio>
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
                                                        placeholder={t("Upload Front Side" )}
                                                        readOnly 
                                                        value={frontFileName} 
                                                    />
                                                </Col>
                                                <Col>
                                                    <Upload 
                                                        beforeUpload={() => false} 
                                                        showUploadList={false} 
                                                        maxCount={1} 
                                                        onChange={(info) => handleUpload({ file: info.file, title: 'front' })}
                                                    >
                                                        <Button aria-labelledby='Upload' className='btncancel pad-x bg-gray-2 text-black border-gray'>{t("Upload")}</Button>
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
                                                        placeholder={t("Upload Back Side" )}
                                                        readOnly 
                                                        value={backFileName} 
                                                    />
                                                </Col>
                                                <Col>
                                                    <Upload 
                                                        beforeUpload={() => false} 
                                                        showUploadList={false} 
                                                        maxCount={1} 
                                                        onChange={(info) => handleUpload({ file: info.file, title: 'back' })}
                                                    >
                                                        <Button aria-labelledby='Upload' className='btncancel pad-x bg-gray-2 text-black border-gray'>{t("Upload")}</Button>
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
                                                    placeholder={t("Upload Passport")} 
                                                    readOnly 
                                                    value={passportFileName} 
                                                />
                                            </Col>
                                            <Col>
                                                <Upload 
                                                    beforeUpload={() => false} 
                                                    showUploadList={false} 
                                                    maxCount={1} 
                                                    onChange={(info) => handleUpload({ file: info.file, title: 'passport' })}
                                                >
                                                    <Button aria-labelledby='Upload' className='btncancel pad-x bg-gray-2 text-black border-gray'>{t("Upload")}</Button>
                                                </Upload>
                                            </Col>
                                        </Row>
                                    </Col>
                                )}
                            </Row>
                        </Col>
                        <Col span={24}>
                            <MyInput
                                label={t("New Password")}
                                type="password"
                                name="password"
                                size='large'
                                required
                                message={()=>{}}
                                placeholder={t('Enter Password')}
                                validator={({ getFieldValue }) => ({
                                    validator: (_, value) => {
                                        const reg = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/;
                                        if (!reg.test(value)) {
                                            return Promise.reject(new Error(t('Password should contain at least 8 characters, one uppercase letter, one number, one special character')));
                                        } else {
                                            return Promise.resolve();
                                        }
                                    }
                                })}
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                label={t("Re-Type Password")}
                                type="password"
                                name="confirmationPassword"
                                size='large'
                                dependencies={['password']}
                                required
                                message={t('Please enter confirm password')}
                                placeholder={t('Enter Confirm Password')}
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error(t('The password that you entered do not match!')));
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
        </>
    )
}

export {AddUser}