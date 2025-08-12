import { Card, Col, Flex, Row, Table, Typography } from 'antd'

const { Title } = Typography
const TableContent = ({columns,data,x=500}) => {
    return (
        <Table
            size="large"
            columns={columns}
            dataSource={data}
            className="pagination table table-cs"
            showSorterTooltip={false}
            scroll={{ x: x }}
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
    )
}

export {TableContent}