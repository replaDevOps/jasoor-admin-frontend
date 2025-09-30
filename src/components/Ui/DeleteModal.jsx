import { Button, Divider, Flex, Modal, Typography } from 'antd'
import { t } from 'i18next'

const { Title, Text } = Typography
const DeleteModal = ({visible,onClose,title,subtitle,type,onConfirm, loading}) => {
  return (
    <Modal
        title={null}
        open={visible}
        onCancel={onClose}
        closeIcon={false}
        centered
        footer={
            <Flex justify='center' gap={5}>
                <Button aria-labelledby='Cancel' type='button' onClick={onClose} className='btncancel text-black border-gray' >
                    {t("Cancel")}
                </Button>
                <Button aria-labelledby='Confirm' className={`btnsave border0 text-white ${type==='danger'? 'bg-red':'bg-brand'}`} onClick={onConfirm} loading={loading} >
                    {t("Confirm")}
                </Button>
            </Flex>
        }
      > 

        <Flex vertical align='center' className='text-center' gap={10}>
            <img src='/assets/icons/cancel-ic.png' alt='cancel icon' width={50} fetchPriority="high" />
            <Title level={5} className='m-0'>
                {title}
            </Title>
            <Text className='fs-14'>
                {subtitle}
            </Text>
        </Flex>
        <Divider className='my-2 bg-light-brand' />
    </Modal>
  )
}

export {DeleteModal}