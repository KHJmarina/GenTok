import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Button, Dialog, Divider, ListItemIcon, Stack, Typography, useTheme } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import isString from 'lodash/isString';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ReactComponent as IconDelete } from 'src/assets/icons/ico-review-delete.svg';
import { ReactComponent as IconStar } from 'src/assets/icons/ico-review-star.svg';
import CAlert from 'src/components/CAlert';
import { CHeader } from 'src/components/CHeader';
import Image from 'src/components/image/Image';
import { useStores } from 'src/models/root-store/root-store-context';
import Upload from './UploadReviewImage';
import { useForm } from 'react-hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import { IMyReview } from 'src/models/my-review/MyReview';
import { CallApiToStore } from 'src/utils/common';
import moment from 'moment';
import { pxToRem } from 'src/theme/typography';
import CTextField from 'src/components/forms/CTextField';
import Lightbox from 'yet-another-react-lightbox';

/**
 * ## WriteReview 설명
 *
 */
type Props = {
  handleClose?: VoidFunction;
  handleSave?: VoidFunction;
  type?: string;
}

export const WriteReview = observer(({ handleClose, handleSave, type }: Props) => {
  const rootStore = useStores();
  const { myReviewStore, loadingStore, responseStore } = rootStore;
  const theme = useTheme();
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const today = new Date().getTime();
  const navigate = useNavigate();

  const [clickStar, setClickStar] = useState(Array(5).fill(false));
  const [openNotice, setOpenNotice] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [regDt, setRegDt] = useState('');
  const [evalScore, setEvalScore] = useState(0);
  const [inputReview, setInputReview] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [attachImgPathList, setAttachImgPathList] = useState<string[]>([]);
  const [alertMsg, setAlertMsg] = useState('');
  let { page } = useParams();
  page = type ? type : page;
  const [lightBoxOpen, setLightBoxOpen] = useState(false);
  const [slides, setSlides] = useState<any>([]);
  const [lightBoxIndex, setLightBoxIndex] = useState(0);

  //종료 이벤트
  const closeEvent = handleClose ? handleClose : ()=>{ navigate(-1) }
  
  //저장 이벤트
  const saveEvent = handleSave ? handleSave : ()=>{ navigate(-1); navigate('/user/mypage/review?tab=myReview'); }

  // 검사 별점
  const handleClickStar = (index: number) => {
    const starStates = [...clickStar];

    for (let i = 0; i < starStates.length; i++) {
      starStates[i] = i <= index ? true : false;
    }
    setClickStar(starStates);
    setEvalScore(index + 1);
  };

  const onChangeInput = (e: any) => {
    setInputReview(e.target.value);
  };

  interface CustomFile extends File {
    path?: string;
    preview?: string;
  }

  const getFileData = (file: CustomFile) => {
    return {
      key: file.name,
      name: file.name,
      size: file.size,
      preview: file.preview,
    };
  };

  const handleAddImg = <T extends File>(acceptedFiles: T[]) => {
    if (files.length + acceptedFiles.length + attachImgPathList.length > 3) {
      setAlertMsg('이미지 첨부는 3개까지 가능합니다.');
      setOpenAlert(true);
    } else {
      acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) })); // 새로운 preview URL 매핑
      acceptedFiles.map((file) => setFiles((files: File[]) => [...files, file])); // 파일 복사
    }
  };

  const handleDeleteNewImg = (file: File) => {
    const newFiles = files.filter((f) => f !== file);
    setFiles(newFiles);
  };

  const handleDeleteAttachImg = (imgsrc: string) => {
    const newFiles = attachImgPathList.filter((_file) => _file !== imgsrc);
    setAttachImgPathList(newFiles);
  };

  const handleOpenNotice = (value: any) => {
    setOpenNotice(!openNotice);
  };

  const options: any = {
    showMainIcon: page === 'write' ? 'back' : 'none',
    handleMainIcon: page === 'write' ? closeEvent : null,
    showXIcon: page === 'edit' ? true : null,
    handleX: page === 'edit' ? closeEvent : null,
  };

  const getHeader = () => {
    switch (page) {
      case 'write':
        return (
          <CHeader
            title={'리뷰'}
            {...options}
          />
        );

      case 'edit':
        return (
          <CHeader
            title={'리뷰 수정'}
            {...options}
          />
        );
      
      default:
        break;
    }
  }

  const getDday = (day: number) => {
    const today = moment(new Date()).format();
    const deadlineDay = moment(new Date(day)).format();
    
    return moment(deadlineDay).diff(moment(today), 'days');
  }

  const showImage = (from: string, index: number) => {
    let tempArr = new Array<Object>;
    files.map((file) => {
      const { preview } = getFileData(file as CustomFile);
      tempArr.push({src: preview, width: 1000, height: 1500 });
    });

    attachImgPathList.map((image) => {
      tempArr.push({src: REACT_APP_IMAGE_STORAGE + image, width: 1000, height: 1500 });
    });
    setSlides([...tempArr]);
    setLightBoxOpen(true);

    if(from === 'files') {
      setLightBoxIndex(index);
    } else if(from === 'attachImage') {
      setLightBoxIndex(files.length+index);
    }
  }

  const [defaultValues, setdefaultValues] = useState<IMyReview>(myReviewStore.review);
  const methods = useForm<IMyReview>({
    defaultValues,
  });

  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async () => {
    const param: any = getValues();
    param.review = inputReview;
    param.evalScore = evalScore;
    param.attachImgPathList = attachImgPathList;

    const goodsSid = myReviewStore.review.goods?.goodsSid!;
    const orderNo = myReviewStore.review.orderNo!;
    if(page === 'write') {
      await CallApiToStore(
        myReviewStore.post(param as IMyReview, goodsSid, orderNo, files),
        'api', 
        loadingStore
      )
      .then(() => {
        if (responseStore.responseInfo.resultCode === 'S') {
          setOpenDialog(true);
        } else {
          if (responseStore.responseInfo) {
            setAlertMsg(responseStore.responseInfo.errorMessage || '');
            setOpenAlert(true);
          }
        }
      })
      .catch((e) => {
        console.error(e);
      });
    } else if(page === 'edit') {
        await CallApiToStore(
          myReviewStore.put(param as IMyReview, goodsSid, orderNo, files),
          'api',
          loadingStore
        )
        .then(() => {
          if (responseStore.responseInfo.resultCode === 'S') {
            setOpenDialog(true);
          } else {
            if (responseStore.responseInfo) {
              setAlertMsg(responseStore.responseInfo.errorMessage || '');
              setOpenAlert(true);
            }
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  useEffect(() => {
    if(page === 'write') {
      const dDay = getDday(myReviewStore.review.deadlineDay!);
      let deadlineDay = '';
      if(dDay === 0) {
        deadlineDay = ' (오늘까지)';
      } else {
        deadlineDay = ' (D-' + dDay + ')';
      }
      setRegDt( '작성기한 ' + moment(myReviewStore.review.deadlineDay!).format('YYYY. MM. DD') + deadlineDay );

    } else if(page === 'edit') {
      setInputReview(myReviewStore.review.review!);
      setAttachImgPathList(myReviewStore.review.attachImgPathList!);
      
      const starStates = [...clickStar];
      for (let i=0; i<5; i++) {
        starStates[i] = i < myReviewStore.review.evalScore! ? true : false;
      }
      setClickStar(starStates);
      setEvalScore(myReviewStore.review.evalScore!);
      setRegDt('작성일자 ' + moment(myReviewStore.review.regDt).format('YYYY. MM. DD'));
    } else {
      navigate(-1);
    }
  }, []);

  return (
    <Stack sx={{ p: '0px !important' }}>
      <Stack
        spacing={2}
        sx={{
          flex: 1,
          overflowX: 'hidden',
          overflowY: 'auto',
          scrollMarginTop: '100px',
        }}
      >
        {getHeader()}

        <Box sx={{ px: pxToRem(20) }}>
          <Box sx={{ width: '100%', mb: pxToRem(16), borderBottom: `1px solid ${theme.palette.divider}` }} justifyContent='space-between'>
            <Box sx={{ display: 'flex', pb: pxToRem(20) }}>
              <Image
                disabledEffect
                src={ myReviewStore.review.goods?.img1Path ? (REACT_APP_IMAGE_STORAGE + myReviewStore.review.goods?.img1Path) : '/assets/default-goods.svg' }
                sx={{ borderRadius: pxToRem(10), width: pxToRem(80), height: pxToRem(80), border: `${pxToRem(1)} solid #F5F5F5`, mr: pxToRem(10)}}
                onError={(e: any) => {
                  e.target.src = '/assets/default-goods.svg';
                }}
              />
              <Stack sx={{ textAlign: 'left' }}>
                <Typography variant={'Kor_12_r'} color={'#9DA0A5'}> 
                  {
                    myReviewStore.review.goods?.ctegryList && myReviewStore.review.goods?.ctegryList.length > 0
                    ? myReviewStore.review.goods?.ctegryList![0].ctegryNm
                    : <br />
                  }
                </Typography>
                <Typography variant={'Kor_16_b'} sx={{ mb: pxToRem(12) }}> {myReviewStore.review.goods?.goodsNm} </Typography>
                <Typography variant={'Kor_12_r'} color={page ==='write'? '#FF7F3F' : '#9DA0A5'}> {regDt} </Typography>
              </Stack>
            </Box>
          </Box>
        </Box>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ px: pxToRem(20) }}>
            <Typography variant={'Kor_16_b'} sx={{ textAlign: 'left' }}> 검사는 어떠셨나요? </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: pxToRem(28), borderBottom: `1px solid ${theme.palette.divider}` }}>
              {[...Array(5)].map((_, index: number) => (
                <Box
                  key={`star` + index}
                  sx={{ mr: pxToRem(12.62), cursor:'pointer', py: pxToRem(7), mb: pxToRem(28) }}
                  onClick={() => {
                    handleClickStar(index);
                  }}
                >
                  {clickStar[index] ? (
                    <IconStar fill={'#FF7F3F'} stroke={'#FF7F3F'} />
                  ) : (
                    <IconStar fill={'#EEEEEE'} stroke={'#EEEEEE'} />
                  )}
                </Box>
              ))}
            </Box>

            <Typography variant={'Kor_16_b'} sx={{ textAlign: 'left' }}> 자세한 후기를 들려주세요 </Typography>
            <Stack sx={{ display: 'flex', flexDirection: 'column', position: 'relative', mb: pxToRem(28), mt: pxToRem(8) }}>
              <CTextField
                label={''}
                variant={'outlined'}
                name={'review'}
                placeholder={"검사에 대한 평가를 작성해 주세요. (최소 10자이상)"}
                multiline
                sx={{
                  minHeight: 150,
                }}
                className={'reviewAreaSub'}
                onChangeCallback={onChangeInput}
              />
              <Box
                sx={{
                  display: 'flex',
                  position: 'absolute',
                  bottom: '10%',
                  right: '3%',
                  fontWeight: theme.typography.fontWeightRegular,
                  ml: 'auto',
                  background: '#FFFFFF'
                }}
              >
                <Typography sx={{ color: inputReview.trim().length === 0 ? '#DFE0E2' : '#202123' }}> {inputReview.trim().length}&nbsp; </Typography>
                <Typography sx={{ color: '#DFE0E2' }}> / 5,000 </Typography>
              </Box>
            </Stack>

            <Stack>
              <Box sx={{ display: 'flex', textAlign: 'left', mb: pxToRem(8) }}>
                <Typography variant={'Kor_16_b'}> 사진을 올려주세요. </Typography>
                <Typography variant={'Kor_16_r'} sx={{ ml: pxToRem(4) }} color={'#DFE0E2'}> (선택) </Typography>
              </Box>

              <Stack sx={{ display: 'flex', flexDirection: 'row', overflow: 'auto', mb: pxToRem(8) }}>
                <Upload
                  files={files}
                  showPreview={true}
                  width={100}
                  height={100}
                  onDrop={handleAddImg}
                />

                <AnimatePresence>
                  <>
                    {files.map((file: File, index: number) => {
                      const { key, name, preview } = getFileData(file as CustomFile);

                      return (
                        <Box sx={{ position: 'relative', mr: pxToRem(8) }} key={`image` + index}>
                          <Box
                            component={'img'}
                            src={isString(file) ? REACT_APP_IMAGE_STORAGE + file : preview}
                            sx={{
                              borderRadius: 0.625,
                              width: 100,
                              height: 100,
                              overflow: 'hidden',
                              objectFit: 'scale-down',
                              border: '1px solid #F5F5F5',
                            }}
                            onClick={() => {showImage('files', index)}}
                          />
                          <IconDelete
                            style={{
                              position: 'absolute',
                              top: '0.2%',
                              right: '0.2%',
                              overflow: 'hidden',
                            }}
                            onClick={() => {
                              handleDeleteNewImg(file);
                            }}
                          />
                        </Box>
                      );
                    })}

                    {attachImgPathList.map((path: string, index: number) => {
                      return (
                        <Box sx={{ position: 'relative' }} key={`attachImage` + index}>
                          <Box
                            component={'img'}
                            src={path ? (REACT_APP_IMAGE_STORAGE + path) : ''}
                            sx={{
                              borderRadius: 0.625,
                              width: 100,
                              height: 100,
                              overflow: 'hidden',
                              objectFit: 'scale-down',
                              border: '1px solid #F5F5F5',
                            }}
                            onClick={() => {showImage('attachImage', index)}}
                          />
                          <IconDelete
                            style={{
                              position: 'absolute',
                              top: '0.2%',
                              right: '0.2%',
                              overflow: 'hidden',
                            }}
                            onClick={() => {
                              handleDeleteAttachImg(path);
                            }}
                          />
                        </Box>
                      );
                    })}
                  </>
                </AnimatePresence>
              </Stack>

              <Typography
                variant={'Kor_12_r'}
                sx={{ textAlign: 'left', mb: pxToRem(24) }}
                color={'#BDBDBD'}
              >
                이미지는 JPEG, JPG, PNG, HEIC만 가능하며 최대 3개까지 첨부 가능합니다.
              </Typography>
            </Stack>
          </Box>

          <Stack>
            <Divider sx={{ borderColor: '#FAFAFA', borderWidth: pxToRem(4), mb: pxToRem(16) }} />

            <Box
              justifyContent="space-between"
              sx={{ display: 'flex', pl: pxToRem(20), pb: pxToRem(16), cursor:'pointer', borderBottom: `1px solid ${theme.palette.divider}` }}
              onClick={() => {
                handleOpenNotice(openNotice);
              }}
            >
              <Typography variant={'Kor_16_b'}>리뷰 작성 안내</Typography>
              <ListItemIcon sx={{ alignItems: 'center', color: '#d4d4d4' }}>
                {openNotice ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </ListItemIcon>
            </Box>

            {openNotice && (
              <Box sx={{ width: '100%', background: '#FAFAFA', p: pxToRem(20), textAlign: 'start' }}>
                <Typography variant={'Kor_14_r'}>
                  게시된 리뷰의 권리와 책임은 게시당사자에게 있으며, 마크로젠 이용자가 작성한 리뷰
                  등을 이용하여 서비스 운영등에 활용할 수 있습니다. 이 때 리뷰는 모두 공개를
                  원칙으로 하되, 공개의 방법은 마크로젠의 서비스 정책에 따라 변경될 수 있습니다.
                </Typography>
              </Box>
            )}

            <Button
              id={page == 'write' ? `btn-my-review-completeRegisterReview` : `btn-my-review-completeModifyReview`}
              disabled={evalScore === 0 || inputReview.trim().length < 10 || myReviewStore.isPending}
              variant={'contained'}
              size={'large'}
              type={'submit'}
              sx={{ borderRadius: pxToRem(999), mx: pxToRem(20), my: pxToRem(40), '&:hover':{ background:'#FF5D0C !important' } }}
            >
              {page === 'write' ? '리뷰 등록 하기' : '수정 완료'}
            </Button>
          </Stack>
        </FormProvider>

        {openDialog && (
          <Dialog
            open={openDialog}
            PaperProps={{
              sx: {
                px: `${pxToRem(20)} !important`,
                borderRadius: `${pxToRem(25)} !important`,
                '@media (max-width: 600px)': {
                  borderRadius: `${pxToRem(25)} !important`,
                },
                width: pxToRem(282),
                height: pxToRem(241)
              },
            }}
            onClose={() => {
              setOpenDialog(false);
            }}
            sx={{
              '& .MuiBackdrop-root':{
                backgroundColor:`rgba(32,33,35, 0.5)`
              },
              margin: '0 !important',
              zIndex: theme.zIndex.modal,
              padding: 0,
            }}
          >
            <Stack>
              <Typography variant={'Kor_18_b'} sx={{ textAlign: 'center', fontWeight: 600, pt: pxToRem(42), mb: pxToRem(12) }}>
                리뷰가 등록 됐어요!
              </Typography>
              <Typography
                variant={'Kor_16_r'}
                sx={{ mb: pxToRem(28), textAlign: 'center' }}
                color={'#9DA0A5'}
              >
                작성한 후기는 [작성한 리뷰]에서 <br /> 확인 가능합니다.{' '}
              </Typography>
              <Button
                id={page == 'write' ? `btn-my-review-dialog-registerReview` : `btn-my-review-dialog-modifyReview`}
                variant="contained"
                size={'large'}
                sx={{ borderRadius: pxToRem(500), '&:hover':{ background:'#FF5D0C !important' }  }}
                onClick={saveEvent}
              >
                확인
              </Button>
            </Stack>
          </Dialog>
        )}

        <CAlert
          isAlertOpen={openAlert}
          alertTitle={alertMsg}
          hasCancelButton={false}
          alertCategory={'error'}
          handleAlertClose={() => {
            setOpenAlert(false);
          }}
        />
      </Stack>
      <Lightbox
        open={lightBoxOpen}
        close={() => setLightBoxOpen(false)}
        slides={slides}
        index={lightBoxIndex}
      />
    </Stack>
  );
});

export default WriteReview;
