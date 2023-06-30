import Box from '@mui/material/Box';
import { Stack, Card, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material';
import { pxToRem } from 'src/theme/typography';
import { convertCtegryToValue } from 'src/screens/user/mypage/Mypage';
import { ReactComponent as IconDnaStar } from 'src/assets/icons/ico-dna-star.svg';
import { IDnaResultCard } from 'src/models/dna-result-card/DnaResultCard';
import { ReactComponent as IconShare } from 'src/assets/icons/ico-share.svg';
import CShareAlert from 'src/components/CShareAlert';
import { useStores } from 'src/models';

/**
 * ## DetailCard 설명
 *
 */

interface Props {
  dnaCard: IDnaResultCard;
  bgColor?: string;
  goodsSid?: string;
}

export const FcfsMarketCard = observer(({ dnaCard, bgColor, goodsSid }: Props) => {
  const rootStore = useStores();
  const { dnaCardDetailStore, loadingStore } = rootStore;
  const theme = useTheme();
  const [ctegryData, setCtegryData] = useState<any>();
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <Box sx={{ pt: '1rem', mb: pxToRem(40) }}>
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Card
              sx={[
                {
                  boxShadow: 'none',
                  background: bgColor,
                  width: pxToRem(300),
                  height: pxToRem(412),
                  mb: 2,
                  zIndex: 0,
                  borderRadius: `${pxToRem(20)} !important`,
                },
              ]}
            >
              <Stack sx={{ px: 2.5, pt: 5, pb: 10, alignItems: 'center' }}>
                <Typography
                  variant="Kor_16_b"
                  sx={{
                    mb: pxToRem(16),
                    color: `${
                      theme.palette.dna[
                        convertCtegryToValue(Number(dnaCard.ctegryList[0]?.ctegrySid))
                      ].primary
                    }`,
                  }}
                >
                  {dnaCard.goodsNm ? dnaCard.goodsNm : null}
                </Typography>
                <Box
                  id="shareImage" 
                  component={'img'}
                  src={
                    // dnaCard.testResultImgPath ? 
                      REACT_APP_IMAGE_STORAGE+ (dnaCard.testResultImgPath || '/assets/default-goods.svg')
                      // : '/assets/default-goods.svg'
                  }
                  // src={dnaCard.testResultImgPath? dnaCard.testResultImgPath : '/assets/default-goods.svg'}
                  width={'180px'}
                  height={'180px'}
                  maxHeight={360}
                  onError={(e: any) => {
                    e.target.src = '/assets/default-goods.svg';
                  }}
                />
                <Box sx={{ display: 'flex', pb: pxToRem(16) }}>
                  {/* 별 개수  */}
                  {dnaCard.myLevel != 0 &&
                    (dnaCard.myLevel === 3 ? (
                      <>
                        {[...Array(dnaCard.myLevel)].map((_, index) => (
                          <IconDnaStar key={index} fill={'#FCC800'} />
                        ))}
                      </>
                    ) : (
                      <>
                        {[...Array(dnaCard.myLevel)].map((_, index) => (
                          <IconDnaStar key={index} fill={'#FCC800'} />
                        ))}
                        {[...Array(3 - (dnaCard.myLevel || 0))].map((_, index) => (
                          <IconDnaStar key={index} fill={'#FAFAFA'} />
                        ))}
                      </>
                    ))}
                </Box>
                <Typography variant="Kor_24_b" sx={{ color: '#202123', pb: pxToRem(4) }}>
                  {dnaCard?.testResultNm}
                  {/* {dnaCard.resultPair?.testResult1.testResultNm} */}
                </Typography>
                <Typography variant="Kor_16_r" sx={{ color: '#202123' }}>
                  {dnaCard?.testResultSummary}
                  {/* {dnaCard.resultPair?.testResult1.testResultSummary} */}
                </Typography>
              </Stack>
            </Card>
          </Box>
        </Box>
      </Box>
    </>
  );
});

export default FcfsMarketCard;
