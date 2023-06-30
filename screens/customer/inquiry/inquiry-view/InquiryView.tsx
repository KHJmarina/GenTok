import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';

// style
import { Button, IconButton, ListItem, Stack, Typography, useTheme, Select, MenuItem, Dialog, Divider, FormControl, FormHelperText, Slide, FormControlLabel, Checkbox } from '@mui/material';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import CTextField from 'src/components/forms/CTextField';
import FileUpload from '../FileIcon';
import { Icon } from '@iconify/react';

import FormProvider from 'src/components/hook-form/FormProvider';
import { Controller, useForm } from 'react-hook-form';
import { IInquirySnapshot } from 'src/models/inquiry/Inquiry';
import { useStores } from 'src/models/root-store/root-store-context';
import { CallApiToStore } from 'src/utils/common';
import _, { isString } from 'lodash';
import { AnimatePresence } from 'framer-motion';
import { DropzoneOptions, DropEvent, FileRejection } from 'react-dropzone';
import CAlert from 'src/components/CAlert';
import { selectOptions } from 'src/components/forms/CTextField';
import { useAuthContext } from 'src/auth/useAuthContext';
import { loadString } from 'src/utils/storage';
import { pxToRem } from 'src/theme/typography';
import parse from 'html-react-parser';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { toJS } from 'mobx';
import React from 'react';
import { TransitionProps } from 'react-transition-group/Transition';
import InquiryOrder from './InquiryOrder';
import { HEADER } from 'src/config-global';
import { useLocation, useNavigate } from 'react-router';
import FaqConnect from './FaqConnect';
import Iconify from 'src/components/iconify';
import InquiryViewFaq from './InquiryViewFaq';
/**
 * ## InquiryView 설명
 *
 */
interface Props {
  onSave: VoidFunction;
  select?: any;
  data?: any;
}

type RedirectLocationState = {
  redirectTo: Location;
};
interface Props extends DropzoneOptions {
  error?: boolean;
  files?: File[];
  showPreview?: boolean;
  accept?: any;
  width?: any;
  height?: any;
  showFileIcon?: boolean;
  maxLen?: number;
}

interface CustomFile extends File {
  path?: string;
  preview?: string;
}
// 이미지 주소
const { REACT_APP_IMAGE_STORAGE } = process.env;

