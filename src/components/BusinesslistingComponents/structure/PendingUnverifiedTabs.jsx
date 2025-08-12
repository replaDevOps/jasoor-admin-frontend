import { Tabs } from 'antd'
import { BusinessStatsTab } from './BusinessStatsTab'
import { AssetsTab } from './AssetsTab'
import { DocumentTab } from './DocumentTab'
import { OfferTable } from './OfferTable'

const PendingUnverifiedTabs = ({ status }) => {
    const baseTabs = [
        {
            key: '1',
            label: 'Business Stats',
            children: <BusinessStatsTab />,
        },
        {
            key: '2',
            label: 'Assets',
            children: <AssetsTab />,
        },
        {
            key: '3',
            label: 'Documents',
            children: <DocumentTab />,
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