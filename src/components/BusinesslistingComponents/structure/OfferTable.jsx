import { Card, Flex, Table, Typography } from 'antd'
import { offerData, offertableColumn } from '../../../data'

const { Title } = Typography
const OfferTable = () => {
    return (
        <Card className='radius-12 border-gray'>
            <Flex vertical gap={10}>
                <Title level={5} className="m-0">
                    Offer
                </Title>
                <Table
                    size="large"
                    columns={offertableColumn}
                    dataSource={offerData}
                    className="pagination table table-cs"
                    showSorterTooltip={false}
                    scroll={{ x: 500 }}
                    rowHoverable={false}
                    pagination={false}
                    // pagination={{
                    //     hideOnSinglePage: true,
                    //     total: 12,
                    //     // pageSize: pagination?.pageSize,
                    //     // defaultPageSize: pagination?.pageSize,
                    //     // current: pagination?.pageNo,
                    //     // size: "default",
                    //     // pageSizeOptions: ['10', '20', '50', '100'],
                    //     // onChange: (pageNo, pageSize) => call(pageNo, pageSize),
                    //     showTotal: (total) => <Button className='brand-bg'>Total: {total}</Button>,
                    // }}
                />
            </Flex>
        </Card>
    )
}

export {OfferTable}