import { Flex } from 'antd'
import { BankAccountCard, CommissionSocial, ModuleTopHeading, PasswordManager } from '../../components';
import React, { use } from 'react';
import {GET_SETTINGS} from '../../graphql/query';
import {useQuery} from '@apollo/client';

const SettingsPage = () => {
    const {data, loading, error} = useQuery(GET_SETTINGS);
    const comssionSocial = data?.getSetting
  ? {
      id: data.getSetting.id,
      commissionRate: data.getSetting.commissionRate,
      facebook: data.getSetting.faceBook,
      instagram: data.getSetting.instagram,
      twitter: data.getSetting.x, // your backend calls this 'x', not 'twitter'
      email: data.getSetting.email,
      whatsapp: data.getSetting.whatsApp
    }
  : null;

  const banks = data?.getSetting?.banks || [];
  const settingId = comssionSocial ? comssionSocial.id : null;
        
    return (
        <Flex vertical gap={20}>
            <ModuleTopHeading level={4}  name='Settings' />
            <CommissionSocial comssionSocial={comssionSocial} />
            <PasswordManager />
            <BankAccountCard banks={banks} settingId={settingId} />
        </Flex>
    )
}

export {SettingsPage}