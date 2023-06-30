import Box from '@mui/material/Box';
import {
  Stack,
  useTheme,
  Typography,
  List,
  ListItem,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../../../models/root-store/root-store-context';
import { pxToRem } from 'src/theme/typography';
import { useAuthContext } from 'src/auth/useAuthContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toJS } from 'mobx';

/**
 * ## GenoPrivacyActList 설명
 *
 */
export const GenoPrivacyActList = observer(() => {

  const rootStore = useStores();
  const { dnaCardDetailStore, loadingStore } = rootStore;
  const theme = useTheme();

  return (
    <>
    <Accordion
      sx={{
        mb: pxToRem(12),
        border: '1px solid #EEEEEE',
        borderRadius: '10px',
        overflowX: 'scroll',
        background: '#FAFAFA',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        justifyContent: 'center',
        '&.MuiAccordion-root.Mui-expanded': {
          mt: 0,
          backgroundColor: '#FAFAFA',
          boxShadow: 'none',
        },
        '&.MuiAccordion-root.Mui-expanded:before': {
          opacity: 1,
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.accordion }} />}
        sx={{
          // my: 1,
          pl: 3,
          pr: 3,
          width: '100%',
          height: '3.75rem',
          backgroundColor: '#FAFAFA',
          // border: '1px solid #EEEEEE',
          // borderRadius: '10px',
        }}
      >
        <Typography>(재)국가생명윤리정책원의 안내 사항</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List sx={{ listStyleType: 'number', px:pxToRem(16) }}>
          {dnaCardDetailStore.dnaCardDetail.attention?.genoPrivacyActList?.map(
            (list: any, index: number) => {
              return (
                <ListItem key={index} sx={{ display: 'list-item', px: 0, pb: 1, fontSize: pxToRem(14) }}>
                  {list}
                </ListItem>
              );
            },
          )}
        </List>
      </AccordionDetails>
    </Accordion>
  </>
  );
});

export default GenoPrivacyActList;