import { useTranslation } from "react-i18next";
import { t } from "i18next";

const categoriesItems = [
  { id: "1", name: "Digital Business" },
  { id: "2", name: "Physical Business" },
];

const priorityItems = [
  { id: 1, name: "Low" },
  { id: 2, name: "Medium" },
  { id: 3, name: "High" },
];

const useGroupItem = () => {
  const { t } = useTranslation();
  const groupselectItem = [
    { id: "OLD", name: t("Old") },
    { id: "NEW", name: t("New") },
    { id: "BOTH", name: t("Both") },
  ];
  return groupselectItem;
};

const useDistrictItem = () => {
  const { t } = useTranslation();
  const districtselectItem = [
    { id: "makkah", name: t("Makkah") },
    { id: "eastern", name: t("Eastern") },
    { id: "al-madinah", name: t("Al-Madinah") },
    { id: "asir", name: t("Asir") },
    { id: "tabuk", name: t("Tabuk") },
    { id: "najran", name: t("Najran") },
    { id: "al-qassim", name: t("Al-Qassim") },
    { id: "hail", name: t("Hail") },
    { id: "al-jouf", name: t("Al-Jouf") },
    { id: "al-bahah", name: t("Al-Bahah") },
    { id: "riyadh", name: t("Riyadh") },
    { id: "northern-borders", name: t("Northern Borders") },
    { id: "jazan", name: t("Jazan") },
  ];
  return districtselectItem;
};

const districtItems = [
  { key: "1", label: t("Makkah") },
  { key: "2", label: t("Eastern") },
  { key: "3", label: t("Al-Madinah") },
  { key: "4", label: t("Asir") },
  { key: "5", label: t("Tabuk") },
  { key: "6", label: t("Najran") },
  { key: "7", label: t("Al-Qassim") },
  { key: "8", label: t("Hail") },
  { key: "9", label: t("Al-Jouf") },
  { key: "10", label: t("Al-Bahah") },
  { key: "11", label: t("Riyadh") },
  { key: "12", label: t("Northern Borders") },
  { key: "13", label: t("Jazan") },
];

const statusItems = [
  { key: "1", label: t("All") },
  { key: "2", label: t("Active") },
  { key: "3", label: t("Inactive") },
];

const typeItems = [
  { key: "1", label: t("All") },
  { key: "2", label: t("New") },
  { key: "3", label: t("Old") },
];

const meetingItems = [
  { key: "1", label: "All" },
  { key: "2", label: "Pending" },
  { key: "3", label: "Cancel Meeting" },
];

const pushstatusItem = [
  { id: true, name: "Send" },
  { id: false, name: "Schedule" },
];

const groupItems = [
  { id: "2", name: "New" },
  { id: "3", name: "Old" },
  { id: "4", name: "Both" },
];

const yearOp = [
  {
    key: "1",
    label: "2025",
  },
  {
    key: "2",
    label: "2024",
  },
  {
    key: "3",
    label: "2023",
  },
  {
    key: "4",
    label: "2022",
  },
  {
    key: "5",
    label: "2021",
  },
];

const langItems = [
  {
    id: "1",
    name: "English",
  },
  {
    id: "2",
    name: "Arabic",
  },
];

const revenueLookups = [
  {
    id: 1,
    name: "Last 6 Months",
  },
  {
    id: 2,
    name: "Last Year",
  },
];

export {
  categoriesItems,
  revenueLookups,
  priorityItems,
  districtItems,
  statusItems,
  typeItems,
  meetingItems,
  pushstatusItem,
  groupItems,
  useGroupItem,
  useDistrictItem,
  yearOp,
  langItems,
};
