import { Flex, Select, Pagination } from 'antd';
import { t } from 'i18next';

const CustomPagination = ({
  total,
  pageSize,
  current,
  onPageChange,
  pageSizeOptions = [10, 20, 30, 50], // includes 30 per your request
}) => {
  if (!total || total <= pageSize) return null;

  return (
    <Flex justify="space-between" align="center" className="px-2 py-4">
      <Flex align="center" gap={8}>
        <span className="text-gray-500">{t("Rows per page")}:</span>
        <Select
          value={pageSize}
          onChange={(value) => {
            // when page size changes -> reset to page 1 with new pageSize
            onPageChange(1, value);
          }}
          options={pageSizeOptions.map((size) => ({
            value: size,
            label: size.toString(),
          }))}
          className="filter-pag w-90"
        />
      </Flex>
      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        // AntD Pagination onChange signature is (page, pageSize)
        onChange={(page, newPageSize) => onPageChange(page, newPageSize)}
        showLessItems
        className="pagination"
      />
    </Flex>
  );
};

export { CustomPagination };
