import { Form, Button, Typography, Row, Col, Divider, Checkbox, Flex, Image, Space, Dropdown } from "antd";
import { NavLink } from "react-router-dom";
import { message } from "antd";
import { useMutation,useLazyQuery } from "@apollo/client";
import { LOGIN } from "../../graphql/mutation/login";
import {GET_SETTINGS} from '../../graphql/query';
import { useNavigate } from "react-router-dom";
import { MyInput } from "../../components";
import { useEffect, useState, useContext } from "react";
import { DownOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/AuthContext";

const { Title, Text, Paragraph } = Typography;
const LoginPage = () => {
    const {t, i18n}= useTranslation()
    const navigate = useNavigate()
    const { login } = useContext(AuthContext);
    const [messageApi, contextHolder] = message.useMessage();
    const [loginUser] = useMutation(LOGIN);
    const [form] = Form.useForm();
    const [selectedLang, setSelectedLang] = useState({
        key: "1",
        label: "EN",
        icon: "assets/icons/en.png",
    })
    const [getSeetings] = useLazyQuery(GET_SETTINGS);
          
    const [language, setLanguage]= useState()
    useEffect(()=>{
        let lang= localStorage.getItem("lang")
        setLanguage(lang  || 'en')
        i18n.changeLanguage(lang  || 'en')
        if(lang === "ar"){
            setSelectedLang({
                key: "2",
                label: "AR",
                icon: "assets/icons/ar.png",
            })
        }else{
            setSelectedLang({
                key: "1",
                label: "EN",
                icon: "assets/icons/en.png",
            })
        }
    }, [])

    const handleFinish = async (values) => {
        try {
        const email = values.email.toLowerCase(); // convert to lowercase
        const password = values.password;
          const { data } = await loginUser({ variables: { email, password } });
      
          if (data?.login?.token && data?.login?.refreshToken) {
            // Use the new token management system
            login(data.login.token, data.login.refreshToken, data.login.user);
            
            const settingsResult = await getSeetings();
            const backendLang = settingsResult?.data?.getSetting?.language?.toLowerCase();

            if (backendLang) {
                localStorage.setItem("lang", backendLang);
                i18n.changeLanguage(backendLang);
                setLanguage(backendLang);
                setSelectedLang(
                backendLang === "ar"
                    ? { key: "2", label: "AR", icon: "assets/icons/ar.png" }
                    : { key: "1", label: "EN", icon: "assets/icons/en.png" }
                );
            }

            messageApi.success("Login successful!");
            navigate("/")
          } else {
            messageApi.error("Login failed: Invalid credentials");
          }
        } catch (error) {
          console.error("Login error:", error);
          messageApi.error("Login failed: Something went wrong");
        }
    };
    
    const handleChange= (value)=>{
        setLanguage(value)
        localStorage.setItem("lang", value)
        i18n?.changeLanguage(value)
        window.location.href='/'
    }

    const lang = [
        {
            key: "1",
            label: (
            <Space>
                <Image src="assets/icons/en.png" width={20} alt="English" fetchPriority="high" preview={false} />
                <Text className='fs-13'>EN</Text>
            </Space>
            ),
            onClick: () =>{
            setSelectedLang({ key: "1", label: "EN", icon: "assets/icons/en.png" }),
            setLanguage("en")
            handleChange("en")
            }
        },
        {
            key: "2",
            label: (
            <Space>
                <Image src="assets/icons/ar.png" width={20} alt="Arabic" fetchPriority="high" preview={false} />
                <Text className='fs-13'>AR</Text>
            </Space>
            ),
            onClick: () =>{
            setSelectedLang({ key: "2", label: "AR", icon: "assets/icons/ar.png" }),
            setLanguage("ar")
            handleChange("ar")  
            }
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

                        <Title level={3} className="mb-1">{t("Welcome Back, Admin")}</Title>
                        <Paragraph>
                            {t("Please Sign In to access your admin dashboard and manage platform activities.")}
                        </Paragraph>
                        <Divider />

                        <Form layout="vertical" form={form} onFinish={handleFinish} requiredMark={false}>
                            <MyInput 
                                label={t("Email Address")}
                                name="email" 
                                required 
                                message="Please enter email address" 
                                placeholder={t("Enter Email Address" )}
                            />
                            <MyInput 
                                label={t("Password")}
                                type="password" 
                                name="password" 
                                required 
                                message="Please enter password" 
                                placeholder={t("Enter Password")}
                            />
                            <Flex justify="space-between" className="mb-3">
                                <Checkbox>{t("Remember Me")}</Checkbox>
                                <NavLink to={"/forgotpassword"} className="fs-13 text-brand">
                                    {t("Forgot Password?")}
                                </NavLink>
                            </Flex>
                            <Button aria-labelledby='Sign In' htmlType="submit" type="primary" className="btnsave bg-dark-blue fs-16" block 
                                // loading={loading}
                            >
                                {t("Sign In")}
                            </Button>
                        </Form>
                    </div>
                </Col>
                <Col xs={0} md={12} lg={8} className="signup-visual-container">
                    <Dropdown 
                        menu={{ items: lang }} 
                        trigger={["click"]} 
                        className="lang-dropdown"
                        onChange={handleChange}
                        value={language}
                    >
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
