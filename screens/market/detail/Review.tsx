import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { useStores } from 'src/models';
import { IReviewModel } from 'src/models/market-store/Review';
import { IReviewSearchOptions } from 'src/services/market/review/ReviewTypes';
import { IReviewProps as IReviewListProps, Review as ReviewList } from '../components/review/Review';

export interface IReviewProps {
  goodsSid?: string;
}

export const Review = observer(({ goodsSid }: IReviewProps) => {
  const {
    marketStore: { reviewStore },
  } = useStores();

  useEffect(() => {
    return () => {
      reviewStore.setPagination({
        ...reviewStore.pagination,
        page: 1,
      });
    };
  }, [reviewStore]);

  const reviewListProps: IReviewListProps = useMemo(
    () => ({
      contentSid: Number(goodsSid),
      contentsType: 'review',
      dataList: reviewStore.list,
      pagination: reviewStore.paginationRaw,

      onSearch: async (options: IReviewSearchOptions) => {
        return await reviewStore?.search(Number(goodsSid), options);
      },

      onNext: async () => {
        console.log('onNextComments', goodsSid);
        return await reviewStore?.next(Number(goodsSid));
      },

      onAddLike: async (comment: IReviewModel, emotionCd: 400101 | 400102) => {
        console.log('onAddLike', comment, emotionCd);
        return await reviewStore.addEmotion(Number(goodsSid), comment.orderNo, emotionCd);
      },

      onRemoveLike: async (comment: IReviewModel) => {
        console.log('onRemoveLike', comment);
        return await reviewStore.removeEmotion(Number(goodsSid), comment.orderNo);
      },
    }),
    [reviewStore, goodsSid],
  );

  return <ReviewList {...reviewListProps} />;
});
