import { Button, Card, Col, Flex, Form, Row, Typography } from "antd";
import { MyInput, MySelect } from "../../Forms";
import { useEffect } from "react";
import { UPDATE_SETTING, CREATE_SETTINGS } from "../../../graphql/mutation/";
import { GET_SETTINGS } from "../../../graphql/query";
import { useMutation } from "@apollo/client";
import { message } from "antd";
import { t } from "i18next";

const { Title } = Typography;
const CommissionSocial = ({ comssionSocial }) => {
  const langItems = [
    {
      id: "EN",
      name: "English",
    },
    {
      id: "AR",
      name: "Arabic",
    },
  ];
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  useEffect(() => {
    if (comssionSocial) {
      form.setFieldsValue({
        rate: comssionSocial.commissionRate,
        facebook: comssionSocial.facebook,
        instagram: comssionSocial.instagram,
        whatsapp: comssionSocial.whatsapp,
        twitter: comssionSocial.twitter,
        email: comssionSocial.email,
        language: comssionSocial.language === "EN" ? "English" : "Arabic",
      });
    }
  }, [comssionSocial, form]);

  const [changeSetting, { loading: updating }] = useMutation(UPDATE_SETTING, {
    refetchQueries: [{ query: GET_SETTINGS }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      messageApi.success(t("Settings updated successfully!"));
    },
    onError: (err) => {
      messageApi.error(err?.message || t("Failed to update settings."));
    },
  });

  const [createSetting, { loading: creating }] = useMutation(CREATE_SETTINGS, {
    refetchQueries: [{ query: GET_SETTINGS }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      messageApi.success("Settings created successfully!");
    },
    onError: (err) => {
      messageApi.error(err?.message || "Failed to create settings.");
    },
  });

  const onFinish = (values) => {
    const commissionRate = values.rate ? String(values.rate) : null;
    const facebook = values.facebook || null;
    const instagram = values.instagram || null;
    const whatsApp = values.whatsapp || null;
    const twitter = values.twitter || null;
    const email = values.email || null;
    const language = values.language || null;
    if (comssionSocial && comssionSocial?.id) {
      changeSetting({
        variables: {
          updateSettingsId: comssionSocial.id,
          commissionRate,
          facebook,
          instagram,
          whatsApp,
          twitter,
          email,
          language: language === "Arabic" ? "AR" : "EN",
        },
      });
    } else {
      createSetting({
        variables: {
          commissionRate: commissionRate || "",
          banks: [],
          email,
          x: twitter || null,
          whatsApp,
          instagram,
          faceBook: facebook || null,
          language,
        },
      });
    }
  };

  const isLoading = updating || creating;

  return (
    <>
      {contextHolder}
      <Card
        className="radius-12 border-gray"
        actions={[
          <Flex justify="end" className="px-3" key="save-action">
            <Button
              aria-labelledby="Save Changes"
              className="btnsave bg-brand"
              type="primary"
              onClick={() => form.submit()}
              loading={isLoading}
            >
              {t("Save Changes")}
            </Button>
          </Flex>,
        ]}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          requiredMark={false}
        >
          <Title level={5} className="mt-0 mb-3 fw-600">
            {t("System Language")}
          </Title>
          <MySelect
            label={t("Language")}
            name="language"
            required
            message={t("Choose language")}
            options={langItems}
            placeholder={t("Choose language")}
          />
          <Title level={5} className="my-3 fw-600">
            {t("Commission Rate")}
          </Title>
          <Row className="mb-3">
            <Col span={24}>
              <MyInput
                label={t("Commission rate")}
                name="rate"
                required
                message={t("Please enter commission rate")}
                placeholder={t("Enter commission rate")}
                addonAfter={"%"}
              />
            </Col>
          </Row>
          <Title level={5} className="mt-0 mb-3 fw-600">
            {t("Social Links")}
          </Title>
          <Row gutter={12}>
            <Col lg={{ span: 12 }} md={{ span: 12 }} span={24}>
              <MyInput label={t("Facebook")} name="facebook" />
            </Col>
            <Col lg={{ span: 12 }} md={{ span: 12 }} span={24}>
              <MyInput label={t("Instagram")} name="instagram" />
            </Col>
            <Col lg={{ span: 12 }} md={{ span: 12 }} span={24}>
              <MyInput label={t("WhatsApp")} name="whatsapp" />
            </Col>
            <Col md={{ span: 12 }} span={24}>
              <MyInput label={t("X")} name="twitter" />
            </Col>
            <Col md={{ span: 12 }} span={24}>
              <MyInput
                label={t("Email Address")}
                name="email"
                required
                disabled
              />
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export { CommissionSocial };
