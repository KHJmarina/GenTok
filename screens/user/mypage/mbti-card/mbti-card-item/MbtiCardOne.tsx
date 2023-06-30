import { Box, Stack, Typography } from '@mui/material';
import { observer } from "mobx-react-lite";
import { useStores } from "src/models/root-store/root-store-context"
import { useNavigate } from 'react-router';
import { pxToRem } from 'src/theme/typography';
import { IMbtiResult } from 'src/models/mbti-result/MbtiResult';
import Image from 'src/components/image/Image';
import { ReactComponent as IconRight } from 'src/assets/icons/ico-right.svg';

/**
 * ## MbtiCardOne 설명
 *
 */

interface Props {
  mbtiCard: IMbtiResult
}

export const MbtiCardOne = observer(({ mbtiCard }: Props) => {

  const rootStore = useStores();
  const navigate = useNavigate();
  const { REACT_APP_IMAGE_STORAGE } = process.env;

  return (
    <Stack 
      sx={{
        textAlign: 'center',
        backgroundColor: `${mbtiCard.resultCardAttr}` ? JSON.parse(`${mbtiCard.resultCardAttr}`).bgCol : '#FFF3F1',
        color: `${mbtiCard.resultCardAttr}` ? JSON.parse(`${mbtiCard.resultCardAttr}`).txtCol : '#000000',
        borderRadius: `${pxToRem(20)}`,
        mb: `${pxToRem(20)} !important`,
      }}
      minWidth={pxToRem(240)}
      onClick={() => navigate(`/contents/mbti/${mbtiCard.mbtiSid}/result/type/${mbtiCard.mbtiTestResultTypeId}`, {replace: true,})}
    >
      <Stack sx={{ px: pxToRem(20), pt: pxToRem(48), pb: pxToRem(46), position: 'relative' }}>
        <Box sx={{ pb: pxToRem(30) }}>
          <Typography variant={'Kor_14_r'}>{mbtiCard.resultTypeSubNm}</Typography><br />
          <Typography variant={'Kor_20_b'}>{mbtiCard.resultTypeNm}</Typography>
        </Box>
        <Image 
          src={ mbtiCard.thumbnlPath ? (REACT_APP_IMAGE_STORAGE + mbtiCard.thumbnlPath) : 'assets/default-goods.svg'} 
          ratio={'1/1'}
          width={pxToRem(200)}
          height={pxToRem(200)}
        />
        <IconRight 
          style={{
            position: 'absolute',
            width: pxToRem(32),
            height: pxToRem(32),
            right: pxToRem(10),
            bottom: pxToRem(10),
          }}/>
      </Stack>
    </Stack>
  )
});

export default MbtiCardOne;