import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { pxToRem } from 'src/theme/typography';
import './dna-card-style.css';
import { useStores } from 'src/models/root-store/root-store-context';
import { ReactComponent as TwinkleStars } from './stars.svg';
import Image from 'src/components/image';
import { IDnaResultCard } from 'src/models/dna-result-card/DnaResultCard';
import { ReactComponent as IconShare } from 'src/assets/icons/ico-share.svg';
import CShareAlert from 'src/components/CShareAlert';

// export interface IGoldCardProps {
//   dnaCard: IDnaResultCard;
// }
export interface Props {
  dnaCard: IDnaResultCard;
  goodsSid?: string;
}

export const DnaDetailGoldCard = (({ dnaCard, goodsSid }: Props) => {
  const rootStore = useStores();
  const { dnaCardDetailStore, loadingStore } = rootStore;
  const [backgroundPositionY, setBackgroundPositionY] = useState(0);
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    // function moveBackground() {
    //   requestAnimationFrame(() => {
    //     setBackgroundPositionY((backgroundPositionY) => backgroundPositionY + 0.1);
    //     moveBackground();
    //   });
    // }
    // moveBackground();
    console.log(dnaCard)
  }, []);

  return (
    // <>
      <Box sx={{ pt: '1rem', mb: pxToRem(40) }}>
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 0,
              mb: pxToRem(35),
            }}
          >
            <Box
              sx={{
                flex: '0 0 300px',
                width: pxToRem(300),
                height: pxToRem(412),
                borderRadius: pxToRem(20),
                overflow: 'hidden',
                position: 'relative',
              }}
              className="infinity-flow-bg-up"
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  m: pxToRem(7.5),
                  border: 'solid 1px #fff',
                  borderRadius: pxToRem(14),
                }}
              ></Box>
              <Box
                id="반짝반짝_빛나는"
                sx={{
                  position: 'absolute',
                  top: pxToRem(80),
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <TwinkleStars className="infinity-twinkle" />
              </Box>

              <Box
                id="컨텐츠박스"
                // id="shareImage"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: pxToRem(39),
                }}
              >
                <Typography variant="Kor_16_b" component="h2">
                  {/* {dnaCard?.ctegryList[0]?.ctegryNm} */}
                  {dnaCard?.goodsNm}
                </Typography>

                <Image
                  id="shareImage"
                  // src={`${REACT_APP_IMAGE_STORAGE}${dnaCard.testResultImgPath}`}
                  src={REACT_APP_IMAGE_STORAGE+ (dnaCard.testResultImgPath || '/assets/default-goods.svg')}
                  sx={{ width: pxToRem(180), height: pxToRem(180), pt: 2 }}
                  alt=""
                />

                <Image
                  src="/assets/images/crown.png"
                  sx={{ width: pxToRem(46), height: pxToRem(42) }}
                  alt=""
                />

                <Typography variant="Kor_24_b" component="h1" sx={{ pt: 1.5, pb: 0.5 }}>
                  {dnaCard?.testResultNm}
                </Typography>

                <Typography variant="Kor_16_r" component="h3">
                  {dnaCard?.testResultSummary}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            id={`bnt-result-share-${goodsSid}`}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 100,
              backgroundColor: '#FAFAFA',
              width: '5.5rem',
              height: '2.13rem',
              m: 'auto',
              mt: '1.25rem',
              cursor: 'pointer',
            }}
            onClick={() => {
              setShareOpen(true);
            }}
          >
            <IconShare fill={'#202123'} width={14} height={14} stroke={'#202123'} />
            <Typography sx={{ ml: 1, fontSize: pxToRem(12) }}>공유하기</Typography>
          </Box>
        </Box>
        
        {shareOpen && (
        <CShareAlert
          isAlertOpen={true}
          alertTitle={'친구에게 공유하기'}
          handleAlertClose={() => {
            setShareOpen(false);
          }}
          shareData={{
            title:dnaCard?.testResultNm, 
            desc:dnaCard?.testResultSummary, 
            thumbnlPath:dnaCard?.testResultImgPath, 
            path: 'dna', 
            type:'상품', 
            Sid: goodsSid, 
            img: REACT_APP_IMAGE_STORAGE&&REACT_APP_IMAGE_STORAGE + dnaCard?.testResultImgPath, 
            url: `https://gentok.net/market/goods/${goodsSid}` , 
          }}
        />
      )}
      </Box>

    // </>
  );
});

export default DnaDetailGoldCard;
