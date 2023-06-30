import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import Comment, { ICommentProps } from '../components/comment/Comment';
import { useStores } from 'src/models';
import { ICommentModel } from 'src/models/market-store/Comment';
import { ICommentSearchOptions } from 'src/services/market/comment';
export interface ICommentsProps {
  goodsSid?: string;
}

export const Comments = observer(({ goodsSid }: ICommentsProps) => {
  const {
    marketStore: { commentStore },
  } = useStores();

  useEffect(() => {
    return () => {
      commentStore.setPagination({
        ...commentStore.pagination,
        page: 1,
      });
    };
  }, [commentStore]);


  const commentProps: ICommentProps = useMemo(
    () => ({
      contentSid: Number(goodsSid),
      contentsType: 'comment',
      dataList: commentStore.list,
      pagination: commentStore.paginationRaw,
      onGetComments: async (options: ICommentSearchOptions) => {
        return await commentStore?.searchByGoods(Number(goodsSid), options);
      },
      onNextComments: async () => {
        console.log('onNextComments', JSON.stringify(commentStore.pagination, null, 2));
        return await commentStore?.next(Number(goodsSid));
      },
      onResetComments: () => {
        console.log('onResetComments');
        return commentStore.reset();
      },
      onAddComment: async (comment: ICommentModel) => {
        return await commentStore.addCommentToGoods(Number(goodsSid), comment);
      },
      onUpdateComment: async (comment: ICommentModel) => {
        return await commentStore.updateComment(Number(goodsSid), comment.commentSid, comment);
      },
      onReplyComment: async (comment: ICommentModel) => {
        return await commentStore.addCommentToGoods(Number(goodsSid), comment);
      },
      onRemoveComment: async (comment: ICommentModel) => {
        return await commentStore.removeComment(Number(goodsSid), comment.commentSid);
      },
      onAddLike: async (comment: ICommentModel, emotionCd: 400101 | 400102) => {
        console.log('onAddLike', comment, emotionCd);
        return await commentStore.addEmotion(Number(goodsSid), comment, emotionCd);
      },
      onRemoveLike: async (comment: ICommentModel) => {
        console.log('onRemoveLike', comment);
        return await commentStore.removeEmotion(Number(goodsSid), comment);
      },
    }),
    [commentStore, goodsSid],
  );

  return <Comment {...commentProps} />;
});
