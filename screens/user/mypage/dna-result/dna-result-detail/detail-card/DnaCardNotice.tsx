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
import { useStores } from '../../../../../../models/root-store/root-store-context';
import { pxToRem } from 'src/theme/typography';
import { useAuthContext } from 'src/auth/useAuthContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TestMeaningList from './dna-card-notice/TestMeaningList';
import PersonalPrivacyActList from './dna-card-notice/PersonalPrivacyActList';
import GenoPrivacyActList from './dna-card-notice/GenoPrivacyActList';
import CautionList from './dna-card-notice/CautionList';
import ReferenceList from './dna-card-notice/ReferenceList';
/**
 * ## DnaCardNotice 설명
 *
 */
export const DnaCardNotice = observer(() => {
  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();

  return (
    <>
      <Box sx={{ backgroundColor: '#FAFAFA', width: '100%', p: 2.5, pb: 4 }}>
        <Typography
          sx={{ fontSize: pxToRem(18), fontWeight: '600', textAlign: 'left', pt: 2, pb: 2 }}
        >
          유의사항
        </Typography>

        <TestMeaningList />
        <PersonalPrivacyActList />
        <GenoPrivacyActList />
        <CautionList />
        <ReferenceList />
      </Box>
    </>
  );
});

export default DnaCardNotice;
