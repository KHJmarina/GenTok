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

/**
 * ## InquiryView 설명
 *
 */
interface Props {
  dailogYn?: boolean
}

export const FaqConnect = observer(({dailogYn}:Props) => {
  const rootStore = useStores();
  const { faqStore, responseStore, loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();

  const [dialogFaq, setDialogFaq] = useState(false)

  // chip 검색
  const [faqCategories, setFaqCategories] = useState<any>(null);
  const [faqCode, setFaqCode] = useState<selectOptions[]>([]);
  const [code, setCode] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // chip 메뉴 조회
  const getCode = () => {
    const code = rootStore.codeListStore.list.filter((code) => code.name === 'FAQ_TYPE_CD');
    if (code) {
      setFaqCode(code[0].list);
    }
  };

  // faq 값 전달
  const connectEvent = (e:any, type:any, i:number) => {
    // console.log("code " , type.code)
    // console.log("text : ", e.target.innerText);
    // console.log("index : ", i);
    navigate(PATH_ROOT.customer.faq, { state : {"code" : type.code, "text" : e.target.innerText, 'index': i} });
  };

  useEffect(() => { 
    getCode();
    if(dailogYn) {
      setDialogFaq(true)
    }
  }, []);
  

  return (
    <Stack maxWidth={'100%'}>
      <Stack
        sx={{
          py: pxToRem(5),
          mt: pxToRem(25),
          maxWidth:'100%',
          display: 'flex',
          flexDirection: 'row',
          flexWrap:'wrap',
          justifyContent: dialogFaq ? 'center' : 'left'
        }}
      >
        {faqCode.map((type:any, i: number) => {
          return (
            <Chip
              key={`faq-chip-${i}`}
              label={type.value}
              size={'medium'}
              clickable={false}
              onClick={(e: any) => {
                connectEvent(e, type, i);
                setFaqCategories(e.target.innerText);
              }}
              variant="outlined"
              sx={{
                p: `${pxToRem(5)} ${pxToRem(8)}`,
                my: pxToRem(5),
                mr: pxToRem(10),
                borderRadius: pxToRem(999),
                cursor:'pointer',
                color:
                  type.value === faqCategories
                    ? theme.palette.common.white
                    : theme.palette.common.black,
                backgroundColor:
                  type.value === faqCategories
                    ? theme.palette.grey[400]
                    : theme.palette.common.white,
                borderColor: theme.palette.grey[400],
              }}
            />
          );
        })}
      </Stack>
    </Stack>
  );
});
export default FaqConnect;
