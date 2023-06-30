import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useStores } from "../../../../../models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import { Stack, Typography, Button, Card } from '@mui/material';
import Image from 'src/components/image/Image';
import { convertCtegryToValue } from '../../Mypage';
import { PATH_AUTH, PATH_PAGE, PATH_ROOT } from '../../../../../routes/paths';
import { pxToRem } from 'src/theme/typography';

/**
 * ## MycandyItem 설명
 *
 */
interface MycandyProps {
  data?: any;
}

export const MycandyItem = observer(({ data }: MycandyProps) => {

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

  return (
    <>
      {
        data && data.length > 0 &&
        data.map((item: any, index: number)=>{
          return (
            <Stack key={`${index}`} minWidth={120}
              sx={{
                textAlign: 'center',
                mb: `${pxToRem(8)} !important`,
                backgroundColor: theme.palette.dna[convertCtegryToValue(item.ctegry?.ctegrySid)].base,
                px: '1.875rem',
                py: 3,
                borderRadius: 2,
                cursor:'pointer',
                ml : index == 0 ? `${pxToRem(20)}` : 0 , 
              }}
              onClick={() => {
                navigate(`${PATH_ROOT.user.mypage.dnaResult}?ctegrySid=${item.ctegry?.ctegrySid}&page=slide`)
              }}
            >
              <Image src={getImagePath(item.ctegry?.thumbnlPath)} ratio={'1/1'} width={40} height={40} 
                onError={(e: any) => {
                  e.target.src = '/assets/default-goods.svg';
                }}
                draggable={false} 
              />
              <Typography variant={'caption'} color={'#202123'} fontWeight={600} sx={{ mt: 0, pt: 2 }}>{item.ctegry?.ctegryNm}</Typography>
              <Typography variant={'h5'} sx={{ mt: 0, py: 0.5, fontWeight: 600, color: '#000000' }}>
                {item.cnt}
                <Typography component={'span'} variant={'h5'}  fontWeight={100} fontSize={pxToRem(18)} color={'#202123'} lineHeight={pxToRem(22)} 
                  fontFamily={'-apple-system,sans-serif'}
                >/{item.totalCnt}</Typography>
              </Typography>
            </Stack>
          )
        })
      }
    </>
  );
});

export default MycandyItem;