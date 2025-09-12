import { Button, Divider, Flex, Modal, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography
const BusinesslistingReviewModal = ({visible,onClose,onCreate}) => {

    const navigate = useNavigate()
  return (
    <Modal
        title={null}
        open={visible}
        onCancel={onClose}
        closeIcon={false}
        centered
        footer={
            <Flex justify='center' gap={5}>
                <Button aria-labelledby='Back to Home' type='button' className='btncancel text-black border-gray' onClick={()=>{onClose();navigate('/')}}>
                    Back to Home
                </Button>
                <Button aria-labelledby='Create new list' type="primary" className='btnsave border0 text-white brand-bg' onClick={()=>{onClose();navigate('/sellbusinesscreate')}}>
                    Create new list
                </Button>
            </Flex>
        }
      > 

        <Flex vertical align='center' className='text-center my-3' gap={10}>
            <img src='/assets/icons/complete.png' alt='complete icon' width={50} />
            <Title level={4} className='mb-0 mt-2'>
                Business Listing Under Review
            </Title>
            <Text>
                Your business listing is currently under review. Once approved by the admin,it will go live on the marketplace.
            </Text>
        </Flex>
        <Divider className='my-2 bg-light-brand' />
    </Modal>
  )
}

export {BusinesslistingReviewModal}