const categoriesItems = [
    { id: '1', name: 'Digital Business' },
    { id: '2', name: 'Physical Business' },
];


const priorityItems = [
    { id: 1, name: 'Low' },
    { id: 2, name: 'Medium' },
    { id: 3, name: 'High' },
] 

const groupselectItem = [
    { id: 1, name: 'All' },
    { id: 2, name: 'New' },
    { id: 3, name: 'Old' },
    { id: 4, name: 'Both' }
]

const districtselectItems = [
    { id: 1, name: 'All District'},
    { id: 2, name: 'Makkah' },
    { id: 3, name: 'Eastern' },
    { id: 4, name: 'Al-Madinah' },
    { id: 5, name: 'Asir' },
    { id: 6, name: 'Tabuk' },
    { id: 7, name: 'Najran' },
    { id: 8, name: 'Al-Qassim' },
    { id: 9, name: 'Hail' },
    { id: 10, name: 'Al-Jouf' },
    { id: 11, name: 'Al-Bahah' },
    { id: 12, name: 'Riyadh' },
    { id: 13, name: 'Northern Borders' },
    { id: 14, name: 'Jazan' },
]


// dropdown lookups
const maincategoriesItem = [
    {
        key: 1,
        label: 'Restaurants & Cafes',
    },
    {
        key: 2,
        label: 'Retail Stores',
    },
    {
        key: 3,
        label: 'Salons & Beauty Centers',
    },
    {
        key: 4,
        label: 'E-commerce Stores',
    },
    {
        key: 5,
        label: 'Gyms & Fitness Centers',
    },
    {
        key: 6,
        label: 'Automotive Services',
    },
    {
        key: 7,
        label: 'Bakeries & Sweet Shops',
    },
    {
        key: 8,
        label: 'Tech & Software Startups',
    },
    {
        key: 9,
        label: 'Educational Centers',
    },
    {
        key: 10,
        label: 'Pharmacies & Clinics',
    },
    {
        key: 11,
        label: 'Printing & Stationery Shops',
    },
    {
        key: 12,
        label: 'Pet Shops & Services',
    },
]


const districtItems = [
    { key: '1', label: 'Makkah' },
    { key: '2', label: 'Eastern' },
    { key: '3', label: 'Al-Madinah' },
    { key: '4', label: 'Asir' },
    { key: '5', label: 'Tabuk' },
    { key: '6', label: 'Najran' },
    { key: '7', label: 'Al-Qassim' },
    { key: '8', label: 'Hail' },
    { key: '9', label: 'Al-Jouf' },
    { key: '10', label: 'Al-Bahah' },
    { key: '11', label: 'Riyadh' },
    { key: '12', label: 'Northern Borders' },
    { key: '13', label: 'Jazan' },
]

 const statusItems = [
    { key: '1', label: 'All' },
    { key: '2', label: 'Active' },
    { key: '3', label: 'Inactive' }
];

const typeItems = [
    { key: '1', label: 'All' },
    { key: '2', label: 'New' },
    { key: '3', label: 'Old' }
];

const meetingItems = [
    { key: '1', label: 'All' },
    { key: '2', label: 'Pending' },
    { key: '3', label: 'Cancel Meeting'},
]

const businessdealItems = [
    { key: '1', label: 'All' },
    { key: '2', label: 'Document & Payment Confirmation' },
    { key: '3', label: 'Commission Verification Pending' },
    { key: '4', label: 'Seller Payment Verification Pending' },
    { key: '5', label: 'Closed Deal Verification Pending' },
    { key: '6', label: 'Payment Approval From Seller Pending' },
    { key: '7', label: 'Bank Details  From Seller Pending' },
    { key: '8', label: 'DSA From Seller Pending' },
    { key: '9', label: 'DSA From Buyer Pending' },
]

const pushstatusItem = [
    { key: '1', label: 'All' },
    { key: '2', label: 'Send' },
    { key: '3', label: 'Schedule' }
];

const groupItems = [
    { key: '1', label: 'All' },
    { key: '2', label: 'New' },
    { key: '3', label: 'Old' },
    { key: '4', label: 'Both' }
];

const yearOp = [
    {
        key: '1', label: '2025'
    },
    {
        key: '2', label: '2024'
    },
    {
        key: '3', label: '2023'
    },
    {
        key: '4', label: '2022'
    },
    {
        key: '5', label: '2021'
    },
]

const langItems = [
    {
        id: '1', name: 'English'
    },
    {
        id: '2', name: 'Arabic'
    },
]


export { categoriesItems, maincategoriesItem, priorityItems, districtItems, statusItems, typeItems,meetingItems, businessdealItems, pushstatusItem,groupItems, groupselectItem, districtselectItems, yearOp, langItems };