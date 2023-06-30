import {
  Autocomplete,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import { CustomerHeader } from 'src/components/CustomerHeader';
import { useNavigate } from 'react-router';
import Terms from 'src/screens/common/terms/Terms';

/**
 * ## 기능 설명
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */
type Props = {
  handleClose: VoidFunction;
};
const options = [
  { label: '문의합니다' },
  { label: '문의합니다' },
  { label: '문의합니다' },
  { label: '문의합니다' },
];

export const SettingTerms = observer(({ handleClose }: Props) => {
  const rootStore = useStores();
  const { loadingStore } = rootStore;

  const { REACT_APP_API_URL } = process.env;

  const [loading, setLoading] = useState(true);

  const getData = async () => {
    // const res = await fetch(REACT_APP_API_URL + 'faq')
    //   .then(async (res: any) => {
    //     const json = await res.json();
    //     setList(json.faqList);
    //     setLoading(false);
    //   }).catch((e: any) => {
    //     setList(faqList);
    //     setLoading(false);
    //   });
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const navigate = useNavigate();
  return (
    <>
      <CustomerHeader title="개인정보 처리방침" handleClose={handleClose} />
      <Box
        sx={{
          flex: 1,
          height: '100%',
          p: 2,
          pt: 0,
          scrollMarginTop: '100px',
        }}
      >
        <Stack sx={{ mt: 2 }}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={options}
            renderInput={(params) => <TextField {...params} label="선택하세요" />}
            sx={{
              minWidth: 300,
            }}
          />
        </Stack>

        <Stack sx={{ mt: 2, background: '#444444' }}>약관 내용</Stack>
      </Box>
    </>
  );
});

export default SettingTerms;
