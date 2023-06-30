import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "src/models/root-store/root-store-context"
import { useTheme } from '@mui/material';

/**
 * ## ResultId 설명
 *
 */
export const ResultId = observer(() => {

  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();

  return (
    <>
      <Box>
        ResultId Screen
      </Box>
    </>
  );
});

export default ResultId;