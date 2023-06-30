export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-detail-tabpanel-${index}`}
      aria-labelledby={`product-detail-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}
