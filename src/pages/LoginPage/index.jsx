import { Form, Button, Typography, Row, Col, Divider, Checkbox, Flex, Image } from "antd";
import { NavLink,useLocation } from "react-router-dom";
import { message } from "antd";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../../graphql/mutation/login";
import { useNavigate } from "react-router-dom";
import { MyInput } from "../../components";

const { Title, Paragraph } = Typography;

const LoginPage = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const [messageApi, contextHolder] = message.useMessage();
    const [loginUser, { loading, error }] = useMutation(LOGIN);
    const [form] = Form.useForm();

    const handleFinish = async (values) => {
        try {
          const { email, password } = values;
          const { data } = await loginUser({ variables: { email, password } });
      
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

    return (
        <>
            {contextHolder}
            <Row className="signup-page" align={"middle"}>
                <Col xs={24} sm={24} md={14} lg={16} className="signup-form-container">
                    <div className="form-inner">
                        <NavLink to={"/"}>
                            <div className="logo">
                                <img src="/assets/images/logo-1.png" style={{ height: "70px" }} />
                            </div>
                        </NavLink>

                        <Title level={3} className="mb-1">Welcome Back, Admin</Title>
                        <Paragraph>
                            Please Sign in to access your admin dashboard and manage platform activities.
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
                                <NavLink to={"/forgotpass"} className="fs-13 text-brand">
                                    Forget Password?
                                </NavLink>
                            </Flex>
                            <Button htmlType="submit" type="primary" className="btnsave bg-dark-blue fs-16" block 
                                // loading={loading}
                            >
                                Signin
                            </Button>
                        </Form>
                    </div>
                </Col>
                <Col xs={0} md={10} lg={8} className="signup-visual-container">
                    <Flex vertical justify="space-between" className="h-100">
                        <Flex vertical justify="center" align="center" className="logo-sp">
                            <Image src="/assets/images/logo.png" width={200} preview={false} />
                            <Title level={5} className="m-0 text-white text-center">
                                Shorten the path
                            </Title>
                        </Flex>
                        <div className="bg-shade">
                            <img src="/assets/images/login.gif" alt="Signup Visual" style={{ width: "100%", opacity: 0.7 }} />
                        </div>
                    </Flex>
                </Col>
            </Row>
        </>
    );
};

export { LoginPage };
