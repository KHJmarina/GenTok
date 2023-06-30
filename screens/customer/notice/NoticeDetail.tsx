import React from 'react';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/models/root-store/root-store-context';
import { Stack, useTheme } from '@mui/material';
import { CustomerHeader } from 'src/components/CustomerHeader';
import moment from 'moment';
import { HEADER } from 'src/config-global';
import parse from 'html-react-parser';
import { pxToRem } from 'src/theme/typography';
import BackHeader from 'src/components/BackHeader';
/**
 * ## Notice 설명
 *
 */

interface propTypes {
  handleClose: VoidFunction;
}

export const NoticeDialog = observer(({ handleClose }: propTypes) => {
  const rootStore = useStores();
  const { noticeStore } = rootStore;
  const theme = useTheme();

  return (
    <>
      <Stack>
        <BackHeader title="공지사항" handleClose={handleClose} />
        <Box sx={{ pb: `${HEADER.H_MOBILE * 2}px` }}>
          <Box
            sx={{
              p: pxToRem(20),
              borderBottom: `1px solid ${theme.palette.grey[200]}`,
            }}
          >
            <Box
              sx={{
                fontWeight: 600,
                lineHeight: 30 / 22,
                fontSize: pxToRem(22),
                letterSpacing: '-0.03em',
                pt: pxToRem(17),
              }}
            >
              {noticeStore.notice.noticeNm}
            </Box>
            <Box
              sx={{
                fontWeight: 400,
                lineHeight: 22 / 14,
                fontSize: pxToRem(14),
                color: theme.palette.grey[400],
                pt: pxToRem(5),
              }}
            >
              {moment().format('yyyy/MM/DD')}
            </Box>
          </Box>
          <Box
            sx={{
              fontWeight: 400,
              lineHeight: 24 / 16,
              fontSize: pxToRem(16),
              letterSpacing: '-0.03em',
              px: pxToRem(20),
              pt: pxToRem(20),
            }}
          >
            {parse(noticeStore.notice.noticeConts.replace(/(?:\r\n|\r|\n)/gi, '<br/>'))}
          </Box>
        </Box>
      </Stack>
    </>
  );
});

export default NoticeDialog;
