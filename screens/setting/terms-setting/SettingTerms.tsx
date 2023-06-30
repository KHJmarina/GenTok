import {
  Autocomplete,
  CircularProgress,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import { CustomerHeader } from 'src/components/CustomerHeader';
import parse from 'html-react-parser';
import { HEADER } from 'src/config-global';
import CSelect, { selectOptions } from 'src/components/forms/CSelect';
import moment from 'moment';
import { CallApiToStore } from 'src/utils/common';
import { toJS } from 'mobx';
// 데이터 전송
import FormProvider from 'src/components/hook-form/FormProvider';
import { useForm } from 'react-hook-form';
import { ITermsSnapshot } from 'src/models/terms/Terms';
import { pxToRem } from 'src/theme/typography';
import BackHeader from 'src/components/BackHeader';
import './terms-style.css';

/**
 * ## 기능 설명
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */
type Props = {
  handleClose: VoidFunction;
};
export const SettingTerms = observer(({ handleClose }: Props) => {
  const rootStore = useStores();
  const { termsStore, loadingStore, responseStore } = rootStore;

  const [loading, setLoading] = useState(true);
  const [contsOpen, setContsOpen] = useState(false);
  const [saveFailAlert, setSaveFailAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [defaultValues, setDefaultValues] = useState<ITermsSnapshot>(termsStore.terms);
  const methods = useForm<ITermsSnapshot>({
    // defaultValues,
  });

  const { getValues } = methods;

  // 해당 약관의 버전 목록 불러오기
  const getsVersion = async () => {
    await CallApiToStore(
      termsStore.getsVersion(termsStore.terms.termsSid),
      'api',
      loadingStore,
    ).then(() => {
      setLoading(false);
    });
  };

  // 해당 약관의 버전 상세내용 불러오기
  const getVersionDetail = async (termsSid: number, ver: string) => {
    CallApiToStore(termsStore.getVersionDetail(termsSid, ver), 'api', loadingStore).then(() => {
      if (responseStore.responseInfo.resultCode === 'S') {
        setContsOpen(true);
      } else {
        if (responseStore.responseInfo.errorMessage) {
          setErrorMessage(responseStore.responseInfo.errorMessage);
          setSaveFailAlert(true);
        } else {
          setErrorMessage('알 수 없는 오류가 발생하였습니다.');
          setSaveFailAlert(true);
        }
      }
    });
  };

  useEffect(() => {
    getsVersion();
  }, [defaultValues]);

  return (
    <>
      <BackHeader title={termsStore.terms.termsNm} handleClose={handleClose} />
      <Stack
        sx={{
          flex: 1,
          overflowY: 'auto',
          scrollMarginTop: pxToRem(100),
        }}
      >
        <Stack
          sx={{
            position: 'sticky',
            top: 0,
            overflowX: 'scroll',
            pt: pxToRem(10),
            px: pxToRem(20),
            pb: `${HEADER.H_MOBILE * 2}px`,
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            justifyContent: 'left',
          }}
        >
          <Stack>
            {termsStore.terms.ver !== null ? (
              <>
                <Typography variant={'Kor_16_b'} sx={{ textAlign: 'left', pb: pxToRem(8) }}>
                  약관 선택
                </Typography>

                <FormProvider methods={methods}>
                  <Select
                    label={''}
                    name={'verList'}
                    variant={'outlined'}
                    sx={{
                      textAlign: 'left',
                      width: '100%',
                      '& .MuiSelect-select': {
                        p: pxToRem(10),
                      },
                    }}
                    defaultValue={termsStore.terms.ver || 0}
                    onChange={(e) => {
                      getVersionDetail(termsStore.terms.termsSid, String(e.target.value));
                    }}
                  >
                    {!loading &&
                      termsStore.termsVersion?.map((row: any, i: number) => {
                        const applyStDay = moment(row.applyStDay).format('YYYY/MM/DD');
                        return (
                          <MenuItem key={i} value={String(row.ver)}>
                            {'현행 시행일자 ' + applyStDay}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormProvider>
              </>
            ) : null}
          </Stack>

          <Stack sx={{ mt: termsStore.terms.ver !== null ? pxToRem(50) : pxToRem(0) }}>
            {!contsOpen
              ? parse(termsStore.terms.termsConts)
              : parse(
                termsStore.termsVersionDetail.termsConts,
              )}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
});

export default SettingTerms;
