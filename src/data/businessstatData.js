const stats = [
    {
        id: 1,
        icon:'/assets/icons/rev.png',
        title:'SAR 50,000',
        subtitle:'Revenue (Last Year)'
    },
    {
        id: 2,
        icon:'/assets/icons/pro.png',
        title:'SAR 25,000',
        subtitle:'Profit (Last Year)'
    },
    {
        id: 3,
        icon:'/assets/icons/promar.png',
        title:'SAR 50,000',
        subtitle:'Profit Margin %'
    },
    {
        id: 4,
        icon:'/assets/icons/cap-re.png',
        title:'3.8 months',
        subtitle:'Capital Recovery'
    },
    {
        id: 5,
        icon:'/assets/icons/foundationdate.png',
        title:'2020',
        subtitle:'Foundation Date'
    },
    {
        id: 6,
        icon:'/assets/icons/teamsize.png',
        title:'1-10',
        subtitle:'Team Size'
    },
]

const postsaleDatas = [
    {
        key: '1',
        period:'2 Months',
        session:'2 Sessions',
        verified: null
    },
    {
        key: '2',
        period:'3 Months',
        session:'3 Sessions',
        verified: 1
    }
]


const documentData = [
    {
        id: 1,
        name: 'Valuation_Report_ExpertFirm.pdf',
        size: '5.3 MB'
    },
    {
        id: 2,
        name: 'Business_Tax_Certificate_2023.jpg',
        size: '5.3 MB'
    },
    {
        id: 3,
        name: 'Valuation_Report_ExpertFirm.pdf',
        size: '5.3 MB'
    },
]


const businessInfoData = [
    {
        id: 1,
        icon:'/assets/icons/verification.png',
        title:'Verified',
        subtitle:'Identity Verification'
    },
    {
        id: 2,
        icon:'/assets/icons/businessprice.png',
        title:'SAR 25,000',
        subtitle:'Business Price'
    },
    {
        id: 3,
        icon:'/assets/icons/businesscate.png',
        title:'Restaurant',
        subtitle:'Business Category'
    },
    {
        id: 5,
        icon:'/assets/icons/businessloc.png',
        title:'Riyadh District, Riyadh',
        subtitle:'Business Location'
    },
]

const marketData = [
    {
        id: 1,
        title: 'Local Business Growth',
        desc:'+4.3% (YoY)'
    },
    {
        id: 2,
        title: 'Population Density',
        desc:'High'
    },
    {
        id: 3,
        title: 'Industry Demand',
        desc:'High'
    },
]

const district = [
    {
        id: 1,
        name: 'Riyadh',
        value: 'riyadh'
    },
    {
        id: 2,
        name: 'Jeddah',
        value: 'jeddah'
    },
    {
        id: 3,
        name: 'Dammam',
        value: 'dammam'
    },
    {
        id: 4,
        name: 'Khobar',
        value: 'khobar'
    },
    {
        id: 5,
        name: 'Makkah',
        value: 'makkah'
    },
    {
        id: 6,
        name: 'Medina',
        value: 'medina'
    },
    {
        id: 7,
        name: 'Taif',
        value: 'taif'
    },
    {
        id: 8,
        name: 'Tabuk',
        value: 'tabuk'
    },
    {
        id: 9,
        name: 'Hail',
        value: 'hail'
    },
    {
        id: 10,
        name: 'Najran',
        value: 'najran'
    }
]

const cities = {
    riyadh: [
      { id: 1, name: 'Riyadh', value: 'riyadh' },
      { id: 2, name: 'Al Kharj', value: 'al-kharj' },
      { id: 3, name: 'Al Majma\'ah', value: 'al-majmaah' },
    ],
    jeddah: [
      { id: 4, name: 'Jeddah', value: 'jeddah' },
      { id: 5, name: 'Rabigh', value: 'rabigh' },
    ],
    dammam: [
      { id: 6, name: 'Dammam', value: 'dammam' },
      { id: 7, name: 'Dhahran', value: 'dhahran' },
      { id: 8, name: 'Qatif', value: 'qatif' },
    ],
    khobar: [
      { id: 9, name: 'Khobar', value: 'khobar' },
    ],
    makkah: [
      { id: 10, name: 'Makkah', value: 'makkah' },
      { id: 11, name: 'Jumum', value: 'jumum' },
    ],
    medina: [
      { id: 12, name: 'Medina', value: 'medina' },
      { id: 13, name: 'Yanbu', value: 'yanbu' },
    ],
    tabuk: [
      { id: 14, name: 'Tabuk', value: 'tabuk' },
      { id: 15, name: 'Duba', value: 'duba' },
    ],
    taif: [
      { id: 16, name: 'Taif', value: 'taif' },
    ],
    hail: [
      { id: 17, name: 'Hail', value: 'hail' },
    ],
    najran: [
      { id: 18, name: 'Najran', value: 'najran' },
    ],
  };

  const teamsizeOp = [
    {
        id: 1,
        name: '1-10'
    },
    {
        id: 2,
        name: '10-20'
    },
    {
        id: 3,
        name: '20-50'
    },
    {
        id: 4,
        name: '50-100'
    },
    {
        id: 5,
        name: '100-200'
    },
    {
        id: 6,
        name: '200+'
    }
]

  
export { stats, teamsizeOp, documentData, businessInfoData, marketData,district,cities, postsaleDatas }