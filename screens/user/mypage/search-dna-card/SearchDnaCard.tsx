import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { Divider, IconButton, InputBase, Stack, Typography, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { ReactComponent as CarouselIcon } from 'src/assets/icons/ico-view-carousel.svg';
import FormProvider from 'src/components/hook-form/FormProvider';
import { pxToRem } from 'src/theme/typography';
import { useStores } from '../../../../models/root-store/root-store-context';
import { PATH_ROOT } from '../../../../routes/paths';
import { CHeader } from 'src/components/CHeader';
import { CallApiToStore } from 'src/utils/common';
import { toJS } from 'mobx';
import { IDnaResultCard } from 'src/models/dna-result-card/DnaResultCard';
import Mycandy from '../mycandy/Mycandy';

const reESC = /[\\^$.*+?()[\]{}|]/g;
const reChar = /[가-힣]/;
const reJa = /[ㄱ-ㅎ]/;
const offset = 44032;

const orderOffest = [
  ['ㄱ', 44032],
  ['ㄲ', 44620],
  ['ㄴ', 45208],
  ['ㄷ', 45796],
  ['ㄸ', 46384],
  ['ㄹ', 46972],
  ['ㅁ', 47560],
  ['ㅂ', 48148],
  ['ㅃ', 48736],
  ['ㅅ', 49324],
];

const con2syl = Object.fromEntries(orderOffest as readonly any[]);
const pattern = (ch: string) => {
  let r;
  if (reJa.test(ch)) {
    const begin = con2syl[ch] || (ch.charCodeAt(0) - 12613) * 588 + con2syl['ㅅ'];
    const end = begin + 587;
    r = `[${ch}\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
  } else if (reChar.test(ch)) {
    const chCode = ch.charCodeAt(0) - offset;
    if (chCode % 28 > 0) return ch;
    const begin = Math.floor(chCode / 28) * 28 + offset;
    const end = begin + 27;
    r = `[\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
  } else r = ch.replace(reESC, '\\$&');
  return `(${r})`;
};

const isMatchInitialConstants = (query: string, target: string) => {
  const reg = new RegExp(query.split('').map(pattern).join('.*?'), 'i');
  console.log('target:', target);
  const matches = reg.exec(target);
  return Boolean(matches);
};

/**
 * ## SearchDnaCard 설명
 *
 */
export const SearchDnaCard = observer((props) => {
  const rootStore = useStores();
  const { dnaResultStore, loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const [search, setSearch] = useState(''); // 입력한 검색어
  const [searchList, setSearchList] = useState<IDnaResultCard[]>(
    [],
    // toJS(dnaResultStore.myResult?.resultList!),
  ); // ok
  const [onlyMine, setOnlyMine] = useState<boolean>(true);
  const [orderTypeCd, setOrderTypeCd] = useState<number>(100601);
  const [ctegryId, setCtegryId] = useState<any>();

  const [searchKeyword, setSearchKeyword] = useState(search);
  const searchInput = useRef(search);
  const [active, setActive] = useState(false);
  const methods = useForm<any>({});
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const [render, setRender] = useState<boolean>(false);
  const [word, setWord] = useState(1);
  const [query, setQuery] = useState<string>('');

  const [myCard, setMyCard] = useState<any>();
  const [myCardStatus, setMyCardStatus] = useState(false);
  const [searchStatus, setSearchStatus] = useState(false);

  const searchCard = (cardList: IDnaResultCard[], query: string, checkedList: IDnaResultCard[]) => {
    if (!query) {
      return dnaResultStore.myResult.resultList;
    }
    console.log('cardList : ', cardList.length);
    console.log('storeList: ', dnaResultStore.myResult.resultList.length);

    if (!isNaN(Number(query)) && query.length < 3) {
      return [];
    }

    return cardList
      .filter((card: IDnaResultCard) => {
        console.log('card.goodsNm : ' + query + ', ' + card.goodsNm);
        return isMatchInitialConstants(query, card?.goodsNm!);
      })
      .map((card: IDnaResultCard) => {
        let checked = checkedList.some((item) => item.goodsNm === card.goodsNm);
        // console.log("checked : " , checked);
        return { ...card, checked: checked };
      });
  };

  const handleOnChangeKeyword = (e: any) => {
    setSearch(e.target.value);
    setSearchStatus(true);
    console.log('e.target.value in changeKeyword: ', e.target.value);
    console.log(toJS(searchList));

    const result = searchCard(dnaResultStore.myResult?.resultList!, e.target.value, []);
    // const result = searchCard(searchList, search, []);
    // console.log(searchList);
    setSearchList(result);
    setMyCardStatus(false);
    console.log('result', result);

    if (e.target.value == '' || searchList.length == 0) {
      setWord(0);
    }
  };

  const {
    getValues,
    formState: { errors },
  } = methods;

  const clickIcon = (e: any) => {
    setSearchKeyword(search);
  };

  const onfocus = () => {
    setActive(false);
  };

  const clickCancel = (e: any) => {
    setSearch('');
  };

  const getDna = async (onlyMine: boolean, orderTypeCd: number, ctegryId: any) => {
    await CallApiToStore(
      dnaResultStore.getDna(onlyMine, orderTypeCd, ctegryId),
      'api',
      loadingStore,
    )
      .then(() => {
        setMyCard(
          dnaResultStore.myResult.resultList
            ? dnaResultStore.myResult.resultList
            : ([] as IDnaResultCard[]),
        );
        setMyCardStatus(true);
        setRender(true);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    getDna(onlyMine, orderTypeCd, ctegryId);
  }, [myCard]);

  const options: any = {
    showMainIcon: 'none',
    showXIcon: true,
    handleX: () => {
      navigate(-1);
    },
  };

  return (
    <>
      {render && (
        <Stack sx={{ height: '100%' }}>
          <Stack>
            <CHeader
              title={'결과 카드 찾기'}
              {...options}
            />
          </Stack>

          {/* 검색창 */}
          <FormProvider methods={methods}>
            <Box
              sx={{
                // width: '20.94rem',
                width: '90%',
                height: '3rem',
                background: search === '' ? '#FAFAFA' : 'white',
                border: search === '' ? '' : `1px solid ${theme.palette.primary.main}`,
                borderRadius: pxToRem(10),
                display: 'inline-flex',
              }}
            >
              <InputBase
                sx={{
                  ml: 2,
                  flex: 1,
                }}
                autoFocus
                placeholder="검색어를 검색하세요."
                inputProps={{ 'aria-label': '검색어를 검색하세요.' }}
                value={search}
                ref={searchInput}
                onChange={handleOnChangeKeyword}
              />
              <IconButton
                type="button"
                sx={{
                  pr: pxToRem(10),
                  '&:hover': {
                    background: 'none',
                  },
                }}
                aria-label="search"
                onClick={clickCancel}
              >
                {search === '' ? '' : <CancelIcon />}
              </IconButton>
              <IconButton
                type="button"
                sx={{
                  pl: '0rem !important',
                  p: 1.5,
                  '&:hover': {
                    background: 'none',
                  },
                }}
                aria-label="search"
                onClick={(e) => e.preventDefault}
              >
                <SearchIcon
                  id={`bnt-result-search-searchDnaCard`}
                  sx={{
                    color: search === '' ? '#C6C7CA' : theme.palette.primary.main,
                  }}
                />
              </IconButton>
            </Box>
          </FormProvider>
          {/* ---- 검색창 ---- */}

          {search === '' ? ( // 입력한 검색어가 없는 경우
            ''
          ) : (
            <Typography
              sx={{
                fontSize: pxToRem(14),
                fontWeight: 600,
                pl: '1.25rem',
                pt: pxToRem(28),
                textAlign: 'left',
              }}
            >
              검색결과
              <span style={{ color: theme.palette.primary.main }}> {searchList.length} </span>
            </Typography>
          )}

        {myCardStatus ? (
          <Box sx={{ p: '1.25rem' }}>
            {myCard.map((goods: any, i: number) => {
              return (
                <Box
                  key={i}
                  onClick={() => {
                    navigate(`${PATH_ROOT.user.mypage.dnaCard}/${goods.singleGoodsSid}`);
                  }}
                >
                  <Box sx={{ display: 'flex', py: '1rem', cursor: 'pointer' }}>
                    <Box
                      component={'img'}
                      src={REACT_APP_IMAGE_STORAGE + goods.thumbnlPath || 'assets/placeholder.svg'}
                      sx={{
                        width: '1.25rem',
                        height: '1.25rem',
                      }}
                    ></Box>
                    <Typography
                      sx={{ pl: '0.5rem', fontSize: pxToRem(14), fontWeight: pxToRem(400) }}
                    >
                      {goods?.goodsNm}
                    </Typography>
                  </Box>
                  <Divider sx={{ border: '0.5px solid #EEEEEE' }} />
                </Box>
              );
            })}
          </Box>
        ) : null}

          {/* 검색 결과 없는 경우 */}

          {searchStatus && searchList.length == 0 ? (
            <Box sx={{ m: 4, flexDirection: 'column', alignItems: 'center' }}>
              <CarouselIcon fill={theme.palette.grey[400]}></CarouselIcon>
              <Typography color={theme.palette.grey[400]} sx={{ mt: 1.5 }}>
                검색결과가 없습니다.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: '1.25rem' }}>
              {searchList.map((goods: any, i: number) => {
                return (
                  <Box
                    key={i}
                    onClick={() => {
                      navigate(`${PATH_ROOT.user.mypage.dnaCard}/${goods.singleGoodsSid}`);
                    }}
                  >
                    <Box sx={{ display: 'flex', py: '1rem', cursor: 'pointer' }}>
                      <Box
                        component={'img'}
                        src={
                          REACT_APP_IMAGE_STORAGE + goods.thumbnlPath || 'assets/placeholder.svg'
                        }
                        sx={{
                          width: '1.25rem',
                          height: '1.25rem',
                        }}
                      ></Box>
                      <Typography
                        sx={{ pl: '0.5rem', fontSize: pxToRem(14), fontWeight: pxToRem(400) }}
                      >
                        {goods?.goodsNm}
                      </Typography>
                    </Box>
                    <Divider sx={{ border: '0.5px solid #EEEEEE' }} />
                  </Box>
                );
              })}
            </Box>
          )}
        </Stack>
      )}
    </>
  );
});

export default SearchDnaCard;
