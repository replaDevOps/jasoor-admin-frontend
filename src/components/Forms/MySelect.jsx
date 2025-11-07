import {Form, Select, Typography} from 'antd';
import './index.css'
import { useTranslation } from 'react-i18next';
export const MySelect = ({withoutForm,name,label,mode,disabled,required,showKey,message,value,options, ...props}) => {
  const { t } = useTranslation()
  return (
    withoutForm?
      <Select 
        maxTagCount= 'responsive'
        className='select w-100'
        value={value || undefined} 
        mode={mode || ''} 
        disabled={disabled || false} 
        {...props}
      >
          {
              options?.map(opt=><Select.Option value={opt?.id} key={opt?.id}>{opt?.name}</Select.Option>)
          }
          
      </Select>
      :
      <Form.Item
          name={name}
          label={<Typography.Text  className="fs-14 fw-400">{label}</Typography.Text>}
          rules={[
              {
              required,
              message,
              },
          ]}
          className='custom-select'
          >
              <Select 
                value={value || ''} 
                mode={mode || ''} 
                disabled={disabled || false} 
                maxTagCount= 'responsive'
                {...props}
                >
                  {
                      options?.map(opt=><Select.Option value={showKey ? opt?.id :  opt?.name} key={opt?.id}>{t(opt?.name)} </Select.Option>)
                  }
              </Select>
      </Form.Item>  
  )
}