import { observer } from 'mobx-react-lite';

// style
import {Box, Chip, Stack, Typography, useTheme} from '@mui/material';
import { useStores } from 'src/models/root-store/root-store-context';
import 'yet-another-react-lightbox/styles.css';
import { pxToRem } from 'src/theme/typography';
import { useEffect, useState } from 'react';
import { CallApiToStore } from 'src/utils/common';
import { selectOptions } from 'src/components/forms/CTextField';
import { useNavigate } from 'react-router';
import { PATH_ROOT } from 'src/routes/paths';
import { Icon } from '@iconify/react';
import FaqConnect from '../inquiry-view/FaqConnect';

/**
 * ## InquiryListFaq 설명
 *
 */
export const InquiryListFaq = observer(() => {
  const rootStore = useStores();
  const { faqStore, responseStore, loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();

  // chip 검색
  const [faqCode, setFaqCode] = useState<selectOptions[]>([]);

  // chip 메뉴 조회
  const getCode = () => {
    const code = rootStore.codeListStore.list.filter((code) => code.name === 'FAQ_TYPE_CD');
    if (code) {
      setFaqCode(code[0].list);
    }
  };

  const connectEventAll = (e:any, type:any) => {
    navigate(PATH_ROOT.customer.faq, { state : {"code" : null, "text" : '전체' } });
  };

  useEffect(() => { 
    getCode();
  }, []);
  

  return (
    <Stack maxWidth={'100%'}>
      <Stack sx={{display:'flex', flexDirection:'row', justifyContent:'space-between'}} onClick={()=>{connectEventAll(null,'전체')}}>
        <Box><Typography variant='Kor_18_b' sx={{display:'inline-block'}}>문의 전 FAQ를 확인해 주세요!</Typography></Box>
        <Box component={Icon} icon={'material-symbols:navigate-next'} sx={{cursor:'pointer', }}></Box>
      </Stack>
      <FaqConnect/>
    </Stack>
  );
});
export default InquiryListFaq;
