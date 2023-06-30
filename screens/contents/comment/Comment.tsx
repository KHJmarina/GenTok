import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useStores } from '../../../models/root-store/root-store-context';
import {
  alpha,
  Avatar,
  Button,
  Divider,
  List,
  Stack,
  Typography,
  useTheme,
  Drawer,
  InputAdornment,
} from '@mui/material';
import FormProvider from 'src/components/hook-form';
import * as Yup from 'yup';
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CTextField from 'src/components/forms/CTextField';
import { grey } from '@mui/material/colors';
import CommentItem from '../comment-item/CommentItem';
import { ReactComponent as IconArrowDown } from 'src/assets/icons/ico-arrow-down.svg';
import { CallApiToStore } from 'src/utils/common';
import Iconify from 'src/components/iconify';
import { ReactComponent as ArrowUp } from 'src/assets/icons/ico-arrow-up.svg';
import { ReactComponent as CloseIcon } from 'src/assets/icons/ico-close-small.svg';
import { ReactComponent as CheckIcon } from 'src/assets/icons/ico-check.svg';
import { ICommentSnapshot } from 'src/models';
import { load, loadString } from 'src/utils/storage';
import { useAuthContext } from '../../../auth/useAuthContext';
import { pxToRem } from 'src/theme/typography';
import profile_avata from 'src/assets/images/profile_avata.svg';

/**
 * ## Comment 설명
 *
 */

interface Props {
  contentSid?: number;
  contentsType: string;
  gameQuestnSid?: number;
}

