import { useState } from 'react'
import { Button, Card, Flex, Form,Spin,message } from 'antd'
import { EditorDescription, ModuleTopHeading } from '../../components';
import { useMutation } from "@apollo/client";
import { CREATE_TERMS } from '../../graphql/mutation/mutations';

const EndaTermPage = () => {
    const [form] = Form.useForm();
    const [ descriptionData, setDescriptionData ] = useState('')
    const [messageApi, contextHolder] = message.useMessage();
    const [createTerms, { loading: creating }] = useMutation(CREATE_TERMS);

    const handleDescriptionChange = (value) =>{
        setDescriptionData(value)
    }

    const onFinish = async () => {
        try {
          if (!descriptionData) {
            messageApi.error("Please add terms content");
            return;
          }
    
          await createTerms({
            variables: {
              term:    null,
              ndaTerm: { content: descriptionData },
              policy: null,
            },
          });
    
          messageApi.success("Terms created successfully!");
          form.resetFields();
          setDescriptionData("");
        } catch (err) {
          console.error(err);
          messageApi.error("Failed to save terms");
        }
      };

    if (creating) {
        return (
            <Flex justify="center" align="center" className='h-200'>
                <Spin size="large" />
            </Flex>
        );
    }
    return (
        <>
        {contextHolder}
        <Flex vertical gap={20}>
            <Flex justify='space-between' align='center'>
                <ModuleTopHeading level={4}  name='E-NDA Terms' />
                <Button onClick={onFinish} aria-labelledby='Save' type='button' className='btnsave border0 text-white brand-bg'>
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
        </>
    )
}

export {EndaTermPage}