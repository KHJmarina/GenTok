import { alpha, Button, Divider, Drawer, List, Stack, Typography, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { ReactComponent as CheckIcon } from 'src/assets/icons/ico-check.svg';
import { ReactComponent as CloseIcon } from 'src/assets/icons/ico-close-small.svg';
import Iconify from 'src/components/iconify';

import { ReactComponent as IconArrowDown } from 'src/assets/icons/ico-arrow-down.svg';

import { IReviewModel } from 'src/models/market-store/Review';
import { IReviewSearchOptions } from 'src/services/market/review/ReviewTypes';

import { IObservableValue } from 'mobx';
import { IPagination } from 'src/models/extensions/with-pagination';
import ReviewItem from './ReviewItem';
import { pxToRem } from 'src/theme/typography';

/**
 * ## Comment 설명
 *
 */

export interface IReviewProps {
  contentSid?: number; // MBTI SID | GOODS SID ...
  contentsType: 'review' | 'comment';
  dataList: IReviewModel[];
  pagination: IObservableValue<IPagination>;
  onSearch?: (options: IReviewSearchOptions) => Promise<any>;
  onNext?: () => Promise<any>;
  onReset?: () => void;
  onAdd?: (comment: IReviewModel) => Promise<any>;
  onUpdate?: (comment: IReviewModel) => Promise<any>;
  onRemove?: (comment: IReviewModel) => Promise<any>;
  onReply?: (comment: IReviewModel) => Promise<any>;
  onAddLike?: (comment: IReviewModel, emotionCd: 400101 | 400102) => Promise<any>;
  onRemoveLike?: (comment: IReviewModel) => Promise<any>;
}

export const Review = observer(
  ({
    contentSid: SID,
    contentsType = 'comment',
    dataList,
    pagination,
    onSearch,
    onNext,
    onReset,
    onAdd,
    onUpdate,
    onRemove,
    onReply,
    onAddLike,
    onRemoveLike,
  }: IReviewProps) => {
    const theme = useTheme();

    const [loadingComment, setLoadingComment] = useState(true);
    const [orderTypeCd, setOrderType] = useState<100601 | 100603>(100601);
    const [openOrderType, setOpenOrderType] = useState(false);

    const getComment = useCallback(async () => {
      await onSearch?.({ orderTypeCd, page: 1 });
      setLoadingComment(false);
    }, [onSearch, orderTypeCd]);

    useEffect(() => {
      getComment();
      return () => {
        // 탭에서 숫자 표시를 위해서 초기화하지 않는다.
        // onResetComments?.();
      };
    }, [getComment]);

    return (
      <>
        <Stack sx={{ p: 3, pt: 4 }}>
          {loadingComment ? (
            <Typography variant={'Kor_16_r'} sx={{ textAlign: 'center', color: '#c6c7ca' }}>
              리뷰를 불러오는 중입니다.
            </Typography>
          ) : pagination.get().totalElements < 1 ? (
            <Typography variant="Kor_16_r" sx={{ color: '#c6c7ca' }}>
              이 상품의 첫번째 리뷰를 작성해보세요.
            </Typography>
          ) : (
            <>
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography
                  variant={'body2'}
                  color={grey[500]}
                  sx={{ textAlign: 'left', fontSize: '.8rem' }}
                >
                  {pagination.get().totalElements > 0 ? (
                    <>
                      총 {pagination.get().totalElements}개 리뷰 중 최신
                      {dataList.length}개
                    </>
                  ) : (
                    <>총 {pagination.get().totalElements}개 리뷰</>
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
                    height: 3,
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
                    <ReviewItem
                      key={`review-${item.orderNo}`}
                      data={item}
                      isReply={false}
                      contentsType={contentsType}
                      onUpdate={onUpdate}
                      onRemove={onRemove}
                      onReply={onReply}
                      onAddLike={onAddLike}
                      onRemoveLike={onRemoveLike}
                    />
                  );
                })}
              </List>

              {/* <Divider sx={{ borderWidth: 1 }} /> */}

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
                  onNext?.();
                  // onGetComments?.({ orderTypeCd, page: pagination.page + 1 });
                }}
              >
                {pagination.get().totalElements < 1 ? (
                  '이 상품의 첫번째 리뷰를 작성해보세요.'
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

export default Review;
