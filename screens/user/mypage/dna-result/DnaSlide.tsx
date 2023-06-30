import { Box, Stack, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import { useNavigate } from 'react-router';
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Image from 'src/components/image/Image';
import { PATH_ROOT } from 'src/routes/paths';
import Slider from 'react-slick';
import { styled } from '@mui/material/styles';
import { IDnaCategory, IDnaResult } from 'src/models/dna-result/DnaResult';
import { convertCtegryToValue } from 'src/screens/user/mypage/Mypage';
import { pxToRem } from 'src/theme/typography';

/**
 * ## DnaSlide 설명
 *
 */

interface Props {
  currentCtegry: IDnaCategory;
  ctegryList: IDnaCategory[];
  myResult: IDnaResult;
  handleSlideChange: any;
  handlePageChange: any;
}

export const DnaSlide = observer(({ currentCtegry, ctegryList, myResult, handleSlideChange, handlePageChange }: Props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const sliderRef = useRef<any>();

  return (
    <Stack>

      <Stack sx={{ m: 3 }}>
        {currentCtegry.ctegrySid === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography
              sx={{
                fontSize: pxToRem(30),
                fontWeight: 300,
                textAlign: 'left',
                lineHeight: pxToRem(40),
              }}
            >
              모으는 맛이
              <br />
              쏠쏠해요
            </Typography>
            <Stack
              sx={{ mt: 'auto', cursor: 'pointer' }}
              onClick={handlePageChange}
            >
              <Typography
                sx={{
                  fontSize: pxToRem(32),
                  fontWeight: 600,
                  lineHeight: pxToRem(22),
                  mb: pxToRem(16),
                }}
              >
                {myResult.cnt}
                <span
                  style={{
                    color: '#DFE0E2',
                    fontSize: pxToRem(32),
                    fontWeight: 100,
                    lineHeight: pxToRem(22),
                  }}
                >
                  /
                </span>
                <span
                  style={{
                    color: '#DFE0E2',
                    fontSize: pxToRem(32),
                    fontWeight: 600,
                    lineHeight: pxToRem(22),
                  }}
                >
                  {myResult.totalCnt}
                </span>
              </Typography>
              <Typography sx={{ fontSize: pxToRem(14), lineHeight: pxToRem(16.71) }}>
                모은 카드
              </Typography>
            </Stack>
          </Box>
        ) : (
          <Box>
            <Typography
              sx={{
                fontSize: pxToRem(30),
                fontWeight: 300,
                lineHeight: pxToRem(40),
                mb: pxToRem(8),
              }}
            >
              {currentCtegry.ctegryNm}
            </Typography>
            <Typography sx={{ fontSize: pxToRem(26), fontWeight: 600, lineHeight: pxToRem(22) }}>
              {myResult?.cnt}
              <span
                style={{
                  color: '#DFE0E2',
                  fontSize: pxToRem(26),
                  fontWeight: 100,
                  lineHeight: pxToRem(22),
                }}
              >
                /
              </span>
              <span
                style={{
                  color: '#DFE0E2',
                  fontSize: pxToRem(26),
                  fontWeight: 600,
                  lineHeight: pxToRem(22),
                }}
              >
                {myResult?.totalCnt}
              </span>
            </Typography>
          </Box>
        )}
      </Stack>

      <SliderStyle>
        <Slider
          dots={true}
          arrows={false}
          ref={sliderRef}
          initialSlide={currentCtegry.ordr ? Number(currentCtegry.ordr) : 0}
          speed={100}
          beforeChange={(current, next) => { handleSlideChange(next) }}
        >
          {ctegryList.map((ctegry: IDnaCategory, index: number) => (
            <Box
              sx={[
                {
                  background:
                    theme.palette.dna[convertCtegryToValue(Number(`${ctegry.ctegrySid!}`))].primary,
                  transform: 'rotate(13deg)',
                },
                cardItem,
              ]}
              key={index}
            >
              <Box
                sx={[
                  {
                    background:
                      theme.palette.dna[convertCtegryToValue(Number(`${ctegry.ctegrySid}`))]
                        .secondary,
                    transform: 'rotate(-25deg)',
                  },
                  cardItem,
                ]}
              >
                <Box
                  sx={[
                    {
                      background:
                        theme.palette.dna[convertCtegryToValue(Number(`${ctegry.ctegrySid}`))]
                          .pastel,
                      transform: 'rotate(13deg)',
                    },
                    cardItem,
                  ]}
                >
                  {myResult?.cnt === 0 ? (
                    <Box
                      sx={{ width: '100%', height: '100%', cursor: 'pointer' }}
                      onClick={() => {
                        navigate(`${PATH_ROOT.market.root}/category/${ctegry.ctegrySid}`);
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          width: pxToRem(2),
                          height: pxToRem(60),
                          left: pxToRem(110),
                          top: pxToRem(75),
                          background: '#FFFFFF',
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            width: pxToRem(2),
                            height: pxToRem(60),
                            background: '#FFFFFF',
                            transform: 'rotate(90deg)',
                          }}
                        />
                      </Box>
                    </Box>
                  ) : (
                    <Image
                      src={
                        myResult.resultList[0].testResultImgPath
                          ? REACT_APP_IMAGE_STORAGE +
                            myResult.resultList[0].testResultImgPath
                          : '/assets/default-goods.svg'
                      }
                      sx={{ cursor: 'pointer' }}
                      onClick={handlePageChange}
                      onError={(e: any) => {
                        e.target.src = '/assets/default-goods.svg';
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </Slider>
      </SliderStyle>

      {myResult.cnt === 0 && <EmptyDnaResult />}
    </Stack>
  );
});

export default DnaSlide;

const EmptyDnaResult = () => {
  const navigate = useNavigate();

  return (
    <Stack
      sx={{ mt: 'auto', pt: pxToRem(54), cursor:'pointer' }}
      onClick={() => {
        navigate(`${PATH_ROOT.market.root}`);
      }}
    >
      <Box
        sx={{
          ml: pxToRem(32),
          mr: pxToRem(28),
          px: pxToRem(24),
          height: pxToRem(50),
          display: 'flex',
          borderRadius: pxToRem(10),
          backgroundColor: '#FAFAFA',
          alignItems: 'center',
        }}
        justifyContent="space-between"
      >
        <Typography variant={'Kor_16_r'}> 유전자 마켓 둘러보기 </Typography>
        <ArrowRightIcon sx={{ color: '#DFE0E2' }} />
      </Box>
    </Stack>
  );
};

const SliderStyle = styled('div')({
  '.slick-slide': {
    padding: '50px 80px 50px 80px',
    display: 'flex !important',
    justifyContent: 'center !important',
  },
  '.slick-dots li': {
    margin: 0,
    marginRight: pxToRem(4),
  },
  '.slick-dots li button:before': {
    opacity: 100,
    color: '#EEEEEE',
  },
  '.slick-dots li.slick-active button:before': {
    opacity: 100,
    color: '#FF7F3F',
  },
  '.slick-dots li, .slick-dots li button, .slick-dots li button:before': {
    width: pxToRem(8),
    height: pxToRem(8),
  },
});

const cardItem = {
  width: pxToRem(228),
  height: pxToRem(228),
  borderRadius: pxToRem(20),
  border: `${pxToRem(3)} solid #FFFFFF`,
  boxShadow: `${pxToRem(3)} ${pxToRem(3)} ${pxToRem(10)} rgba(0, 0, 0, 0.15)`,
};
