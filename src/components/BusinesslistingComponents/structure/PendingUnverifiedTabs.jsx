import { Tabs } from 'antd'
import { BusinessStatsTab } from './BusinessStatsTab'
import { AssetsTab } from './AssetsTab'
import { DocumentTab } from './DocumentTab'
import { OfferTable } from './OfferTable'

const PendingUnverifiedTabs = ({ status }) => {
    const businessId = status?.id
    const baseTabs = [
        {
            key: '1',
            label: 'Business Stats',
            children: <BusinessStatsTab status={status} />,
        },
        {
            key: '2',
            label: 'Assets',
            children: <AssetsTab businessId={businessId} />,
        },
        {
            key: '3',
            label: 'Documents',
            children: <DocumentTab businessId={businessId} />,
        }
    ]
    
    const offerTab = {
        key: '4',
        label: 'Offers',
        children: <OfferTable />,
    }
    
    const tabs = [...baseTabs];
    if (status === 1 || status === 2) {
        tabs.push(offerTab);
    }
    
    return (
        <div>
            <Tabs 
                className='tabs-fill'
                defaultActiveKey="1" 
                items={tabs}
            />
        </div>
    )
}

export { PendingUnverifiedTabs }