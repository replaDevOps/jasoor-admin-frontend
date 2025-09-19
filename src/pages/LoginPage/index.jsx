import { Form, Button, Typography, Row, Col, Divider, Checkbox, Flex, Image, Space, Dropdown } from "antd";
import { NavLink } from "react-router-dom";
import { message } from "antd";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../../graphql/mutation/login";
import { useNavigate } from "react-router-dom";
import { MyInput } from "../../components";
import { useState } from "react";
import { DownOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const LoginPage = () => {
    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage();
    const [loginUser, { loading, error }] = useMutation(LOGIN);
    const [form] = Form.useForm();
    const [selectedLang, setSelectedLang] = useState({
        key: "1",
        label: "EN",
        icon: "assets/icons/en.png",
    });

    const handleFinish = async (values) => {
        try {
          const { email, password } = values;
          const { data,error } = await loginUser({ variables: { email, password } });
      
          if (data?.login?.token) {
            // store token/id
            localStorage.setItem("accessToken", data.login.token);
            localStorage.setItem("userId", data.login.user.id);      
            messageApi.success("Login successful!");
            navigate("/")
            // compute destination safely (it could be a string or Location object)
          } else {
            messageApi.error("Login failed: Invalid credentials");
          }
        } catch (error) {
          console.error("Login error:", error);
          messageApi.error("Login failed: Something went wrong");
        }
      };
console.log("error",error)
      const lang = [
            {
              key: "1",
              label: (
                <Space>
                  <Image src="assets/icons/en.png" width={20} alt="English" fetchPriority="high" preview={false} />
                  <Text className='fs-13'>EN</Text>
                </Space>
              ),
              onClick: () =>
                setSelectedLang({ key: "1", label: "EN", icon: "assets/icons/en.png" }),
            },
            {
              key: "2",
              label: (
                <Space>
                  <Image src="assets/icons/ar.png" width={20} alt="Arabic" fetchPriority="high" preview={false} />
                  <Text className='fs-13'>AR</Text>
                </Space>
              ),
              onClick: () =>
                setSelectedLang({ key: "2", label: "AR", icon: "assets/icons/ar.png" }),
            },
          ];

    return (
        <>
            {contextHolder}
            <Row className="signup-page" align={"middle"}>
                <Col xs={24} sm={24} md={12} lg={16} className="signup-form-container">
                    <div className="form-inner">
                        <NavLink to={"/"}>
                            <div className="logo">
                                <img src="/assets/images/logo-1.png" alt="jusoor logo" width={70} fetchPriority="high" />
                            </div>
                        </NavLink>

                        <Title level={3} className="mb-1">Welcome Back, Admin</Title>
                        <Paragraph>
                            Please Sign In to access your admin dashboard and manage platform activities.
                        </Paragraph>
                        <Divider />

                        <Form layout="vertical" form={form} onFinish={handleFinish} requiredMark={false}>
                            <MyInput 
                                label="Email Address" 
                                name="email" 
                                required 
                                message="Please enter email address" 
                                placeholder="Enter Email Address" 
                            />
                            <MyInput 
                                label="Password" 
                                type="password" 
                                name="password" 
                                required 
                                message="Please enter password" 
                                placeholder="Enter Password" 
                            />
                            <Flex justify="space-between" className="mb-3">
                                <Checkbox>Remember Me</Checkbox>
                                <NavLink to={"/forgotpassword"} className="fs-13 text-brand">
                                    Forget Password?
                                </NavLink>
                            </Flex>
                            <Button aria-labelledby='Sign In' htmlType="submit" type="primary" className="btnsave bg-dark-blue fs-16" block 
                                // loading={loading}
                            >
                                Sign In
                            </Button>
                        </Form>
                    </div>
                </Col>
                <Col xs={0} md={12} lg={8} className="signup-visual-container">
                    <Dropdown menu={{ items: lang }} trigger={["click"]} className="lang-dropdown">
                        <Button
                            onClick={(e) => e.preventDefault()}
                            className="bg-transparent btn-outline btn p-2 border-white"
                            aria-labelledby='language'
                        >
                            <Space align="center">
                                <Image
                                    src={selectedLang.icon}
                                    width={20}
                                    alt={selectedLang.label}
                                    preview={false}
                                    fetchPriority="high"
                                />
                                <Text className="text-white fs-13">{selectedLang.label}</Text>
                                <DownOutlined className="text-white" />
                            </Space>
                        </Button>
                    </Dropdown>
                    <Flex vertical justify="space-between" className="h-100 minheight-100vh">
                        <Flex vertical justify="center" align="center" className="logo-sp">
                            <Image src="/assets/images/logo.webp" alt='jusoor-logo' fetchPriority="high" width={200} preview={false} />
                            <Title level={5} className="m-0 text-white text-center">
                                Shorten the path
                            </Title>
                        </Flex>
                        <div className="bg-shade">
                            <img src="/assets/images/login.gif" alt="signin gif" className="w-100 opacity-7" fetchPriority="high" />
                        </div>
                    </Flex>
                </Col>
            </Row>
        </>
    );
};

export { LoginPage };
