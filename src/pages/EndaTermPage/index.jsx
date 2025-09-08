import { useState } from 'react'
import { Button, Card, Flex, Form } from 'antd'
import { EditorDescription, ModuleTopHeading } from '../../components';

const EndaTermPage = () => {

    const [form] = Form.useForm();
    const [ descriptionData, setDescriptionData ] = useState('')

    const handleDescriptionChange = () =>{
        setDescriptionData()
    }


    return (
        <Flex vertical gap={20}>
            <Flex justify='space-between' align='center'>
                <ModuleTopHeading level={4}  name='E-NDA Terms' />
                <Button aria-labelledby='Save' type='button' className='btnsave border0 text-white brand-bg'>
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
                        label={'Terms Content'} 
                        descriptionData={descriptionData}
                        onChange={handleDescriptionChange}
                    />
                </Form>
            </Card>
        </Flex>
    )
}

export {EndaTermPage}