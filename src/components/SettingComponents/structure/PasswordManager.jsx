import { Button, Card, Col, Flex, Form, Row, Typography } from "antd";
import { MyInput } from "../../Forms";
import { CHANGE_ADMIN_PASSWORD } from "../../../graphql/mutation";
import { useMutation } from "@apollo/client";
import { message } from "antd";
import { t } from "i18next";
import Cookie from "js-cookie";

const { Title } = Typography;
const PasswordManager = () => {
  const [messageApi, contextHolder] = message.useMessage();
  // get userId from localStorage or context
  const userId = Cookie.get("userId");
  const [form] = Form.useForm();

  const [changePassword, { loading }] = useMutation(CHANGE_ADMIN_PASSWORD, {
    onCompleted: () => {
      messageApi.success(t("Password changed successfully!"));
      form.resetFields();
    },
    onError: (err) => {
      messageApi.error(err.message || t("Failed to change password."));
    },
  });

  const onFinish = (values) => {
    changePassword({
      variables: {
        adminChangePasswordId: userId,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      },
    });
  };

  return (
    <>
      {contextHolder}
      <Card
        className="radius-12 border-gray"
        actions={[
          <Flex justify="end" className="px-3">
            <Button
              aria-labelledby="Save Changes"
              className="btnsave bg-brand"
              type="primary"
              onClick={() => form.submit()}
              loading={loading}
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
            {t("Password Manager")}
          </Title>
          <Row gutter={12}>
            <Col lg={{ span: 8 }} md={{ span: 12 }} span={24}>
              <MyInput
                label={t("Old Password")}
                name="oldPassword"
                type="password"
                required
                message={t("Please enter old password")}
              />
            </Col>
            <Col lg={{ span: 8 }} md={{ span: 12 }} span={24}>
              <MyInput
                label={t("New Password")}
                name="newPassword"
                type="password"
                rules={[
                  { required: true, message: t("Please enter new password") },
                  {
                    min: 8,
                    message: t("Password must be at least 8 characters"),
                  },
                  {
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/,
                    message: t(
                      "Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character"
                    ),
                  },
                ]}
              />
            </Col>
            <Col lg={{ span: 8 }} md={{ span: 12 }} span={24}>
              <MyInput
                label={t("Re-type Password")}
                name="confirmPassword"
                type="password"
                dependencies={["newPassword"]}
                rules={[
                  {
                    required: true,
                    message: t("Please confirm your password"),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(t("The two passwords do not match!"))
                      );
                    },
                  }),
                ]}
              />
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export { PasswordManager };
