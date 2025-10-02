import { useState,useEffect } from 'react'
import { Button, Card, Flex, Form ,Spin,message} from 'antd'
import { EditorDescription, ModuleTopHeading } from '../../components';
import { useMutation,useQuery } from "@apollo/client";
import { CREATE_TERMS,UPDATE_TERMS } from '../../graphql/mutation/mutations';
import { GETTERMSOFUSE } from '../../graphql/query/queries';
import { t } from 'i18next';

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
            messageApi.error(t("Please add terms content"));
            return;
          }
          // get language from localStorage or i18n
          const lang = localStorage.getItem("lang") || i18n.language || "en";
          const isArabic = lang.toLowerCase() === "ar";

          // prepare dynamic input
          const termInput = isArabic
          ? { arabicTerm: { content: descriptionData } }
          : { term: { content: descriptionData } };
          if (data?.getTerms?.id) {
            await updateTerms({
              variables: {
                updateTermsId: data.getTerms.id,
                input: {
                  ...termInput,
                  ndaTerm: null,
                  policy: null,
                },
              },
              refetchQueries: [{ query: GETTERMSOFUSE }],
              awaitRefetchQueries: true,
            });
            messageApi.success(t("Terms updated successfully!"));
          } else {
            // ✅ Create new terms
            await createTerms({
              variables: {
                input: {
                  ...termInput,
                  ndaTerm: null,
                  policy: null,
                },
              },
              refetchQueries: [{ query: GETTERMSOFUSE }],
              awaitRefetchQueries: true,
            });
            messageApi.success(t("Terms created successfully!"));
          }
    
        } catch (err) {
          console.error(err);
          messageApi.error(t("Failed to save terms"));
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
                <ModuleTopHeading level={4}  name={t('Terms of Use')} />
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
                        label={t('Terms Content')} 
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