export const InquiryView = observer(({ onSave, data }: Props) => {
  const rootStore = useStores();
  const { inquiryStore, loadingStore, responseStore, faqStore, orderHistoryStore } = rootStore;
  const theme = useTheme();
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { state: locationState } = useLocation();
  const { redirectTo } = (locationState as RedirectLocationState) || {
    pathname: '',
  }

  useEffect(() => {
    if (redirectTo && redirectTo.pathname !== '') {
      navigate(redirectTo.pathname, { replace: true, state: null });
    }
  });

  // open
  const [loading, setLoading] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [saveFailAlert, setSaveFailAlert] = useState(false);
  const [openLightBox, setOpenLightBox] = useState(false);
  const [openLightBoxPut, setOpenLightBoxPut] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [orderYn, setOrderYn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectOrder, setSelectOrder] = useState<any>();

  const [options, setOptions] = useState<selectOptions[]>([
    { code: 0, pcode: 0, value: '선택하세요' },
    ...(rootStore.getCodeList('INQUIRY_TYPE_CD') as selectOptions[]),
  ]);

  const [files, setFiles] = useState<File[]>([]);
  const [attachImgPathList, setAttachImgPathList] = useState<string[]>(
    inquiryStore.inquiry.attachImgPathList,
  );
  const [defaultValues, setdefaultValues] = useState<IInquirySnapshot>(inquiryStore.inquiry);
  const inquirySchema = Yup.object().shape({
    inquiryTypeCd: Yup.object({
      code: Yup.number().min(1, '문의 유형을 선택하세요'),
    })
      .nullable()
      .required('문의 유형을 선택하세요'),
    inquiryNm: Yup.string()
      .trim()
      .min(1, '제목을 입력하세요')
      .max(80, '제목은 최대 80자까지 입력할 수 있습니다'),
    inquiryConts: Yup.string()
      .trim()
      .min(10, '문의 내용을 입력하세요 (최소 10자이상)')
      .max(5000, ''),
  });

  const methods = useForm<IInquirySnapshot>({
    resolver: yupResolver(inquirySchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  // 마켓에서 넘어왔을 경우 select값, oderNo값 세팅
  const marketPick = options.filter((p: any) => p.value === state?.clickStatus)
  const handleOrderDetail = () => {
      CallApiToStore(orderHistoryStore.getOrderHistoryDetail(state?.orderNo), 'api', loadingStore).then(() => { })
  }

  // 하위 컴포넌트에서 선택한 주문내역 값 전달 받기
  const getSelectOrder = (select: any) => {
    if (select) {
      setSelectOrder(select)
    }
  }
  const [check, setCheck] = useState(false);


  // post
  const onSubmit = async (data: any) => {
    const temp: any = getValues();
    temp.attachImgPathList = attachImgPathList;
    temp.userSid = inquiryStore.inquiry.userSid;
    temp.orderNo = selectOrder?.orderNo || inquiryStore.inquiry.orderNo || null;
    temp.answerEmailNotifYn = check;

    if (_.isEmpty(errors)) {
      if (temp === null) {
        setOpenAlert(true);
      } else {
        await CallApiToStore(inquiryStore.post(temp as IInquirySnapshot, files), 'api', loadingStore)
          .then(() => {
            if (responseStore.responseInfo.resultCode === 'S') {
              onSave();
              reset();
              setLoading(false);
            } else {
              if (responseStore.responseInfo.errorMessage) {
                setErrorMessage(responseStore.responseInfo.errorMessage);
                setSaveFailAlert(true);
              } else {
                setErrorMessage('알 수 없는 오류가 발생하였습니다.');
                setSaveFailAlert(true);
              }
            }
          }).catch((e) => { console.error(e); reset(); })
      }
    }
  };


  // 이미지 삭제
  // post할 때 state에서 file 삭제
  const handleRemove = (file: File) => {
    const newFiles = files.filter((_file) => _file !== file);
    setFiles(newFiles);
  };
  // put할 때 store에서 file 삭제
  const onRemove = (imgsrc: string) => {
    const newFiles = attachImgPathList.filter((_file) => _file !== imgsrc);
    setAttachImgPathList(newFiles);
  };

  /**
   * 이미지 파일 업로드
   * 파일 선택했을  때 개수 제한
   */
  const handleDropFile = <T extends File>(
    acceptedFiles: T[],
    fileRejections: FileRejection[],
    event: DropEvent,
  ) => {
    if (files.length + attachImgPathList.length + acceptedFiles.length > 3) {
      setOpenAlert(true);
    } else {
      acceptedFiles.map((r) => setFiles((files: File[]) => [...files, r]));
    }
  };

  const getFileData = (file: CustomFile) => {
    return {
      key: file.name,
      name: file.name,
      size: file.size,
      preview: file.preview,
    };
  };

  const onChangeCallback = () => { };
  const [inquiryConts, setInquiryConts] = useState('');
  const onChangeCallbackCons = (e: any) => {
    const len = e.target.value.replace(/<br\s*\/?>/gm, '\n').trim().length;
    setInquiryConts(
      (txtLen) =>
        `<span style="background-color:#ffffff">${len}</span>` +
        '<span style="background-color:#ffffff"> / 5000</span>',
    );
  };

  const inputRef = useRef<any>(null);
  const onFocusCallback = async () => {
    const os = await loadString('os');
    if (os && os !== '') {
      inputRef.current?.scrollIntoView(100);
    }
  };  
  
  useEffect(() => {
    return () => {
      inquiryStore.resetInquiry();
      delete state?.orderNo
      delete state?.clickStatus
      setOrderYn(false)
      setTypeCdYn(false)
    };
  // }, [inquiryStore.inquirysOrder]);
  }, []);

  const [typeCdYn, setTypeCdYn] = useState(false);

  // condition일 경우 주문목록 선택 select open
  const condition = [840003, 840004, 840005, 840008];
  useEffect(() => {
    setOrderYn(false)
    handleOrderDetail()
    // 문의하기 수정 (등록된 api가 들어올때)
    if (inquiryStore.inquiry.inquiryTypeCd?.value !== '' && state === null) {
      setOrderYn(condition.includes(Number(inquiryStore.inquiry.inquiryTypeCd?.code)));
    }
    if (state && state.orderNo) {
      setOrderYn(true)
      setTypeCdYn(true)
    }
  }, [])
  

  useEffect(()=>{
    CallApiToStore(inquiryStore.getsOrder(), 'api', loadingStore)
  },[inquiryStore.inquirysOrder])  


  return (
    <>
      {/* 문의유형 */}
      <Stack sx={{ px: pxToRem(20), pt: pxToRem(20), overflowX: 'scroll', background: '#FFFFFF', '&::-webkit-scrollbar': { display: 'none', }, justifyContent: 'center', }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Typography variant={'Kor_16_b'} textAlign={'left'}>
              문의 유형
            </Typography>

            <Controller
              name={'inquiryTypeCd'}
              control={control}
              render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => {

                return (
                  <FormControl sx={{ width: '100%' }}>
                    <Select
                      label={''}
                      name={'inquiryTypeCd'}
                      variant={'outlined'}
                      sx={{ textAlign: 'left', mt: pxToRem(8), borderRadius: pxToRem(5), '& .MuiSelect-select': { p: pxToRem(10), }, }}
                      defaultValue={marketPick[0]?.code || inquiryStore.inquiry.inquiryTypeCd?.code || 0}
                      onChange={(e, opt: any) => { onChange({ target: { name: 'inquiryTypeCd', value: { code: e.target.value } } }) }}
                      error={!!error}
                      disabled={typeCdYn}
                    >
                      {options.map((row: any, i: number) => {
                        return (
                          <MenuItem key={`menu-${i}`} value={row.code}
                            onClick={() => {
                              setOrderYn(condition.includes(row.code || 0));
                            }}
                          >
                            {row.value}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <FormHelperText error variant="filled" sx={{ marginTop: '0' }}>{error?.message}</FormHelperText>
                  </FormControl>
                );
              }}
            />
          </Stack>


          {/* 주문내역  => 주문/결제 문의 : 840003 | 교환 : 840004 | 반품 : 840005 | 배송 : 840008 */}
          {orderYn && (
            <InquiryOrder
              inquiryOrder={inquiryStore.inquiry}
              orderYn={orderYn}
              marketOrder={orderHistoryStore.orderHistory}
              // marketOrder={inquiryStore.inquirysOrder}
              select={getSelectOrder} />
          )}

          {/* 문의내용 */}
          <Stack display={'flex'} flexDirection={'column'} mt={pxToRem(14)} sx={{ position: 'relative' }}>
            <Typography variant={'Kor_16_b'} textAlign={'left'} marginTop={pxToRem(8)}>문의 내용</Typography>
            <Stack display={'flex'} flexDirection={'column'} mt={pxToRem(8)}>
              {/* 제목 */}
              <CTextField
                label={''}
                name={'inquiryNm'}
                variant={'outlined'}
                multiline
                multilineHeight={25}
                placeholder={
                  !isAuthenticated
                    ? '로그인이 필요합니다.'
                    : '제목은 최대 80자까지 입력할 수 있습니다'
                }
                disabled={!isAuthenticated}
                resizeType={'none'}
                onFocusCallback={onFocusCallback}
                onChangeCallback={onChangeCallback}
                className={'InquiryTextArea'}
                maxLength={80}
              ></CTextField>
              {/* 내용 */}
              <CTextField
                label={''}
                name={'inquiryConts'}
                variant={'outlined'}
                multiline
                placeholder={
                  !isAuthenticated
                    ? '로그인이 필요합니다.'
                    : '문의 내용을 입력하세요 (최소 10자이상)'
                }
                className={'textAreaP0'}
                disabled={!isAuthenticated}
                resizeType={'none'}
                onFocusCallback={onFocusCallback}
                onChangeCallback={onChangeCallbackCons}
                maxLength={5000}
                sx={{
                  minHeight: pxToRem(152),
                  mt: pxToRem(8),
                }}
              ></CTextField>

              <Typography sx={{ position: 'absolute', bottom: errors.inquiryConts ? '38px' : '20px', right: '20px', }} >
                {parse(inquiryConts)}
              </Typography>
            </Stack>
          </Stack>
          <Stack marginTop={pxToRem(20)}>
            <Typography variant={'Kor_16_b'} textAlign={'left'}>
              이미지 첨부
            </Typography>
            <Stack sx={{
              display: 'flex', flexDirection: 'row', alignItems: 'center', mt: pxToRem(8), overflowX: 'auto', whiteSpace: 'nowrap', '&::-webkit-scrollbar': {
                display: 'none',
              },
            }} >
              <Box>
                {files.map((file: any, i: number) => {
                  if (i > 2) { return null; } else {
                    if (file) { Object.assign(file, { preview: URL.createObjectURL(file) }); }
                    return <Box sx={{ display: 'none' }} key={`fileUpload` + i}></Box>;
                  }
                })}
                <FileUpload
                  files={files}
                  showPreview={true}
                  onDrop={handleDropFile}
                  showFileIcon={false}
                  maxLen={2}
                  accept={'./jpeg, ./jpg, ./png'}
                ></FileUpload>
              </Box>

              <Box display={'flex'} flexDirection={'row'} flexWrap={'nowrap'}>
                <AnimatePresence>
                  {files.map((file: File, i: number) => {
                    const { preview } = getFileData(file as CustomFile);
                    if (i > 2) {
                      return null;
                    }
                    return (
                      <ListItem
                        key={`image` + i}
                        sx={{ p: 0, ml: pxToRem(8), width: pxToRem(100), height: pxToRem(100), borderRadius: 1, overflow: 'hidden', display: 'inline-flex', justifyContent: 'center', bgcolor: (theme) => alpha(theme.palette.grey[400], 0.48), }}>
                        <img src={isString(file) ? file : preview} alt={''}
                          onClick={(e: any) => {
                            setPhotoIndex(i);
                            setOpenLightBox(true);
                          }} />
                        <Box display={'block'} position={'absolute'} top={0} right={pxToRem(6)}>
                          <IconButton
                            size="small"
                            onClick={() => handleRemove(file)}
                            sx={{
                              p: pxToRem(2),
                              color: 'common.white',
                              borderRadius: 0.3,
                              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                              '&:hover': {
                                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                              },
                            }}
                          >
                            <Box component={Icon} icon={'ph:x'}></Box>
                          </IconButton>
                        </Box>
                      </ListItem>
                    );
                  })}
                  {inquiryStore.inquiry.inquirySid &&
                    attachImgPathList.map((imgsrc: string, i: number) => {
                      return (
                        <ListItem
                          key={`image` + i}
                          sx={{
                            p: 0,
                            ml: pxToRem(8),
                            width: 100,
                            height: 100,
                            borderRadius: 1.5,
                            overflow: 'hidden',
                            display: 'inline-flex',
                            justifyContent: 'center',
                            bgcolor: (theme) => alpha(theme.palette.grey[400], 0.48),
                          }}
                        >
                          <img
                            src={REACT_APP_IMAGE_STORAGE + imgsrc}
                            alt={''}
                            onClick={() => {
                              setPhotoIndex(i);
                              setOpenLightBoxPut(true);
                            }}
                          />
                          <Box display={'block'} position={'absolute'} top={0} right={pxToRem(6)}>
                            <IconButton
                              size="small"
                              onClick={() => {
                                onRemove(imgsrc);
                              }}
                              sx={{
                                p: pxToRem(2),
                                color: 'common.white',
                                borderRadius: 0.3,
                                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                                '&:hover': {
                                  bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                                },
                              }}
                            >
                              <Box component={Icon} icon={'ph:x'}></Box>
                            </IconButton>
                          </Box>
                        </ListItem>
                      );
                    })}
                </AnimatePresence>
              </Box>
            </Stack>
            <Typography
              variant={'Eng_12_b'}
              textAlign={'left'}
              marginTop={pxToRem(7)}
              color={theme.palette.grey[400]}
              sx={{ mb: pxToRem(30) }}
            >
              이미지는 JPEG, JPG, PNG만 가능하며 최대 3개까지 첨부 가능합니다.
            </Typography>

            <Stack sx={{ display: 'flex', flexDirection: 'row', mt: pxToRem(12), mb: pxToRem(30) }}>
              <FormControlLabel
                sx={{ mr: 0 }}
                control={
                  <Checkbox
                    name="answerEmailNotifYn"
                    disableRipple
                    icon={<Iconify icon={'material-symbols:check-circle-rounded'} color={theme.palette.grey[300]} />}
                    checkedIcon={<Iconify icon={'material-symbols:check-circle-rounded'} />}
                    onClick={(e: any) => {
                      if (e.nativeEvent.target.checked !== undefined && e.nativeEvent.target.checked === true) {
                        setCheck(e.nativeEvent.target.checked);
                      }
                    }}
                  />
                }
                label={undefined}
              />
              <Typography
                variant={'Kor_14_r'}
                textAlign={'left'}
                alignItems={'center'}
                marginTop={pxToRem(10)}
              >
                이메일로 답변 알림 받기
              </Typography>
            </Stack>


          </Stack>
          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              flex: 1,
              spacing: 1,
              width: '100%',
              pb: `${HEADER.H_MOBILE * 0.5}px`,
            }}
          >
            <Button
              variant={'outlined'}
              size={'large'}
              color={'inherit'}
              sx={{
                borderRadius: pxToRem(50),
                mb: pxToRem(40),
                fontWeight: 600,
                lineHeight: 24 / 16,
                fontSize: pxToRem(16),
                letterSpacing: '-0.03em',
                my: pxToRem(5),
                mr: pxToRem(5),
                flex: 1,
                color: '#C6C7CA',
                '&:hover': { color: '#000000' },
              }}
              onClick={() => {
                navigate(-1);
              }}
            >
              취소
            </Button>
            <Button
              variant={'contained'}
              disabled={
                isSubmitting ||
                !_.isEmpty(errors) ||
                !getValues('inquiryNm') ||
                (!getValues('inquiryTypeCd') && !marketPick[0]) ||
                orderYn && selectOrder === undefined && !typeCdYn
              }
              size={'large'}
              type={'submit'}
              sx={{
                borderRadius: pxToRem(50),
                mb: pxToRem(40),
                fontWeight: 600,
                lineHeight: 24 / 16,
                fontSize: pxToRem(16),
                letterSpacing: '-0.03em',
                my: pxToRem(5),
                ml: pxToRem(5),
                flex: 1,
              }}
            >
              확인
            </Button>
          </Stack>
        </FormProvider>
      </Stack>

      {/* ------------------------------------------------------------------------------------- */}

      {/* 문의리스트 없을 경우, '문의하기' 진입 시 open */}
      {inquiryStore.inquirys.length < 1 && <InquiryViewFaq />}

      {/* openLightBox : 이미지 modal */}
      {openLightBox && (
        <Lightbox
          open={openLightBox}
          close={() => {
            setOpenLightBox(false);
          }}
          index={photoIndex}
          carousel={{ finite: true }}
          styles={{ container: { backgroundColor: 'rgba(0, 0, 0, .7)' } }}
          slides={files.map((src: any, i: number) => {
            return { src: src.preview, width: 1000, height: 1500 };
          })}
          render={{
            buttonPrev: files.length <= 1 ? () => null : undefined,
            buttonNext: files.length <= 1 ? () => null : undefined,
          }}
        />
      )}

      {/* 수정할 때 openLightBox : 이미지 modal */}
      {openLightBoxPut && (
        <Lightbox
          open={openLightBoxPut}
          close={() => {
            setOpenLightBoxPut(false);
          }}
          index={photoIndex}
          carousel={{ finite: true }}
          styles={{ container: { backgroundColor: 'rgba(0, 0, 0, .7)' } }}
          slides={attachImgPathList.map((src: any, i: number) => {
            return { src: REACT_APP_IMAGE_STORAGE + src, width: 1000, height: 1500 };
          })}
          render={{
            buttonPrev: attachImgPathList.length <= 1 ? () => null : undefined,
            buttonNext: attachImgPathList.length <= 1 ? () => null : undefined,
          }}
        />
      )}

      {/* openAlert : 3개이상 이미지 업로드 제한 경고창*/}
      {openAlert && (
        <CAlert
          isAlertOpen={true}
          alertTitle={'이미지 첨부는 3개까지 가능합니다.'}
          hasCancelButton={false}
          alertCategory={'error'}
          handleAlertClose={() => {
            setOpenAlert(false);
          }}
        ></CAlert>
      )}

      {/* saveFailAlert : 저장 실패 경고창*/}
      <Dialog
        open={saveFailAlert}
        PaperProps={{
          sx: {
            p: '25px !important',
            borderRadius: '25px !important',
            '@media (max-width: 600px)': {
              p: 5,
              borderRadius: '25px !important',
            },
          },
        }}
        onClose={() => {
          setSaveFailAlert(false);
        }}
        sx={{
          margin: '0 !important',
          zIndex: theme.zIndex.modal,
          padding: 0,
        }}
      >
        <Typography variant="body1">
          {responseStore.responseInfo.resultCode === 'S' ? '저장되었습니다' : errorMessage}
        </Typography>
        <Button
          variant="contained"
          size={'medium'}
          sx={{ mt: 3, borderRadius: 3 }}
          onClick={() => {
            setSaveFailAlert(false);
          }}
        >
          확인
        </Button>
      </Dialog>
    </>
  );
});
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});
export default InquiryView;
