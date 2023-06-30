import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useStores } from '../../../models/root-store/root-store-context';
import {
  alpha,
  Chip,
  Drawer,
  Fade,
  IconButton,
  InputAdornment,
  List,
  Rating,
  useTheme,
} from '@mui/material';
import {
  Box,
  Stack,
  Button,
  Avatar,
  Divider,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import Parser from 'html-react-parser';
import moment from 'moment';
import 'moment/locale/ko';
import { comment } from 'stylis';
import { IComment, ICommentSnapshot } from 'src/models';
import { ReactComponent as IconHeart } from 'src/assets/icons/ico-heart-small.svg';
import { ReactComponent as IconHeartOn } from 'src/assets/icons/ico-heart-on.svg';
import MoreIcon from '@mui/icons-material/MoreHoriz';
import MenuPopover from 'src/components/menu-popover';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import { useAuthContext } from 'src/auth/useAuthContext';
import CTextField from 'src/components/forms/CTextField';
import * as Yup from 'yup';
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CallApiToStore } from 'src/utils/common';
import FormProvider from 'src/components/hook-form';
import CAlert from 'src/components/CAlert';
import { toJS } from 'mobx';
import { merge } from 'lodash';
import Image from 'src/components/image';
import Carousel from 'src/components/carousel';
import { ReactComponent as CloseIcon } from 'src/assets/icons/ico-close-small.svg';
import React from 'react';
import profile_avata from 'src/assets/images/profile_avata.svg';

/**
 * ## CommentItem 설명
 *
 */

