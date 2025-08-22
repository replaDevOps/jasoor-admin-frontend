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
        footer={
            <Flex justify='center' gap={5}>
                <Button type='button' className='btn text-black border-gray' onClick={()=>{onClose();navigate('/')}}>
                    Back to Home
                </Button>
                <Button type="primary" className='btn bg-brand' onClick={()=>{onClose();navigate('/sellbusinesscreate')}}>
                    Create new list
                </Button>
            </Flex>
        }
      > 

        <Flex vertical align='center' className='text-center' gap={6}>
            <img src='/assets/icons/complete.png' width={50} />
            <Title level={4} className='m-0'>
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