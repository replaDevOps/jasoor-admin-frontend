import { Flex, Select, Pagination } from 'antd';

const CustomPagination = ({
  total,
  pageSize,
  current,
  onPageChange,
  pageSizeOptions = [10, 20, 50, 100],
}) => {
  if (!total || total <= pageSize) return null;

  return (
    <Flex justify="space-between" align="center" className="px-2 py-4">
      <Flex align="center" gap={8}>
        <span className="text-gray-500">Rows per page:</span>
        <Select
          value={pageSize}
          onChange={(value) => onPageChange(1, value)}
          style={{ width: 80 }}
          options={pageSizeOptions.map((size) => ({
            value: size,
            label: size.toString(),
          }))}
          className="filter-pag"
        />
      </Flex>
      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onPageChange}
        showLessItems
        className="pagination"
      />
    </Flex>
  );
};

export { CustomPagination };
