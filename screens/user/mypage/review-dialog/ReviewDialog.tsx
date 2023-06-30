import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../models/root-store/root-store-context';
import {
  Dialog,
  useTheme,
  Button,
  Typography,
  Stack,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { pxToRem } from 'src/theme/typography';
import { PossibleReviewItem } from '../review-management/review-list-items/PossibleReviewItem';

/**
 * ## ReviewDialog 설명
 * 리뷰 작성 가능한 상품 리스트 팝업
 */

type Props = {
  handleClose: any;
  open: boolean;
};

export const ReviewDialog = observer(({ handleClose, open }: Props) => {
  const rootStore = useStores();
  const { myReviewStore, loadingStore } = rootStore;
  const theme = useTheme();

  const [check, setCheck] = useState(true);

  useEffect(() => {}, []);

  return (
    <>
      <Dialog
        open={open}
        PaperProps={{
          sx: {
            p: `${pxToRem(20)} !important`,
            borderRadius: `${pxToRem(20)} !important`,
            '@media (max-width: 600px)': {
              p: pxToRem(40),
              borderRadius: `${pxToRem(20)} !important`,
            },
            width: pxToRem(335),
            height: pxToRem(480),
            // maxHeight: '60%',
            justifyContent: myReviewStore.possibleReviews.length > 2 ? 'normal' : 'space-between',
          },
        }}
        onClose={() => {
          handleClose();
        }}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: `rgba(32,33,35, 0.5)`,
          },
          margin: '0 !important',
          zIndex: theme.zIndex.modal,
          padding: 0,
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'left',
            fontWeight: 600,
            fontSize: pxToRem(18),
            lineHeight: pxToRem(26),
            p: 0,
            pb: pxToRem(12)
          }}
        >
          리뷰를 남길 상품
        </DialogTitle>

        <DialogContent sx={{ p: 0, '&::-webkit-scrollbar': { display: 'none' }, }}>
          <Stack
            spacing={pxToRem(8)}
            sx={{
              overflowY: 'auto',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            <PossibleReviewItem isOrderHistory={true} />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: '0 !important', mt: 'auto' }}>
          <Button
            id={'btn-order-dialog-checkPossibleReview-cancel'}
            variant="outlined"
            size={'medium'}
            sx={{
              mt: pxToRem(10),
              borderRadius: pxToRem(500),
              width: '100%',
              color: '#9DA0A5',
              border: '1px solid #9DA0A5',
              '&:hover': {
                background:'none',
                border:'1px solid #9DA0A5'
              },
              fontSize: pxToRem(16),
              fontWeight: 500,
              lineHeight: pxToRem(19.09),
            }}
            onClick={() => {
              handleClose();
            }}
          >
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default ReviewDialog;
