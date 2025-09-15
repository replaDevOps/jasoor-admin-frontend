import React from 'react'
import { Modal } from 'antd'

const ImagePreviewModal = ({ visible, imageSrc, onClose }) => {
  return (
    <Modal
      open={visible}
       className='shadow-c'
      footer={null}
      onCancel={onClose}
      centered
    >
      <img alt="preview" style={{ width: '100%' }} src={imageSrc} fetchPriority="high"/>
    </Modal>
  )
}

export {ImagePreviewModal}
