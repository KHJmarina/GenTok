import Box from '@mui/material/Box';
import { Divider, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { TEST_TYPES } from 'src/components/test-types-svg';
import { pxToRem } from 'src/theme/typography';
import { PATH_ROOT } from '../../../../../routes/paths';
import { useLocation, useNavigate, useNavigation } from 'react-router-dom';
/**
 * ## DnaCardList 설명
 *
 */

export const DnaCardList = observer((getData, cardList) => {
  
  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState('');
  const colors: any = {
    A: '#FCC800',
    B: '#008FF8',
    C: '#FF8872',
    D: '#69CA90',
    E: '#5A75FF',
    F: '#5B4DF7',
  };
  
  // const card = props.card;
  // const setCard = props.setCard;
  
  useEffect(() => {
    
  });

  return (
    <>
      <Box sx={{ p: '1.25rem' }}>
        {[...Array(30)].map((_, i: number) => {
          return (
            <Box 
              key={i}
              onClick={() =>
                navigate(`/market/goods/` + (i+1))
              }  
            >
              <Box sx= {{ display :'flex', py:'1rem'}}>
                <svg
                  width="1.25rem"
                  height="1.25rem"
                  viewBox="0 0 60 60"
                  fill={colors[TEST_TYPES[i].type]}
                >
                  <path d={TEST_TYPES[i].svg} />
                </svg>
                <Typography sx={{ pl : '0.5rem', fontSize:pxToRem(14), fontWeight:pxToRem(400) }}>{TEST_TYPES[i].name}</Typography>
              </Box>
              <Divider sx={{ border: '1px solid #EEEEEE' }} />
            </Box>
          );
        })}
      </Box>
    </>
  );
});

export default DnaCardList;
