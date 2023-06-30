import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState, useRef } from 'react';
import { useStores } from '../../../../models/root-store/root-store-context';
import { useNavigate } from 'react-router-dom';
import {
  useTheme,
  Stack,
  Paper,
  InputBase,
  Divider,
  IconButton,
  Typography,
  TextField,
  FormControl,
  MenuItem,
  InputLabel,
  Card,
  Button,
  Drawer,
  alpha,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import { CustomerHeader } from 'src/components/CustomerHeader';
import { HEADER } from 'src/config-global';
import OrderHistoryItems from './order-history-detail/order-history-items/OrderHistoryItems';
import { type } from 'os';
import { CHeader } from 'src/components/CHeader';
import OrderHistoryDetailButtons from './order-history-buttons/OrderHistoryDetailButtons';
import { CallApiToStore } from 'src/utils/common';
import { toJS } from 'mobx';
import { IOrderHistory } from 'src/models/order-history/OrderHistory';
import { ReactComponent as CheckIcon } from 'src/assets/icons/ico-check.svg';
import { ReactComponent as CloseIcon } from 'src/assets/icons/ico-close-small.svg';
import { pxToRem } from 'src/theme/typography';
import Iconify from 'src/components/iconify';
import { ReactComponent as IconOrder } from 'src/assets/icons/ico-order.svg';
import CancelIcon from '@mui/icons-material/Cancel';
import moment from 'moment';
import { useScroll } from 'framer-motion';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

/**
 * ## Order 설명
 *
 */
export const Order = observer(() => {
  const rootStore = useStores();
  const { loadingStore, orderHistoryStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const [period, setPeriod] = useState('0');
  const [active, setActive] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [isSearch, setIsSearch] = useState(false);

  const [filter, setFilter] = useState<any>({ day: 0, value: '전체' });
  const [openFilter, setOpenFilter] = useState(false);

  let firstIndex = 1;
  const orderHistoryIndex = useRef(firstIndex);

  const [orderHistoryList, setOrderHistoryList] = useState<IOrderHistory[]>();

  const filterCode = [
    { day: 0, value: '전체' },
    { day: 7, value: '최근 1주일' },
    { day: 30, value: '최근 1개월' },
    { day: 90, value: '최근 3개월' },
    { day: 180, value: '최근 6개월' },
  ];

  const onfocus = () => {
    setActive(false);
  };

  const searchKeyword = async () => {
    const now = new Date();
    const orderDt = new Date(now.setDate(now.getDate() - filter.day)).getTime();

    CallApiToStore(
      orderHistoryStore.searchKeyword(keyword, filter.day === 0 ? '' : orderDt),
      'api',
      loadingStore,
    ).then(() => {
      setOrderHistoryList(
        orderHistoryStore.orderHistorys ? orderHistoryStore.orderHistorys : ([] as IOrderHistory[]),
      );
      setCurrentIndex(0);
      setIsSearch(true);
    });
  };

  const getOrderHistory = async () => {
    CallApiToStore(orderHistoryStore.gets(), 'api', loadingStore).then(() => {
      // console.log(toJS(orderHistoryStore.orderHistorys));
      setCurrentIndex(0);
      setOrderHistoryList(
        orderHistoryStore.orderHistorys ? orderHistoryStore.orderHistorys : ([] as IOrderHistory[]),
      );
    });
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    window.addEventListener('popstate', () => {
      setOpenFilter(false);
    });
    // orderHistoryStore.reset();
    // orderHistoryStore.resetOrderHistory();

    getOrderHistory();
    // console.log(orderHistoryIndex)
    // console.log('시작');
    return () => {
      orderHistoryStore.reset();
      orderHistoryStore.resetOrderHistory();
    };
  }, [orderHistoryStore.orderHistory?.purchsConfirmYn]);

  const addPage = async (): Promise<any> => {
    // switch (orderHistoryStore.pagination.first == currentIndex) {
    //   case 0:
    //     return new Promise((resolve, reject) => {
    //       if (!orderHistoryStore.pagination.last) {
    //         orderHistoryStore.pagination.setProps({
    //           page: orderHistoryStore.pagination.page + 1,
    //         });
    //         resolve(orderHistoryStore.pagination.page);
    //       } else {
    //         reject('last page'); // new Error('last page')
    //       }
    //     });

    //     break;
    //   case 1:
    //     return new Promise((resolve, reject) => {
    //       if (!orderHistoryStore.pagination.last) {
    //         orderHistoryStore.pagination.setProps({
    //           page: orderHistoryStore.pagination.page + 1,
    //         });
    //         resolve(orderHistoryStore.pagination.page);
    //       } else {
    //         reject('last page');
    //       }
    //     });

    //     break;
    //   case 2:
    //     break;
    return new Promise((resolve, reject) => {
      if (!orderHistoryStore.pagination.last) {
        orderHistoryStore.pagination.setProps({
          page: orderHistoryStore.pagination.page + 1,
        });
        resolve(orderHistoryStore.pagination.page);
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
              getOrderHistory();
            })
            .catch((e) => {});
        }
      }
    });
    return () => {
      orderHistoryStore.pagination.setProps({ page: 1 });
    };
  }, [orderHistoryStore, scrollYProgress]);

  const options: any = {
    showMainIcon: 'back',
    showHomeIcon: true,
    showCartIcon: true,
  };

  return (
    <>
      <Stack
        sx={{
          overflowX: 'hidden',
        }}
      >
        <CHeader title="주문내역" {...options} />

        <Stack
          direction={'row'}
          sx={{
            // width: '100%',
            px: pxToRem(20),
          }}
        >
          <Button
            variant={'text'}
            disableFocusRipple
            disableRipple
            disableTouchRipple
            endIcon={<KeyboardArrowDownIcon width={pxToRem(20)} />}
            sx={{
              fontSize: pxToRem(13),
              // color: alpha(theme.palette.common.black, .7),
              '&:hover': { background: 'none' },
              border: '1px solid #EEEEEE',
              height: pxToRem(40),
              alignSelf: 'center',
              mr: pxToRem(8),
              width: '35%',
              display: 'inline-flex',
              justifyContent: 'space-around',
              color: '#9DA0A5',
              borderRadius: pxToRem(4),
            }}
            onClick={() => {
              setOpenFilter(true);
              window.history.pushState(null, '', window.location.href);
            }}
          >
            {`${filter.value}`}
          </Button>

          <Paper
            component="form"
            sx={{
              my: 2.5,
              alignItems: 'center',
              display: 'flex',
              height: 40,
              // border: active === false ? '1px solid #eeeeee' : '1px solid #637381',
              border: keyword === '' ? '1px solid #eeeee' : '1px solid #FF7F3F',
              backgroundColor: '#FAFAFA',
              borderRadius: pxToRem(4),
              width: '70%',
            }}
          >
            <InputBase
              sx={{
                ml: 2,
                flex: 1,
                // border: 'none'
              }}
              placeholder="검색어를 입력하세요."
              inputProps={{ 'aria-label': '검색어를 입력하세요.' }}
              onClick={() => setActive(true)}
              value={keyword}
              onFocus={onfocus}
              onBlur={onfocus}
              onKeyDown={(e: any) => {
                if (e.key === 'Enter') {
                  setKeyword(e.target.value);
                  searchKeyword();
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              onChange={(e: any) => {
                if (e.key !== 'Enter') {
                  setKeyword(e.target.value);
                }
              }}
            />
            <IconButton
              type="button"
              aria-label="search"
              onClick={() => {
                setKeyword('');
              }}
            >
              {keyword === '' ? '' : <CancelIcon style={{ color: '#DFE0E2' }} />}
            </IconButton>
            <IconButton
              id={`btn-order-search`}
              type="button"
              aria-label="search"
              onClick={() => {
                searchKeyword();
              }}
            >
              <SearchIcon
                sx={{
                  // color: active === false ? '#cccccc' : '#637381',
                  fill: keyword === '' ? '#eeeee' : '#FF7F3F',
                }}
              />
            </IconButton>
          </Paper>
        </Stack>

        <Drawer
          open={openFilter}
          onClose={() => {
            setOpenFilter(false);
            navigate(-1);
          }}
          PaperProps={{
            sx: {
              width: '100%',
              borderRadius: pxToRem(25),
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              mx: 'auto',
              maxWidth: theme.breakpoints.values.md,
            },
          }}
          anchor={'bottom'}
        >
          <Stack spacing={2} sx={{ px: pxToRem(26), pt: pxToRem(25), pb: pxToRem(20) }}>
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
              sx={{ cursor: 'pointer', mb: pxToRem(20) }}
            >
              <Typography
                sx={{
                  fontSize: pxToRem(20),
                  fontWeight: 500,
                  lineHeight: pxToRem(23.87),
                  textAlign: 'left',
                }}
              >
                정렬 기준 선택
              </Typography>
              <CloseIcon
                fill={theme.palette.common.black}
                onClick={() => {
                  setOpenFilter(false);
                  navigate(-1);
                }}
              />
            </Stack>
            {filterCode.map((f, index) => {
              return (
                <Stack
                  key={`type-filter-${index}`}
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  sx={{ cursor: 'pointer', mt: '0px !important', mb: `${pxToRem(20)} !important` }}
                  onClick={() => {
                    setOpenFilter(false);
                    setFilter(f);
                    navigate(-1);
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: 'left',
                      color: filter.value === f.value ? '#008FF8' : '#202123',
                    }}
                  >
                    {f.value}
                  </Typography>
                  <CheckIcon
                    fill={
                      filter.value === f.value
                        ? theme.palette.secondary.main
                        : theme.palette.grey[300]
                    }
                  />
                </Stack>
              );
            })}
          </Stack>
        </Drawer>

        {isSearch && (
          <Box sx={{ display: 'flex', px: pxToRem(20), mb: pxToRem(20) }}>
            <Typography variant="Kor_14_b" sx={{ mr: pxToRem(4) }}>
              검색결과
            </Typography>
            <Typography
              sx={{ fontWeight: 600, fontSize: pxToRem(14), color: theme.palette.primary.main }}
            >
              {orderHistoryList?.length}
            </Typography>
          </Box>
        )}

        {isSearch && orderHistoryList?.length === 0 ? (
          <Stack alignItems="center" sx={{ pt: pxToRem(72) }}>
            <IconOrder fill={'#EEEEEE'} />
            <Typography
              variant={'Kor_16_r'}
              sx={{ pt: pxToRem(22) }}
              color={theme.palette.grey[300]}
            >
              검색 결과가 없습니다.
            </Typography>
          </Stack>
        ) : (
          <Stack
            spacing={2}
            sx={{
              flex: 1,
              pb: `${HEADER.H_MOBILE}px`,
              overflowY: 'auto',
            }}
          >
            {orderHistoryList?.length != 0 ? (
              <Stack
                sx={{
                  top: 0,
                  px: 2.5,
                  borderBottom: 0,
                  background: '#FFFFFF',
                  flex: 1,
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                  justifyContent: 'flex-start',
                }}
              >
                <Stack spacing={2.5}>
                  <OrderHistoryItems />
                </Stack>
              </Stack>
            )
          : (
            <Stack
                sx={{
                  display:'flex',
                  flexDirection:'column',
                  alignItems:'center',
                  mt: pxToRem(50)
                }}
              >
                <IconOrder fill={'#EEEEEE'} />
                <Typography variant="Kor_16_r" sx={{ color: '#C6C7CA', pt: pxToRem(20) }}> 주문 내역이 없습니다. </Typography>
              </Stack>
          )
          
          }
          </Stack>
        )}
      </Stack>
    </>
  );
});

export default Order;
