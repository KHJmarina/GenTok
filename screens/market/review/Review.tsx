import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "src/models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import { Page } from '../../../components/Page';

/**
 * ## Review 설명
 *
 */
export const Review = observer(() => {

  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();

  return (
    <Page  title='DNA Market - Review' sx={{p: '20px'}}>
      <Box>
        Review Screen
      </Box>
    </Page>
  );
});

export default Review;