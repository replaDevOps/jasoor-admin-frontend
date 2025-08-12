import { Flex } from 'antd'
import { BankAccountCard, CommissionSocial, ModuleTopHeading, PasswordManager } from '../../components';

const SettingsPage = () => {
    return (
        <Flex vertical gap={20}>
            <ModuleTopHeading level={4}  name='Settings' />
            <CommissionSocial />
            <PasswordManager />
            <BankAccountCard />
        </Flex>
    )
}

export {SettingsPage}