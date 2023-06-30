import infoIcon from '@iconify/icons-ic/error-outline';
import errorIcon from '@iconify/icons-ic/error-outline';
import questionIcon from '@iconify/icons-ic/help-outline';
import successIcon from '@iconify/icons-ic/round-check-circle-outline';
import warningIcon from '@iconify/icons-ic/round-warning';

// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Icon, IconifyIcon } from '@iconify/react';
import { Box, Button, Card, IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DialogAnimate } from 'src/components/animate';
import CTextField from 'src/components/forms/CTextField';
import FormProvider from 'src/components/hook-form/FormProvider';
import Iconify from 'src/components/iconify';
import { ReactComponent as CloseIcon } from 'src/assets/icons/ico-close.svg';
import { pxToRem } from 'src/theme/typography';
type ExchangeAlertProps = {
  /**
   * ** Alert 창 표시 여부 **
   */
  isAlertOpen: boolean;
  /**
   * ** Alert 창의 종류 **
   */
  alertCategory: 'f2d' | 'success' | 'info' | 'warning' | 'error' | 'question';
  /**
   * ** Alert 창의 제목 **
   */
  alertTitle?: string;
  /**
   * ** Alert 창의 내용 **
   */
  alertContent?: string;
  /**
   * ** Alert 창의 취소버튼 표시 **
   */
  hasCancelButton?: boolean;
  /**
   * ** Alert 창 끄기 함수 **
   *
   * useState를 이용하여 콜백 함수를 구성 후 Props로 전달
   */
  handleAlertClose?: () => void;
  /**
   * ** Alert 창 Callback **
   *
   * 확인과 취소 버튼에 대한 결과를 콜백 함수로 반환
   */
  callBack?: Function;
  /**
   * ** Alert 창 삭제 물음표 **
   *
   * true 일 경우 삭제 물음표는 빨간색
   */
  deleteQ?: boolean;
  /**
   * ** 입력 TextArea key **
   */
  addTextArea?: boolean;
  textAreaLabel?: string;
  textAreaKey?: string;

  /**
   * ** 입력 Custom Button Set **
   */
  buttonSet?: React.ReactNode;
  
    /**
   * Alert 창의 X 버튼 표시 여부
   * true인 경우 X 버튼 표시, false인 경우 X 버튼 없음
   * 기본 false(x 버튼 없음)
   */
    hasXbutton?:boolean;
};

/**
 * ## 기본 사용법
 * > 기본 Alert 창으로 경고 및 정보 등 여러 상황에 알맞은 Alert를 제공합니다.
 */
export default function ExchangeAlert({
  isAlertOpen,
  alertCategory,
  alertTitle,
  alertContent,
  hasCancelButton = false,
  handleAlertClose,
  callBack,
  deleteQ,
  addTextArea = false,
  textAreaLabel = '입력',
  textAreaKey = 'alertTextArea',
  buttonSet,
  hasXbutton = false,
  ...others
}: ExchangeAlertProps) {
  const categoryColors = useMemo(() => {
    return {
      error: 'rgb(255, 72, 66)',
      warning: 'rgb(255, 193, 7)',
      info: 'rgb(24, 144, 255)',
      success: 'rgb(84, 214, 44)',
      question: 'rgb(0, 171, 85)',
      f2d: '#FFFFFF',
    };
  }, []);
  const methods = useForm({});
  const theme = useTheme();

  const { reset, getValues } = methods;

  // const onSubmit = async (data: any) => {
  //   alert(JSON.stringify(data));
  // };

  const [info, setInfo] = useState<{
    icon: IconifyIcon;
    name:
      | 'success'
      | 'info'
      | 'warning'
      | 'error'
      | 'inherit'
      | 'primary'
      | 'secondary'
      | undefined;
    color: string;
  }>({
    icon: infoIcon,
    name: 'info',
    color: categoryColors.info,
  });

  useEffect(() => {
    switch (alertCategory) {
      case 'success':
        setInfo({
          icon: successIcon,
          name: 'success',
          color: categoryColors.success,
        });
        break;
      case 'info':
        setInfo({
          icon: infoIcon,
          name: 'info',
          color: categoryColors.info,
        });
        break;
      case 'warning':
        setInfo({
          icon: warningIcon,
          name: 'warning',
          color: categoryColors.warning,
        });
        break;
      case 'error':
        setInfo({
          icon: errorIcon,
          name: 'error',
          color: categoryColors.error,
        });
        break;
      case 'question':
        if (deleteQ) {
          setInfo({
            icon: questionIcon,
            name: 'error',
            color: categoryColors.error,
          });
        } else {
          setInfo({
            icon: questionIcon,
            name: 'primary',
            color: categoryColors.question,
          });
        }
        break;
    }
  }, [alertCategory, categoryColors, deleteQ]);

  const cancelClose = () => {
    if (handleAlertClose) {
      handleAlertClose();
    }
  };

  const confirmClose = () => {
    if (handleAlertClose) {
      handleAlertClose();
    }
    // callBack && callBack();
    if (callBack) {
      if (addTextArea) {
        callBack(getValues());
        reset();
      } else {
        callBack();
      }
    }
  };
  
  return (
    <DialogAnimate
      open={isAlertOpen}
      onClose={handleAlertClose}
      maxWidth={'sm'}
      sx={{
        maxHeight: '80%',
        '.MuiDialog-container > .MuiBox-root': { alignItems: 'center' },
      }}
      PaperProps={{
        sx: {
          maxWidth: 400,
        },
      }}
      {...others}
    >
      <Card sx={{ background: '#ffffff' }}>
        {alertTitle && (
          <>
          {hasXbutton && 
            <Stack direction="row" sx={{ justifyContent: 'end', p: 2, py: 0 }}>
              <IconButton size={'large'} onClick={handleAlertClose}>
                <CloseIcon stroke={theme.palette.common.black} />
              </IconButton>
            </Stack>
          }
          {!hasXbutton && 
            <Stack direction="row" sx={{ justifyContent: 'flex-end', p: 2, pb: 0, mt:2}}>
            </Stack>
            }
          
            <Stack direction="row" sx={{ justifyContent: 'center', mb: 2, width: '100%' }}>
              <Typography
                variant="h4"
                sx={{
                  margin: 'auto',
                  fontWeight: '600',
                  opacity: 0.9,
                  // mb: 1,
                  width: '80%',
                  textAlign: 'center',
                }}
              >
                {alertTitle}
              </Typography>
            </Stack>
          </>
        )}

        {alertContent && (
          <Stack
            direction="row"
            sx={{
              flexDirection: 'column',
              justifyContent: 'center',
              margin: '10px auto',
              padding: '20px',
              overflow: 'auto',
              marginTop: 0,
              paddingTop: 0,
            }}
          >
            {alertContent.split('<br/>').map((value, index) => {
              return (
                <Typography
                  key={index}
                  sx={{
                    fontWeight: '600',
                    margin: 'auto',
                    color: theme.palette.common.black,
                    textAlign: 'center',
                    fontSize: pxToRem(18),
                  }}
                >
                  {value}
                  <br />
                </Typography>
              );
            })}
          </Stack>
        )}
        {buttonSet && (
          <Stack
            direction="row"
            sx={{ justifyContent: 'center', padding: '0px, 10px', marginBottom: '30px' }}
          >
            {buttonSet}
          </Stack>
        )}
      </Card>
    </DialogAnimate>
  );
}
