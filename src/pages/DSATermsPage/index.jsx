import { useState,useRef,useEffect } from 'react'
import { Button, Card, Flex, Form,Spin,message,Tag } from 'antd'
import { EditorDescription, ModuleTopHeading } from '../../components';
import { useMutation,useQuery } from "@apollo/client";
import { CREATE_TERMS,UPDATE_TERMS } from '../../graphql/mutation/mutations';
import { GETDSATERMS } from '../../graphql/query/queries';
import 'react-quill/dist/quill.snow.css';
import { t } from 'i18next';

const TAGS = [
  { key: t("buyerName"), label: t("Buyer Name") },
  { key: t("sellerName"), label: t("Seller Name") },
  { key: t("businessName"), label: t("Business Name") },
  { key: t("offerPrice"), label: t("Offer Price") },
  { key: t("commission"), label: t("Commission") },
  { key: t("date"), label: t("Date") },
];

const DSATermsPage = () => {
  const [form] = Form.useForm();
  const [descriptionData, setDescriptionData] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const [createTerms, { loading: creating }] = useMutation(CREATE_TERMS);
  const [updateTerms, { loading: updating }] = useMutation(UPDATE_TERMS);
  const { data, loading, error } = useQuery(GETDSATERMS);

  useEffect(() => {
      if (data?.getDSATerms?.dsaTerms?.content) {
        setDescriptionData(data?.getDSATerms?.dsaTerms?.content);
      }
  }, [data]);

  const editorRef = useRef(null);

    const handleDescriptionChange = (value) => {
        setDescriptionData(value)
    }

    // Callback to get the editor reference
    const handleEditorInit = (editor) => {
        editorRef.current = editor;
    }

  

  // const textareaRef = useRef(null);

  // const getTextAreaDOM = () => {
  //   const r = textareaRef.current;
  //   if (!r) return null;
  //   // AntD exposes different internals depending on version; try the common ones then fallback to the ref itself
  //   return r?.resizableTextArea?.textArea || r?.textArea || r?.input || r;
  // };

  // const handleDescriptionChange = (e) => {
  //     setDescriptionData(e.target.value);
  // };

//   const handleInsertTag = (tag) => {
//   const dom = getTextAreaDOM();
//   if (!dom) return;

//   // ensure textarea has focus so selectionStart/End are meaningful
//   dom.focus();

//   // read the *actual* value from the DOM (safer than relying on possibly-stale state)
//   const currentValue = typeof dom.value === 'string' ? dom.value : (descriptionData ?? '');

//   // safe selection handling: if selectionStart/End aren't numbers, default to end of text
//   const rawStart = typeof dom.selectionStart === 'number' ? dom.selectionStart : currentValue.length;
//   const rawEnd   = typeof dom.selectionEnd   === 'number' ? dom.selectionEnd   : rawStart;

//   // guard against reverse selections by normalizing start/end
//   const start = Math.min(rawStart, rawEnd);
//   const end   = Math.max(rawStart, rawEnd);

//   const tagText = `{{${tag}}}`;
//   const newValue = currentValue.slice(0, start) + tagText + currentValue.slice(end);

//   // update React state (controlled component)
//   setDescriptionData(newValue);

//   // After React has a chance to render the new value, set caret to after inserted tag.
//   // requestAnimationFrame is more reliable than tiny timeouts.
//   requestAnimationFrame(() => {
//     const caretPos = start + tagText.length;
//     if (typeof dom.setSelectionRange === 'function') {
//       try {
//         dom.setSelectionRange(caretPos, caretPos);
//       } catch (e) {
//         // some wrapped elements might still throw; fallback to assignments
//         dom.selectionStart = dom.selectionEnd = caretPos;
//       }
//     } else {
//       // fallback
//       dom.selectionStart = dom.selectionEnd = caretPos;
//     }
//     dom.focus();
//   });
// };

  const onFinish = async () => {
      try {
          if (!descriptionData || descriptionData.trim().length === 0) {
              messageApi.error(t("Please add terms content"));
              return;
          }
          if(data?.getDSATerms?.id){
            await updateTerms({
                variables: {
                  updateTermsId: data.getDSATerms.id,
                  input: {
                    term: null,
                    dsaTerms: { content: descriptionData },
                    policy: null,
                  },
                },
                refetchQueries: [{ query: GETDSATERMS }],
                awaitRefetchQueries: true,
              });
              messageApi.success(t("DSA Terms updated successfully!"));
          }else{
            await createTerms({
              variables: {
              input:{
                  term: null,
                  dsaTerms: { content: descriptionData },
                  policy: null,
              },
              refetchQueries: [{ query: GETDSATERMS }],
                awaitRefetchQueries: true,
          }
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

  const handleInsertTag = (tagKey) => {
        const tagText = `{{${tagKey}}}`;

        if (editorRef.current) {
            const editor = editorRef.current;

            // Force focus before inserting
            editor.focus();

            let range = editor.getSelection(true); // true = focus if not active
            if (range) {
            // Insert at current cursor position
            editor.insertText(range.index, tagText, "user");
            editor.setSelection(range.index + tagText.length);
            } else {
            // Fallback: append at end
            const length = editor.getLength();
            editor.insertText(length - 1, tagText, "user"); // before last \n
            editor.setSelection(length - 1 + tagText.length);
            }
        } else {
            // Fallback: update state
            setDescriptionData((prev) => prev + tagText);
        }
    };

  return (
      <>
          {contextHolder}
          <Flex vertical gap={20}>
              <Flex justify='space-between' align='center'>
                  <ModuleTopHeading level={4} name={t('DSA Terms')} />
                  <Button onClick={onFinish} aria-labelledby='Save' type='button' className='btnsave border0 text-white brand-bg'>
                      {t("Save")}
                  </Button>
              </Flex>
              
              <Card className="radius-12 border-gray">
                  <Flex gap={8} wrap="wrap">
                      {TAGS.map((t) => (
                         <Tag
                         key={t.key}
                         color="blue"
                         style={{ cursor: "pointer" }}
                         onClick={() => handleInsertTag(t.key)}
                         onMouseDown={(e) => {
                           e.preventDefault();
                         }}
                       >
                         {`${t.key}`}
                       </Tag>
                     
                      ))}
                  </Flex>
              </Card>

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
                          onEditorInit={handleEditorInit}                     
                      />
                  </Form>
              </Card>
          </Flex>
      </>
  );
};

export {DSATermsPage}