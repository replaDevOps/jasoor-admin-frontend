import { useState } from 'react';
import { Row, Col, Button, Flex,Spin, message } from 'antd';
import { AddNotification, ArticleCards, DeleteModal, ModuleTopHeading } from '../../components';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {DELETE_ARTICLE} from '../../graphql/mutation/mutations'
import { useMutation } from "@apollo/client";
import { t } from 'i18next';

const ArticlePage = () => {
    const [ visible, setVisible ] = useState(false)
    const [ viewnotify, setViewNotify ] = useState(null)
    const [ edititem, setEditItem ] = useState(null)
    const [ deleteitem, setDeleteItem ] = useState(null)
    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage();
    const [deleteArticle, { loading: deleting }] = useMutation(DELETE_ARTICLE);
    const handleDelete = async () => {
        if (!deleteitem) return;
        try {
            await deleteArticle({ variables: { deleteArticleId: deleteitem } });
            messageApi.success('FAQ deleted successfully');
            setDeleteItem(null);
            refetch(); // refresh the FAQ list
        } catch (err) {
          console.error(err);
          messageApi.error('Failed to delete FAQ');
        }
    };
    if (deleting) {
        return (
            <Flex justify="center" align="center" className='h-200'>
                <Spin size="large" />
            </Flex>
        );
    }
    return (
        <>
        {contextHolder}
            <Row gutter={[24,24]}>
                <Col span={24}>
                    <Flex justify='space-between'>
                        <ModuleTopHeading level={4} name={t('Articles')} />
                        <Button aria-labelledby='Add New Article' type='primary' className='btnsave' onClick={()=>navigate('/articles/add')}> 
                            <PlusOutlined /> {t("Add New Articles")}
                        </Button>
                    </Flex>
                </Col>
                <Col span={24}>
                    <ArticleCards setDeleteItem={setDeleteItem} onDelete={handleDelete} />
                </Col>
            </Row>
            <AddNotification 
                visible={visible}
                viewnotify={viewnotify}
                edititem={edititem}
                onClose={()=>{setVisible(false);setViewNotify(null);setEditItem(null)}}
            />
            <DeleteModal 
                visible={deleteitem}
                onClose={()=>setDeleteItem(false)}
                title='Are you sure?'
                subtitle='This action cannot be undone. Are you sure you want to delete this article?'
                type='danger'
                onConfirm={(refetch) => handleDelete(refetch)}
                loading={deleting}
            />
        </>
    )
}

export { ArticlePage }; 