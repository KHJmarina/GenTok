import { Box, Stack, Typography, List, ListItem, ListItemIcon, Dialog, useTheme } from '@mui/material';
import { observer } from "mobx-react-lite";
import { useState, useEffect } from 'react';
import { useStores } from "src/models/root-store/root-store-context";
import ArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Image from 'src/components/image/Image';
import { ReactComponent as IconReview } from 'src/assets/icons/ico-review.svg';
import { ReactComponent as IconStar } from 'src/assets/icons/ico-review-star.svg';
import { ReactComponent as IconEdit } from 'src/assets/icons/ico-review-edit.svg';
import moment from 'moment';
import { toJS } from 'mobx';
import { pxToRem } from 'src/theme/typography';
import WriteReview from '../WriteReview';
import { CallApiToStore } from 'src/utils/common';
import Lightbox from 'yet-another-react-lightbox';
import { useScroll } from 'framer-motion';

/**
 * ## ReviewItem 설명
 * 
 */

export const ReviewItem = observer(() => {
  const rootStore = useStores();
  const { loadingStore, myReviewStore } = rootStore;
  const theme = useTheme();
  const [reviewOpen, setReviewOpen] = useState(Array(myReviewStore.reviews.length).fill(false));
  const [lightBoxOpen, setLightBoxOpen] = useState(false);
  const [slides, setSlides] = useState<any>([]);
  const [lightBoxIndex, setLightBoxIndex] = useState(0);
  
  const [callApi, setCallApi] = useState(false);
  const [openWriteDialog, setOpenWriteDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(0);
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const { scrollYProgress } = useScroll();

  const handleReviewDetail = (index: any) => {
    const reviewStates = [...reviewOpen];
    reviewStates[index] = !reviewOpen[index];
    
    setReviewOpen(reviewStates);
  };

  const handleEdit = (index: number, goodsSid: number) => {
    // navigate(`/user/mypage/review-management/edit`); //리뷰작성 다이어로그 화면으로 변경
    setOpenWriteDialog(true);
    setSelectedReview(goodsSid);
    myReviewStore.setProps({
      review: {...toJS(myReviewStore.reviews[Number(index!)])}
    });
    window.history.pushState(null,'',window.location.href);
  };

  const closeWriteDialog = () => {    
    setOpenWriteDialog(false);
  };

  const writeDialog = () => {
    setReviewOpen(Array(myReviewStore.reviews.length).fill(false));
    setOpenWriteDialog(false);

    // 작성한 리뷰 목록 조회
    CallApiToStore(myReviewStore.gets({ page: 1 }), 'api', loadingStore)
    .then(() => { 
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
      setCallApi(!callApi);
    })
    .catch((e) => {
      console.log(e);
    });
  };

  const showImage = (reviewIndex: number, imageIndex: number) => {
    let tempArr = new Array<Object>;
    myReviewStore.reviews[reviewIndex].attachImgPathList?.map((image) => {
      tempArr.push({src: REACT_APP_IMAGE_STORAGE + image, width: 1000, height: 1500 });
    });
    setSlides([...tempArr]);
    setLightBoxOpen(true);
    window.history.pushState(null,'',window.location.href);
    setLightBoxIndex(imageIndex);
  }

  const getDday = (day: number) => {
    const today = moment(new Date()).format();
    const deadlineDay = moment(new Date(day)).format();
    
    return moment(deadlineDay).diff(moment(today), 'days');
  };

  useEffect(()=>{
    window.addEventListener('popstate', () => {
      setOpenWriteDialog(false);
      setLightBoxOpen(false);
    })
    
    myReviewStore.reviews.map((review: any, index: number) => {
      if(review.goodsSid == selectedReview){
        handleReviewDetail(index);
      }
    })
    
    scrollYProgress.on('change', (v) => {
      if (v == 1) {
        myReviewStore?.next?.();
      }
    });
  }, [callApi, myReviewStore, scrollYProgress]);

  return (
    <>
      {myReviewStore.reviews &&
        <Stack>
          { myReviewStore.reviews.length === 0
            ? ( <Stack alignItems='center' sx={{ pt: pxToRem(72) }}>
                  <IconReview fill={'#9DA0A5'}/>
                  <Typography variant={'Kor_16_r'} sx={{ pt: pxToRem(22) }} color='#C6C7CA'>
                    작성한 리뷰가 없어요.
                  </Typography>
                </Stack>
              )
            : ( myReviewStore.reviews.map((review: any, reviewIndex: number) => {
                  return (
                    <Stack key={reviewIndex} sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                      <List sx={{ m: pxToRem(20), py: 0, cursor:'pointer' }}>
                        <ListItem sx={{ p: 0, cursor:'pointer' }} onClick={() => {handleReviewDetail(reviewIndex)}}>
                          <Stack direction={'row'} sx={{ width: '100%' }} justifyContent='space-between'>
                            <Box sx={{ display: 'flex' }}>
                              <Box sx={{ mr: pxToRem(10) }}>
                                <Image
                                  src={ review.goods?.img1Path ? (REACT_APP_IMAGE_STORAGE + review.goods?.img1Path) : '/assets/default-goods.svg'}
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
                                <Typography variant={'Kor_16_b'} sx={{ mb: pxToRem(12) }}> {review.goods?.goodsNm || ''} </Typography>
                                <Typography variant={'Kor_12_r'} color={'#9DA0A5'}> 작성일자 {moment(review.regDt).format('YYYY. MM. DD')} </Typography>
                              </Stack>
                            </Box>
                            <ListItemIcon sx={{ alignItems: 'center', color: '#d4d4d4' }}> 
                              { reviewOpen[reviewIndex] ? <ArrowUpIcon /> : <ArrowDownIcon /> }
                            </ListItemIcon>
                          </Stack>
                        </ListItem>
                      </List>
              
                      <Box>
                        { reviewOpen[reviewIndex] && (
                            <Stack sx={{ background: '#FAFAFA', borderTop: `1px solid ${theme.palette.divider}` }}>
                              <Stack sx={{ m: pxToRem(20) }}>
                                <Box sx={{ display:'flex', mb: pxToRem(10) }}>
                                  {[...Array(review.evalScore)].map((_, index: number) => (
                                    <Box key={index} sx={{ mr: pxToRem(5.68) }}>
                                      <IconStar fill={'#FF7F3F'} stroke={'#FF7F3F'} width={15} height={15}/>
                                    </Box>
                                  ))}
                                  {[...Array(5-review?.evalScore || 0)].map((_, index: number) => (
                                    <Box key={index} sx={{ mr: pxToRem(5.68) }}>
                                      <IconStar fill={'#EEEEEE'} stroke={'#EEEEEE'} width={15} height={15} />
                                    </Box>
                                  ))}
                                  <Typography variant={'Kor_16_b'} sx={{ color: '#202123', textAlign: 'center', ml: pxToRem(5.68) }}> {review.evalScore} </Typography>
                                  <Box id={'btn-my-review-modify'} sx={{ marginLeft: 'auto' }} onClick={ () => handleEdit(reviewIndex, review.goodsSid) }>
                                    {getDday(review.deadlineDay) >= 0 && <IconEdit style={{ cursor:'pointer' }}/>}
                                  </Box>
                                </Box>
                                <Typography variant='Kor_14_r' sx={{ textAlign: 'left', mb: pxToRem(8), whiteSpace: 'pre-wrap' }}>{review.review}</Typography>

                                { review.attachImgPathList?.length > 0 && ( 
                                  <Stack sx={{ pt: pxToRem(30) }}>
                                    <Typography variant={'Kor_14_b'} sx={{ textAlign: 'left', color: '#9E9E9E', mb: pxToRem(4) }}> 첨부된 사진 </Typography>
                                    <Box sx={{ display: 'flex' }}> 
                                      {[...Array(review.attachImgPathList?.length || 0)].map((_, imageIndex: number) => (
                                        <Image
                                          disabledEffect
                                          key={imageIndex}
                                          src={review.attachImgPathList![imageIndex]? (REACT_APP_IMAGE_STORAGE + review.attachImgPathList![imageIndex]) : '/assets/default-goods.svg'}
                                          sx={{ borderRadius: pxToRem(5), mr: pxToRem(7), width: pxToRem(101), height: pxToRem(100), border: `${pxToRem(1)} solid #F5F5F5` }}
                                          onError={(e: any) => {
                                            e.target.src = '/assets/default-goods.svg';
                                          }}
                                          onClick={() => {showImage(reviewIndex, imageIndex)}}
                                        />
                                      ))}
                                    </Box>
                                  </Stack>
                                )}
                              </Stack>
                            </Stack>
                          )
                        }
                      </Box>
                    </Stack>
                  )
                }
              )
            )
          }
        </Stack>
      }

      {
        openWriteDialog && (
          <Dialog
            fullWidth
            keepMounted
            maxWidth={'md'}
            open={openWriteDialog}
            // TransitionComponent={Transition}
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
            }}
            sx={{
              margin: '0 !important',
              zIndex: 100,

              padding: 0,
              borderRadius: 0,
            }}
          >
            <WriteReview handleClose={closeWriteDialog} handleSave={writeDialog} type={'edit'} />
          </Dialog>
        )
      }

      <Lightbox
        open={lightBoxOpen}
        close={() => setLightBoxOpen(false)}
        slides={slides}
        index={lightBoxIndex}
      />
    </>
  );
});

export default ReviewItem;