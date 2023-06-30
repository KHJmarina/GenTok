import { Box, Stack, Typography, Container } from '@mui/material';
import { observer } from "mobx-react-lite";
import { useRef } from 'react';
import { useStores } from "src/models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router';
import { pxToRem } from 'src/theme/typography';
import { MotionContainer, varFade } from 'src/components/animate';
import { m } from 'framer-motion';
import { IMbtiResult } from 'src/models/mbti-result/MbtiResult';
import Image from 'src/components/image/Image';
import { ReactComponent as IconRight } from 'src/assets/icons/ico-right.svg';
import { useScrollable } from 'src/hooks/useScrollable';
import { ReactComponent as TwinkleStars } from '../../../user/mypage/dna-result/dna-result-detail/detail-card/stars.svg';
import { IDnaResultCard } from 'src/models';
import { toJS } from 'mobx';

/**
 * ## FcfsMarketCard 설명
 *
 */

interface Props {
  dnaCard: any;
  goodsSid?: string;
}

export const FcfsMarketGoldCard = observer(({ dnaCard, goodsSid }: Props) => {

  const rootStore = useStores();
  const theme = useTheme();
  const navigate = useNavigate();
  const { REACT_APP_IMAGE_STORAGE } = process.env;

  const transition = {
    repeatType: 'loop',
    ease: 'linear',
    duration: 'none',
    repeat: Infinity,
  } as const;

  const dragRef = useRef<HTMLDivElement>(null);
  useScrollable(dragRef, 'x');

  return (
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
                src={dnaCard.testResultImgPath}
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
      </Box>
    </Box>
  );
});

export default FcfsMarketGoldCard;