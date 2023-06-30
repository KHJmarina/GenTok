import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import { Grid, Stack, Typography, useTheme } from '@mui/material';
import { ReactComponent as IcoRecommend } from 'src/assets/icons/ico-recommend.svg';
import GoodsItem from 'src/screens/home/goods-item/GoodsItem';
import { grey } from '@mui/material/colors';
import { CallApiToStore } from 'src/utils/common';
import { useNavigate } from 'react-router';
import { toJS } from 'mobx';
import { IRecommendSnapshot } from 'src/models';
import ContentItem from 'src/screens/home/content-item/ContentItem';
import { pxToRem } from 'src/theme/typography';
import { PATH_ROOT } from 'src/routes/paths';

/**
 * ## Recommend 설명
 *
 */
interface Props {
  type?: string
}
export const Recommend = observer(({
  type = 'mbti'
}: Props) => {
  const rootStore = useStores();
  const { loadingStore, mbtiStore, gameStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();

  /// 게임 추천 목록 조회 (이건 어때요?)
  const getsRecommend = () => {
    CallApiToStore(gameStore.getsRecommend({
      mbtiSid: type === 'mbti' ? mbtiStore.mbti.mbtiSid : '',
      gameSid: type === 'game' ? gameStore.game.gameSid : '',
    }), 'api', loadingStore);
  };

  useEffect(() => {
    getsRecommend();
  }, []);

  const moreHandle = () => {
    if (type === 'mbti') {
      navigate(PATH_ROOT.contents.mbti)
    } else if (type === 'game') {
      navigate(PATH_ROOT.contents.game)
    }
  }
  return (<></>);
  return (
    <>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        sx={{ mt: '40px', mb: '20px', px: '20px' }}
      >
        <Typography variant={'Kor_22_b'} sx={{ display: 'flex', alignItems: 'center' }}>
          <IcoRecommend style={{ marginRight: '10px' }} />
          이런건 어때요?
        </Typography>
        <Box onClick={moreHandle} sx={{ pb: '5px', cursor: 'pointer' }}>
          <Typography sx={{ fontSize: pxToRem(13), fontWeight: 400, color: '#AAAAAA', cursor: 'pointer' }}>
            더보기
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1} justifyContent={'space-between'} sx={{ px: '20px' }}>
          {gameStore.recoGame?.map((recoGame: any, i: number) => (
            <Grid key={`game-${i}`} item xs={6} sm={6} md={6} sx={{ mb: '16px' }}>
              <ContentItem data={recoGame} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
});

export default Recommend;
