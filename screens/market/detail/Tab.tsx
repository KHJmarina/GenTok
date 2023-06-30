import { Tab as MuiTab } from '@mui/material';
import { styled } from '@mui/material/styles';
import { pxToRem } from 'src/theme/typography';

interface TabProps {
  label: React.ReactNode | string;
}

export const Tab = styled((props: TabProps) => {
  return <MuiTab {...props} disableRipple />;
})(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  [theme.breakpoints.up('sm')]: {
    minWidth: 0,
  },
  marginRight: theme.spacing(1),
  color: '#BDBDBD',
  fontWeight: 400,
  fontSize: pxToRem(16),
  lineHeight: pxToRem(24),
  '&:hover': {
    color: '#000000',
    opacity: 1,
  },
  '&.Mui-selected': {
    color: '#000000',
    fontWeight: theme.typography.fontWeightMedium,
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#d1eaff',
  },
}));
