import {
  Button, Card, Col, Flex, Form, InputNumber, Modal,
  Popconfirm, Row, Select, Switch, Table, Tag, Typography, message,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

// ── GraphQL ───────────────────────────────────────────────────────────────────

const GET_COMMISSION_BRACKETS = gql`
  query GetCommissionBrackets {
    getCommissionBrackets {
      id
      fromAmount
      toAmount
      type
      percentageValue
      fixedValue
      isActive
      version
      description
    }
  }
`;

const PREVIEW_COMMISSION = gql`
  query PreviewCommission($price: Float!) {
    previewCommission(price: $price)
  }
`;

const CREATE_BRACKET = gql`
  mutation CreateCommissionBracket($input: CommissionBracketInput!) {
    createCommissionBracket(input: $input) { id }
  }
`;

const UPDATE_BRACKET = gql`
  mutation UpdateCommissionBracket($input: UpdateCommissionBracketInput!) {
    updateCommissionBracket(input: $input) { id }
  }
`;

const DELETE_BRACKET = gql`
  mutation DeleteCommissionBracket($id: ID!) {
    deleteCommissionBracket(id: $id)
  }
`;

const TOGGLE_BRACKET = gql`
  mutation ToggleCommissionBracket($id: ID!, $isActive: Boolean!) {
    toggleCommissionBracket(id: $id, isActive: $isActive) { id isActive }
  }
`;

// ── Component ─────────────────────────────────────────────────────────────────

const CommissionBrackets = () => {
  const { t } = useTranslation();
  const [messageApi, ctx] = message.useMessage();
  const [form] = Form.useForm();
  const [previewForm] = Form.useForm();

  const [modalOpen, setModalOpen]   = useState(false);
  const [editingId, setEditingId]   = useState(null);
  const [previewResult, setPreview] = useState(null);

  const refetchOptions = { refetchQueries: [{ query: GET_COMMISSION_BRACKETS }], awaitRefetchQueries: true };

  const { data, loading } = useQuery(GET_COMMISSION_BRACKETS);
  const [previewCommission, { loading: previewing }] = useLazyQuery(PREVIEW_COMMISSION, { fetchPolicy: 'network-only' });
  const [createBracket, { loading: creating }] = useMutation(CREATE_BRACKET, { ...refetchOptions, onCompleted: () => { messageApi.success(t('Bracket created')); closeModal(); }, onError: (e) => messageApi.error(e.message) });
  const [updateBracket, { loading: updating }] = useMutation(UPDATE_BRACKET, { ...refetchOptions, onCompleted: () => { messageApi.success(t('Bracket updated')); closeModal(); }, onError: (e) => messageApi.error(e.message) });
  const [deleteBracket]                        = useMutation(DELETE_BRACKET, { ...refetchOptions, onCompleted: () => messageApi.success(t('Bracket deleted')), onError: (e) => messageApi.error(e.message) });
  const [toggleBracket]                        = useMutation(TOGGLE_BRACKET, { ...refetchOptions });

  const brackets = data?.getCommissionBrackets ?? [];

  const openCreate = () => {
    setEditingId(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      fromAmount:      record.fromAmount,
      toAmount:        record.toAmount,
      type:            record.type,
      percentageValue: record.percentageValue,
      fixedValue:      record.fixedValue,
      description:     record.description,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    const input = {
      fromAmount:      values.fromAmount,
      toAmount:        values.toAmount ?? 0,
      type:            values.type,
      percentageValue: values.percentageValue ?? 0,
      fixedValue:      values.fixedValue ?? 0,
      description:     values.description,
    };
    if (editingId) {
      updateBracket({ variables: { input: { id: editingId, ...input } } });
    } else {
      createBracket({ variables: { input } });
    }
  };

  const handlePreview = async () => {
    const price = previewForm.getFieldValue('previewPrice');
    if (!price) return;
    const { data: pd } = await previewCommission({ variables: { price } });
    if (pd?.previewCommission != null) {
      setPreview(pd.previewCommission);
    }
  };

  const typeLabel = (type) => {
    if (type === 'PERCENTAGE') return <Tag color="blue">{t('Percentage')}</Tag>;
    if (type === 'FIXED')      return <Tag color="green">{t('Fixed')}</Tag>;
    return <Tag color="purple">{t('Hybrid')}</Tag>;
  };

  const formatAmount = (n) => Number(n ?? 0).toLocaleString();

  const commissionFormula = (r) => {
    if (r.type === 'PERCENTAGE') return `${r.percentageValue}%`;
    if (r.type === 'FIXED')      return `${formatAmount(r.fixedValue)} SAR`;
    return `${formatAmount(r.fixedValue)} SAR + ${r.percentageValue}%`;
  };

  const columns = [
    {
      title: t('From (SAR)'),
      dataIndex: 'fromAmount',
      render: (v) => formatAmount(v),
    },
    {
      title: t('To (SAR)'),
      dataIndex: 'toAmount',
      render: (v) => Number(v) === 0 ? <Text type="secondary">{t('Unlimited')}</Text> : formatAmount(v),
    },
    {
      title: t('Type'),
      dataIndex: 'type',
      render: typeLabel,
    },
    {
      title: t('Commission Formula'),
      render: (_, r) => commissionFormula(r),
    },
    {
      title: t('Version'),
      dataIndex: 'version',
      render: (v) => <Tag>v{v}</Tag>,
    },
    {
      title: t('Active'),
      dataIndex: 'isActive',
      render: (val, r) => (
        <Switch
          checked={val}
          onChange={(checked) => toggleBracket({ variables: { id: r.id, isActive: checked } })}
        />
      ),
    },
    {
      title: t('Actions'),
      render: (_, r) => (
        <Flex gap={8}>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)}>
            {t('Edit')}
          </Button>
          <Popconfirm
            title={t('Delete this bracket?')}
            onConfirm={() => deleteBracket({ variables: { id: r.id } })}
            okText={t('Delete')}
            cancelText={t('Cancel')}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              {t('Delete')}
            </Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  return (
    <>
      {ctx}
      <Card
        className="radius-12 border-gray"
        title={
          <Flex justify="space-between" align="center">
            <Title level={5} className="m-0 fw-600">{t('Commission Brackets')}</Title>
            <Button type="primary" className="bg-brand" icon={<PlusOutlined />} onClick={openCreate}>
              {t('Add Bracket')}
            </Button>
          </Flex>
        }
      >
        {/* Preview calculator */}
        <Card size="small" className="mb-4" style={{ background: '#f0faf6', border: '1px solid #b7e4d1' }}>
          <Title level={5} className="mt-0 mb-2 fw-600">{t('Commission Preview Calculator')}</Title>
          <Form form={previewForm} layout="inline">
            <Form.Item name="previewPrice">
              <InputNumber
                min={0}
                step={1000}
                placeholder={t('Enter deal price (SAR)')}
                style={{ width: 220 }}
                formatter={(v) => v ? `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                parser={(v) => v ? v.replace(/,/g, '') : ''}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" className="bg-brand" onClick={handlePreview} loading={previewing}>
                {t('Preview')}
              </Button>
            </Form.Item>
            {previewResult != null && (
              <Form.Item>
                <Tag color="green" style={{ fontSize: 14, padding: '4px 12px' }}>
                  {t('Commission')}: {Number(previewResult).toLocaleString()} SAR
                </Tag>
              </Form.Item>
            )}
          </Form>
        </Card>

        <Table
          dataSource={brackets}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: true }}
        />
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        title={editingId ? t('Edit Commission Bracket') : t('New Commission Bracket')}
        onCancel={closeModal}
        onOk={() => form.submit()}
        okText={editingId ? t('Save Changes') : t('Create')}
        okButtonProps={{ loading: creating || updating, className: 'bg-brand' }}
        cancelText={t('Cancel')}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="fromAmount"
                label={t('From Amount (SAR)')}
                rules={[{ required: true, message: t('Required') }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="toAmount" label={t('To Amount (SAR — 0 = unlimited)')}>
                <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="type"
            label={t('Commission Type')}
            rules={[{ required: true, message: t('Required') }]}
          >
            <Select
              options={[
                { value: 'PERCENTAGE', label: t('Percentage of price') },
                { value: 'FIXED',      label: t('Fixed SAR amount') },
                { value: 'HYBRID',     label: t('Fixed + Percentage (Hybrid)') },
              ]}
            />
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prev, cur) => prev.type !== cur.type}>
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              return (
                <>
                  {(type === 'PERCENTAGE' || type === 'HYBRID') && (
                    <Form.Item
                      name="percentageValue"
                      label={t('Percentage Value (%)')}
                      rules={[{ required: true, message: t('Required') }]}
                    >
                      <InputNumber min={0} max={100} step={0.5} addonAfter="%" style={{ width: '100%' }} />
                    </Form.Item>
                  )}
                  {(type === 'FIXED' || type === 'HYBRID') && (
                    <Form.Item
                      name="fixedValue"
                      label={t('Fixed Amount (SAR)')}
                      rules={[{ required: true, message: t('Required') }]}
                    >
                      <InputNumber min={0} step={100} addonAfter="SAR" style={{ width: '100%' }} />
                    </Form.Item>
                  )}
                </>
              );
            }}
          </Form.Item>

          <Form.Item name="description" label={t('Description (optional)')}>
            <input
              className="ant-input"
              placeholder={t('e.g. Standard bracket for mid-range deals')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export { CommissionBrackets };
