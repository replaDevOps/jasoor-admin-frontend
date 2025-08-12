const businesslisttableData = [
    {
        key:'1',
        refno:2657998,
        title:'Al Madinah Coffee Shop',
        sellername:'Aayid Ramaas Shaker',
        category:'Educational',
        businessprice:'20,000',
        status:0,
        verified: 0, // verified
        date:'01/01/2021',
    },
    {
        key:'2',
        refno:2878983,
        title:'Qahwa House - Authentic Vibe',
        sellername:'Zaidaan Mamdooh',
        category:'Online Store',
        businessprice:'22,000',
        status:1,
        verified: 1, // unverified
        date:'01/01/2021',
    },
    {
        key:'3',
        refno:4250644,
        title:'Modern Specialty Café',
        sellername:'Fawzi Humaidaan Nasir',
        category:'Restaurant',
        businessprice:'24,000',
        status:2,
        verified: 1, // verified
        date:'01/01/2021',
    },
]

const basicInfoData = [
    {
        title:'Full Name',
        desc:'Abdullah Ali'
    },
    {
        title:'Email',
        desc:'abdullah@gmail.com'
    },
    {
        title:'Phone Number',
        desc:'1234 93734 568'
    },
    {
        title:'City',
        desc:'Makkah'
    },
    {
        title:'District',
        desc:'Makkah District'
    },
    {
        title:'National ID / Passport',
        desc:[
            '/assets/images/idcardback.png',
            '/assets/images/idcardfront.png'
        ]
    },
]

const businessstatsData = [
    {
        id: 1,
        icon:'/assets/icons/rev.png',
        title:`SAR 50,000`,
        subtitle:`Revenue (Last Year)`,
    },
    {
        id: 2,
        icon:'/assets/icons/pro.png',
        title:`SAR 25,000`,
        subtitle:`Profit (Last Year)`,
    },
    {
        id: 3,
        icon:'/assets/icons/teamsize.png',
        title:'1-10',
        subtitle:'Team Size'
    },
    {
        id: 4,
        icon:'/assets/icons/promar.png',
        title:`SAR 50,000`,
        subtitle:'Profit Margin %'
    },
    {
        id: 5,
        icon:'/assets/icons/cap-re.png',
        title:'3.8 months',
        subtitle:'Capital Recovery'
    },
    {
        id: 6,
        icon:'/assets/icons/multiple.png',
        title:'2x',
        subtitle:'Multiples'
    },
]

const postsaleData = [
    {
        key:1,
        supportperiod:'1 month',
        nosession:10,
    },
]

const outstandliabilitiesData = [
    {
        key:1,
        liabilitiesname:'Espresso Machine',
        noitems:5,
        purchaseyear:2020,
        price:10000,
        verify:1,
    },
    {
        key:2,
        liabilitiesname:'Air Conditioner Units',
        noitems:10,
        purchaseyear:2019,
        price:10000,
        verify:0,
    },
    {
        key:3,
        liabilitiesname:'Dining Tables',
        noitems:12,
        purchaseyear:2022,
        price:10000,
        verify:1,
    },
]

const keyassetData = [
    {
        key:1,
        assetname:'Espresso Machine',
        noitems:5,
        purchaseyear:2020,
        price:10000,
        verify:1,
    },
    {
        key:2,
        assetname:'Air Conditioner Units',
        noitems:10,
        purchaseyear:2019,
        price:10000,
        verify:0,
    },
    {
        key:3,
        assetname:'Dining Tables',
        noitems:12,
        purchaseyear:2022,
        price:10000,
        verify:1,
    },
]

const inventoryData = [
    {
        key:1,
        inventoryname:'Espresso Machine',
        noitems:5,
        purchaseyear:2020,
        price:10000,
        verify:1,
    },
    {
        key:2,
        inventoryname:'Air Conditioner Units',
        noitems:10,
        purchaseyear:2019,
        price:10000,
        verify:0,
    },
    {
        key:3,
        inventoryname:'Dining Tables',
        noitems:12,
        purchaseyear:2022,
        price:10000,
        verify:1,
    },
]

const documentsData = [
    {
        id: 1,
        title:'Valuation_Report_ExpertFirm.pdf'
    },
    {
        id: 2,
        title:'Business_Tax_Certificate_2023.jpg'
    },
    {
        id: 3,
        title:'Valuation_Report_ExpertFirm.pdf'
    },
    {
        id: 4,
        title:'Business_Tax_Certificate_2023.jpg'
    },
]

const offerData = [
    {
        key:1,
        buyername:'Abdullah Ali',
        businessprice:'SAR 20,000',
        offerprice:'SAR 20,000',
        priceType:1,
        status:0,
        offerdate:'21-04-2025',
    },
    {
        key:2,
        buyername:'Sheraz Khan',
        businessprice:'SAR 19,000',
        offerprice:'SAR 20,000',
        priceType:2,
        status:1,
        offerdate:'21-04-2025',
    },
    {
        key:3,
        buyername:'Shujat Ali',
        businessprice:'SAR 21,000',
        offerprice:'SAR 20,000',
        priceType:1,
        status:2,
        offerdate:'21-04-2025',
    },
]



export { businesslisttableData, basicInfoData, businessstatsData, postsaleData, outstandliabilitiesData, keyassetData, inventoryData, documentsData, offerData}