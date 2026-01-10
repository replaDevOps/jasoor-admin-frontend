import { ArrowLeftOutlined, ArrowRightOutlined, RightOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Flex,
  Form,
  message,
  Row,
  Typography,
  Spin,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { MyInput, SingleFileUpload } from "../../../Forms";
import { useEffect, useMemo, useState } from "react";
import { EditorDescription } from "../../../Ui";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_ARTICLE,
  UPDATE_ARTICLE,
} from "../../../../graphql/mutation/mutations";
import { GETARTICLE, GETARTICLES } from "../../../../graphql/query/queries";
import imageCompression from "browser-image-compression";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const AddArticle = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [descriptionData, setDescriptionData] = useState("");
  const [showImage, setShowImage] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [createArticle, { loading: creating }] = useMutation(CREATE_ARTICLE, {
    onCompleted: () => {
      messageApi.success(t("Article created successfully"));
      // Delay navigation to show success message
      setTimeout(() => {
        navigate("/articles", { state: { refetch: true } });
      }, 1500);
    },
    onError: (err) => {
      console.error(err);
      messageApi.error(t("Failed to create article"));
    },
  });

  const [updateArticle, { loading: updating }] = useMutation(UPDATE_ARTICLE, {
    onCompleted: () => {
      messageApi.success(t("Article updated successfully"));
      // Delay navigation to show success message
      setTimeout(() => {
        navigate("/articles", { state: { refetch: true } });
      }, 1500);
    },
    onError: (err) => {
      console.error(err);
      messageApi.error(t("Failed to update article"));
    },
  });

  // fetch article when id exists
  const { data, loading } = useQuery(GETARTICLE, {
    variables: { getArticleId: id },
    skip: !id,
    fetchPolicy: "network-only",
  });

  const detail = useMemo(() => {
    if (!data?.getArticle) return null;
    const g = data.getArticle;
    return {
      id: g.id,
      img: g.image,
      title: g.title,
      description: g.body?.content || g.body || "",
      date: g.createdAt,
      arabicTitle: g.arabicTitle,
      arabicBody: g.arabicBody?.content || g.arabicBody || "",
    };
  }, [data]);

  useEffect(() => {
    if (detail) {
      form.setFieldsValue({
        articletitle: detail.title ?? detail.arabicTitle ?? "",
      });
      setDescriptionData(detail.description || detail.arabicBody || "");
      setImageUrl(detail.img || null);
      setShowImage(Boolean(detail.img));
    } else {
      // editing mode closed or create mode
      form.resetFields();
      setDescriptionData("");
      setImageUrl(null);
      setShowImage(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);

  const handleDescriptionChange = (value) => {
    setDescriptionData(value);
  };

  // handle file upload with image compression
  const uploadFileToServer = async (file) => {
    setUploading(true);
    try {
      let compressedFile = file;

      if (file.type && file.type.startsWith("image/")) {
        compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        });
      }

      const formData = new FormData();
      formData.append("file", compressedFile);

      const res = await fetch("https://verify.jusoor-sa.co/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const json = await res.json();
      if (!json?.fileUrl) throw new Error("No file URL returned from upload");

      setImageUrl(json.fileUrl);

      return {
        fileName: json.fileName,
        fileType: json.fileType,
        filePath: json.fileUrl,
      };
    } catch (err) {
      console.error(err);
      message.error(t("Failed to upload file"));
      throw err;
    } finally {
      setUploading(false);
    }
  };

  // Save handler (create or update)
  const onFinish = async (values) => {
    const { articletitle } = values;
    try {
      if (!articletitle || !articletitle.trim()) {
        messageApi.error(t("Please enter article title"));
        return;
      }
      if (!descriptionData || !descriptionData.trim()) {
        messageApi.error(t("Please add article content"));
        return;
      }
      if (!imageUrl) {
        messageApi.error(t("Please upload an image"));
        return;
      }

      const lang = localStorage.getItem("lang") || i18n.language || "en";
      const isArabic = lang.toLowerCase().startsWith("ar");

      const payloadBody = isArabic
        ? {
            arabicTitle: articletitle,
            arabicBody: { content: descriptionData },
          }
        : { title: articletitle, body: { content: descriptionData } };

      if (detail?.id) {
        // Update
        await updateArticle({
          variables: {
            updateArticleId: detail.id,
            input: {
              ...payloadBody,
              image: imageUrl,
              isArabic,
            },
          },
        });
      } else {
        // Create
        await createArticle({
          variables: {
            input: {
              ...payloadBody,
              image: imageUrl,
              isArabic,
            },
          },
        });
      }

      // Navigation happens in onCompleted callback after delay
    } catch (err) {
      console.error(err);
      messageApi.error(t("Failed to save article"));
    }
  };

  // don't block entire UI when querying — show spinner only while fetching article
  if (loading) {
    return (
      <Flex justify="center" align="center" className="h-200">
        <Spin size="large" />
      </Flex>
    );
  }

  // helpful computed flags for button states
  const isMutating = creating || updating;
  const saveDisabled = uploading || isMutating;

  return (
    <>
      {contextHolder}
      <Flex vertical gap={20}>
        <Flex vertical gap={25}>
          <Breadcrumb
            separator={
              <Text className="text-gray">
                <RightOutlined className="fs-10" />
              </Text>
            }
            items={[
              {
                title: (
                  <Text
                    className="fs-13 text-gray cursor"
                    onClick={() => navigate("/articles")}
                  >
                    {t("Article")}
                  </Text>
                ),
              },
              {
                title: (
                  <Text className="fw-500 fs-13 text-black">
                    {detail
                      ? detail.title || t("Edit Article")
                      : t("Add a New Article")}
                  </Text>
                ),
              },
            ]}
          />
        </Flex>

        <Flex justify="space-between" align="center">
          <Flex gap={15} align="center">
            <Button
              aria-labelledby="Arrow left"
              className="border0 p-0 bg-transparent"
              onClick={() => navigate("/articles")}
            >
              {isArabic ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
            </Button>
            <Title level={4} className="m-0">
              {detail
                ? detail.title || t("Edit Article")
                : t("Add a New Article")}
            </Title>
          </Flex>
          <Flex gap={5} align="center">
            <Button
              onClick={() => navigate("/articles")}
              aria-labelledby="Cancel"
              type="button"
              className="btncancel text-black border-gray"
            >
              {t("Cancel")}
            </Button>

            <Button
              onClick={() => form.submit()}
              loading={isMutating}
              disabled={saveDisabled}
              aria-labelledby="submit button"
              type="button"
              className="btnsave border0 text-white brand-bg"
            >
              {detail ? t("Update") : t("Save")}
            </Button>
          </Flex>
        </Flex>

        <Card className="radius-12 border-gray">
          <Title level={5} className="mt-0">
            {t("Article Details")}
          </Title>
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            requiredMark={false}
          >
            <Row gutter={[0, 16]}>
              <Col span={24}>
                <MyInput
                  label={t("Article Title")}
                  name="articletitle"
                  required
                  message={t("Please enter article title")}
                  placeholder={t("Enter Title")}
                />
              </Col>

              <Col span={24}>
                {imageUrl && showImage ? (
                  <div className="position-relative w-100 inline-block">
                    <img
                      src={imageUrl}
                      className="radius-12 object-cover object-top w-100 h-400"
                      fetchPriority="high"
                      alt="article"
                    />
                    <Button
                      size="small"
                      shape="circle"
                      danger
                      onClick={() => setShowImage(false)}
                      className="text-white cross-position"
                      aria-labelledby="Close"
                    >
                      ×
                    </Button>
                  </div>
                ) : (
                  <SingleFileUpload
                    label={
                      <Flex vertical>
                        <Title level={5} className="m-0 fw-500">
                          {t("Article Image")}
                        </Title>
                        <Text className="text-gray">
                          {t(
                            "Accepted formats: JPEG, JPG & PNG, Max size: 5MB per file. Aspect Ratio: 1:1."
                          )}
                        </Text>
                      </Flex>
                    }
                    form={form}
                    name={"uploadcr"}
                    title={t("Upload")}
                    multiple={false}
                    onUpload={uploadFileToServer}
                    disabled={uploading}
                  />
                )}
              </Col>

              <Col span={24} className="my-3">
                <EditorDescription
                  label={t("Article Content")}
                  descriptionData={descriptionData}
                  onChange={handleDescriptionChange}
                />
              </Col>
            </Row>
          </Form>
        </Card>
      </Flex>
    </>
  );
};

export { AddArticle };
