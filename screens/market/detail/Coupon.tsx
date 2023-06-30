import { Box, Button, Grid, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { ReactComponent as IconCoupon } from 'src/assets/icons/ico-coupon-goods-detail.svg';
import { Card } from '../components/Card';
import { ReactComponent as IconPlay } from 'src/assets/icons/ico-play-small.svg';
import { ReactComponent as IconShare } from 'src/assets/icons/ico-share-small.svg';
import { ReactComponent as IcoView } from 'src/assets/icons/ico-goods-view.svg';
import { IGameRecommendModel } from 'src/models/market-store/GameRecommend';
import { pxToRem } from 'src/theme/typography';
import { useNavigate } from 'react-router';
import Image from 'src/components/image';
import uuidv4 from 'src/utils/uuidv4';

export interface ICouponProps {
  data: IGameRecommendModel[];
}

export const Coupon = observer(({ data }: ICouponProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  // console.log('Coupon', JSON.stringify(data, null, 2));
  const onClickMore = () => {
    navigate('/contents/mbti');
  };

  const onClickGame = (item: IGameRecommendModel) => {
    if (item.contsTypeCd.code === 400003) {
      navigate(`/contents/mbti/${item.contsSid}`);
    } else if (item.contsTypeCd.code === 400004) {
      navigate(`/contents/game/${item.contsSid}`);
    }
  };

  return (
    <Card>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconCoupon />
          <Typography
            variant="Kor_20_b"
            sx={{
              textAlign: 'left',
            }}
          >
            쿠폰을 받을 수 있는 게임
          </Typography>
        </Box>

        <Button
          onClick={onClickMore}
          variant="text"
          sx={{
            p: 0,
            color: '#a0a0a0',
            fontWeight: 400,
            fontSize: pxToRem(13),
            lineHeight: pxToRem(26),
            justifyContent: 'flex-end !important',
          }}
        >
          더보기
        </Button>
      </Box>

      <Grid container columns={12} spacing={1}>
        {/* -----------------------------------------------------------------------------  */}

        {data.map((item, index) => (
          <Grid
            item
            xs={6}
            sm={6}
            md={6}
            lg={6}
            xl={6}
            key={`game-${item.contsSid}.${uuidv4()}`}
            onClick={() => onClickGame(item)}
          >
            <Box
              sx={{
                width: '100%',
                // border: 'solid 1px #eeeeee',
                borderRadius: pxToRem(10),
                overflow: 'hidden',
                lineHeight: 0,
              }}
            >
              <Image
                ratio={'1/1'}
                src={`${process.env.REACT_APP_IMAGE_STORAGE}${item.thumbnlPath}`}
                alt=""
                onError={() => '/assets/placeholder.svg'}
                width="100%"
                height="100%"
                sx={{ lineHeight: 0 }}
              />
            </Box>

            <Box
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}
            >
              <Typography sx={gridStyles.coupon_title}>{item.contsNm}</Typography>
              <Box sx={{ display: 'flex', gap: 1.25 }}>
                <Box
                  sx={{
                    display: 'flex',
                    color: '#555555',
                    fontSize: pxToRem(11),
                    fontWeight: 400,
                    lineHeight: pxToRem(13.13),
                    gap: '3px',
                  }}
                >
                  <IcoView style={{ marginRight: '4px' }} />
                  {item.prtcptnCnt}
                </Box>

                {/* <Box
                  sx={{
                    display: 'flex',
                    color: '#555555',
                    fontSize: pxToRem(11),
                    fontWeight: 400,
                    lineHeight: pxToRem(13.13),
                    gap: '3px',
                  }}
                >
                  <IconShare />
                  {item.shareCnt}
                </Box> */}
              </Box>
            </Box>
          </Grid>
        ))}

        {/* -----------------------------------------------------------------------------  */}
      </Grid>
    </Card>
  );
});

const gridStyles = {
  coupon_container: { display: 'flex', flexDirection: 'column' },
  coupon_title: {
    pt: 1,
    fontSize: pxToRem(15),
    lineHeight: pxToRem(18),
    fontWeight: 600,
    letterSpacing: '-5%',
    color: '#000000',
    textAlign: 'left',
  },
  coupon_describe: {
    pt: 0.5,
    fontSize: pxToRem(14),
    lineHeight: pxToRem(22),
    fontWeight: 400,
    color: '#000000',
    textAlign: 'left',
  },
  coupon_selPrice: {
    pt: 1,
    fontSize: pxToRem(14),
    lineHeight: pxToRem(22),
    fontWeight: 600,
    color: '#000000',
    textAlign: 'left',
  },
  coupon_oriPrice: {
    fontSize: pxToRem(12),
    lineHeight: '14.32px',
    fontWeight: 600,
    color: '#C6C7CA',
    textAlign: 'left',
    textDecoration: 'line-through',
  },
  coupon_cartAndImage: {
    position: 'relative',
    border: 'solid 1px #eee',
    borderRadius: 1,
    width: '160px',
    height: '160px',
    overflow: 'hidden',
  },
  coupon_cartButton: { position: 'absolute', bottom: '5px', right: '10px' },
  coupon_productImage: { width: '160px', height: '160px', padding: 0, margin: 0 },
};
