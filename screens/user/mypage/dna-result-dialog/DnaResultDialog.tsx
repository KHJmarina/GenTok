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
  List,
  ListItem,
  ListItemIcon,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { pxToRem } from 'src/theme/typography';
import Image from 'src/components/image/Image';
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { PATH_ROOT } from 'src/routes/paths';
import { useNavigate } from 'react-router';
import { getImagePath } from 'src/utils/common';

/**
 * ## DnaResultDialog 설명
 *
 */
type Props = {
  handleClose: any;
  open: boolean;
};

export const DnaResultDialog = observer(({ handleClose, open }: Props) => {
  const rootStore = useStores();
  const { loadingStore, orderHistoryStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const { REACT_APP_IMAGE_STORAGE } = process.env;

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
            justifyContent:
              orderHistoryStore.orderHistory?.userTestResultList?.length! < 3
                ? 'space-between'
                : 'normal',
          },
        }}
        onClose={handleClose}
        sx={{
          '& .MuiBackdrop-root':{
            backgroundColor:`rgba(32,33,35, 0.5)`
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
          결과확인
        </DialogTitle>

        <DialogContent sx={{ p: 0, '&::-webkit-scrollbar': { display: 'none' }, }}>
          <Stack>
            {orderHistoryStore.orderHistory?.userTestResultList?.length === 0 ? (
              <Stack alignItems="center" sx={{ pt: 10 }}>
                <Typography variant={'body1'} sx={{ pt: 2 }} color={theme.palette.grey[300]}>
                  확인 가능한 검사결과가 없어요.
                </Typography>
              </Stack>
            ) : (
              orderHistoryStore.orderHistory?.userTestResultList?.map((item, index) => {
                return (
                  <Stack key={index}>
                    <List sx={{ py: 0, borderBottom: `1px solid ${theme.palette.divider}` }}>
                      <ListItem
                        onClick={() => {
                          // navigate(PATH_ROOT.user.mypage.dnaCard, { state:{ ctegryNm: item.ctegryList[0]?.ctegryNm, ctegrySid: item.ctegryList[0]?.ctegrySid, ordr: item.ctegryList[0]?.ordr }})
                          // navigate(PATH_ROOT.user.mypage.dnaCard, { state:{ ctegryNm: item.ctegryList[0]?.ctegryNm, ctegrySid: item.ctegryList[0]?.ctegrySid, ordr: item.ctegryList[0]?.ordr }})
                          item.singleGoodsSid
                            ? navigate(
                                `${PATH_ROOT.user.mypage.dnaCard}/${item.singleGoodsSid}`,{replace: true}
                              )
                            : navigate(`${PATH_ROOT.user.mypage.dnaCard}/${item.goodsSid}`,{replace:true});
                        }}
                        sx={{ px: 0, py:0 }}
                      >
                        <Stack
                          direction={'row'}
                          sx={{ width: '100%' }}
                          justifyContent="space-between"
                        >
                          <Box sx={{ display: 'flex', py: pxToRem(12) }} borderRadius={2}>
                            <Image
                              disabledEffect
                              src={getImagePath(item.testResultImgPath || '')}
                              sx={{
                                borderRadius: 1,
                                width: 80,
                                height: 80,
                                border: '1px solid #F5F5F5',
                                mr: pxToRem(10),
                              }}
                              onError={(e: any) => {
                                e.target.src = '/assets/default-goods.svg';
                              }}
                            />
                            <Stack justifyContent={'center'}>
                              <Typography variant={'caption'} color={'#9DA0A5'}>
                                {' '}
                                {item.ctegryList[0]?.ctegryNm}{' '}
                              </Typography>
                              <Typography variant={'subtitle1'} sx={{ color: '#202123' }}>
                                {' '}
                                {item.goodsNm}{' '}
                              </Typography>
                            </Stack>
                          </Box>
                          <ListItemIcon sx={{ alignItems: 'center' }}>
                            <ArrowRightIcon sx={{ color: '#d4d4d4' }} />
                          </ListItemIcon>
                        </Stack>
                      </ListItem>
                    </List>
                  </Stack>
                );
              })
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: '0 !important', mt: 'auto' }}>
          <Button
            id={'btn-order-dialog-checkResult-cancel'}
            variant="outlined"
            size={'medium'}
            sx={{
              mt: pxToRem(10),
              borderRadius: pxToRem(500),
              width: '100%',
              color: '#9DA0A5',
              border: '1px solid #9DA0A5',
              '&:hover':
              {
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

export default DnaResultDialog;
