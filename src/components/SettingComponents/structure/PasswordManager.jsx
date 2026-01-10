import { Button, Card, Col, Flex, Form, Row, Typography } from "antd";
import { MyInput } from "../../Forms";
import { CHANGE_ADMIN_PASSWORD } from "../../../graphql/mutation";
import { useMutation } from "@apollo/client";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import Cookie from "js-cookie";

const { Title } = Typography;
const PasswordManager = () => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const userId = Cookie.get("userId");
  const [form] = Form.useForm();

  const [changePassword, { loading }] = useMutation(CHANGE_ADMIN_PASSWORD, {
    onCompleted: () => {
      messageApi.success(t("Password changed successfully!"));
      form.resetFields();
    },
    onError: (err) => {
      messageApi.error(t(err.message) || t("Failed to change password."));
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
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.resolve();
                      }
                      if (value.length < 8) {
                        return Promise.reject(
                          new Error(t("Password must be at least 8 characters"))
                        );
                      }
                      const pattern =
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/;
                      if (!pattern.test(value)) {
                        return Promise.reject(
                          new Error(
                            t(
                              "Password must contain at least one uppercase, lowercase, number and a special character"
                            )
                          )
                        );
                      }
                      return Promise.resolve();
                    },
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
