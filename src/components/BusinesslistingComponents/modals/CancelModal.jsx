import { Button, Divider, Flex, Modal, Typography } from 'antd'

const { Title, Text } = Typography
const CancelModal = ({visible,onClose}) => {
  return (
    <Modal
        title={null}
        open={visible}
        onCancel={onClose}
        closeIcon={false}
        centered
        footer={
            <Flex justify='center' gap={5}>
                <Button type='button' className='btncancel text-black border-gray' onClick={onClose}>
                    Cancel
                </Button>
                <Button type="primary" className='btnsave border0 text-white brand-bg'>
                    Confirm
                </Button>
            </Flex>
        }
      > 

        <Flex vertical align='center' gap={6}>
            <img src='/assets/icons/cancel-ic.png' width={50} />
            <Title level={4} className='mb-0 mt-2'>
                Cancel Listing?
            </Title>
            <Text>
                Your current progress will be lost if you cancel. Do you still want to proceed?
            </Text>
        </Flex>
        <Divider className='my-2 bg-light-brand' />
    </Modal>
  )
}

export {CancelModal}