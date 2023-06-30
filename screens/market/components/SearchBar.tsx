import { IconButton, InputAdornment, Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import CTextField from 'src/components/forms/CTextField';
import FormProvider from 'src/components/hook-form/FormProvider';
import Iconify from 'src/components/iconify';
import { useStores } from 'src/models';
import { pxToRem } from 'src/theme/typography';

export interface ISearchBarProps {}

export const SearchBar = observer(({}: ISearchBarProps) => {
  const {
    marketStore: { goodsStore },
  } = useStores();
  const methods = useForm<any>();
  const { handleSubmit, setValue, watch } = methods;
  const watchKeyword = watch('keyword');

  const onSubmit = (data: any) => {
    // goodsStore.setKeyword(data.keyword);
    goodsStore.search({ keyword: data.keyword, page: 1, size: 16, category: goodsStore.category });
  };
  const [focus, setFocus] = useState(false);

  let searchDebounceTimeId = useRef<any>();
  useEffect(() => {
    // 키 입력시 검색 키워드 변경 보관
    goodsStore.setKeyword(watchKeyword);

    // 검색 디바운스 타이머 초기화
    if (searchDebounceTimeId.current) {
      clearTimeout(searchDebounceTimeId.current);
    }
    // 검색 디바운스 타이머 설정
    searchDebounceTimeId.current = setTimeout(() => {
      goodsStore.search({
        keyword: watchKeyword,
        page: 1,
        size: 16,
        category: goodsStore.category,
      });
    }, 500);
  }, [goodsStore, watchKeyword]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{ px: pxToRem(20), py: pxToRem(7), scrollMarginTop: pxToRem(60) }}>
        <Stack sx={{ flex: 1, pt: '2px' }}>
          <CTextField
            name="keyword"
            label=""
            variant="outlined"
            placeholder="가장 궁금한 유전자는 어떤 것인가요?"
            sx={{ minHeight: 24, maxHeight: 240 }}
            help={false}
            className="TypetestTextAreaSub"
            hasFocus={focus}
            endAdornment={
              <InputAdornment position="end" sx={{ alignItems: 'center', ml: 0 }}>
                {watchKeyword && watchKeyword.length > 0 && (
                  <IconButton
                    onClick={(e: any) => {
                      setValue('keyword', '');
                      onSubmit({ keyword: '' });
                      setFocus(true);
                    }}
                  >
                    <Iconify icon={'ph:x-circle-fill'} sx={{ width: 24, height: 24 }} />
                  </IconButton>
                )}
                <IconButton type="submit">
                  <Iconify icon={'ic:round-search'} sx={{ width: 24, height: 24 }} />
                </IconButton>
              </InputAdornment>
            }
          />
        </Stack>
      </Stack>
    </FormProvider>
  );
});
