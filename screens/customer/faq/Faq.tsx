import { Typography, Stack, Dialog, Slide, ListItemIcon, Chip, InputAdornment, Divider, Button } from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import Iconify from 'src/components/iconify';
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { pxToRem } from 'src/theme/typography';
import { TransitionProps } from '@mui/material/transitions';
// ----------------------------------------------------------------
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useEffect, useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { debounce } from 'lodash';
import { reset } from 'numeral';
import { useLocation, useNavigate } from 'react-router-dom';
import { CallApiToStore } from 'src/utils/common';
import FormProvider from 'src/components/hook-form';
import { ICodeItemModel, useStores } from 'src/models';
import CTextField, { selectOptions } from 'src/components/forms/CTextField';
import { HEADER } from 'src/config-global';
import { FaqDetail } from './FaqDetail';
import { useScroll } from 'framer-motion';
import CHeader from 'src/components/CHeader';

/**
 * ## 기능 설명
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */
export const Faq = observer(() => {
  const rootStore = useStores();
  const { faqStore, loadingStore, responseStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  // input 검색
  const [search, setSearch] = useState('');
  const [searchKeyword, setSearchKeyword] = useState(search);
  const scrollRef = useRef<any>(null);
  // 문의하기 연결
  const state = useLocation()

  // chip 검색
  const [faqCategories, setFaqCategories] = useState<any>(null);
  const [faqCode, setFaqCode] = useState<selectOptions[]>([]);
  const [code, setCode] = useState<number | null>(null);

  // faq 목록 조회
  const getData = async (faqTypeCd: number | null, faqConts: string | null, isReset?: boolean) => {
    CallApiToStore(faqStore.gets(faqTypeCd, faqConts, true), 'api', loadingStore).then(() => {
      if (responseStore.responseInfo.resultCode === 'S') {
        setLoading(loading => loading = false);
      }
    });
  };

  // faq 목록 상세 조회
  const getDetail = async (faqSid: number) => {
    CallApiToStore(faqStore.get(faqSid), 'api', loadingStore).then((e) => {
      setOpen(true);
    });
  };

  // chip 메뉴 조회
  const getCode = () => {
    const code = rootStore.codeListStore.list.filter((code) => code.name === 'FAQ_TYPE_CD');
    if (code) {
      setFaqCode(code[0].list);
    }
  };

  // 검색 input 이벤트
  const onChangeCallback = (e: any) => {
    // setSearch(search => search = e.target.value);
  };
  const onEnterCallback = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.key === 'Enter' && !loading) {
      setLoading(loading => loading = true);
      faqStore.reset();
      getData(code, getValues('keyword'));
      setSearchKeyword(getValues('keyword'));
    }
  };

  useEffect(() => {
    faqStore.pagination.setProps({ size: 10 });
    if (state.state !== null || undefined) {
      getData(state.state.code, null)
      setFaqCategories(state.state.text)
      setCode(state.state.code)
    } else {
      getData(null, searchKeyword);
      setFaqCategories('전체');
    }
    getCode();
  }, []);

  const methods = useForm<any>({});
  const { formState, getValues, setValue, handleSubmit } = methods;

  const [category, setCategory] = useState<ICodeItemModel[] | undefined>([]);
  useEffect(() => {
    if (rootStore.getCodeList) {
      setCategory(rootStore.getCodeList('FAQ_TYPE_CD'));
    }
  }, [rootStore.codeListStore?.list.length]);

  // chip focus
  const focusChip = useRef<any>([]);
  const scrollToChip = (i: number) => {
    const chipElement = focusChip.current[i]
    chipElement?.scrollIntoView({ behavior: 'smooth', inline: 'center' })
  };
  useEffect(() => {
    faqStore.reset();
    setTimeout(() => { state.state && scrollToChip(state.state.index) }, 50)
  }, []);


  // infinite scroll
  const addPage = async (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!faqStore.pagination.last) {
        faqStore.pagination.setProps({
          page: faqStore.pagination.page + 1,
        });
        resolve(faqStore.pagination.page);
      } else {
        reject('last page'); // new Error('last page')
      }
    });
  };

  const { scrollYProgress, scrollY } = useScroll();
  useEffect(() => {
    scrollYProgress.on('change', (v) => {
      if (v > 0.8) {
        if (!loadingStore.loading) {
          addPage()
            .then(() => {
              getData(code, searchKeyword);
            })
            .catch((e) => { });
        }
      }
    });
    return () => {
      faqStore.pagination.setProps({ page: 1 });
    };
  }, [faqStore, scrollYProgress]);

  const options: any = {
    showMainIcon: 'back',
    showHomeIcon: true,
  };

  const onSubmit = () => { }
  return (
    <>
      <Stack sx={{ maxWidth: '100%', }} >
        <CHeader title="자주 찾는 질문 (FAQ)" {...options} />
        {/* 검색 input */}
        <Stack
          sx={{
            px: pxToRem(20),
            pt: pxToRem(20),
            flex: 1,
            position: 'sticky',
            scrollMarginTop: pxToRem(150),
            overflowY: 'scroll',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <CTextField
              label={''}
              name={'keyword'}
              variant={'outlined'}
              placeholder={'문의사항을 검색하세요.'}
              className={'faqTextArea'}
              help={false}
              sx={{
                maxHeight: pxToRem(55),
              }}
              onEnterCallback={onEnterCallback}
              // onChangeCallback={debounce((e) => {
              //   // onChangeCallback(e);
              // }, 300)}
              resizeType={'none'}
              endAdornment={
                <InputAdornment
                  position="end"
                  sx={{
                    alignItems: 'center',
                    ml: pxToRem(20),
                  }}
                >
                  <Divider
                    sx={{
                      height: pxToRem(30),
                      borderWidth: 0.4,
                    }}
                  />
                  <Button sx={{ p: 0, m: 0, minWidth: pxToRem(25), height: pxToRem(25) }}>
                    <Iconify
                      icon={'ri:search-line'}
                      onClick={(e: any) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSearchKeyword(getValues('keyword'));
                        getData(code, getValues('keyword'));
                      }}
                      sx={{
                        m: pxToRem(10),
                      }}
                    />
                  </Button>
                </InputAdornment>
              }
            />
          </FormProvider>
        </Stack>
        {/* 검색 chip */}
        <Stack sx={{ justifyContent: 'center', m: 0, }} >
          <Stack sx={{ pl: pxToRem(20), py: pxToRem(5), my: pxToRem(25), display: 'flex', flexDirection: 'row', whiteSpace: 'nowrap', overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }} >
            <Chip
              label={'전체'}
              size={'medium'}
              clickable={false}
              onClick={(e: any) => {
                setCode(null);
                faqStore.reset();
                getData(null, searchKeyword);
                setFaqCategories('전체');
                if (search === '' && faqCategories !== null) {
                  setSearchKeyword('');
                  setFaqCategories('전체');
                }
              }}
              variant="outlined"
              sx={{
                p: `${pxToRem(5)} ${pxToRem(8)}`,
                mr: pxToRem(10),
                whiteSpace: 'nowrap',
                borderRadius: 50,
                color:
                  faqCategories === '전체'
                    ? theme.palette.common.white
                    : theme.palette.primary.main,
                backgroundColor:
                  faqCategories === '전체'
                    ? theme.palette.primary.main
                    : theme.palette.common.white,
                borderColor: theme.palette.primary.main,
              }}
            />
            {faqCode.map((type, i: number) => {
              return (
                <Chip
                  key={`faq-chip-${i}`}
                  ref={(el) => (focusChip.current[i] = el)}
                  label={type.value}
                  size={'medium'}
                  clickable={false}
                  onClick={(e: any) => {
                    scrollToChip(i);
                    faqStore.reset();
                    getData(Number(type.code), searchKeyword); // chip의 list call
                    setFaqCategories(e.target.innerText); // chip의 항목 저장 : 스타일, 해당 데이터 불러오는 용도
                    setCode(Number(type.code) || null); // call 할때 faqTypeCd
                    // input 키워드 작성 후 검색 버튼 안눌렀때
                    if (search === '' && faqCategories !== null) {
                      setSearchKeyword('');
                      setFaqCategories(e.target.innerText);
                    }
                  }}
                  variant="outlined"
                  sx={{
                    p: `${pxToRem(5)} ${pxToRem(8)}`,
                    mr: pxToRem(10),
                    whiteSpace: 'nowrap',
                    borderRadius: pxToRem(999),
                    color:
                      type.value === faqCategories
                        ? theme.palette.common.white
                        : theme.palette.primary.main,
                    backgroundColor:
                      type.value === faqCategories
                        ? theme.palette.primary.main
                        : theme.palette.common.white,
                    borderColor: theme.palette.primary.main,
                  }}
                />
              );
            })}
          </Stack>
        </Stack>

        {/* 검색 결과 요약*/}
        {searchKeyword !== '' && responseStore.responseInfo.resultCode === 'S' ? (
          <Box
            paddingX={pxToRem(20)}
            paddingTop={pxToRem(20)}
            paddingBottom={pxToRem(8)}
            display={'flex'}
            flexDirection={'row'}
          >
            <Typography
              variant={'Kor_18_b'}
              display={'inline-block'}
              color={theme.palette.primary.dark}
            >
              {searchKeyword}
            </Typography>
            <Typography variant={'Kor_18_b'} textAlign={'left'}>
              에 대해 총
            </Typography>
            <Typography
              variant={'Kor_18_b'}
              alignItems={'baseline'}
              display={'inline-block'}
              color={theme.palette.primary.dark}
              marginLeft={pxToRem(5)}
            >
              {faqStore.pagination.totalElements}
            </Typography>
            <Typography variant={'Kor_18_b'} textAlign={'left'}>
              개가 검색 되었습니다.
            </Typography>
          </Box>
        ) : null}

        {/* 검색 결과 리스트 */}
        {
          // <Carousel ref={carouselRef} {...carouselSettings}>
          <Box
            sx={{
              overflowX: 'hidden',
              pb: `${HEADER.H_MOBILE * 2}px`,
            }}
          >
            {faqStore.faqs.map((faq: any, i: number) => {
              return (
                <Box
                  key={`faq-result` + i}
                  onClick={() => getDetail(faq.faqSid)}
                  display={'flex'}
                  justifyContent={'space-between'}
                  borderTop={`1px solid ${theme.palette.grey[200]}`}
                  sx={{
                    py: pxToRem(20),
                    pl: pxToRem(20),
                  }}
                >
                  <Box display={'flex'} sx={{ py: pxToRem(4) }}>
                    <Typography
                      key={`faq-q-${faq.faqSid}`}
                      variant={'Kor_16_r'}
                      textAlign={'left'}
                      paddingRight={pxToRem(8)}
                    >
                      Q
                    </Typography>
                    <Typography
                      key={`faq-nm-${faq.faqSid}`}
                      variant={'Kor_16_r'}
                      textAlign={'left'}
                    >
                      {faq.faqNm}
                    </Typography>
                  </Box>
                  <ListItemIcon sx={{ alignItems: 'center', mr: pxToRem(17) }}>
                    <ArrowRightIcon sx={{ color: theme.palette.grey[400] }} />
                  </ListItemIcon>
                </Box>
              );
            })}
            <Box sx={{ borderBottom: `1px solid ${theme.palette.grey[200]}` }} />
          </Box>
          // {/* </Carousel> */}
        }

        {open && (
          <Dialog
            fullWidth
            keepMounted
            maxWidth={'md'}
            hideBackdrop
            disableEscapeKeyDown
            open={open}
            TransitionComponent={Transition}
            PaperProps={{
              sx: {
                p: 0,
                m: '0 !important',
                maxHeight: '100%',
                minHeight: '100%',
                borderRadius: '0 !important',
                boxShadow: 'none',
              },
            }}
            onClose={() => {
              setOpen(false);
            }}
            sx={{
              margin: '0 !important',
              zIndex: 100,
              padding: 0,
              borderRadius: 0,
            }}
          >
            {faqStore.faq !== null && <FaqDetail handleClose={() => setOpen(false)} />}
          </Dialog>
        )}
      </Stack>
    </>
  );
});

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default Faq;
