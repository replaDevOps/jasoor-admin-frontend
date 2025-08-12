import { Button, Divider, Flex, Modal, Typography } from 'antd'

const { Title, Text } = Typography
const DeleteModal = ({visible,onClose,title,subtitle,type}) => {
  return (
    <Modal
        title={null}
        open={visible}
        onCancel={onClose}
        closeIcon={false}
        centered
        footer={
            <Flex justify='center' gap={5}>
                <Button type='button' onClick={onClose} className='btncancel text-black border-gray'>
                    Cancel
                </Button>
                <Button className={`btnsave border0 text-white ${type==='danger'? 'bg-red':'bg-brand'}`}>
                    Confirm
                </Button>
            </Flex>
        }
      > 

        <Flex vertical align='center' className='text-center' gap={10}>
            <img src='/assets/icons/cancel-ic.png' width={50} />
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