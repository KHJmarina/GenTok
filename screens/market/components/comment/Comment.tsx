import { yupResolver } from '@hookform/resolvers/yup';
import {
  alpha,
  Avatar,
  Button,
  Divider,
  Drawer,
  InputAdornment,
  List,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ReactComponent as CheckIcon } from 'src/assets/icons/ico-check.svg';
import { ReactComponent as CloseIcon } from 'src/assets/icons/ico-close-small.svg';
import CTextField from 'src/components/forms/CTextField';
import FormProvider from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { loadString } from 'src/utils/storage';
import * as Yup from 'yup';

import { ReactComponent as IconArrowDown } from 'src/assets/icons/ico-arrow-down.svg';

import { ICommentModel } from 'src/models/market-store/Comment';
import { ICommentSearchOptions } from 'src/services/market';

import { IObservableValue } from 'mobx';
import { IPagination } from 'src/models/extensions/with-pagination';
import CommentItem from './CommentItem';
import { pxToRem } from 'src/theme/typography';
import { useAuthContext } from 'src/auth/useAuthContext';

/**
 * ## Comment 설명
 *
 */

export interface ICommentProps {
  contentSid?: number; // MBTI SID | GOODS SID ...
  contentsType: 'review' | 'comment';
  dataList: ICommentModel[];
  pagination: IObservableValue<IPagination>;
  onGetComments?: (options: ICommentSearchOptions) => Promise<any>;
  onNextComments?: () => Promise<any>;
  onResetComments?: () => void;
  onAddComment?: (comment: ICommentModel) => Promise<any>;
  onUpdateComment?: (comment: ICommentModel) => Promise<any>;
  onRemoveComment?: (comment: ICommentModel) => Promise<any>;
  onReplyComment?: (comment: ICommentModel) => Promise<any>;
  onAddLike?: (comment: ICommentModel, emotionCd: 400101 | 400102) => Promise<any>;
  onRemoveLike?: (comment: ICommentModel) => Promise<any>;
}

