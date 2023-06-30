import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { Stack, useTheme } from '@mui/material';
import { CustomerHeader } from 'src/components/CustomerHeader';
import { useStores } from 'src/models';
import { HEADER } from 'src/config-global';
import parse from 'html-react-parser';
import { pxToRem } from 'src/theme/typography';
import BackHeader from 'src/components/BackHeader';

/**
 * ## 기능 설명
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */

type FaqItem = {
  id: number;
  question: string;
  answer: string;
  type: string;
};

interface propTypes {
  handleClose: VoidFunction;
}
export const FaqDetail = observer(({ handleClose }: propTypes) => {
  const theme = useTheme();
  const rootStore = useStores();
  const { faqStore } = rootStore;

  return (
    <>
      <BackHeader title="자주 찾는 질문 (FAQ)" handleClose={handleClose} />
      <Stack
        sx={
          {
            // position: 'sticky',
            // scrollMarginTop: '150px',
            // overflowX: 'scroll',
            // '&::-webkit-scrollbar': {
            //   display: 'none',
            // },
          }
        }
      >
        <Box sx={{ pb: `${HEADER.H_MOBILE * 2}px` }}>
          <Box
            sx={{
              borderBottom: `1px solid ${theme.palette.grey[200]}`,
              px: pxToRem(20),
            }}
          >
            <Box
              sx={{
                fontWeight: 400,
                lineHeight: 22 / 14,
                fontSize: pxToRem(14),
                color: theme.palette.grey[400],
                mt: pxToRem(10),
                mb: pxToRem(5),
              }}
            >
              {faqStore.faq.faqTypeCd?.value}
            </Box>
            <Box
              sx={{
                fontWeight: 600,
                lineHeight: 30 / 22,
                fontSize: pxToRem(22),
                letterSpacing: '-0.03em',
                mb: pxToRem(20),
              }}
            >
              {faqStore.faq.faqNm}
            </Box>
          </Box>
          <Box
            sx={{
              fontWeight: 400,
              lineHeight: 24 / 16,
              fontSize: pxToRem(16),
              letterSpacing: '-0.03em',
              px: pxToRem(20),
              pt: pxToRem(10),
            }}
          >
            {parse(faqStore.faq.faqConts.replace(/(?:\r\n|\r|\n)/gi, '<br/>'))}
          </Box>
        </Box>
      </Stack>
    </>
  );
});
