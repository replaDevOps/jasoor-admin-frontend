import React from 'react'
import { toppagesData } from '../../../../data'
import { Card, Flex, Table } from 'antd'
import { ModuleTopHeading } from '../../../PageComponents'

const TopPagesTable = () => {

    const Column = [
        {
            title:'Page Name',
            dataIndex: 'pagename'
        },
        {
            title:'Views',
            dataIndex: 'views'
        },
    ]
    

    return (
        <Card className='radius-12 border-gray h-100'>
            <Flex vertical gap={14}>
                <ModuleTopHeading level={4}  name='Top Pages' />
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