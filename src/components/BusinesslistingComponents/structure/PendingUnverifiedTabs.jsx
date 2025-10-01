import { Tabs } from 'antd'
import { BusinessStatsTab } from './BusinessStatsTab'
import { AssetsTab } from './AssetsTab'
import { DocumentTab } from './DocumentTab'
import { OfferTable } from './OfferTable'

const PendingUnverifiedTabs = ({ data }) => {
    const businessId = data?.id
    const baseTabs = [
        {
            key: '1',
            label: 'Business Stats',
            children: <BusinessStatsTab data={data} />,
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
        },
        {
            key: '4',
            label: "Offers",
            children: <OfferTable businessId={businessId} />,
        }
    ]
    
    return (
        <div>
            <Tabs 
                className='tabs-fill'
                defaultActiveKey="1" 
                items={baseTabs}
            />
        </div>
    )
}

export { PendingUnverifiedTabs }