export const Comment = observer(({ contentSid, contentsType = 'mbti', gameQuestnSid }: Props) => {
  const rootStore = useStores();
  const { mbtiStore, commentStore, loadingStore } = rootStore;
  const theme = useTheme();
  const { user, isAuthenticated } = useAuthContext();
  const { REACT_APP_IMAGE_STORAGE } = process.env;

  const defaultValues = {
    comment: '',
  };

  const valid = Yup.object().shape({
    comment: Yup.string()
      .trim()
      .min(2, '2자 이상 등록해주세요')
      .max(100, '최대 100자 이내로 등록해주세요.'),
  });
  const methods = useForm<any>({
    resolver: yupResolver(valid),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
  });

  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async () => {
    if (_.isEmpty(errors)) {
      const comm = getValues();
      comm.contsSid = contentSid;
      comm.comment = comm.comment.replace(/\n/gi, '<br />');
      comm.gameQuestnSid = gameQuestnSid;
      CallApiToStore(commentStore.post(comm), 'api', loadingStore).then(() => {
        setValue('comment', '');
        setNewLine(1);
        if (contentSid) {
          CallApiToStore(
            commentStore.gets(contentSid, orderType, gameQuestnSid, true),
            'api',
            loadingStore,
          );
        }
      });
    }
  };

  const [newLine, setNewLine] = useState(1);
  const onEnterCallback = (e: any) => {
    if (e && e.keyCode === 13 && !e.shiftKey) {
      valid
        .validate({ comment: getValues('comment') })
        .then((e) => {
          onSubmit();
        })
        .catch((e) => {
          // console.log('🌈 ~ awaitvalid.validate ~ e:', e)
        });
      e.nativeEvent.preventDefault();
    }
  };

  const onChangeCallback = (e: any) => {
    setNewLine(getValues('comment').split('\n').length);
  };

  const inputRef = useRef<any>(null);
  const onFocusCallback = async () => {
    const os = await loadString('os');
    if (os && os !== '') {
      inputRef.current?.scrollIntoView(100);
    }
  };

  const [pcommentSid, setPcommentSid] = useState(-1);
  const [loadingComment, setLoadingComment] = useState(true);
  const [orderType, setOrderType] = useState<100601 | 100603>(100601);
  const [openOrderType, setOpenOrderType] = useState(false);
  const getComment = () => {
    // orderTypeCd	No	String(최신순 : 100601, 인기순(=공감순) : 100603)
    if (contentSid) {
      CallApiToStore(commentStore.gets(contentSid, orderType, gameQuestnSid), 'api', loadingStore)
        .then(() => {
          setLoadingComment(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  useEffect(() => {
    commentStore.setType(contentsType);
    commentStore.resetComments();
    commentStore.pagination.setProps({ size: 5 });
    getComment();

    return () => {
      commentStore.pagination.setProps({ page: 1 });
    };
  }, [orderType, gameQuestnSid]);

  const getProfileImage = () => {
    if (user?.profileImgPath) {
      if (user?.profileImgPath.substr(0, 4) === 'http') {
        return user?.profileImgPath;
      } else {
        return REACT_APP_IMAGE_STORAGE + user?.profileImgPath;
      }
    } else {
      return profile_avata;
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack
          ref={inputRef}
          direction={'row'}
          alignItems={'top'}
          spacing={0}
          sx={{ p: '20px', pt: '40px', pb: '4px', scrollMarginTop: '50px' }}
        >
          <Avatar
            alt={user?.nickNm || ''}
            src={getProfileImage()}
            sx={{ mt: 1, mr: '10px', width: 35, height: 35 }}
          ></Avatar>
          <Stack direction={'row'} sx={{ flex: 1, pt: '2px' }}>
            <CTextField
              label={''}
              name={'comment'}
              variant={'outlined'}
              placeholder={!isAuthenticated ? '로그인이 필요합니다.' : '이야기를 들려주세요.'}
              multiline
              multilineHeight={24 * (newLine > 1 ? newLine + 1 : newLine)}
              className={'commentTextArea'}
              disabled={!isAuthenticated}
              sx={{
                minHeight: 24,
                maxHeight: 240,
                // 43
              }}
              onFocusCallback={onFocusCallback}
              onEnterCallback={onEnterCallback}
              onChangeCallback={onChangeCallback}
              // help={false}
              resizeType={'none'}
              endAdornment={
                <InputAdornment
                  position="end"
                  sx={{
                    alignItems: 'center',
                    ml: 0,
                  }}
                >
                  <Divider sx={{ height: 24, borderWidth: 1, borderColor: '#EEEEEE' }} />
                  <Button
                    disabled={!isAuthenticated}
                    disableElevation
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                    variant={'contained'}
                    size={'medium'}
                    sx={{
                      transition: 'all 0s',
                      height: 40,
                      opacity: isAuthenticated ? 1 : 0.3,
                    }}
                    type={'submit'}
                  >
                    등록
                  </Button>
                </InputAdornment>
              }
            />
          </Stack>
        </Stack>
      </FormProvider>

      <Stack sx={{ px: '20px', m: 0 }}>
        {loadingComment ? (
          <Typography variant={'body2'} sx={{ textAlign: 'center' }}>
            댓글을 불러오는 중입니다.
          </Typography>
        ) : (
          <>
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
              sx={{
                pb: '10px',
                borderBottom: '1px solid #EEEEEE',
              }}
            >
              <Typography
                variant={'Kor_12_r'}
                sx={{ textAlign: 'left', color: '#9DA0A5', fontWeight: 400 }}
              >
                {commentStore.pagination.totalElements > 0 ? (
                  <>
                    총 {commentStore.pagination.totalElements}개 댓글 중 최신{' '}
                    {commentStore.comments.length}개
                  </>
                ) : (
                  <>총 {commentStore.pagination.totalElements}개 댓글</>
                )}
              </Typography>
              <Button
                variant={'text'}
                disableFocusRipple
                disableRipple
                disableTouchRipple
                endIcon={<Iconify width={14} icon={'ep:arrow-down'} />}
                sx={{
                  fontSize: pxToRem(12),
                  fontWeight: 400,
                  color: '#202123',
                  '&:hover': { background: 'none' },
                }}
                onClick={() => {
                  setOpenOrderType(true);
                }}
              >
                {orderType === 100601 ? '최신순' : '공감순'}
              </Button>
            </Stack>

            <List disablePadding>
              {commentStore.comments.map((comment: ICommentSnapshot, i: number) => {
                return (
                  <CommentItem
                    key={`comment-${contentsType}-${contentSid}-${comment.commentSid}`}
                    data={comment}
                    getComment={getComment}
                  />
                );
              })}
            </List>

            <Button
              variant={'text'}
              sx={{
                my: '20px',
                color: '#999999',
                '&:hover': {
                  color: '#999999',
                },
                '&.Mui-disabled': {
                  fontSize: pxToRem(14),
                  fontWeight: 400,
                  background: '#FFFFFF',
                  color: '#999999',
                },
                fontSize: pxToRem(14),
                fontWeight: 400,
              }}
              disabled={commentStore.pagination.totalElements - 1 < commentStore.comments.length}
              onClick={() => {
                commentStore.pagination.setProps({
                  page: commentStore.pagination.page + 1,
                });
                getComment();
              }}
            >
              {commentStore.pagination.totalElements < 1 ? (
                '첫번째 댓글을 작성해 보세요'
              ) : commentStore.pagination.totalElements - 1 < commentStore.comments.length ? (
                '더이상 댓글이 없습니다.'
              ) : (
                <>
                  댓글 더보기
                  <IconArrowDown />
                </>
              )}
            </Button>

            <Drawer
              open={openOrderType}
              onClose={() => {
                setOpenOrderType(false);
              }}
              PaperProps={{
                sx: {
                  pb: 3,
                  m: 'auto',
                  width: '100%',
                  maxWidth: 'md',
                  borderRadius: 3,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                },
              }}
              anchor={'bottom'}
              sx={{
                zIndex: 999999
              }}
            >
              <Stack spacing={2} sx={{ p: 4 }}>
                <Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography
                    variant={'h6'}
                    sx={{ textAlign: 'left', color: '#000000', fontWeight: 700 }}
                  >
                    정렬 기준 선택
                  </Typography>
                  <CloseIcon
                    fill={theme.palette.common.black}
                    onClick={() => {
                      setOpenOrderType(false);
                    }}
                  />
                </Stack>
                <Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    setOrderType(100601);
                    setOpenOrderType(false);
                  }}
                >
                  <Typography variant={'body1'} sx={{ textAlign: 'left', color: 'text.primary' }}>
                    최신순
                  </Typography>
                  <CheckIcon
                    fill={
                      orderType === 100601 ? theme.palette.secondary.main : theme.palette.grey[300]
                    }
                  />
                </Stack>
                <Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    setOrderType(100603);
                    setOpenOrderType(false);
                  }}
                >
                  <Typography variant={'body1'} sx={{ textAlign: 'left', color: 'text.primary' }}>
                    공감순
                  </Typography>
                  <CheckIcon
                    fill={
                      orderType === 100603 ? theme.palette.secondary.main : theme.palette.grey[300]
                    }
                  />
                </Stack>
              </Stack>
            </Drawer>
          </>
        )}
      </Stack>
    </>
  );
});

export default Comment;
