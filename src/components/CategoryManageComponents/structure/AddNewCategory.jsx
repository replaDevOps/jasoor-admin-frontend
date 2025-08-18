import { Button, Card, Col, Flex, Form, Row, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { MyInput, MySelect, SingleFileUpload } from '../../Forms';
import { categoriesItems } from '../../../shared';
import { categoryData, categoryStatsProfColumn, categorystatsProfData } from '../../../data';
import { useEffect, useState } from 'react';
import { TableContent } from '../../BusinesslistingComponents';
import { CREATE_CATEGORY } from '../../../graphql/mutation/mutations';
import { useMutation } from '@apollo/client';
import { message,Spin } from "antd";

const mapDensity = (value) => {
    if (!value) return null;
  
    switch(value) {
      case 1:
      case "1":
      case "Low":
      case "LOW":
        return "LOW";
      case 2:
      case "2":
      case "Medium":
      case "MEDIUM":
        return "MEDIUM";
      case 3:
      case "3":
      case "High":
      case "HIGH":
        return "HIGH";
      default:
        return null;
    }
};

const { Text, Title } = Typography;

const AddNewCategory = () => {
    const navigate = useNavigate()
    const {id} = useParams()
    const [form] = Form.useForm();
    const editdata = categoryData?.find((list)=>list?.key === Number(id))
    const [categoryProfData, setCategoryProfData] = useState(categorystatsProfData);
    const [documents, setDocuments] = useState( { title: "Category Icon", fileName: "", fileType: "", filePath: "" }, );
    const [createCategory, { loading: createLoading }] = useMutation(CREATE_CATEGORY, {
        onCompleted: (data) => {
            message.success("Category created successfully");
            navigate("/categorymanagement");
        },
        onError: (error) => {
            message.error(`Error creating category: ${error.message}`);
        },
    });

    const transformGrowthRecords = (data) => {
        return data.map((row) => ({
          regionName: row.regionname,
          populationDensity: mapDensity(row.populationdensity),
          industryDemand: mapDensity(row.industrydemand),
          years: [
            { year: 2021, localBusinessGrowth: parseFloat(row.value2021 || 0) },
            { year: 2022, localBusinessGrowth: parseFloat(row.value2022 || 0) },
            { year: 2023, localBusinessGrowth: parseFloat(row.value2023 || 0) },
            { year: 2024, localBusinessGrowth: parseFloat(row.value2024 || 0) },
          ],
        }));
      };

    useEffect(()=>{
        if(id && editdata){
            form.setFieldsValue({
                title: editdata?.categoryname,
                category: editdata?.businesstype
            })
        }else{
            form.resetFields()
        }
    },[id,editdata])

    const handleInputChange = (value, index, key) => {
        const updated = [...categoryProfData];
        updated[index][key] = value;
        setCategoryProfData(updated);
    };

    const onFinish = (values) => {
        console.log("Form values:", values);
        console.log("Category stats data:", categoryProfData);
      
        const input = {
          name: values.title,
          icon: documents.filePath || null, // from uploaded file
          isDigital: values.category === "digital" ? true : false, // adjust based on your dropdown
          growthRecords: transformGrowthRecords(categoryProfData),
        };
      
      
        createCategory({ variables: { input } });
      };
    const handleSingleFileUpload = async (file) => {
        try {
          let processedFile = file;
      
          // Prepare FormData
          const formData = new FormData();
          formData.append("file", processedFile);
      
          // Upload to server
          const response = await fetch("https://220.152.66.148.host.secureserver.net/upload", {
            method: "POST",
            body: formData,
          });
      
          if (!response.ok) {
            throw new Error("Upload failed");
          }
      
          const result = await response.json();
          console.log("Upload successful:", result);
          // set it to documents state
          setDocuments({
            title: "Category Icon",
            fileName: processedFile.name,
            fileType: processedFile.type,
            filePath: result.fileUrl || result.url, // Assuming your API returns the file URL
          });
      
          // Return file URL or whatever your API returns
          return result.fileUrl || result.url;
        } catch (error) {
          console.error("Error uploading file:", error);
          return null;
        }
      };

    return (
        <>
            <Flex vertical gap={25}>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: (
                                <Text className="cursor fs-13 text-gray" onClick={() => navigate("/categorymanagement")}>
                                    Categories Management
                                </Text>
                            ),
                        },
                        {
                            title: <Text className="fw-500 fs-14 text-black">
                                {editdata?.categoryname ? editdata?.categoryname : 'Add New Category' }
                            </Text>,
                        },
                    ]}
                />
                <Flex gap={10} justify='space-between' align="center">
                    <Flex gap={10} align="center">
                        <Button className="border0 p-0 bg-transparent" onClick={() => navigate("/categorymanagement")}>
                            <ArrowLeftOutlined />
                        </Button>
                        <Title level={4} className="fw-500 m-0">
                            {editdata?.categoryname ? editdata?.categoryname : 'Add New Category' }
                        </Title>
                    </Flex>
                    <Flex gap={10}>
                        <Button className="btncancel" onClick={() => navigate("/categorymanagement")}>
                            Cancel      
                        </Button>
                        <Button className="btnsave brand-bg border0 text-white" onClick={()=>form.submit()}>
                            {
                                id ? 'Update' : 'Save'
                            }
                        </Button>
                    </Flex>
                </Flex>
                <Card className="radius-12 border-gray">
                    <Form layout="vertical" form={form} onFinish={onFinish} requiredMark={false}>
                        <Row gutter={[24, 14]}>
                            <Col span={24}>
                                <Title level={5} className="m-0">
                                    Category Details
                                </Title>
                            </Col> 
                            <Col xs={24} sm={24} md={12}>
                                <MyInput
                                    label="Business Title"
                                    name="title"
                                    required
                                    message="Please enter title"
                                    placeholder="Write business name"
                                />
                            </Col>
                            <Col xs={24} sm={24} md={12}>
                                <MySelect
                                    label="Business Category"
                                    name="category"
                                    required
                                    message="Choose business category"
                                    options={categoriesItems}
                                    placeholder="Choose business category"
                                />                        
                            </Col>  
                            <Col span={24}>
                                <SingleFileUpload
                                    label={
                                        <Flex vertical>
                                            <Title level={5} className="m-0 fw-500">
                                                Category Icon
                                            </Title>
                                            <Text className="text-gray">
                                                Accepted formats: JPEG, JPG & PNG, Max size: 5MB per file. Aspect Ratio: 1:1.
                                            </Text>
                                        </Flex>
                                    }   
                                    form={form}
                                    name={'uploadcr'}
                                    title={'Upload'}
                                    onUpload={async (file) => {
                                        const fileUrl = await handleSingleFileUpload(file);
                                        if (fileUrl) {
                                          form.setFieldsValue({ uploadcr: fileUrl });
                                        }
                                      }}
                                    // uploading={uploading}
                                    multiple={false}
                                />
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card className='radius-12 border-gray'>
                    <Flex vertical gap={10} className='alignStart'>
                        <Title level={5} className="m-0">
                            Category Stats & Profitability
                        </Title>
                        <TableContent x={2000} data={categoryProfData} columns={categoryStatsProfColumn(handleInputChange)} />
                    </Flex>
                </Card>
            </Flex>
        </>
    );
};

export { AddNewCategory };
