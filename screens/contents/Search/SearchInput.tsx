import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useStores } from '../../../models/root-store/root-store-context';
import { Button, Stack, useTheme, InputAdornment } from '@mui/material';
import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form';
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import CTextField from 'src/components/forms/CTextField';
import { loadString } from 'src/utils/storage';
import { pxToRem } from 'src/theme/typography';
import { CallApiToStore } from 'src/utils/common';
import { useLocation, useNavigate } from 'react-router';
import { PATH_ROOT } from 'src/routes/paths';

/**
 * ## SearchInput 설명
 *
 */

interface Props {
  contentsType: string;
  keyword: any;
}

export const SearchInput = observer(({ keyword }: Props) => {
  const rootStore = useStores();
  const { loadingStore, contentStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const { state } = useLocation();

  // input 검색 (e.target.value)
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(false);
  const defaultValues = {
    search: search === null ? '' : state,
  };

  const methods = useForm<any>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
  });

  const {
    getValues,
    setValue,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = methods;

  const onSubmit = async () => {};
  const getContents = (state: any, isAdd: boolean, isReset: boolean) => {
    if (_.isEmpty(errors)) {
      CallApiToStore(contentStore.getsSearch(state, isAdd, true), 'api', loadingStore);
    }
  };
  const sendTextValue = () => {
    setSearch(getValues('search'));
    // const searchKeyword = getValues('search');
    // keyword(searchKeyword);
  };
  const [newLine, setNewLine] = useState(1);
  const onEnterCallback = (e: any) => {
    if (e && e.keyCode === 13 && !e.shiftKey) {
      navigate(PATH_ROOT.contents.result, { state: search });
      getContents(search, true, true);
      e.nativeEvent.preventDefault();
      e.stopPropagation();
    }
  };

  const onChangeCallback = (e: any) => {
    setSearch(e.target.value);
    setNewLine(getValues('search').split('\n').length);
  };

  const inputRef = useRef<any>(null);

  const onFocusCallback = async () => {
    setActive(true);
    inputRef.current?.focus();
    const os = await loadString('os');
    // if (os && os !== '') {
    //   inputRef.current?.scrollIntoView(100);
    // }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack
          ref={inputRef}
          direction={'row'}
          alignItems={'top'}
          spacing={0}
          sx={{ px: pxToRem(20), py: pxToRem(7), scrollMarginTop: pxToRem(60) }}
        >
          <Stack direction={'row'} sx={{ flex: 1, pt: '2px' }}>
            <CTextField
              label={''}
              name={'search'}
              variant={'outlined'}
              placeholder={'검색어를 입력하세요.'}
              multiline
              multilineHeight={24 * (newLine > 1 ? newLine + 1 : newLine)}
              className={'TypetestTextAreaSub'}
              sx={{
                minHeight: 24,
                maxHeight: 240,
              }}
              onFocusCallback={onFocusCallback}
              onEnterCallback={onEnterCallback}
              onChangeCallback={onChangeCallback}
              help={false}
              resizeType={'none'}
              endAdornment={
                <InputAdornment
                  position="end"
                  sx={{
                    alignItems: 'center',
                    ml: 0,
                  }}
                >
                  {(search !== '' || (getValues('search') && getValues('search').length > 0)) && (
                    <Button
                      disableElevation
                      disableRipple
                      disableFocusRipple
                      disableTouchRipple
                      variant={'contained'}
                      size={'medium'}
                      sx={{
                        transition: 'all 0s',
                        p: 0,
                        color: '#DFE0E2 !important',
                      }}
                      type={'submit'}
                      onClick={(e: any) => {
                        setSearch('');
                        setValue('search', '');
                        inputRef.current.focus();
                        setNewLine(1);
                      }}
                    >
                      <Iconify icon={'ph:x-circle-fill'} sx={{ width: 24, height: 24 }} />
                    </Button>
                  )}

                  <Button
                    disableElevation
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                    variant={'contained'}
                    size={'medium'}
                    sx={{
                      transition: 'all 0s',
                    }}
                    type={'submit'}
                    onClick={(e: any) => {
                      e.preventDefault();
                      e.stopPropagation();
                      sendTextValue();
                      PATH_ROOT.contents.result
                        ? getContents(search, true, true)
                        : navigate('/contents/result', { state: search });
                      if (
                        defaultValues.search === null ||
                        defaultValues.search === '' ||
                        search === ''
                      ) {
                        navigate(PATH_ROOT.contents.root);
                      }
                    }}
                  >
                    <Iconify icon={'ic:round-search'} sx={{ width: 25, height: 25 }} />
                  </Button>
                </InputAdornment>
              }
            />
          </Stack>
        </Stack>
      </FormProvider>
    </>
  );
});

export default SearchInput;
