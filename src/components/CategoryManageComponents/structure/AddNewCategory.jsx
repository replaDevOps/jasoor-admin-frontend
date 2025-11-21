import { Button, Card, Col, Flex, Form, Row, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { MyInput, MySelect, SingleFileUpload } from '../../Forms';
import { categoriesItems } from '../../../shared';
import { categorystatsProfData,categoryStatsProfColumn } from '../../../data';
import { useEffect, useState } from 'react';
import { UPDATE_CATEGORY, CREATE_CATEGORY} from '../../../graphql/mutation/mutations';
import {GET_CATEGORIES_BY_ID} from '../../../graphql/query'
import { useMutation,useQuery } from '@apollo/client';
import { message,Spin } from "antd";
import { TableContent } from '../../BusinesslistingComponents/structure/TableContent';
import { t } from 'i18next';

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
    const [messageApi, contextHolder] = message.useMessage();

    const [form] = Form.useForm();
    const { loading, error, data:category } = useQuery(GET_CATEGORIES_BY_ID, {
        variables: { getCategoryByIdId: id },
        skip: !id, // skip if no id
    });
    const editdata = category?.getCategoryById
    const [categoryProfData, setCategoryProfData] = useState([]);

    // load data from server into state when editing
    useEffect(() => {
        if (id && editdata?.growthRecords) {
            // Editing: map server data
            const mappedData = editdata.growthRecords.map((record, idx) => {
                const yearValues = record.years.reduce((acc, y) => {
                    acc[`value${y.year}`] = y.localBusinessGrowth || 0;
                    return acc;
                }, {});
                return {
                    key: idx + 1,
                    regionname: record.regionName,
                    localbusinessgrowth: record.years?.[0]?.localBusinessGrowth ?? 0,
                    populationdensity: record.populationDensity,
                    industrydemand: record.industryDemand,
                    ...yearValues,
                };
            });
            setCategoryProfData(mappedData);
        } else {
            // Creating: show dummy data
            setCategoryProfData(categorystatsProfData);
        }
    }, [id, editdata]);
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
                title: editdata?.name,
                arabicTitle: editdata?.arabicName,
                category: editdata?.isDigital ? "Digital" : "Physical",
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

    const [updateCategory,{ loading: updating }] = useMutation(UPDATE_CATEGORY, {
        refetchQueries: [
          {
            query: GET_CATEGORIES_BY_ID,
            variables: { getCategoryByIdId: id }, 
          },
        ],
        awaitRefetchQueries: true,
        onCompleted: () => {
            messageApi.success("Stats changed successfully!");
          },
          onError: (err) => {
            messageApi.error(err.message || "Something went wrong!");
          },
    });

    const onFinish = (values) => {   
        const input = {
        ...(id && { id }),
          name: values.title,
          arabicName: values.arabicTitle,
          icon: documents.filePath || null, // from uploaded file
          isDigital: values.category === "Digital Business" ? true : false, // adjust based on your dropdown
          growthRecords: transformGrowthRecords(categoryProfData),
        };
        if(id){
            updateCategory({variables:{ input }})
        }else{
            createCategory({ variables: { input } });
        }
      };
    const handleSingleFileUpload = async (file) => {
        try {
          let processedFile = file;
      
          // Prepare FormData
          const formData = new FormData();
          formData.append("file", processedFile);
      
          // Upload to server
          const response = await fetch("https://verify.jusoor-sa.co/upload", {
            method: "POST",
            body: formData,
          });
      
          if (!response.ok) {
            throw new Error("Upload failed");
          }
      
          const result = await response.json();
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
    if (loading || updating) {
        return (
          <Flex justify="center" align="center" className='h-200'>
            <Spin size="large" />
          </Flex>
        );
    }
    return (
        <>
        {contextHolder}
            <Flex vertical gap={25}>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: (
                                <Text className="cursor fs-13 text-gray" onClick={() => navigate("/categorymanagement")}>
                                    {t("Categories Management")}
                                </Text>
                            ),
                        },
                        {
                            title: <Text className="fw-500 fs-14 text-black">
                                {editdata?.name ? editdata?.name : t('Add New Category') }
                            </Text>,
                        },
                    ]}
                />
                <Flex gap={10} justify='space-between' align="center">
                    <Flex gap={10} align="center">
                        <Button aria-labelledby='Arrow left' className="border0 p-0 bg-transparent" onClick={() => navigate("/categorymanagement")}>
                            <ArrowLeftOutlined />
                        </Button>
                        <Title level={4} className="fw-500 m-0">
                            {editdata?.name ? editdata?.name : t('Add New Category') }
                        </Title>
                    </Flex>
                    <Flex gap={10}>
                        <Button aria-labelledby='Cancel' className="btncancel" onClick={() => navigate("/categorymanagement")}>
                            {t("Cancel")}      
                        </Button>
                        <Button aria-labelledby='submit button' className="btnsave brand-bg border0 text-white" onClick={()=>form.submit()}>
                            {    id ? t('Update') : t('Save')    }
                        </Button>
                    </Flex>
                </Flex>
                <Card className="radius-12 border-gray">
                    <Form layout="vertical" form={form} onFinish={onFinish} requiredMark={false}>
                        <Row gutter={[24, 14]}>
                            <Col span={24}>
                                <Title level={5} className="m-0">
                                    {t("Category Details")}
                                </Title>
                            </Col> 
                            <Col xs={24} sm={24} md={12}>
                                <MyInput
                                    label={t("Category Title")}
                                    name="title"
                                    required
                                    message={t("Please enter title")}
                                    placeholder={t("Write business name")}
                                />
                            </Col>
                            <Col xs={24} sm={24} md={12}>
                                <MySelect
                                    label={t("Business Category")}
                                    name="category"
                                    required
                                    message={t("Choose business category")}  
                                    options={categoriesItems}
                                    placeholder={t("Choose business category")}
                                />                        
                            </Col>  
                            <Col xs={24} sm={24} md={24}>
                                <MyInput
                                    label={t("Arabic Title")}
                                    name="arabicTitle"
                                    required
                                    message={t("Please enter arabic title")}
                                    placeholder={t("Write business name")}
                                />
                            </Col>
                            
                            <Col span={24}>
                            {!editdata?.icon ? (
                            <SingleFileUpload
                                label={
                                <Flex vertical>
                                    <Title level={5} className="m-0 fw-500">
                                    {t("Category Icon")}
                                    </Title>
                                    <Text className="text-gray">
                                    {t("Accepted formats")}: JPEG, JPG & PNG, Max size: 5MB per file. Aspect Ratio: 1:1.
                                    </Text>
                                </Flex>
                                }
                                form={form}
                                name={'uploadcr'}
                                title={t('Upload')}
                                onUpload={async (file) => {
                                const fileUrl = await handleSingleFileUpload(file);
                                if (fileUrl) {
                                    form.setFieldsValue({ uploadcr: fileUrl });
                                }
                                }}
                                multiple={false}
                            />
                            ) : (
                            <img
                                src={editdata?.icon}
                                alt="Category Icon"
                                className='w-80 h-80 object-cover radius-8'
                                fetchPriority="high"
                            />
                            )}

                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card className='radius-12 border-gray'>
                    <Flex vertical gap={10} className='alignStart'>
                        <Title level={5} className="m-0">
                            {t("Category Stats & Profitability")}
                        </Title>
                        <TableContent x={2000} data={categoryProfData} columns={categoryStatsProfColumn(handleInputChange)} />
                    </Flex>
                </Card> 
            </Flex>
        </>
    );
};

export { AddNewCategory };
