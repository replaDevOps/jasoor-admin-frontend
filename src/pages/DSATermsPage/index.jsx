import { useState,useRef,useEffect } from 'react'
import { Button, Card, Flex, Form,Spin,message,Tag,Input } from 'antd'
import { ModuleTopHeading } from '../../components';
import { useMutation,useQuery } from "@apollo/client";
import { CREATE_TERMS,UPDATE_TERMS } from '../../graphql/mutation/mutations';
import { GETDSATERMS } from '../../graphql/query/queries';
import 'react-quill/dist/quill.snow.css';

const TAGS = [
  { key: "buyerName", label: "Buyer Name" },
  { key: "sellerName", label: "Seller Name" },
  { key: "businessName", label: "Business Name" },
  { key: "offerPrice", label: "Offer Price" },
  { key: "commission", label: "Commission" },
  { key: "date", label: "Date" },
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
  

  const textareaRef = useRef(null);
  const modules = {
    toolbar: {
        container: [
            [{ 'font': [] }, { 'size': [] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
            ['link', 'image', 'video'],
            ['clean']
        ],
        handlers: {
            // Add custom handlers if needed
        }
    }
};

  const getTextAreaDOM = () => {
    const r = textareaRef.current;
    if (!r) return null;
    // AntD exposes different internals depending on version; try the common ones then fallback to the ref itself
    return r?.resizableTextArea?.textArea || r?.textArea || r?.input || r;
  };

  const handleDescriptionChange = (e) => {
      setDescriptionData(e.target.value);
  };

  const handleInsertTag = (tag) => {
  const dom = getTextAreaDOM();
  if (!dom) return;

  // ensure textarea has focus so selectionStart/End are meaningful
  dom.focus();

  // read the *actual* value from the DOM (safer than relying on possibly-stale state)
  const currentValue = typeof dom.value === 'string' ? dom.value : (descriptionData ?? '');

  // safe selection handling: if selectionStart/End aren't numbers, default to end of text
  const rawStart = typeof dom.selectionStart === 'number' ? dom.selectionStart : currentValue.length;
  const rawEnd   = typeof dom.selectionEnd   === 'number' ? dom.selectionEnd   : rawStart;

  // guard against reverse selections by normalizing start/end
  const start = Math.min(rawStart, rawEnd);
  const end   = Math.max(rawStart, rawEnd);

  const tagText = `{{${tag}}}`;
  const newValue = currentValue.slice(0, start) + tagText + currentValue.slice(end);

  // update React state (controlled component)
  setDescriptionData(newValue);

  // After React has a chance to render the new value, set caret to after inserted tag.
  // requestAnimationFrame is more reliable than tiny timeouts.
  requestAnimationFrame(() => {
    const caretPos = start + tagText.length;
    if (typeof dom.setSelectionRange === 'function') {
      try {
        dom.setSelectionRange(caretPos, caretPos);
      } catch (e) {
        // some wrapped elements might still throw; fallback to assignments
        dom.selectionStart = dom.selectionEnd = caretPos;
      }
    } else {
      // fallback
      dom.selectionStart = dom.selectionEnd = caretPos;
    }
    dom.focus();
  });
};

  const onFinish = async () => {
      try {
          if (!descriptionData || descriptionData.trim().length === 0) {
              messageApi.error("Please add terms content");
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
              messageApi.success("DSA Terms updated successfully!");
          }else{
            await createTerms({
              variables: {
              input:{
                  term: null,
                  dsaTerms: { content: descriptionData },
                  policy: null,
              },
          }
        });

        messageApi.success("Terms created successfully!");
        form.resetFields();
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
                  <ModuleTopHeading level={4} name='DSA Terms' />
                  <Button onClick={onFinish} aria-labelledby='Save' type='button' className='btnsave border0 text-white brand-bg'>
                      Save
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
                  <Form layout='vertical' form={form} requiredMark={false}>
                      <Form.Item label="Terms Content" required>
                          <Input.TextArea
                              ref={textareaRef}
                              value={descriptionData}
                              onChange={handleDescriptionChange}
                              rows={15}
                              placeholder="Enter your terms and conditions here..."
                              style={{ resize: 'vertical' }}
                              modules={modules}
                          />
                      </Form.Item>
                  </Form>
              </Card>
          </Flex>
      </>
  );
};

export {DSATermsPage}