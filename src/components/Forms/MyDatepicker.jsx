import { Form, TimePicker, DatePicker, Typography } from 'antd';
import moment from 'moment';
export const MyDatepicker = ({withoutForm, name, label, disabled, required, message, value, rangePicker, placeholder, datePicker, ...props }) => {
    return (
        <>
        {
            withoutForm ?
            (
                datePicker ?
                <DatePicker
                    disabled={disabled || false}
                    value={value ? moment(value, 'YYYY-MM-DD') : ''}
                    format={'YYYY-MM-DD-'}
                    style={{ width: '100%' }}
                    {...props}
                    className={'fs-14 without-timeinput'}

                />
                :
                rangePicker ?
                    <DatePicker.RangePicker
                        disabled={disabled || false}
                        value={value ? moment(value, 'YYYY-MM-DD') : ''}
                        style={{ width: '100%' }}
                        {...props}
                        className='fs-14 without-timeinput'
                    /> 
                :
                <TimePicker
                    disabled={disabled || false}
                    // value={moment(value || '00:00')}
                    placeholder={placeholder}
                    format='HH:mm A'
                    style={{ width: '100%' }}
                    {...props}
                    className='fs-14 without-timeinput'
                />
            )
            :
            <Form.Item
                name={name}
                label={<Typography.Text className='fs-14 fw-400'>{label}</Typography.Text>}
                rules={[
                    {
                        required,
                        message,
                    },
                ]}
                className='custom-input fs-14'
            >
            {
                datePicker ?
                <DatePicker
                    disabled={disabled || false}
                    value={value ? moment(value, 'YYYY-MM-DD') : ''}
                    style={{ width: '100%' }}
                    {...props}

                />
                :
                rangePicker ?
                    <DatePicker.RangePicker
                    disabled={disabled || false}
                    value={value ? moment(value, 'YYYY-MM-DD') : ''}
                    style={{ width: '100%' }}
                    {...props}
                /> :
                <TimePicker
                    disabled={disabled || false}
                    value={moment(value || '00:00')}
                    format='HH:mm A'
                    style={{ width: '100%' }}
                    placeholder={placeholder}
                    {...props}
                />
            }
            </Form.Item>
        }
        </>
    )
}