type Props = {
  data: ICommentSnapshot;
  isReply?: boolean;
  getComment?: VoidFunction;
  type?: 'comment' | 'review' | string;
};
export const CommentItem = observer(
  ({ data, type = 'comment', isReply = false, getComment }: Props) => {
    const rootStore = useStores();
    const { commentStore, loadingStore } = rootStore;
    const { REACT_APP_IMAGE_STORAGE } = process.env;
    const theme = useTheme();
    const { user, isAuthenticated } = useAuthContext();

    const [alertOpen, setAlertOpen] = useState(false);

    const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
    const [openDrawer, setOpenDrawer] = useState(false);

    const emotionFn = (id: number, type: boolean) => { };

    const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
      setOpenPopover(event.currentTarget);
    };

    const handleClosePopover = () => {
      setOpenPopover(null);
    };

    const [comment, setComment] = useState<ICommentSnapshot>(data);
    const [children, setChildren] = useState<any[]>(comment.childList);

    const [mode, setMode] = useState('');

    const valid = Yup.object({
      comment: Yup.string()
        .trim()
        .min(1, '2자 이상 등록해주세요')
        .max(100, '최대 100자 이내로 등록해주세요.'),
    });

    const methods = useForm<any>({
      resolver: yupResolver(valid),
      mode: 'all',
      reValidateMode: 'onChange',
      defaultValues: {},
    });

    const {
      reset,
      setValue,
      getValues,
      handleSubmit,
      formState: { errors },
    } = methods;

    const onSubmit = async () => {
      if (_.isEmpty(errors)) {
        const comm = getValues();
        comm.comment = comm.comment.replace(/\n/gi, '<br />');
        comm.gameQuestnSid = comment.gameQuestnSid;
        if (mode === 'edit') {
          comm.contsSid = comment.contsSid;
          comm.commentSid = comment.commentSid;
          await commentStore
            .edit(comm)
            .then((res) => {
              reset();
              setMode('');
            })
            .catch((e) => {
              alert('댓글 등록 실패');
            });
        } else if (mode === 'reply') {
          comm.pcommentSid = comment.commentSid;
          comm.commentSid = null;
          comm.contsSid = comment.contsSid;
          await commentStore
            .reply(comm)
            .then((res) => {
              reset();
              setMode('');
            })
            .catch((e) => {
              alert('댓글 등록 실패');
            });
        }
      }
    };

    const onDelete = async () => {
      await commentStore
        .delete(comment)
        .then((res) => {
          setMode('');
          setComment(res as IComment);
        })
        .catch((e) => {
          alert('댓글 삭제 실패');
        });
    };

    const handleLike = () => {
      // 이모션(400101 : 좋아요, 400102: 싫어요)
      // const emotionCd = comment.myEmotionCd?.code === 400101 ? 400102 : 400101;
      if (!isAuthenticated) {
        return;
      }
      if (comment.myEmotionCd?.code === 400101) {
        commentStore.removeLike(comment).then((res) => {
          setComment(res as IComment);
        });
      } else {
        commentStore.addLike(comment, 400101).then((res) => {
          setComment(res as IComment);
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
          .catch((e) => { });
        e.nativeEvent.preventDefault();
      }
    };

    const onChangeCallback = (e: any) => {
      setNewLine(getValues('comment').split('\n').length);
    };

    const profileImgPath =
      comment.writer.profileImgPath !== null && comment.writer.profileImgPath !== ''
        ? REACT_APP_IMAGE_STORAGE + comment.writer.profileImgPath
        : profile_avata;

    const [toggleThumbnail, setToggleThumbnail] = useState(false);

    const contentRef = useRef<any>(null);
    const carouselRef = useRef<Carousel | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselSettings = {
      dots: false,
      arrows: false,
      autoplay: true,
      draggable: true,
      slidesToShow: 1,
      initialSlide: 0,
      rtl: false,
      speed: 400,
      infinite: true,
      centerMode: false,
      swipeToSlide: true,
      adaptiveHeight: true,
      beforeChange: (current: number, next: number) => setCurrentIndex(next),
    };

    const handlePrev = () => {
      carouselRef.current?.slickPrev();
    };

    const handleNext = () => {
      carouselRef.current?.slickNext();
    };

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

    useEffect(() => { }, [commentStore, comment]);

    return (
      <>
        <ListItem
          disableGutters
          key={`comment-list-${comment.commentSid}`}
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            alignItems: 'flex-start',
            ...(isReply
              ? {
                pl: '42px',
                mr: 0,
                pr: 0,
                pb: 0,
              }
              : {
                py: 2,
                borderBottom: '1px solid #EEEEEE',
              }),
            width: '100%',
          }}
        >
          <Stack
            sx={{
              width: '100%',
              ...(isReply && {
                p: 2,
                pr: 0,
                borderRadius: '5px',
                background: alpha(theme.palette.background.neutral, 0.4),
              }),
            }}
          >
            <Stack direction={'row'}>
              <Avatar
                alt={comment.writer.nickNm}
                src={profileImgPath}
                sx={{ mr: '10px', width: 35, height: 35 }}
              />

              <Stack sx={{ width: '100%' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 0,
                    p: 0,
                    m: 0,
                    ...(isReply && { top: 24, right: 0 }),
                  }}
                >
                  {isAuthenticated && comment.isMine === true && !comment.delYn && (
                    <Button
                      sx={{ minWidth: 20 }}
                      // onClick={handleOpenPopover}
                      onClick={() => setOpenDrawer(true)}
                    >
                      <MoreIcon sx={{ stroke: '#FFF', color: alpha('#9DA0A5', 0.75) }} />
                    </Button>
                  )}
                  {comment.attachImgPathList &&
                    comment.attachImgPathList.length > 0 &&
                    !toggleThumbnail && (
                      <Image
                        src={profileImgPath}
                        disabledEffect
                        sx={{ width: 40, height: 40, borderRadius: 1, cursor: 'pointer' }}
                        onClick={() => setToggleThumbnail(true)}
                      />
                    )}
                </Box>

                <Typography variant="subtitle1">
                  {' '}
                  {comment.writer.nickNm}
                  {isAuthenticated && comment.isMine === true && (
                    <Chip
                      label={'작성자'}
                      size={'small'}
                      sx={{
                        fontSize: '.7rem',
                        fontWeight: 200,
                        ml: 1,
                        py: 0,
                        height: 20,
                        background: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      }}
                    />
                  )}
                </Typography>

                {mode !== 'edit' ? (
                  <>
                    <Typography
                      variant="Kor_14_r"
                      sx={{
                        width: '100%',
                        mt: 0,
                        color: comment.delYn ? theme.palette.text.disabled : '#5D6066',
                      }}
                    >
                      {/* {Parser(comment.comment)} */}
                      {comment.comment}
                    </Typography>
                    {toggleThumbnail && (
                      <Box sx={{ my: 1, mr: 1, overflow: 'hidden', borderRadius: 1 }}>
                        <Carousel ref={carouselRef} {...carouselSettings}>
                          {comment.attachImgPathList &&
                            comment.attachImgPathList.map((src: string, i: number) => {
                              return (
                                <Image
                                  key={`review-carousel-${comment.orderNo}-${i}`}
                                  src={src}
                                  effect={'opacity'}
                                  sx={{}}
                                />
                              );
                            })}
                        </Carousel>
                      </Box>
                    )}
                  </>
                ) : (
                  <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Stack direction={'row'} alignItems={'top'} spacing={2} sx={{ pt: 1 }}>
                      <CTextField
                        // ref={inputRef1}
                        hasFocus={true}
                        label={''}
                        name={'comment'}
                        variant={'outlined'}
                        placeholder={
                          !isAuthenticated ? '로그인이 필요합니다.' : '이야기를 들려주세요.'
                        }
                        multiline
                        multilineHeight={24 * (newLine > 1 ? newLine + 1 : newLine)}
                        className={'commentTextAreaSub'}
                        sx={{
                          minHeight: 24,
                          maxHeight: 240,
                        }}
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
                  </FormProvider>
                )}

                <Stack direction={'row'} alignContent={'center'} alignItems={'flex-end'}>
                  {type === 'review' && (
                    <Rating
                      name="read-only"
                      value={comment.evalScore}
                      size={'small'}
                      readOnly
                      sx={{ mr: 1, mb: 0.3 }}
                    />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      color: '#9DA0A5',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    {moment(comment?.updDt || comment?.regDt).fromNow()}
                  </Typography>
                  <Divider
                    sx={{ borderWidth: 1, height: 12, mx: 1, mb: 0.4, borderColor: '#EEE' }}
                  />
                  {isAuthenticated && !isReply && !comment.delYn && type !== 'review' && (
                    <>
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 1,
                          color: '#9DA0A5',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          if (mode !== 'reply') {
                            // setReply();
                            setValue('commment', '');
                            setMode('reply');
                          }
                        }}
                      >
                        답글달기
                      </Typography>
                      <Divider
                        sx={{ borderWidth: 1, height: 12, mx: 1, mb: 0.4, borderColor: '#EEE' }}
                      />
                    </>
                  )}
                  {comment.emotionList.length < 1 ? (
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        color: '#9DA0A5',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        cursor: comment.delYn ? 'normal' : 'pointer',
                      }}
                      onClick={() => {
                        !comment.delYn && handleLike();
                      }}
                    >
                      <IconHeart stroke={'#9DA0A5'} width={16} height={16} /> 좋아요
                    </Typography>
                  ) : (
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        color: '#9DA0A5',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        cursor: comment.delYn ? 'normal' : 'pointer',
                      }}
                      onClick={() => {
                        !comment.delYn && handleLike();
                      }}
                    >
                      {comment.myEmotionCd && comment.myEmotionCd?.code === 400101 ? (
                        <IconHeartOn width={16} height={16} />
                      ) : (
                        <IconHeart stroke="#9DA0A5" width={16} height={16} />
                      )}{' '}
                      {comment.emotionList[0].cnt}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Stack>
            <List disablePadding>
              {children.map((frozen: any, j: number) => {
                const child: ICommentSnapshot = frozen;
                return (
                  <CommentItem
                    key={`reply-${comment.commentSid}-${child.commentSid}`}
                    data={child}
                    isReply={true}
                  />
                );
              })}
            </List>

            {mode === 'reply' && (
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack direction={'row'} alignItems={'top'} spacing={2} sx={{ pt: 1 }}>
                  <Avatar sx={{ mt: 0.5, mr: 0 }} src={getProfileImage()}></Avatar>
                  <CTextField
                    label={''}
                    name={'comment'}
                    hasFocus={true}
                    variant={'outlined'}
                    placeholder={'이야기를 들려주세요.'}
                    multiline
                    multilineHeight={24 * (newLine > 1 ? newLine + 1 : newLine)}
                    className={'commentTextAreaSub'}
                    sx={{
                      minHeight: 24,
                      maxHeight: 240,
                    }}
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
              </FormProvider>
            )}
          </Stack>
        </ListItem>

        {/* <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 80, p: 2, boxShadow: 'none', border: '1px solid ' + theme.palette.divider }}>
        <Stack spacing={2}>
          <Typography variant="caption" sx={{ mt: 1, color: 'text.disabled', display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => {
              setMode('edit');
              handleClosePopover();
              setValue('comment', comment.comment);
              setTimeout(() => {
                onChangeCallback('edit')
              }, 1000)
            }} >
            <EditIcon sx={{ width: 16, mr: 1 }} /> 수정
          </Typography>
          <Typography variant="caption" sx={{ mt: 1, color: 'text.disabled', display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => { setAlertOpen(true); handleClosePopover() }} >
            <DeleteIcon sx={{ width: 16, mr: 1 }} /> 삭제
          </Typography>
        </Stack>
      </MenuPopover> */}

        {openDrawer && (
          <Drawer
            open={openDrawer}
            onClose={() => {
              setOpenDrawer(false);
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
          >
            <Stack spacing={2} sx={{ p: 4 }}>
              <Stack
                direction={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  setMode('edit');
                  setOpenDrawer(false);
                  setValue('comment', comment.comment);
                  setTimeout(() => {
                    onChangeCallback('edit');
                  }, 1000);
                }}
              >
                <Typography variant={'body1'} sx={{ textAlign: 'left', color: 'text.primary' }}>
                  수정하기
                </Typography>
                <CloseIcon
                  fill={theme.palette.common.black}
                  onClick={() => {
                    setOpenDrawer(false);
                  }}
                />
              </Stack>
              <Stack
                direction={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  setAlertOpen(true);
                  setOpenDrawer(false);
                }}
              >
                <Typography variant={'body1'} sx={{ textAlign: 'left', color: 'text.primary' }}>
                  삭제하기
                </Typography>
              </Stack>
            </Stack>
          </Drawer>
        )}

        {alertOpen && (
          <CAlert
            isAlertOpen={alertOpen}
            alertCategory={'f2d'}
            alertTitle={'정말 삭제하시겠습니까?'}
            hasCancelButton={true}
            handleAlertClose={() => {
              setAlertOpen(false);
            }}
            callBack={onDelete}
          ></CAlert>
        )}
      </>
    );
  },
);

export default CommentItem;
