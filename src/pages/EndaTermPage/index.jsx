import { useState,useEffect } from 'react'
import { Button, Card, Flex, Form,Spin,message } from 'antd'
import { EditorDescription, ModuleTopHeading } from '../../components';
import { useMutation,useQuery } from "@apollo/client";
import { CREATE_TERMS,UPDATE_TERMS } from '../../graphql/mutation/mutations';
import { GETENDATERMS } from '../../graphql/query/queries';

const EndaTermPage = () => {
    const [form] = Form.useForm();
    const [ descriptionData, setDescriptionData ] = useState('')
    const [messageApi, contextHolder] = message.useMessage();
    const [createTerms, { loading: creating }] = useMutation(CREATE_TERMS);
    const [updateTerms, { loading: updating }] = useMutation(UPDATE_TERMS);
    const { data, loading, error } = useQuery(GETENDATERMS);

    useEffect(() => {
        if (data?.getNDATerms?.term?.content) {
          setDescriptionData(data?.getNDATerms?.ndaTerm?.content);
        }
    }, [data]);

    const handleDescriptionChange = (value) =>{
        setDescriptionData(value)
    }

    const onFinish = async () => {
        try {
          if (!descriptionData) {
            messageApi.error("Please add terms content");
            return;
          }
          if (data?.getNDATerms?.id) {
            await updateTerms({
                variables: {
                  updateTermsId: data.getTerms.id,
                  input: {
                    term: null,
                    ndaTerm: { content: descriptionData },
                    policy: null,
                  },
                },
                refetchQueries: [{ query: GETTERMSOFUSE }],
                awaitRefetchQueries: true,
              });
              messageApi.success("E-NDA Terms updated successfully!");
          }
          else{
            await createTerms({
                variables: {
                    input:{
                    term:    null,
                    ndaTerm: { content: descriptionData },
                    policy: null,
                },
            }
          });
          messageApi.success("E-NDA Terms created successfully!");
          form.resetFields();
          }
        } catch (err) {
          console.error(err);
          messageApi.error("Failed to save terms");
        }
      };

    if (creating || loading|| updating) {
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