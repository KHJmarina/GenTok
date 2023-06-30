import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import { Stack, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router';
import { ReactComponent as IconHeart } from 'src/assets/icons/ico-heart.svg';
import Image from '../../../../../components/image/Image';
import { CallApiToStore } from 'src/utils/common';
import { ILikeSnapshot } from 'src/models';

/**
 * ## LikeTestItems 설명
 * 유형 테스트 좋아요 관리
 */

interface Props {
  data?: ILikeSnapshot;
}

export const LikeTestItems = observer(({ data }: Props) => {
  const rootStore = useStores();
  const { likeStore, loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const [active, setActive] = useState(true);
  const { REACT_APP_IMAGE_STORAGE } = process.env;

  // const handleChange = () => {
  //   setActive(!active); // 좋아요 취소 확인 필요
  // };

  const handleLike = (sid:number) => {
    if(data?.gameTypeCd == null){
      // if(active == true){
      //   likeStore.removeLikeMbti(sid);
      //   setActive(false);
      //   // alert('삭제 되었습니다.');
      // }else {
      //   likeStore.addLikeMbti(sid,400101);
      //   setActive(true);
      //   // alert('추가 되었습니다.');
      // }
      
      CallApiToStore(likeStore.removeLikeMbti(sid), 'api', loadingStore).then(() => {
        CallApiToStore(likeStore.getContents(), 'api', loadingStore).then(() => {});
      });
      
    } else {
      // if(active == true){
      //   likeStore.removeLikeGame(sid);
      //   setActive(false);
      //   // alert('삭제 되었습니다.');
      // }else {
      //   likeStore.addLikeGame(sid,400101);
      //   setActive(true);
      //   // alert('추가 되었습니다.');
      // }
      CallApiToStore(likeStore.removeLikeGame(sid), 'api', loadingStore).then(() => {
        CallApiToStore(likeStore.getContents(), 'api', loadingStore).then(() => {});
      });
    }
  }  
  
  
  return (
    <>
      {data && (
        <Stack sx={{ textAlign: 'left', mb: 1 }}>
          <Stack sx={{ position: 'relative', mb: 1 }}>
            <Image
              src={data.thumbnlPath ? REACT_APP_IMAGE_STORAGE + data.thumbnlPath : ''}
              ratio={'1/1'}
              sx={{ borderRadius: 2, cursor:'pointer' }}
              onClick={() => {
                navigate(
                  '/contents/' + (data.gameTypeCd ? 'game/' : 'mbti/') + data.contsSid,
                );
              }}
              onError={(e: any) => {
                e.target.src = '/assets/default-goods.svg';
              }}
              disabledEffect
            />
            <IconHeart
              id={data.gameTypeCd ? `btn-my-like-gameLike-${data?.contsSid}` : `btn-my-like-mbtiLike-${data?.contsSid}`}
              // stroke={active == true ? theme.palette.primary.main : theme.palette.grey[400]}
              stroke={theme.palette.primary.main}
              width={30}
              height={30}
              // fill={active == true ? theme.palette.primary.main : 'white'}
              fill={theme.palette.primary.main }
              onClick={() => handleLike(data?.contsSid)}
              style={{ position: 'absolute', top: '80%', right: '2%', margin: 2, cursor:'pointer' }}
            />
          </Stack>
          <Stack sx={{ textAlign: 'left', cursor:'pointer' }}
            onClick={() => {
              navigate(
                '/contents/' + (data.gameTypeCd ? 'game/' : 'mbti/') + data.contsSid,
              );
            }}
          >
            <Typography
              variant="Kor_14_r"
              sx={{ mt: '0 !important', color: theme.palette.grey[400] }}
            >
              {data.gameTypeCd
              ? data.gameTypeCd.value
              : data.contsTypeCd?.value} 
            </Typography>
          </Stack>
          <Typography
            variant="Kor_18_b"
            sx={{ mt: '0 !important' }}
            fontWeight={900}
            onClick={() => {
              navigate(
                '/contents/' +
                (data.gameTypeCd ? 'game/' : 'mbti/') + data.contsSid,
              );
            }}
          >
            {data.contsNm}
          </Typography>
        </Stack>
      )}
    </>
  );
});

export default LikeTestItems;
