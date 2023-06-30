import { Box, Stack, Typography } from '@mui/material';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "src/models/root-store/root-store-context"
import { useNavigate } from 'react-router';
import { PATH_ROOT } from 'src/routes/paths';
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CHeader from 'src/components/CHeader';
import { pxToRem } from 'src/theme/typography';
import { CallApiToStore } from 'src/utils/common';
import { ReactComponent as IconMachine } from 'src/assets/icons/ico-machine.svg';
import { MbtiCardOne } from 'src/screens/user/mypage/mbti-card/mbti-card-item/MbtiCardOne';
import { MbtiCardMany } from 'src/screens/user/mypage/mbti-card/mbti-card-item/MbtiCardMany';

/**
 * ## MbtiCard 설명
 *
 */
export const MbtiCard = observer(() => {

  const rootStore = useStores();
  const { loadingStore, mbtiCardStore } = rootStore;
  const navigate = useNavigate();
  const [isRender, setIsRender] = useState(false);

  const getMine = async () => {
    CallApiToStore(mbtiCardStore.get(), 'api', loadingStore)
      .then(() => {
        setIsRender(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect (() => {
    getMine();
  },[])

  const options: any = {
    showMainIcon: 'back',
    showHomeIcon: true
  };

  return (
    <Stack>
      <CHeader 
        title="MBTI 카드"
        {...options}
      />

      {isRender && (
        <>
          <Stack>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', ml: pxToRem(28), mr: pxToRem(32), my: pxToRem(40) }}>
              <Typography sx={{ fontSize: pxToRem(30), fontWeight: 300, textAlign: 'left', whiteSpace: 'pre-wrap', lineHeight: pxToRem(40) }}>
                { mbtiCardStore.mbtiCard.cnt === 0 ? '테스트하고\n반값쿠폰 응모하자' : '나만의\nMBTI 카드' }
              </Typography>
              <Stack sx={{ mt: 'auto' }}>
                <Typography sx={{ fontSize: pxToRem(32), fontWeight: 600, lineHeight: pxToRem(22), mb: pxToRem(16) }}>{mbtiCardStore.mbtiCard.cnt}
                  {/* <span style={{ color: '#DFE0E2', fontSize: pxToRem(32), fontWeight: 100, lineHeight: pxToRem(22) }}>/</span> */}
                  <span style={{ color:'#DFE0E2', fontSize: pxToRem(32), fontWeight: '300', fontFamily:'-apple-system,sans-serif', textAlign: 'right'}}>/</span>
                  <span style={{ color: '#DFE0E2', fontSize: pxToRem(32), fontWeight: 600, lineHeight: pxToRem(22) }}>{mbtiCardStore.mbtiCard.totalCnt}</span>
                </Typography>
                <Typography sx={{ fontSize: pxToRem(14), lineHeight: pxToRem(16.71) }}>모은 카드</Typography>
              </Stack>
            </Box>
            
            { mbtiCardStore.mbtiCard.cnt <= 1
              ? (
                <Stack alignItems='center' sx={{ mb: pxToRem(62) }}>
                  { mbtiCardStore.mbtiCard.cnt === 0
                    ? <IconMachine />
                  : <MbtiCardOne mbtiCard={mbtiCardStore.mbtiCard.mbtiResultList[0]}/>
                  }
                </Stack>
              )
              : <MbtiCardMany mbtiCards={mbtiCardStore.mbtiCard.mbtiResultList}/>
            }
          </Stack>
          
          <Stack sx={{ mt: 'auto', cursor:'pointer' }} onClick={() => { navigate(PATH_ROOT.contents.mbti)}}>
            <Box 
              sx={{
                ml: pxToRem(28), 
                mr: pxToRem(32), 
                p: `${pxToRem(12)} ${pxToRem(12)} ${pxToRem(12)} ${pxToRem(20)}`,
                height: 50,
                display: 'flex',
                borderRadius: pxToRem(10),
                backgroundColor: '#FAFAFA',
                alignItems: 'center',
              }}
              justifyContent='space-between'
            >
              <Typography variant={'Kor_16_r'}> MBTI 테스트 하러 가기 </Typography>
              <ArrowRightIcon sx={{ color: '#DFE0E2' }} />
            </Box>
          </Stack>
        </>
      )}
    </Stack>
  );
});

export default MbtiCard;