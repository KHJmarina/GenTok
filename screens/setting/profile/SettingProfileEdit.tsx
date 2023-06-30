import {
  Avatar,
  Button,
  Dialog,
  Divider,
  Drawer,
  IconButton,
  List,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import { AnimatePresence } from 'framer-motion';
import profile_avata from 'src/assets/images/profile_avata.svg';
import camera_imm from '../../../assets/images/camera.svg';
import BackHeader from 'src/components/BackHeader';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useStores } from 'src/models/root-store/root-store-context';
import _, { isObject } from 'lodash';
import CAlert from 'src/components/CAlert';

import { useAuthContext } from 'src/auth/useAuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { FileRejection } from 'react-dropzone';
import FormProvider from 'src/components/hook-form';

import { IUserSnapshot } from 'src/models/user/user';
import { CallApiToStore, sendReactNativeMessage } from 'src/utils/common';
import ProfileFileUpload from './ProfileFileIcon';
import { pxToRem } from 'src/theme/typography';
import { toJS } from 'mobx';
// api

/**
 * ## Profile 설명
 *
 */

type Props = {
  handleClose: VoidFunction;
};
export const SettingProfile = observer(({ handleClose }: Props) => {
  const rootStore = useStores();
  const { userStore, loadingStore, responseStore } = rootStore;
  const theme = useTheme();
  const { pathname } = useLocation();

  const auth = useAuthContext();
  const { user } = useAuthContext();

  const [showNickName, setShowNickName] = useState(false);
  const [open, setOpen] = useState(false);

  // drawer, alert open
  const [openDrawer, setOpenDrawer] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [saveAlert, setSaveAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // profile image, nickNm
  const [files, setFiles] = useState<File[]>([]);
  const [profileImgPath, setProfileImgPath] = useState(auth.user?.profileImgPath);
  const [imgPath, setImgPath] = useState(auth.user?.profileImgPath);
  const [uploadFile, setUploadFile] = useState([]);
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const [text, setText] = useState('');

  //put
  const [defaultValues, setDefaultValues] = useState<any>(auth.user);
  const NickNmSchema = Yup.object().shape({
    nickNm: Yup.string()
      .max(13, '사용이 불가능한 닉네임 입니다.')
      .min(2, '한글 1-6자, 영문 및 숫자 1-12자까지 혼용해서 입력할 수 있습니다.')
      .trim()
      .required(''),
  });
  const methods = useForm<IUserSnapshot>({
    resolver: yupResolver(NickNmSchema),
    defaultValues,
    mode: 'onChange',
  });

  interface CustomFile extends File {
    path?: string;
    preview?: string;
    profileImgPath?: string;
  }

  const getFileData = (file: CustomFile) => {
    return {
      size: file.size,
      preview: file.preview,
    };
  };
  const {
    reset,
    handleSubmit,
    getValues,
    clearErrors,
    formState: { errors },
  } = methods;

  // const regLen = /^.{2,12}$/;
  // const regKorean = /^[ㄱ-ㅎ|가-힣]{2,6}$/;
  // const regEnglish = /^[A-Z|a-z]{2,12}$/;
  const regNick = /^[ㄱ-ㅎ|가-힣|A-Z|a-z|0-9]{2,12}$/;
  const [koreanLength, setKoreanLength] = useState(0);
  const [check, setCheck] = useState({
    nickname: false,
    match: false,
    nick: regNick.test(getValues('nickNm').replace(/\s/g, '')),
  });
  // 한글 포함 개수 확인
  const checkKorean = (text: any) => {
    const koreanRegex = /[\u{1100}-\u{11FF}\u{3130}-\u{318F}\u{AC00}-\u{D7AF}]/gu;
    const koreanMatches = text.match(koreanRegex);
    return koreanMatches ? setKoreanLength(koreanMatches.length) : 0;
  };

  // put할 때 store에서 file 삭제
  const onRemove = (imgsrc: any) => {
    setImgPath('');
  };
  const [btnDisabled, setBtnDisabled] = useState(!!errors.nickNm);
  // 저장하기
  const onSubmit = async (data: IUserSnapshot) => {
    data.profileImgPath = profileImgPath;
    data.uploadFile = uploadFile;

    if (_.isEmpty(errors)) {
      if (data === null) {
        setSaveAlert(true);
      } else {
        await CallApiToStore(userStore.setProfile(data, files, imgPath), 'api', loadingStore)
          .then(() => {
            if (responseStore.responseInfo.resultCode === 'S') {
              userStore.setRegisterInfo(data);
              handleClose();
              auth.initialize();
              // setSaveAlert(true);
              reset();
            } else {
              if (responseStore.responseInfo.errorMessage) {
                setErrorMessage(responseStore.responseInfo.errorMessage);
                setSaveAlert(true);
              } else {
                setErrorMessage('알 수 없는 오류가 발생하였습니다.');
                setSaveAlert(true);
              }
            }
          })
          .catch((e) => {
            console.error(e);
            reset();
          });
      }
    }
    setOpen(false);
    reset();
  };
  /** 닉네임 중복 확인 */
  const checkNickNmDuplicate = (nickNm: string) => {
    if (errors.nickNm === undefined) {
      CallApiToStore(userStore.nickNmDuplicate(nickNm), 'api', loadingStore).then(() => {
        if (responseStore.responseInfo.resultCode === 'S' && errors.loginId === undefined) {
          setBtnDisabled(false);
        } else {
          if (responseStore.responseInfo.errorMessage) {
            setErrorMessage(responseStore.responseInfo.errorMessage);
            setSaveAlert(true);
            setBtnDisabled(!errors.nickNm);
          } else {
            setErrorMessage('알 수 없는 오류가 발생하였습니다.');
            setSaveAlert(true);
            setBtnDisabled(!errors.nickNm);
          }
        }
      });
    }
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  useEffect(() => {
    if (openDrawer) {
      handleCloseDrawer();
    }
  }, [pathname]);

  // 프로필 이미지
  const handleDropFile = <T extends File>(acceptedFiles: T[], fileRejections: FileRejection[]) => {
    handleCloseDrawer();
    acceptedFiles.splice(1);
    setFiles(acceptedFiles);
  };

  const getProfileImage = () => {
    if (imgPath) {
      if (imgPath.substr(0, 4) === 'http') {
        return imgPath;
      } else {
        return REACT_APP_IMAGE_STORAGE + imgPath;
      }
    } else {
      return profile_avata;
    }
  };

  const getPicture = () => {
    sendReactNativeMessage({
      type: 'getProfilePicture',
      payload: '',
    });
  };

  const blobToBase64 = useCallback((blob: any) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    } catch (err) {
      console.log(`Error in converting blob to base64 - ${err}`);
      throw err;
    }
  }, []);
  const listener = async (event: any) => {
    let data: any;
    try {
      if (isObject(event.data)) {
        return;
      }
      if (!isObject(event.data)) {
        data = JSON.parse(event.data);
      }
    } catch (e) {
      console.log('e', event, e);
    }
    if (data.type === 'os') {
      return;
    }
    if (data.type === 'sendProfilePicture') {
      handleCloseDrawer();

      const user: IUserSnapshot = getValues();
      const byteString = atob(data.payload.file.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ia], {
        type: data.payload.blob._data.type,
      });
      const file = new File([blob], data.payload.blob._data.name);
      setFiles([file]);
      return;
    }
  };
  useEffect(() => {
    getProfileImage();

    try {
      document.addEventListener('message', listener);
      window.addEventListener('message', listener);
    } catch (e) {}

    return () => {
      try {
        document.removeEventListener('message', listener);
        window.removeEventListener('message', listener);
      } catch (e) {}
    };
  }, []);

  return (
    <>
      <BackHeader title="프로필 수정" handleClose={handleClose} />
      <Stack
        justifyContent={'space-between'}
        sx={{ flex: 1, p: pxToRem(20), pt: pxToRem(30), scrollMarginTop: pxToRem(100) }}
      >
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack
            sx={{
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <AnimatePresence>
              {files.map((file: any, i: number) => {
                if (file) {
                  Object.assign(file, {
                    preview: URL.createObjectURL(file),
                  });
                }
                return <Box sx={{}} key={`fileUpload` + i}></Box>;
              })}
              {files.map((file: File, i: number) => {
                const { preview } = getFileData(file as CustomFile);
                return (
                  <Avatar
                    key={`avatar` + i}
                    src={preview}
                    sx={{
                      width: pxToRem(120),
                      height: pxToRem(120),
                      mx: 'auto',
                    }}
                  />
                );
              })}
              {files.length < 1 && (
                <Avatar
                  key={`errorAvatar`}
                  src={getProfileImage()}
                  sx={{
                    width: pxToRem(120),
                    height: pxToRem(120),
                    mx: 'auto',
                  }}
                />
              )}
            </AnimatePresence>

            <Stack
              sx={{
                border: '1px solid #C4CDD5',
                zIndex: 1,
                backgroundColor: theme.palette.common.white,
                display: 'flex',
                flexDirection: 'row',
                borderRadius: pxToRem(50),
                px: pxToRem(8),
                py: 0,
                justifyContent: 'center',
                mt: pxToRem(-15),
              }}
            >
              <IconButton
                onClick={() => {
                  setOpenDrawer(true);
                }}
                sx={{ py: pxToRem(5) }}
              >
                <Iconify icon="mdi:camera-plus" sx={{ color: theme.palette.grey[400] }}></Iconify>
              </IconButton>
              <Divider
                sx={{ borderWidth: 0.5, borderColor: theme.palette.grey[400] }}
                orientation={'horizontal'}
                variant={'fullWidth'}
              />
              <IconButton
                sx={{ py: pxToRem(5) }}
                onClick={() => {
                  setDeleteAlert(true);
                }}
              >
                <Iconify icon="ic:baseline-close" sx={{ color: theme.palette.grey[400] }}></Iconify>
              </IconButton>
            </Stack>
          </Stack>
          <Stack sx={{ flex: 1, mt: pxToRem(41) }}>
            <Typography variant={'Kor_16_b'} sx={{ mb: pxToRem(10) }}>
              닉네임
            </Typography>
            <Stack spacing={1} sx={{ flex: 1, width: '100%' }}>
              <RHFTextField
                type="text"
                name="nickNm"
                placeholder="닉네임을 설정해주세요"
                variant={'standard'}
                onKeyUp={(e: any) => {
                  let nick: any = e.target.value;
                  nick = nick.replace(/(\s*)/g, '');
                  if (nick.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g, '$&$1$2').length > 12) {
                    nick = nick.slice(0, 12);
                  }
                  if (getValues('nickNm') !== undefined || getValues('nickNm') !== null) {
                    setCheck({
                      ...check,
                      nick: regNick.test(getValues('nickNm').replace(/\s/g, '')),
                    });
                  }
                  checkKorean(getValues('nickNm'));
                }}
                onKeyDown={(e: any) => {
                  if (e.keyCode === 13) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.target.blur();
                  }
                }}
                onFocus={(e) => {
                  clearErrors();
                  e.target.enterKeyHint = 'done';
                }}
                inputProps={{
                  maxLength: 12,
                }}
              />

              <Stack sx={{ alignItems: 'baseline' }} direction={'row'}>
                {getValues('nickNm') === null || getValues('nickNm') === undefined ? (
                  <Typography variant="Kor_12_b" color={theme.palette.grey[500]}>
                    한글 1-6자, 영문 및 숫자 1-12자까지 혼용해서 입력할 수 있습니다
                  </Typography>
                ) : (
                  <Typography
                    variant="Kor_12_b"
                    color={
                      check.nick && koreanLength < 7
                        ? theme.palette.secondary.light
                        : theme.palette.error.light
                    }
                  >
                    {getValues('nickNm').length < 2
                      ? null
                      : check.nick && koreanLength < 7
                      ? '사용이 가능한 닉네임 입니다.'
                      : '한글 1-6자, 영문 및 숫자 1-12자까지 혼용해서 입력할 수 있습니다'}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Stack>
        </FormProvider>

        <Stack>
          <Button
            // disabled={!!errors.nickNm}
            disabled={!check.nick || koreanLength > 6}
            variant={'contained'}
            size={'large'}
            onClick={handleSubmit(onSubmit)}
            sx={{ borderRadius: pxToRem(50), mt: pxToRem(25) }}
          >
            저장하기
          </Button>
        </Stack>
      </Stack>

      {
        <Drawer
          anchor={'bottom'}
          keepMounted
          open={openDrawer}
          onClose={handleCloseDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            maxWidth: 'md',
            minWidth: 375,
          }}
          PaperProps={{
            sx: {
              borderTopLeftRadius: pxToRem(25),
              borderTopRightRadius: pxToRem(25),
              overflowY: 'hidden',
            },
          }}
        >
          <List sx={{ ...listStyle }}>
            {userStore.os !== '' && userStore.os !== null && (
              <Stack
                onClick={getPicture}
                sx={{ display: 'flex', flexDirection: 'row', mt: pxToRem(5), pl: pxToRem(8) }}
              >
                <Box
                  component={'img'}
                  src={camera_imm}
                  sx={{ my: pxToRem(12), width: pxToRem(20), height: pxToRem(20) }}
                />
                <Typography
                  variant="Kor_16_r"
                  sx={{ my: pxToRem(12), display: 'block', ml: pxToRem(12) }}
                >
                  사진 촬영
                </Typography>
              </Stack>
            )}
            <Stack
              sx={{ display: 'flex', flexDirection: 'row', mb: pxToRem(12), pl: pxToRem(8) }}
              gap={3}
            >
              <ProfileFileUpload
                files={files}
                showPreview={true}
                onDrop={handleDropFile}
                showFileIcon={false}
                maxLen={2}
              >
                <Typography
                  variant="Kor_16_r"
                  sx={{ my: pxToRem(10), display: 'block', ml: pxToRem(12) }}
                >
                  앨범에서 사진 선택
                </Typography>
              </ProfileFileUpload>
            </Stack>
          </List>

          <Divider
            sx={{ borderWidth: 0.5, borderColor: theme.palette.grey[300] }}
            orientation={'horizontal'}
            variant={'fullWidth'}
          />
          <List
            sx={{
              pt: 0,
              m: 0,
              pl: pxToRem(28),
              pr: pxToRem(20),
              pb: pxToRem(36),
              display: 'flex',
              alignItems: 'left',
              background: '#ffffff',
              color: '#637381',
            }}
          >
            <IconButton sx={{ pl: 0, pr: pxToRem(12) }} onClick={handleCloseDrawer}>
              <Iconify icon="ic:baseline-close" sx={{ p: 0, fontSize: pxToRem(20) }} />
            </IconButton>

            <Typography
              variant="Kor_16_r"
              sx={{
                my: pxToRem(14),
              }}
              onClick={handleCloseDrawer}
            >
              취소
            </Typography>
          </List>
        </Drawer>
      }

      {deleteAlert && (
        <CAlert
          isAlertOpen={true}
          alertCategory={'question'}
          alertContent={''}
          hasCancelButton={files.length > 0 || imgPath ? true : false}
          alertTitle={
            files.length > 0 || imgPath
              ? '프로필 사진을 삭제하시겠습니까?'
              : '삭제할 프로필 사진이 없습니다.'
          }
          hasXbutton={false}
          callBack={() => {
            setFiles([]);
            onRemove(imgPath);
          }}
          handleAlertClose={() => {
            setDeleteAlert(false);
          }}
          deleteQ
        ></CAlert>
      )}

      {saveAlert && (
        <CAlert
          isAlertOpen={true}
          alertTitle={
            responseStore.responseInfo.resultCode === 'S'
              ? '저장되었습니다'
              : getValues('nickNm') === null
              ? '저장할 닉네임이 없습니다'
              : errorMessage
          }
          alertCategory={'success'}
          handleAlertClose={() => {
            setSaveAlert(false);
            handleClose();
          }}
        ></CAlert>
      )}
    </>
  );
});
const listStyle = {
  px: pxToRem(20),
  pt: pxToRem(16),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'left',
  background: '#ffffff',
  color: '#637381',
};

export default SettingProfile;
