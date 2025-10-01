import { Card, Flex, Table } from 'antd'
import { ModuleTopHeading } from '../../../PageComponents'
import axios from "axios";
import { useEffect, useState } from "react";
import { t } from 'i18next';

const TopPagesTable = () => {
    const [toppagesData, setTopPagesData] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          try {
            const { data } = await axios.get(
              `https://verify.jusoor-sa.co/api/toppages`
            );
    
            if (data.success) {
              setTopPagesData(data.data); // backend already returns [{key, pagename, views}]
            }
          } catch (err) {
            console.error("Failed to load analytics:", err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, []);
    
      const Column = [
        {
            title:t('Page Name'),
            dataIndex: 'pagename'
        },
        {
            title:t('Views'),
            dataIndex: 'views'
        },
    ]
    return (
        <Card className='radius-12 border-gray h-100'>
            <Flex vertical gap={14}>
                <ModuleTopHeading level={4}  name={t('Top Pages')} />
                <Table
                    size='large'
                    columns={Column}
                    dataSource={toppagesData}
                    className='pagination table-cs table'
                    showSorterTooltip={false}
                    scroll={{ x: 500 }}
                    rowHoverable={false}
                    pagination={false}
                />
            </Flex>
        </Card>
    )
}

export {TopPagesTable}