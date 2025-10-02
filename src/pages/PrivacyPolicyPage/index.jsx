import { useState,useEffect } from 'react'
import { Button, Card, Flex, Form,Spin,message } from 'antd'
import { EditorDescription, ModuleTopHeading } from '../../components';
import { useMutation,useQuery } from "@apollo/client";
import { CREATE_TERMS,UPDATE_TERMS } from '../../graphql/mutation/mutations';
import { GETPRIVACYPOLICY } from '../../graphql/query/queries';
import { t } from 'i18next';

const PrivacyPolicyPage = () => {
    const [form] = Form.useForm();
    const [ descriptionData, setDescriptionData ] = useState('')
    const [messageApi, contextHolder] = message.useMessage();
    const [createTerms, { loading: creating }] = useMutation(CREATE_TERMS);
    const [updateTerms, { loading: updating }] = useMutation(UPDATE_TERMS);
    const { data, loading, error } = useQuery(GETPRIVACYPOLICY);

      useEffect(() => {
          if (data?.getPrivacyPolicy?.policy?.content) {
            setDescriptionData(data?.getPrivacyPolicy?.policy?.content);
          }
      }, [data]);

    const handleDescriptionChange = (value) =>{
        setDescriptionData(value)
    }

    const onFinish = async () => {
        try {
          if (!descriptionData) {
            messageApi.error("Please add policy content");
            return;
          }
          // get language from localStorage or i18n
          const lang = localStorage.getItem("lang") || i18n.language || "en";
          const isArabic = lang.toLowerCase() === "ar";

          // prepare dynamic input
          const policyInput = isArabic
          ? { arabicPolicy: { content: descriptionData } }
          : { policy: { content: descriptionData } };
          if( data?.getPrivacyPolicy?.id) {
            await updateTerms({
                variables: {
                  updateTermsId: data.getDSATerms.id,
                  input: {
                    term: null,
                    dsaTerms: null,
                    ...policyInput,
                  },
                },
                refetchQueries: [{ query: GETPRIVACYPOLICY }],
                awaitRefetchQueries: true,
              });
              messageApi.success("DSA Terms updated successfully!");
          }else{
            await createTerms({
                variables: {
                    input: {
                    term: null,   
                    ndaTerm: null,
                    ...policyInput,
                    }
                },
                refetchQueries: [{ query: GETPRIVACYPOLICY }],
                awaitRefetchQueries: true,
              });
          messageApi.success(t("Policy created successfully!"));
          }
        } catch (err) {
          console.error(err);
          messageApi.error(t("Failed to save policy"));
        }
      };

    if (creating || updating || loading) {
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
                <ModuleTopHeading level={4}  name={t('Privacy Policy')} />
                <Button onClick={onFinish} aria-labelledby='Save' type='button' className='btnsave border0 text-white brand-bg'>
                    {t("Save")}
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
                        label={t('Privacy Policy Content')} 
                        descriptionData={descriptionData}
                        onChange={handleDescriptionChange}
                    />
                </Form>
            </Card>
        </Flex>
        </>
    )
}

export {PrivacyPolicyPage}