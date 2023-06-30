import { yupResolver } from '@hookform/resolvers/yup';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import MoreIcon from '@mui/icons-material/MoreHoriz';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  InputAdornment,
  List,
  ListItem,
  Rating,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Parser from 'html-react-parser';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import 'moment/locale/ko';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ReactComponent as IconHeartOn } from 'src/assets/icons/ico-heart-on.svg';
import { ReactComponent as IconHeart } from 'src/assets/icons/ico-heart-small.svg';
import { useAuthContext } from 'src/auth/useAuthContext';
import CAlert from 'src/components/CAlert';
import Carousel from 'src/components/carousel';
import CTextField from 'src/components/forms/CTextField';
import FormProvider from 'src/components/hook-form';
import MenuPopover from 'src/components/menu-popover';
import { IReviewModel } from 'src/models/market-store/Review';
import * as Yup from 'yup';
import Image from 'src/components/image';

/**
 * ## CommentItem 설명
 *
 */

export interface IReviewItemProps {
  data: IReviewModel;
  isReply?: boolean;
  contentsType?: 'comment' | 'review';
  onUpdate?: (comment: IReviewModel) => Promise<any>;
  onRemove?: (comment: IReviewModel) => Promise<any>;
  onReply?: (comment: IReviewModel) => Promise<any>;
  onAddLike?: (comment: IReviewModel, emotionCd: 400101 | 400102) => Promise<any>;
  onRemoveLike?: (comment: IReviewModel) => Promise<any>;
}
export const ReviewItem = observer(
  ({
    data,
    contentsType = 'review',
    isReply = false,
    onUpdate,
    onRemove,
    onReply,
    onAddLike,
    onRemoveLike,
  }: IReviewItemProps) => {
    const { REACT_APP_IMAGE_STORAGE } = process.env;
    const theme = useTheme();
    const { user, isAuthenticated } = useAuthContext();

    const [alertOpen, setAlertOpen] = useState(false);

    const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

    // const emotionFn = (id: number, type: boolean) => {};

    // const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    //   setOpenPopover(event.currentTarget);
    // };

    const handleClosePopover = () => {
      setOpenPopover(null);
    };

    const [comment, setComment] = useState<IReviewModel>(data);
    useEffect(() => {
      // console.log('change review model', JSON.stringify(data, null, 2));
      setComment(data);
    }, [data]);

    const [children, setChildren] = useState<any[]>([]);
    const [profileImgPath, setProfileImgPath] = useState<string>('');
    useEffect(() => {
      if (comment) {
        setChildren(comment.childList);
        if (comment.writer.profileImgPath !== null) {
          setProfileImgPath(
            REACT_APP_IMAGE_STORAGE + (comment?.writer.profileImgPath || '/assets/placeholder.svg'),
          );
        }
      }
    }, [comment, REACT_APP_IMAGE_STORAGE]);

    const [mode, setMode] = useState('');

    const valid = Yup.object({
      comment: Yup.string()
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
      setValue,
      getValues,
      handleSubmit,
      formState: { errors },
    } = methods;

    const onSubmit = async () => {
      if (_.isEmpty(errors)) {
        const comm = getValues();
        comm.comment = comm.comment.replace(/\n/gi, '<br />');
        if (mode === 'edit') {
          comm.contsSid = comment.contsSid;
          comm.commentSid = comment.commentSid;
          await onUpdate?.(comm as IReviewModel);
          setMode('');
        } else if (mode === 'reply') {
          comm.pcommentSid = comment?.commentSid;
          comm.commentSid = null;
          comm.contsSid = comment?.contsSid;
          await onReply?.(comm as IReviewModel);
          setMode('');
        }
      }
    };

    const onDelete = async () => {
      console.log('delete', comment);
      await onRemove?.(comment as IReviewModel);
      setMode('');
    };

    const handleLike = () => {
      // // 이모션(400101 : 좋아요, 400102: 싫어요)
      // const emotionCd = comment?.myEmotionCd?.code === 400101 ? 400102 : 400101;
      if (!isAuthenticated) {
        return;
      }
      if (comment?.myEmotionCd?.code === 400101) {
        onRemoveLike?.(comment as IReviewModel);
      } else {
        onAddLike?.(comment as IReviewModel, 400101);
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
          .catch((e) => {});
        e.nativeEvent.preventDefault();
      }
    };

    const onChangeCallback = (e: any) => {
      setNewLine(getValues('comment').split('\n').length);
    };

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

    const attachImgPathList = [profileImgPath, profileImgPath, profileImgPath];

    return (
      <>
        <ListItem
          disableGutters
          // key={`comment-${comment?.commentSid}`}
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            alignItems: 'flex-start',
            ...(isReply
              ? {
                  pl: 8,
                  pb: 0,
                }
              : {
                  py: 2,
                  borderBottom: '1px solid #eeeeee',
                }),
            width: '100%',
          }}
        >
          <Stack
            sx={{
              width: '100%',
              ...(isReply && {
                p: 2,
                borderRadius: 2,
                background: alpha(theme.palette.background.neutral, 0.4),
              }),
            }}
          >
            <Stack direction={'row'}>
              <Avatar
                alt={comment?.writer.nickNm}
                src={profileImgPath}
                sx={{ mt:'4px', mr: '10px', width: 35, height: 35 }}
              />

              <Stack sx={{ width: 'calc(100% - 56px)' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 0,
                    p: 0,
                    m: 0,
                    ...(isReply && { top: 24, right: 16 }),
                  }}
                >
                  {/* {isAuthenticated &&
                    user?.loginId === comment?.writer.loginId &&
                    !comment?.delYn && (
                      <Button sx={{ minWidth: 20 }} onClick={handleOpenPopover}>
                        <MoreIcon sx={{ stroke: '#FFF', color: alpha('#9DA0A5', 0.75) }} />
                      </Button>
                    )} */}
                  {comment?.attachImgPathList &&
                    comment?.attachImgPathList.length > 0 &&
                    !toggleThumbnail && (
                      <Image
                        src={
                          comment?.attachImgPathList[0]
                            ? REACT_APP_IMAGE_STORAGE + comment?.attachImgPathList[0]
                            : '/assets/default-goods.svg'
                        }
                        disabledEffect
                        sx={{ width: 40, height: 40, borderRadius: 1, cursor: 'pointer' }}
                        onClick={() => setToggleThumbnail(true)}
                      />
                    )}
                </Box>

                <Typography variant="subtitle1">
                  {comment?.writer.nickNm}
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
                      variant="body2"
                      sx={{
                        width: '100%',
                        mt: 0,
                        color: comment?.delYn
                          ? theme.palette.text.disabled
                          : theme.palette.text.secondary,
                        fontWeight: 200,
                      }}
                    >
                      {/* {tagUser && (
                      <Box component="strong" sx={{ mr: 0.5 }}>
                      @{tagUser}
                      </Box>
                    )} */}
                      {Parser(comment?.comment || '')}
                    </Typography>
                    {toggleThumbnail && (
                      <Box sx={{ my: 1, mr: 1, overflow: 'hidden', borderRadius: 1 }}>
                        <Carousel ref={carouselRef} {...carouselSettings}>
                          {comment?.attachImgPathList &&
                            comment?.attachImgPathList.map((src: string, i: number) => {
                              return (
                                <Image
                                  key={`review-carousel-${comment?.orderNo}-${i}`}
                                  src={REACT_APP_IMAGE_STORAGE + src}
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
                        label={''}
                        name={'comment'}
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

                {/* REVIEW ---------------------------------------------------------------- */}
                {/* REVIEW ---------------------------------------------------------------- */}
                {/* REVIEW ---------------------------------------------------------------- */}
                {/* REVIEW ---------------------------------------------------------------- */}

                <Stack direction={'row'} alignContent={'center'} alignItems={'flex-end'}>
                  {contentsType === 'review' && (
                    <Rating
                      name="read-only"
                      value={comment?.evalScore || 0}
                      size={'small'}
                      readOnly
                      sx={{ mr: 1, mb: 0.3 }}
                    />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      color: 'text.disabled',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    {moment(comment?.updDt).fromNow()}
                  </Typography>
                  <Divider
                    sx={{ borderWidth: 1, height: 12, mx: 1, mb: 0.4, borderColor: '#EEE' }}
                  />
                  {!isReply && !comment?.delYn && contentsType !== 'review' && (
                    <>
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 1,
                          color: 'text.disabled',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          if (mode !== 'reply') {
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
                  {comment?.emotionList.length < 1 ? (
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        color: 'text.disabled',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        cursor: comment?.delYn ? 'normal' : 'pointer',
                      }}
                      onClick={() => {
                        !comment?.delYn && handleLike();
                      }}
                    >
                      <IconHeart stroke={'#9DA0A5'} width={16} height={16} /> 좋아요
                    </Typography>
                  ) : (
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        color: 'text.primary',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        cursor: comment?.delYn ? 'normal' : 'pointer',
                      }}
                      onClick={() => {
                        !comment?.delYn && handleLike();
                      }}
                    >
                      <IconHeartOn width={16} height={16} /> {comment?.emotionList[0].cnt}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Stack>
            <List disablePadding>
              {children.map((frozen: any, j: number) => {
                const child: any = frozen;
                return (
                  <ReviewItem
                    key={`reply-${comment?.commentSid}-${child.commentSid}`}
                    data={child}
                    isReply={true}
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                    onAddLike={onAddLike}
                    onRemoveLike={onRemoveLike}
                  />
                );
              })}
            </List>

            {mode === 'reply' && (
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack direction={'row'} alignItems={'top'} spacing={2} sx={{ pt: 1 }}>
                  <Avatar sx={{ mt: 0.5, mr: 0 }}></Avatar>
                  <CTextField
                    label={''}
                    name={'comment'}
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

        <MenuPopover
          open={openPopover}
          onClose={handleClosePopover}
          sx={{ width: 80, p: 2, boxShadow: 'none', border: '1px solid ' + theme.palette.divider }}
        >
          <Stack spacing={2}>
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                color: 'text.disabled',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => {
                setMode('edit');
                handleClosePopover();
                setValue('comment', comment?.comment);
                setTimeout(() => {
                  onChangeCallback('edit');
                }, 1000);
              }}
            >
              <EditIcon sx={{ width: 16, mr: 1 }} /> 수정
            </Typography>
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                color: 'text.disabled',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => {
                setAlertOpen(true);
                handleClosePopover();
              }}
            >
              <DeleteIcon sx={{ width: 16, mr: 1 }} /> 삭제
            </Typography>
          </Stack>
        </MenuPopover>

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

        {/* <Divider
        sx={{
          borderWidth: 0,
          ...(isReply && {
            borderWidth: 1,
            ml: 7,
          }),
        }}
      /> */}
      </>
    );
  },
);

export default ReviewItem;
