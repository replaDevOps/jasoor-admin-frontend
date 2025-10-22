import { useState,useEffect } from 'react'
import { Button, Card, Flex, Form ,Spin,message} from 'antd'
import { EditorDescription, ModuleTopHeading } from '../../components';
import { useMutation,useQuery } from "@apollo/client";
import { CREATE_TERMS,UPDATE_TERMS } from '../../graphql/mutation/mutations';
import { GETTERMSOFUSE } from '../../graphql/query/queries';
import { useTranslation } from "react-i18next";

const TermOfUsePage = () => {
    const {t, i18n}= useTranslation()
    const [form] = Form.useForm();
    const lang = localStorage.getItem("lang") || i18n.language || "en";
    const isArabic = lang.toLowerCase() === "ar";
    const [ descriptionData, setDescriptionData ] = useState('')
    const [messageApi, contextHolder] = message.useMessage();
    const [createTerms, { loading: creating }] = useMutation(CREATE_TERMS);
    const [updateTerms, { loading: updating }] = useMutation(UPDATE_TERMS);
    // call GETTERMSOFUSE
    const { data } = useQuery(GETTERMSOFUSE);

    useEffect(() => {
    if (!data?.getTerms) return;
    if (isArabic) {
      const arabicTerm = data.getTerms.find(t => t.arabicTerm?.content);
      if (arabicTerm) {
        setDescriptionData(arabicTerm.arabicTerm.content);
      }
    } else {
      const englishTerm = data.getTerms.find(t => t.term?.content);
      if (englishTerm) {
        setDescriptionData(englishTerm.term.content);
      }
    }
  }, [data,isArabic]);

    const handleDescriptionChange = (value) =>{
        setDescriptionData(value)
    }

    const onFinish = async () => {
        try {
          if (!descriptionData || descriptionData.trim().length === 0) {
            messageApi.error(t("Please add terms content"));
            return;
          }
          
          // Find existing term based on language
          const existingTerms = data?.getTerms?.find(t => t.isArabic === isArabic);
          
          if (existingTerms?.id) {
            // Update existing terms
            await updateTerms({
              variables: {
                updateTermsId: existingTerms.id,
                input: {
                  ...(
                    isArabic
                      ? { arabicTerm: { content: descriptionData } }
                      : { term: { content: descriptionData} }
                  ),
                  isArabic,
                  ndaTerm: null,
                  policy: null,
                },
              },
              refetchQueries: [{ query: GETTERMSOFUSE }],
              awaitRefetchQueries: true,
            });
            messageApi.success(t("Terms updated successfully!"));
          } else {
            // Create new terms
            await createTerms({
              variables: {
                input: {
                  ...(
                    isArabic
                      ? { arabicTerm: { content: descriptionData } }
                      : { term: { content: descriptionData} }
                  ),
                  isArabic,
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

    return (
        <>
        {contextHolder}
        <Flex vertical gap={20}>
            <Flex justify='space-between' align='center'>
                <ModuleTopHeading level={4}  name={t('Terms of Use')} />
                <Button 
                    onClick={onFinish} 
                    aria-labelledby='Save' 
                    type='button' 
                    className='btnsave border0 text-white brand-bg'
                    loading={creating || updating}
                >
                    {t("Save")}
                </Button>
            </Flex>
            <Card className='radius-12 border-gray'>
                <Form
                    layout='vertical'
                    form={form}
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