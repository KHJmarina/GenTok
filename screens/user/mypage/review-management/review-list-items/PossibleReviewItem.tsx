import { Box, Stack, Typography, List, ListItem, ListItemIcon, Dialog, useTheme } from '@mui/material';
import { observer } from "mobx-react-lite";
import { useState, useEffect } from 'react';
import { useStores } from "src/models/root-store/root-store-context";
import { useNavigate } from 'react-router';
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Image from 'src/components/image/Image';
import { ReactComponent as IconReview } from 'src/assets/icons/ico-review.svg';
import moment from 'moment';
import { toJS } from 'mobx';
import { pxToRem } from 'src/theme/typography';
import { useScroll } from 'framer-motion';
import WriteReview from '../WriteReview';
import { CallApiToStore } from 'src/utils/common';

/**
 * ## PossibleReviewItem 설명
 * 
 */

interface Props {
  setValue?: any;
  isOrderHistory? : boolean;
}

export const PossibleReviewItem = observer(({setValue, isOrderHistory}: Props) => {
  const rootStore = useStores();
  const { loadingStore, myReviewStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const [openWriteDialog, setOpenWriteDialog] = useState(false);
  const { scrollYProgress } = useScroll();

  const getDday = (day: number) => {
    const today = moment(new Date()).format();
    const deadlineDay = moment(new Date(day)).format();
    
    return moment(deadlineDay).diff(moment(today), 'days');
  }

  const handleWrite = (review: any) => {
    myReviewStore.setProps({
      review: {...toJS(review)}
    });

    if(isOrderHistory) {
      // navigate(`/user/mypage/review-management/write`);
      setOpenWriteDialog(true);
      window.history.pushState(null,'',window.location.href);
    } else {
      setOpenWriteDialog(true);
      window.history.pushState(null,'',window.location.href);
    }
  }

  const closeWriteDialog = () => {   
    setOpenWriteDialog(false);
  };

  const saveReview = () => {
    if(!isOrderHistory) {
      setValue('myReview');
    }
    setOpenWriteDialog(false);

    // 작성가능한 리뷰 목록 조회
    CallApiToStore(myReviewStore.getPossibles({ page: 1 }), 'api', loadingStore)
    .then(() => { 
    })
    .catch((e) => {
      console.log(e);
    });

    // 작성한 리뷰 목록 조회
    CallApiToStore(myReviewStore.gets({ page: 1 }), 'api', loadingStore)
    .then(() => { 
    })
    .catch((e) => {
      console.log(e);
    });

  }

  useEffect(() => {
    
    window.addEventListener('popstate', () => {
      setOpenWriteDialog(false);
    })
    
    
    scrollYProgress.on('change', (v) => {
      if (v == 1) {
        myReviewStore?.nextPossibles?.();
      }
    });
  }, [myReviewStore, scrollYProgress]);

  return (
    <>
      {myReviewStore.possibleReviews &&
        <Stack>
          { myReviewStore.possibleReviews.length === 0
            ? (<Stack alignItems='center' sx={{ pt: pxToRem(72) }}>
                <IconReview fill={'#9DA0A5'} />
                <Typography variant={'Kor_16_r'} sx={{ pt: pxToRem(22) }} color={'#C6C7CA'}>
                  작성할 수 있는 리뷰가 없어요.
                </Typography>
              </Stack> 
            )
            : (myReviewStore.possibleReviews.map((review, index) => {
                return (
                  <Stack key={index} sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <List sx={{ mx: isOrderHistory ? 0 : pxToRem(20), my: pxToRem(20), py: 0, cursor:'pointer' }}>
                      <ListItem sx={{ py: 0, px:0 }} onClick={() => { handleWrite(review) }}>
                        <Stack direction={'row'} sx={{ width: '100%' }} justifyContent='space-between'>
                          <Box sx={{ display: 'flex' }}>
                            <Box sx={{ mr: pxToRem(10) }}>
                              <Image
                                src={ review.goods?.img1Path? (REACT_APP_IMAGE_STORAGE + review.goods?.img1Path) : '/assets/default-goods.svg'}
                                sx={{ borderRadius: pxToRem(10), width: pxToRem(80), height: pxToRem(80), border: `${pxToRem(1)} solid #F5F5F5` }}
                                onError={(e: any) => {
                                  e.target.src = '/assets/default-goods.svg';
                                }}
                              />
                            </Box>
                            <Stack sx={{ textAlign: 'left' }}>
                              <Typography variant={'Kor_12_r'} color={'#9DA0A5'}> 
                                {
                                  review.goods?.ctegryList && review.goods?.ctegryList.length > 0
                                  ? review.goods?.ctegryList![0].ctegryNm
                                  : <br />
                                }
                              </Typography>
                              <Typography variant={'Kor_16_b'} sx={{ mb: pxToRem(12) }}> {review.goods?.goodsNm} </Typography>
                              <Typography variant={'Kor_12_r'} color={'#FF7F3F'}> 
                                작성기한 {moment(review.deadlineDay).format('YYYY. MM. DD')} &nbsp;
                                { getDday(review?.deadlineDay!) === 0
                                  ? '오늘까지'
                                  : `(D-${getDday(review?.deadlineDay!)})`
                                }

                              </Typography>
                            </Stack>
                          </Box>
                          <ListItemIcon sx={{ alignItems: 'center' }}>
                            <ArrowRightIcon sx={{ color: '#DFE0E2' }} />
                          </ListItemIcon>
                        </Stack>
                      </ListItem>
                    </List>
                  </Stack>
                )
              })
            )
          }   

          {
            openWriteDialog && (
              <Dialog
                fullWidth
                keepMounted
                maxWidth={'md'}
                open={openWriteDialog}
                PaperProps={{
                  sx: {
                    p: 0,
                    m: 0,
                    maxHeight: '100%',
                    minHeight: '100%',
                    borderRadius: '0 !important',
                    '@media (max-width: 600px)': {
                      margin: 0,
                    },
                  },
                }}
                onClose={() => {
                  setOpenWriteDialog(false);
                  navigate(-1)
                }}
                sx={{
                  margin: '0 !important',
                  // zIndex: 10000,
    
                  padding: 0,
                  borderRadius: 0,
                }}
              >
                <WriteReview 
                  handleClose={closeWriteDialog} 
                  handleSave={saveReview} 
                  type={'write'} 
                />
              </Dialog>        
            )
          }
        </Stack>
      } 
    </>
  );
});

export default PossibleReviewItem;
