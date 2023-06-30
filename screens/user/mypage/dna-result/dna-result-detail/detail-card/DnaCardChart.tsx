import Box from '@mui/material/Box';
import { useTheme, Typography, Divider, Slider } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../../models/root-store/root-store-context';
import { pxToRem } from 'src/theme/typography';
import { ReactComponent as IconDnaChartStar } from 'src/assets/icons/ico-dna-chart-star.svg';
import { ReactComponent as IconDnaChartStarActive } from 'src/assets/icons/ico-dna-chart-star-active.svg';
import LinearProgress from '@mui/material/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import { convertCtegryToValue } from 'src/screens/user/mypage/Mypage';
import { any } from 'prop-types';
/**
 * ## DnaCardChart 설명
 *
 */

export const DnaCardChart = observer(() => {
  const rootStore = useStores();
  const { dnaCardDetailStore, loadingStore } = rootStore;
  const theme = useTheme();
  // const REACT_APP_IMAGE_STORAGE = process.env;
  const props = {
    myLevel: dnaCardDetailStore.dnaCardDetail?.level?.myLevel,
    levelPosition: dnaCardDetailStore.dnaCardDetail?.level?.myLevelPosition,
    ctegrySid: dnaCardDetailStore.dnaCardDetail?.ctegryList[0]?.ctegrySid!,
    levelRateLeft1: dnaCardDetailStore.dnaCardDetail?.level?.levelRate?.[1][0],
    levelRateRight1: dnaCardDetailStore.dnaCardDetail?.level?.levelRate?.[1][1],
    levelRateLeft2: dnaCardDetailStore.dnaCardDetail?.level?.levelRate?.[2][0],
    levelRateRight2: dnaCardDetailStore.dnaCardDetail?.level?.levelRate?.[2][1],
    levelRateLeft3: dnaCardDetailStore.dnaCardDetail?.level?.levelRate?.[3][0],
    levelRateRight3: dnaCardDetailStore.dnaCardDetail?.level?.levelRate?.[3][1],
    theme: theme,
  };
  const classes = useStyles(props);

  useEffect(() => {
    // console.log(props)
  }, []);

  return (
    <>
    {dnaCardDetailStore.dnaCardDetail?.level?.myLevel == 0 ? null : 
      <>
      <Typography
        variant="Kor_22_b"
        component={'p'}
        sx={{
          textAlign: 'left',
          wordBreak: 'keep-all',
          px: '1.25rem',
          my:'1.25rem'
        }}
      >
        <span style={{ fontWeight: 400 }}> 동일한 Lv.{dnaCardDetailStore.dnaCardDetail?.level?.myLevel} 능력치를 가진 사람은 </span> <br />
        <Typography variant="Kor_22_b">
          한국인 100명 중 &nbsp;
          <span style={{ color: theme.palette.primary.main }}>
            {dnaCardDetailStore.dnaCardDetail?.level?.person}명
          </span>
        </Typography>
      </Typography>

      <Box sx={{ mb: pxToRem(20) }}>

        {/* 1번 차트바 */}
        <Box
          sx={{
            mx: pxToRem(20),
            // my: pxToRem(18),
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ width: '45%' }}>
            <LinearProgress
              variant="determinate"
              value={dnaCardDetailStore.dnaCardDetail?.level?.levelRate?.[1][0]}
              className={classes.progressBarLeft1}
            />
            <Typography
              sx={{
                textAlign: 'right',
                mx: pxToRem(8),
                fontSize: pxToRem(10),
                color: dnaCardDetailStore.dnaCardDetail?.level?.myLevel === 1 && dnaCardDetailStore.dnaCardDetail.level.myLevelPosition =='left' ? '#202123' : '#5D6966',
                fontWeight: dnaCardDetailStore.dnaCardDetail?.level?.myLevel === 1 && dnaCardDetailStore.dnaCardDetail.level.myLevelPosition =='left' ? '600' : '400',
                // position:'absolute',
                // right: '55%',
                transform: 'translateY(-1.36rem)',
              }}
            >
              {dnaCardDetailStore.dnaCardDetail?.level?.levelRate?.[1][0]}%
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {dnaCardDetailStore.dnaCardDetail?.level?.myLevel === 1 ? (
              <IconDnaChartStarActive
                style={{
                  marginLeft: pxToRem(8),
                  marginRight: pxToRem(8),
                  width: pxToRem(32),
                  height: pxToRem(32),
                }}
              />
            ) : (
              <IconDnaChartStar
                style={{
                  marginLeft: pxToRem(8),
                  marginRight: pxToRem(8),
                  width: pxToRem(32),
                  height: pxToRem(32),
                }}
              />
            )}
            <Typography
              sx={{
                color:
                  dnaCardDetailStore.dnaCardDetail?.level?.myLevel === 1 ? '#202123' : '#C6C7CA',
                position: 'absolute',
                fontSize: pxToRem(10),
                fontWeight: '700',
              }}
            >
              {1}
            </Typography>
          </Box>

          <Box sx={{ width: '45%' }}>
            <LinearProgress
              variant="determinate"
              value={dnaCardDetailStore.dnaCardDetail?.level?.levelRate?.[1][1]}
              className={classes.progressBarRight1}
            />
            <Typography
              sx={{
                textAlign: 'left',
                ml: pxToRem(8),
                fontSize: pxToRem(10),
                color: dnaCardDetailStore.dnaCardDetail?.level?.myLevel === 1 && dnaCardDetailStore.dnaCardDetail.level.myLevelPosition =='right' ? '#202123' : '#5D6966',
                fontWeight: dnaCardDetailStore.dnaCardDetail?.level?.myLevel === 1 && dnaCardDetailStore.dnaCardDetail.level.myLevelPosition =='right' ? '600' : '400',
                position: 'absolute',
                transform: 'translateY(-1.36rem)',
              }}
            >
              {dnaCardDetailStore.dnaCardDetail?.level?.levelRate?.[1][1]}%
            </Typography>
          </Box>
        </Box>
        {/* ------ 1번 차트바 ------*/}

        {/* ------ 2번 차트바 ------*/}
        <Box
          sx={{
            mx: pxToRem(20),
            // my: pxToRem(18),
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ width: '45%' }}>
            <LinearProgress
              variant="determinate"
              value={dnaCardDetailStore.dnaCardDetail?.level?.levelRate?.[2][0]}
              className={classes.progressBarLeft2}
              // sx={{
              //   '&.MuiLinearProgress-root .MuiLinearProgress-bar': {
              //     backgroundColor: `${getChipColor(dnaCardDetailStore.dnaCardDetail?.ctegryList[0]?.ctegrySid!)}`,
              //   }
              // }}
            />
            <Typography
              sx={{
                textAlign: 'right',
                mx: pxToRem(8),
                fontSize: pxToRem(10),
                color:
                  dnaCardDetailStore.dnaCardDetail?.level?.myLevel === 2 && dnaCardDetailStore.dnaCardDetail.level.myLevelPosition =='left' ? '#202123' : '#5D6966',
                fontWeight: 
                dnaCardDetailStore.dnaCardDetail?.level?.myLevel === 2 && dnaCardDetailStore.dnaCardDetail.level.myLevelPosition =='left' ? '600' : '400',
                // position:'absolute',
                transform: 'translateY(-1.36rem)',
                // right: '55%',
              }}
            >
              {dnaCardDetailStore.dnaCardDetail?.level?.levelRate?.[2][0]}%
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {dnaCardDetailStore.dnaCardDetail?.level?.myLevel === 2 ? (
              <IconDnaChartStarActive
                style={{
                  marginLeft: pxToRem(8),
                  marginRight: pxToRem(8),
                  width: pxToRem(32),
                  height: pxToRem(32),
                }}
              />
            ) : (
              <IconDnaChartStar
                style={{
                  marginLeft: pxToRem(8),
                  marginRight: pxToRem(8),
                  width: pxToRem(32),
                  height: pxToRem(32),
                }}
              />
            )}
            <Typography
              sx={{
                color:
                  dnaCardDetailStore.dnaCardDetail?.level?.myLevel === 2 ? '#202123' : '#C6C7CA',
                position: 'absolute',
                fontSize: pxToRem(10),
                fontWeight: '700',
              }}
            >
              {2}
            </Typography>
          </Box>

          <Box sx={{ width: '45%' }}>
            <LinearProgress
              variant="determinate"
              value={dnaCardDetailStore.dnaCardDetail?.level?.levelRate?.[2][1]}
              className={classes.progressBarRight2}
            />
            <Typography
              sx={{
                textAlign: 'left',
                ml: pxToRem(8),
                fontSize: pxToRem(10),
                color:
                  dnaCardDetailStore.dnaCardDetail?.level?.myLevel === 2 && dnaCardDetailStore.dnaCardDetail.level.myLevelPosition =='right' ? '#202123' : '#5D6966',
                fontWeight: 
                  dnaCardDetailStore.dnaCardDetail?.level?.myLevel === 2 && dnaCardDetailStore.dnaCardDetail.level.myLevelPosition =='right' ? '600' : '400',
                position: 'absolute',
                transform: 'translateY(-1.36rem)',
              }}
            >
              {dnaCardDetailStore.dnaCardDetail?.level?.levelRate?.[2][1]}%
            </Typography>
          </Box>
        </Box>
        {/* ------ 2번 차트바 ------*/}

        {/* ------ 3번 차트바 ------*/}
        <Box
          sx={{
            mx: pxToRem(20),
            // my: pxToRem(18),
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ width: '45%' }}>
            <LinearProgress
              variant="determinate"
              value={dnaCardDetailStore.dnaCardDetail?.level?.levelRate?.[3][0]}
              className={classes.progressBarLeft3}
            />
            <Typography
              sx={{
                textAlign: 'right',
                mx: pxToRem(8),
                fontSize: pxToRem(10),
                color:
                  dnaCardDetailStore.dnaCardDetail?.level?.myLevel === 3 && dnaCardDetailStore.dnaCardDetail.level.myLevelPosition =='left' ? '#202123' : '#5D6966',
                fontWeight: 
                dnaCardDetailStore.dnaCardDetail?.level?.myLevel === 3 && dnaCardDetailStore.dnaCardDetail.level.myLevelPosition =='left' ? '600' : '400',
                // position: 'absolute',
                transform: 'translateY(-1.36rem)',
                // right: '55%',
              }}
            >
              {dnaCardDetailStore.dnaCardDetail?.level?.levelRate?.[3][0]}%
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {dnaCardDetailStore.dnaCardDetail?.level?.myLevel === 3 ? (
              <IconDnaChartStarActive
                style={{
                  marginLeft: pxToRem(8),
                  marginRight: pxToRem(8),
                  width: pxToRem(32),
                  height: pxToRem(32),
                }}
              />
            ) : (
              <IconDnaChartStar
                style={{
                  marginLeft: pxToRem(8),
                  marginRight: pxToRem(8),
                  width: pxToRem(32),
                  height: pxToRem(32),
                }}
              />
            )}
            <Typography
              sx={{
                color:
                  dnaCardDetailStore.dnaCardDetail?.level?.myLevel === 3 ? '#202123' : '#C6C7CA',
                position: 'absolute',
                fontSize: pxToRem(10),
                fontWeight: '700',
              }}
            >
              3
            </Typography>
          </Box>
          <Box sx={{ width: '45%' }}>
            <LinearProgress
              variant="determinate"
              value={dnaCardDetailStore.dnaCardDetail?.level?.levelRate?.[3][1]}
              className={classes.progressBarRight3}
            />
            <Typography
              sx={{
                textAlign: 'left',
                ml: pxToRem(8),
                fontSize: pxToRem(10),
                color:
                  dnaCardDetailStore.dnaCardDetail?.level?.myLevel === 3 && dnaCardDetailStore.dnaCardDetail.level.myLevelPosition =='right' ? '#202123' : '#5D6966',
                fontWeight: 
                  dnaCardDetailStore.dnaCardDetail?.level?.myLevel === 3 && dnaCardDetailStore.dnaCardDetail.level.myLevelPosition =='right' ? '600' : '400',
                position: 'absolute',
                transform: 'translateY(-1.36rem)',
              }}
            >
              {dnaCardDetailStore.dnaCardDetail?.level?.levelRate?.[3][1]}%
            </Typography>
          </Box>
        </Box>
        {/* ------ 3번 차트바 ------*/}
      </Box>
      {/* 끝 */}
      </>}
      <Divider sx={{ borderWidth: 6 }}></Divider>
    </>
  );
});

