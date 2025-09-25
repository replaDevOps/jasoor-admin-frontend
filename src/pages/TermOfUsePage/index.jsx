import { useState,useEffect } from 'react'
import { Button, Card, Flex, Form ,Spin,message} from 'antd'
import { EditorDescription, ModuleTopHeading } from '../../components';
import { useMutation,useQuery } from "@apollo/client";
import { CREATE_TERMS,UPDATE_TERMS } from '../../graphql/mutation/mutations';
import { GETTERMSOFUSE } from '../../graphql/query/queries';

const TermOfUsePage = () => {
    const [form] = Form.useForm();
    const [ descriptionData, setDescriptionData ] = useState('')
    const [messageApi, contextHolder] = message.useMessage();
    const [createTerms, { loading: creating }] = useMutation(CREATE_TERMS);
    const [updateTerms, { loading: updating }] = useMutation(UPDATE_TERMS);
    // call GETTERMSOFUSE
    const { data, loading, error } = useQuery(GETTERMSOFUSE);
    useEffect(() => {
        if (data?.getTerms?.term?.content) {
          setDescriptionData(data?.getTerms?.term?.content);
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
    
          if (data?.getTerms?.id) {
            // ✅ Update existing terms
            await updateTerms({
              variables: {
                updateTermsId: data.getTerms.id,
                input: {
                  term: { content: descriptionData },
                  ndaTerm: null,
                  policy: null,
                },
              },
              refetchQueries: [{ query: GETTERMSOFUSE }],
              awaitRefetchQueries: true,
            });
            messageApi.success("Terms updated successfully!");
          } else {
            // ✅ Create new terms
            await createTerms({
              variables: {
                input: {
                  term: { content: descriptionData },
                  ndaTerm: null,
                  policy: null,
                },
              },
              refetchQueries: [{ query: GETTERMSOFUSE }],
              awaitRefetchQueries: true,
            });
            messageApi.success("Terms created successfully!");
          }
    
        } catch (err) {
          console.error(err);
          messageApi.error("Failed to save terms");
        }
      };

    if (creating || loading || updating) {
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
                <ModuleTopHeading level={4}  name='Terms of Use' />
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

export {TermOfUsePage}