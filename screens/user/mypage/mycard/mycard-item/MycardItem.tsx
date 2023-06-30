import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { PATH_AUTH, PATH_PAGE, PATH_ROOT } from '../../../../../routes/paths';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { Stack, Typography, Button, Card } from '@mui/material';
import Image from 'src/components/image/Image';

import { ReactComponent as MycardStar } from 'src/assets/images/mycard_star.svg';
import { pxToRem } from 'src/theme/typography';
import { convertCtegryToValue } from '../../Mypage';

/**
 * ## MycardItem 설명
 *
 */
interface MycardProps {
  data: any;
}

export const MycardItem = observer(({ data }: MycardProps) => {
  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const { REACT_APP_IMAGE_STORAGE } = process.env;

  // 이미지 url get
  const getImagePath = (thumbnlPath: string) => {
    if (thumbnlPath) {
      if (thumbnlPath.substr(0, 4) === 'http') {
        return thumbnlPath;
      } else {
        return REACT_APP_IMAGE_STORAGE + thumbnlPath;
      }
    } else {
      return '/assets/default-goods.svg';
    }
  };

  useEffect(() => {
    // console.log("data : " , data.length);
  });

  return (
    <>
      {data.map((item: any, index: number) => (
        <Stack
          key={`mycard-${index}`}
          sx={{
            minWidth: pxToRem(184),
            textAlign: 'center',
            mb: `${pxToRem(8)} !important`,
            backgroundColor:
              theme.palette.dna[convertCtegryToValue(item.ctegryList[0]?.ctegrySid)].pastel,
            // px: pxToRem(40),
            // py: pxToRem(30),
            px: pxToRem(20),
            py:pxToRem(27.5),
            borderRadius: pxToRem(16),
            alignItems: 'center',
            ml: index == 0 ? 2.5 : 0,
            mr: index == data.length - 1 ? 2.5 : 0,
          }}
          onClick={() => {
            item.singleGoodsSid
              ? navigate(`${PATH_ROOT.user.mypage.dnaCard}/${item.singleGoodsSid}`)
              : navigate(`${PATH_ROOT.user.mypage.dnaCard}/${item.goodsSid}`);
          }}
        >
          <Typography
            variant={'subtitle2'}
            color={theme.palette.dna[convertCtegryToValue(item.ctegryList[0]?.ctegrySid)].primary}
            sx={{
              mt: 0,
              whiteSpace: 'nowrap', 
              textOverflow: 'ellipsis',
              maxWidth:'100%',
              overflow: 'hidden'
            }}
          >
            {item.goodsNm}
          </Typography>
          <Box>
            <Image
              src={getImagePath(item.testResultImgPath)}
              ratio={'1/1'}
              width={pxToRem(120)}
              height={pxToRem(120)}
              py={pxToRem(4)}
              sx={{
                width: pxToRem(100),
                height: pxToRem(100),
              }}
              onError={(e: any) => {
                e.target.src = '/assets/default-goods.svg';
              }}
              draggable={false}
            />
          </Box>

          <Stack direction={'row'} spacing={0.5} justifyContent={'center'}>
            {
              //TODO 별 갯수 정의되면 api에서 받아서 표시
              [...Array(3)].map((_, i) => (
                <MycardStar key={`mycard-star-${i}`} />
              ))
            }
          </Stack>
          <Typography
            variant={'subtitle1'}
            sx={{
              mt: 0,
              pt: 0.5,
              color: '#202123',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              maxWidth:'100%',
              overflow: 'hidden'
            }}
          >
            {item.testResultNm}
          </Typography>
        </Stack>
      ))}
    </>
  );
});

export default MycardItem;