export default DnaCardChart;

const useStyles = makeStyles(() => ({
  progressBarLeft1: (props: any) => ({
    '&.MuiLinearProgress-root': {
      position: 'relative',
      overflow: 'hidden',
      height: pxToRem(32),
      backgroundColor: '#FAFAFA',
      borderTopLeftRadius: pxToRem(999),
      borderTopRightRadius: pxToRem(0),
      borderBottomRightRadius: pxToRem(0),
      borderBottomLeftRadius: pxToRem(999),
    },
    '&.MuiLinearProgress-root .MuiLinearProgress-bar': {
      borderTopLeftRadius: pxToRem(999),
      borderTopRightRadius: pxToRem(0),
      borderBottomRightRadius: pxToRem(0),
      borderBottomLeftRadius: pxToRem(999),
      backgroundColor: props?.myLevel === 1 && props.levelPosition =='left' ? `${props?.theme.palette.dna[convertCtegryToValue(Number(props?.ctegrySid))].pastel}` : '#EEEEEE',
      transform: `translateX(${100 - props?.levelRateLeft1}%) !important`,
    },
  }),

  progressBarRight1:(props:any)  => ({
    '&.MuiLinearProgress-root': {
      position: 'relative',
      overflow: 'hidden',
      height: pxToRem(32),
      backgroundColor: '#FAFAFA',
      borderTopLeftRadius: pxToRem(0),
      borderTopRightRadius: pxToRem(999),
      borderBottomRightRadius: pxToRem(999),
      borderBottomLeftRadius: pxToRem(0),
    },
    '&.MuiLinearProgress-root .MuiLinearProgress-bar': {
      borderTopLeftRadius: pxToRem(0),
      borderTopRightRadius: pxToRem(999),
      borderBottomRightRadius: pxToRem(999),
      borderBottomLeftRadius: pxToRem(0),
      backgroundColor: props?.myLevel === 1 && props.levelPosition =='right' ? `${props?.theme.palette.dna[convertCtegryToValue(Number(props?.ctegrySid))].pastel}` : '#EEEEEE',
    },
  }),

  progressBarLeft2: (props: any) => ({
    '&.MuiLinearProgress-root': {
      position: 'relative',
      overflow: 'hidden',
      height: pxToRem(32),
      backgroundColor: '#FAFAFA',
      borderTopLeftRadius: pxToRem(999),
      borderTopRightRadius: pxToRem(0),
      borderBottomRightRadius: pxToRem(0),
      borderBottomLeftRadius: pxToRem(999),
    },
    '&.MuiLinearProgress-root .MuiLinearProgress-bar': {
      borderTopLeftRadius: pxToRem(999),
      borderTopRightRadius: pxToRem(0),
      borderBottomRightRadius: pxToRem(0),
      borderBottomLeftRadius: pxToRem(999),
      backgroundColor: props?.myLevel === 2 && props.levelPosition =='left'? `${props?.theme.palette.dna[convertCtegryToValue(Number(props?.ctegrySid))].pastel}` : '#EEEEEE',
      transform: `translateX(${100 - props?.levelRateLeft2}%) !important`,
    },
  }),
  progressBarRight2:(props:any) => ({
    '&.MuiLinearProgress-root': {
      position: 'relative',
      overflow: 'hidden',
      height: pxToRem(32),
      backgroundColor: '#FAFAFA',
      borderTopLeftRadius: pxToRem(0),
      borderTopRightRadius: pxToRem(999),
      borderBottomRightRadius: pxToRem(999),
      borderBottomLeftRadius: pxToRem(0),
    },
    '&.MuiLinearProgress-root .MuiLinearProgress-bar': {
      borderTopLeftRadius: pxToRem(0),
      borderTopRightRadius: pxToRem(999),
      borderBottomRightRadius: pxToRem(999),
      borderBottomLeftRadius: pxToRem(0),
      backgroundColor: props?.myLevel === 2 && props.levelPosition =='right'? `${props?.theme.palette.dna[convertCtegryToValue(Number(props?.ctegrySid))].pastel}` : '#EEEEEE',
    },
  }),

  progressBarLeft3: (props: any) => ({
    '&.MuiLinearProgress-root': {
      position: 'relative',
      overflow: 'hidden',
      height: pxToRem(32),
      backgroundColor: '#FAFAFA',
      borderTopLeftRadius: pxToRem(999),
      borderTopRightRadius: pxToRem(0),
      borderBottomRightRadius: pxToRem(0),
      borderBottomLeftRadius: pxToRem(999),
    },
    '&.MuiLinearProgress-root .MuiLinearProgress-bar': {
      borderTopLeftRadius: pxToRem(999),
      borderTopRightRadius: pxToRem(0),
      borderBottomRightRadius: pxToRem(0),
      borderBottomLeftRadius: pxToRem(999),
      backgroundColor: props?.myLevel === 3 && props.levelPosition =='left'? `${props?.theme.palette.dna[convertCtegryToValue(Number(props?.ctegrySid))].pastel}` : '#EEEEEE',
      transform: `translateX(${100 - props?.levelRateLeft3}%) !important`,
    },
  }),
  progressBarRight3:(props: any) => ({
    '&.MuiLinearProgress-root': {
      position: 'relative',
      overflow: 'hidden',
      height: pxToRem(32),
      backgroundColor: '#FAFAFA',
      borderTopLeftRadius: pxToRem(0),
      borderTopRightRadius: pxToRem(999),
      borderBottomRightRadius: pxToRem(999),
      borderBottomLeftRadius: pxToRem(0),
    },
    '&.MuiLinearProgress-root .MuiLinearProgress-bar': {
      borderTopLeftRadius: pxToRem(0),
      borderTopRightRadius: pxToRem(999),
      borderBottomRightRadius: pxToRem(999),
      borderBottomLeftRadius: pxToRem(0),
      backgroundColor: props?.myLevel === 3 && props.levelPosition =='right'? `${props?.theme.palette.dna[convertCtegryToValue(Number(props?.ctegrySid))].pastel}` : '#EEEEEE',
    },
  }),
}));
