import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import Carousel from 'src/components/carousel';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { Stack, Typography, useTheme, Box } from '@mui/material';
import { useNavigate } from 'react-router';
import { ReactComponent as IconHeart } from 'src/assets/icons/ico-heart.svg';
import Image from '../../../../../components/image/Image';
import { lineBreak } from 'html2canvas/dist/types/css/property-descriptors/line-break';
import palette from 'src/theme/palette';
import { useParams } from 'react-router-dom';
import { ILikeSnapshot, IMbtiSnapshot } from 'src/models';
import { CallApiToStore } from 'src/utils/common';
import { number } from 'yup/lib/locale';
import { TEST_TYPES } from 'src/components/test-types-svg';


/**
 * ## LikeDnaItems 설명
 * DNA 테스트 좋아요 관리
 */

interface Props {
  data?: ILikeSnapshot;
}

export const LikeDnaItems = observer(({ data }: Props) => {
  const rootStore = useStores();
  const { likeStore, loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const [active, setActive] = useState(true);
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const carouselRef = useRef<Carousel | null>(null);
  const [cardList, setCardList] = useState();
  
  const handleLike = () => {
    // if (active == true) {
    //   likeStore.removeLikeGoods(sid);
    //   // alert('삭제 되었습니다.');
    //   setActive(false);
    //   likeStore.gets();
    // } 
    // else {
    //   likeStore.addLikeGoods(sid, 400101);
    //   // alert('추가 되었습니다.');
    //   setActive(true);
    //   likeStore.gets();
    // }
    setActive(false);
    CallApiToStore(likeStore.removeLikeGoods(data?.goodsSid!), 'api', loadingStore).then(() => {
      CallApiToStore(likeStore.gets(), 'api', loadingStore).then(() => {});
    });
  };

  useEffect(() => {
    
    let timeoutId: NodeJS.Timeout;
    const play = () => {
      timeoutId && clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        carouselRef.current?.slickNext();
        play();
      }, 3000);
    };
    setTimeout(play, Math.random() * 3000);
    return () => {
      timeoutId && clearTimeout(timeoutId);
    };
  }, [carouselRef]);

  const carouselSettings = {
    dots: false,
    arrows: false,
    draggable: true,
    slidesToShow: 1,
    initialSlide: 0,
    rtl: false,
    speed: 700,
    infinite: true,
    swipeToSlide: true,
  };
  const images: string[] = [];
  if (data?.img1Path){
    images.push(REACT_APP_IMAGE_STORAGE + (data.img1Path));
  } else{
    images.push('/assets/placeholder.svg');
  }
  if (data?.img2Path){
    images.push(REACT_APP_IMAGE_STORAGE + (data.img2Path));
  } else{
    images.push('/assets/placeholder.svg');
  }

  return (
    <>
      {data && (
        <Stack sx={{ textAlign: 'left', mb: 1, overflow: 'hidden' }}>
          <Stack sx={{ position: 'relative', mb: 1 }}>
            <Carousel ref={carouselRef} {...carouselSettings}>
              {images.map((src: string, i: number) => (
                <Image
                  key={i}
                  src={src}
                  ratio={'1/1'}
                  sx={{ borderRadius: 2, border: '1px solid', borderColor: '#F5F5F5', cursor:'pointer' }}
                  onClick={() => {
                    navigate('/market/goods/' + data?.goodsSid);
                  }}
                  disabledEffect
                  onError={(e: any) => {
                    e.target.src = '/assets/default-goods.svg';
                  }}
                />
              ))}
            </Carousel>
            <IconHeart
              id={`btn-my-like-dnaLike-${data?.goodsSid}`}
              // stroke={active == true ? theme.palette.primary.main : theme.palette.grey[400]}
              stroke={ theme.palette.primary.main }
              width={30}
              height={30}
              // fill={active == true ? theme.palette.primary.main : 'white'}
              fill={theme.palette.primary.main}
              onClick={() => handleLike()}
              style={{ position: 'absolute', top: '80%', right: '2%', margin: 2 , cursor:'pointer' }}
            />
          </Stack>
          <Stack sx={{ textAlign: 'left', cursor:'pointer' }} 
            onClick={() => {
              navigate('/market/goods/' + data?.goodsSid);
          }}>
            <Typography variant="Kor_18_b" sx={{ mt: '0' }}>
              {data.goodsNm}
            </Typography>
            <Typography
              variant="Kor_14_r" 
              sx={{ mt: '0' }}
              // onClick={() => {
              //   navigate('/market/goods/' + data?.goodsSid);
              // }}
            >
              {data.goodsSummary}
            </Typography>
            <Typography
              variant="Kor_12_b"
              sx={{ mt: 1, color: theme.palette.grey[400], textDecorationLine: 'line-through' }}
            >
              {data.price.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,")}원
            </Typography>
            <Stack direction={'row'} spacing={1}>
              <Typography variant="Kor_12_b"sx={{ color: theme.palette.primary.main }}>
                {data.dispDscntRate == null ? 0 : data.dispDscntRate}%
              </Typography>
              <Typography variant="Kor_12_b">
                {data.goodsAmt.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,")}원
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      )}
    </>
  );
});

export default LikeDnaItems;
