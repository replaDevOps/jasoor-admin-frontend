import { t } from "i18next";

const district = [
  {
    id: 1,
    name: t('Riyadh'),
    value: 'riyadh'
  },
  {
    id: 2,
    name: t('Makkah'),
    value: 'makkah'
  },
  {
    id: 3,
    name: t('Madinah'),
    value: 'madinah'
  },
  {
    id: 4,
    name: t('Eastern Province'),
    value: 'eastern-province'
  },
  {
    id: 5,
    name: t('Qassim'),
    value: 'qassim'
  },
  {
    id: 6,
    name: t('Asir'),
    value: 'asir'
  },
  {
    id: 7,
    name: t('Tabuk'),
    value: 'tabuk'
  },
  {
    id: 8,
    name: t('Hail'),
    value: 'hail'
  },
  {
    id: 9,
    name: t('Northern Borders'),
    value: 'northern-borders'
  },
  {
    id: 10,
    name: t('Al Jouf'),
    value: 'al-jouf'
  },
  {
    id: 11,
    name: t('Jazan'),
    value: 'jazan'
  },
  {
    id: 12,
    name: t('Najran'),
    value: 'najran'
  },
  {
    id: 13,
    name: t('Al Baha'),
    value: 'al-baha'
  }
];


const cities = {
  riyadh: [
    { id: 1, name: 'Riyadh', value: 'riyadh' },
    { id: 2, name: 'Al Kharj', value: 'al-kharj' },
    { id: 3, name: 'Al Dawadmi', value: 'al-dawadmi' },
    { id: 4, name: 'Al Majmaah', value: 'al-majmaah' },
    { id: 5, name: 'Wadi Al Dawasir', value: 'wadi-al-dawasir' },
    { id: 6, name: 'Az Zulfi', value: 'az-zulfi' },
  ],
  makkah: [
    { id: 7, name: 'Makkah', value: 'makkah' },
    { id: 8, name: 'Jeddah', value: 'jeddah' },
    { id: 9, name: 'Taif', value: 'taif' },
    { id: 10, name: 'Al Qunfudhah', value: 'al-qunfudhah' },
    { id: 11, name: 'Rabigh', value: 'rabigh' },
  ],
  medinah: [
    { id: 12, name: 'Madinah', value: 'madinah' },
    { id: 13, name: 'Yanbu', value: 'yanbu' },
    { id: 14, name: 'Khaybar', value: 'khaybar' },
    { id: 15, name: 'Al Ula', value: 'al-ula' },
  ],
  qassim: [
    { id: 16, name: 'Buraydah', value: 'buraydah' },
    { id: 17, name: 'Unaizah', value: 'unaizah' },
    { id: 18, name: 'Ar Rass', value: 'ar-rass' },
    { id: 19, name: 'Al Bukayriyah', value: 'al-bukayriyah' },
  ],
  easternProvince: [
    { id: 20, name: 'Dammam', value: 'dammam' },
    { id: 21, name: 'Khobar', value: 'khobar' },
    { id: 22, name: 'Dhahran', value: 'dhahran' },
    { id: 23, name: 'Jubail', value: 'jubail' },
    { id: 24, name: 'Al Ahsa (Hofuf/Mubarraz)', value: 'al-ahsa' },
    { id: 25, name: 'Qatif', value: 'qatif' },
    { id: 26, name: 'Hafar Al Batin', value: 'hafar-al-batin' },
    { id: 27, name: 'Al Khafji', value: 'al-khafji' },
  ],
  asir: [
    { id: 28, name: 'Abha', value: 'abha' },
    { id: 29, name: 'Khamis Mushait', value: 'khamis-mushait' },
    { id: 30, name: 'Mahail Asir', value: 'mahail-asir' },
    { id: 31, name: 'Bisha', value: 'bisha' },
    { id: 32, name: 'Al Namas', value: 'al-namas' },
    { id: 33, name: 'Sabt Al Alaya', value: 'sabt-al-alaya' },
  ],
  tabuk: [
    { id: 34, name: 'Tabuk', value: 'tabuk' },
    { id: 35, name: 'Al Wajh', value: 'al-wajh' },
    { id: 36, name: 'Duba', value: 'duba' },
    { id: 37, name: 'Haql', value: 'haql' },
    { id: 38, name: 'Umluj', value: 'umluj' },
  ],
  hail: [
    { id: 39, name: 'Hail', value: 'hail' },
    { id: 40, name: 'Baqaa', value: 'baqaa' },
    { id: 41, name: 'Al Ghazalah', value: 'al-ghazalah' },
    { id: 42, name: 'Jubbah', value: 'jubbah' },
    { id: 43, name: 'Ash Shinan', value: 'ash-shinan' },
  ],
  northernBorders: [
    { id: 44, name: 'Arar', value: 'arar' },
    { id: 45, name: 'Rafha', value: 'rafha' },
    { id: 46, name: 'Turaif', value: 'turaif' },
  ],
  alJouf: [
    { id: 47, name: 'Sakaka', value: 'sakaka' },
    { id: 48, name: 'Al Qurayyat', value: 'al-qurayyat' },
    { id: 49, name: 'Dumat Al Jandal', value: 'dumat-al-jandal' },
  ],
  jazan: [
    { id: 50, name: 'Jazan', value: 'jazan' },
    { id: 51, name: 'Samtah', value: 'samtah' },
    { id: 52, name: 'Abu Arish', value: 'abu-arish' },
    { id: 53, name: 'Sabya', value: 'sabya' },
  ],
  najran: [
    { id: 54, name: 'Najran', value: 'najran' },
    { id: 55, name: 'Sharurah', value: 'sharurah' },
    { id: 56, name: 'Hubuna', value: 'hubuna' },
  ],
  alBaha: [
    { id: 57, name: 'Al Baha', value: 'al-baha' },
    { id: 58, name: 'Baljurashi', value: 'baljurashi' },
    { id: 59, name: 'Al Mandaq', value: 'al-mandaq' },
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

  
export { teamsizeOp, district, cities }