import { Box } from '@mui/material';
import Tab, { TabProps } from '@mui/material/Tab';
import Tabs, { TabsProps } from '@mui/material/Tabs';
import { styled } from '@mui/material/styles';
import { observer } from 'mobx-react-lite';
import React from 'react';
import Image from 'src/components/image/Image';
import { ICategoryModel, ICategoryModelSnapshot } from 'src/models/market-store/Category';
import { pxToRem } from 'src/theme/typography';

const MarketTabs = styled((props: StyledTabsProps) => <Tabs {...props} />)(({ theme }) => ({
  // borderBottom: '1px solid #e8e8e8',
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: '1px',
  },
  // paddingBottom: pxToRem(18),
  // paddingLeft: pxToRem(20),
  // paddingRight: pxToRem(20),
  // marginRight: theme.spacing(2.5),
  // transform: `translateX(${theme.spacing(2.5)}px)`,
  '& .MuiTabs-flexContainer': {
    paddingRight: '20px',
    display: 'block',
    width: 'fit-content',
  },
}));

const MarketTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    minWidth: 0,
    [theme.breakpoints.up('sm')]: {
      minWidth: 0,
    },
    alignItems: 'flex-end',
    margin: '0 10px 4px 10px !important',
    minHeight: pxToRem(40),
    fontSize: pxToRem(16),
    // lineHeight: pxToRem(24),
    letterSpacing: '-3%',
    marginRight: theme.spacing(1),
    color: '#000000 !important',
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover': {
      // color: `${theme.palette.primary.main} !important`,
      opacity: 1,
    },
    '&.Mui-selected': {
      color: `${theme.palette.primary.main} !important`,
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:first-of-type': {
      marginLeft: `${pxToRem(20)} !important`,
    },
    '&:last-of-type': {
      marginRight: `${pxToRem(20)} !important`,
    },
  }),
);

interface StyledTabsProps extends TabsProps {}

interface StyledTabProps extends TabProps {}

export interface IMenubarProps {
  categories: ICategoryModel[] | ICategoryModelSnapshot[];
  category?: number;
  onChangeCategory?: (newValue: number) => void;
}

export const Menubar = observer(
  ({ categories = [], category = 0, onChangeCategory }: IMenubarProps) => {
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      onChangeCategory?.(newValue);
    };

    return (
      <>
        <MarketTabs
          value={categories.findIndex((c) => c.ctegrySid === category)}
          onChange={handleChange}
          variant="scrollable"
          // scrollButtons="auto"
          scrollButtons={false}
          allowScrollButtonsMobile
          aria-label="menu bar"
        >
          {categories.map((category) => (
            <MarketTab key={category.ctegrySid} label={category.ctegryNm!} />
          ))}
        </MarketTabs>
        <CategoryBanner category={categories.find((c) => c.ctegrySid === category)} />
      </>
    );
  },
);

const CategoryBanner = observer(({ category }: { category?: ICategoryModelSnapshot }) => {
  return (
    <>
      {category && category.bannerPath ? (
        <Box sx={{ py: pxToRem(18), px: pxToRem(20) }}>
          <Image
            effect="opacity"
            onError={(e: any) => (e.target.src = '/assets/default-goods.svg')}
            src={category.bannerPath}
            alt={category.ctegryNm || ''}
            sx={{ width: '100%' }}
          />
        </Box>
      ) : (
        <Box sx={{ height: pxToRem(20) }}></Box>
      )}
    </>
  );
});
