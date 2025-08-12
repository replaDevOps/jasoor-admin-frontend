import { useState } from 'react'
import { Button, Card, Flex, Form, Typography } from 'antd'
import { EditorDescription, ModuleTopHeading } from '../../components';

const { Title } = Typography
const PrivacyPolicyPage = () => {

    const [form] = Form.useForm();
    const [ descriptionData, setDescriptionData ] = useState('')

    const handleDescriptionChange = () =>{
        setDescriptionData()
    }


    return (
        <Flex vertical gap={20}>
            <Flex justify='space-between' align='center'>
                <ModuleTopHeading level={4}  name='Privacy Policy' />
                <Button type='button' className='btnsave border0 text-white brand-bg'>
                    Save
                </Button>
            </Flex>
            <Card className='radius-12 border-gray'>
                <Form
                    layout='vertical'
                    form={form}
                    // onFinish={onFinish} 
                    requiredMark={false}
                >
                    <EditorDescription
                        label={'Privacy Policy Content'} 
                        descriptionData={descriptionData}
                        onChange={handleDescriptionChange}
                    />
                </Form>
            </Card>
        </Flex>
    )
}

export {PrivacyPolicyPage}