export const Comment = observer(
  ({
    contentSid: SID,
    contentsType = 'comment',
    dataList,
    pagination,
    onGetComments,
    onNextComments,
    onResetComments,
    onAddComment,
    onUpdateComment,
    onRemoveComment,
    onReplyComment,
    onAddLike,
    onRemoveLike,
  }: ICommentProps) => {
    const theme = useTheme();

    const defaultValues = {
      comment: '',
    };

    const valid = Yup.object().shape({
      comment: Yup.string()
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
        comm.contsSid = SID;
        comm.comment = comm.comment.replace(/\n/gi, '<br />');
        if (comm.commentSid) {
          await onUpdateComment?.(comm);
        } else {
          await onAddComment?.(comm);
        }
        setValue('comment', '');
        setNewLine(1);
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

    const [loadingComment, setLoadingComment] = useState(true);
    const [orderTypeCd, setOrderType] = useState<100601 | 100603>(100601);
    const [openOrderType, setOpenOrderType] = useState(false);

    const getComment = useCallback(async () => {
      await onGetComments?.({ orderTypeCd, page: 1 });
      setLoadingComment(false);
    }, [onGetComments, orderTypeCd]);

    useEffect(() => {
      getComment();
      return () => {
        // 탭에서 숫자 표시를 위해서 초기화하지 않는다.
        // onResetComments?.();
      };
    }, [getComment]);

    const { user, isAuthenticated } = useAuthContext();
    const { REACT_APP_IMAGE_STORAGE } = process.env;
    const getProfileImage = () => {
      if (user?.profileImgPath) {
        if (user?.profileImgPath.substr(0, 4) === 'http') {
          return user?.profileImgPath;
        } else {
          return REACT_APP_IMAGE_STORAGE + user?.profileImgPath;
        }
      } else {
        return null;
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
            sx={{ p: 3, pt: 4, pb: pxToRem(11), scrollMarginTop: pxToRem(50) }}
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
                placeholder={'이야기를 들려주세요.'}
                multiline
                multilineHeight={24 * (newLine > 1 ? newLine + 1 : newLine)}
                className={'commentTextArea'}
                sx={{
                  minHeight: 24,
                  maxHeight: 240,
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
                      disableElevation
                      disableRipple
                      disableFocusRipple
                      disableTouchRipple
                      variant={'contained'}
                      size={'medium'}
                      sx={{
                        transition: 'all 0s',
                        height: 40,
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

        <Stack sx={{ p: 3, pt: 0 }}>
          {loadingComment ? (
            <Typography variant={'Kor_16_r'} sx={{ textAlign: 'center', color: '#C6C7CA' }}>
              댓글을 불러오는 중입니다.
            </Typography>
          ) : pagination.get().totalElements === 0 ? (
            <Typography variant={'Kor_16_r'} sx={{ textAlign: 'center', color: '#C6C7CA' }}>
              이 상품의 첫번째 댓글을 작성해보세요.
            </Typography>
          ) : (
            <>
              <Stack
                direction={'row'}
                justifyContent={'space-between'}
                sx={{
                  pb: pxToRem(19),
                  borderBottom: 'solid 1px #EEEEEE',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant={'body2'}
                  color={grey[500]}
                  sx={{ textAlign: 'left', fontSize: '.8rem' }}
                >
                  {pagination.get().totalElements > 0 ? (
                    <>
                      총 {pagination.get().totalElements}개 댓글 중 최신
                      {dataList.length}개
                    </>
                  ) : (
                    <>총 {pagination.get().totalElements}개 댓글</>
                  )}
                </Typography>
                <Button
                  variant={'text'}
                  disableFocusRipple
                  disableRipple
                  disableTouchRipple
                  endIcon={<Iconify width={14} icon={'ep:arrow-down'} />}
                  sx={{
                    color: alpha(theme.palette.common.black, 0.7),
                    '&:hover': { background: 'none' },
                    p: 0,
                    pr: '6px',
                  }}
                  onClick={() => {
                    setOpenOrderType(true);
                  }}
                >
                  {orderTypeCd === 100601 ? '최신순' : '공감순'}
                </Button>
              </Stack>

              <List disablePadding>
                {dataList.map((item, i: number) => {
                  return (
                    <CommentItem
                      key={`comment-${item.commentSid}`}
                      data={item}
                      isReply={false}
                      contentsType={contentsType}
                      onUpdateComment={onUpdateComment}
                      onRemoveComment={onRemoveComment}
                      onReplyComment={onReplyComment}
                      onAddLike={onAddLike}
                      onRemoveLike={onRemoveLike}
                    />
                  );
                })}
              </List>

              <Button
                variant={'text'}
                sx={{
                  my: 1,
                  color: theme.palette.text.disabled,
                  '&:hover': {
                    color: theme.palette.text.disabled,
                  },
                  '&:disabled': {
                    background: 'transparent',
                    color: theme.palette.text.disabled,
                    paddingTop: pxToRem(pagination.get().totalElements < 1 ? 40 : 0),
                    paddingBottom: pxToRem(pagination.get().totalElements < 1 ? 40 : 0),
                  },
                }}
                disabled={pagination.get().last}
                onClick={() => {
                  onNextComments?.();
                  // onGetComments?.({ orderTypeCd, page: pagination.page + 1 });
                }}
              >
                {pagination.get().totalElements < 1 ? (
                  '이 상품의 첫번째 댓글을 작성해보세요.'
                ) : pagination.get().last ? (
                  ''
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
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%',
                    maxWidth: theme.breakpoints.values.md,
                    borderRadius: 3,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                }}
                anchor={'bottom'}
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
                        orderTypeCd === 100601
                          ? theme.palette.secondary.main
                          : theme.palette.grey[300]
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
                        orderTypeCd === 100603
                          ? theme.palette.secondary.main
                          : theme.palette.grey[300]
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
  },
);

export default Comment;
