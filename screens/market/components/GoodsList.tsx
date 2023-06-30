import { Box, Grid } from '@mui/material';
import { useScroll } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthContext } from 'src/auth/useAuthContext';
import CAlert from 'src/components/CAlert';
import { HEADER } from 'src/config-global';
import { useConsole } from 'src/hooks/useConsole';
import { ICodeItemModel, useStores } from 'src/models';
import { IGoodsModel } from 'src/models/market-store/Goods';
import { TGoodsOrderTypeCd } from 'src/services/market';
import { pxToRem } from 'src/theme/typography';
import { GoodsListFooter } from './GoodsListFooter';
import { GoodsListItem } from './GoodsListItem';
import { IToolbarProps, Toolbar } from './Toolbar';
import useCodes from 'src/hooks/useCodes';

export interface IGoodsListProps {
  category?: string;
}

export const GoodsList = observer(({ category }: IGoodsListProps) => {
  const navigate = useNavigate();

  const rootStore = useStores();
  const { marketStore } = rootStore;

  // const [sortMethods, setSortMethods] = useState<ICodeItemModel[] | undefined>([]);
  const [currentCategory, setCurrentCategory] = useState<number>(parseInt(category || '0'));

  // useEffect(() => {
    // const [codes] = useCodes('GOODS_ORDER_TYPE_CD');
    // setSortMethods(codes);
    // if (rootStore.getCodeList) {
    // setSortMethods(rootStore.getCodeList('GOODS_ORDER_TYPE_CD'));
    // }
  // }, [rootStore, rootStore.codeListStore?.list.length]);

  const { scrollYProgress } = useScroll();
  useEffect(() => {
    scrollYProgress.on('change', (v) => {
      if (v < 0) {
        marketStore?.goodsStore?.previous();
      }
      if (v > 0.9) {
        marketStore?.goodsStore?.next?.();
      }
    });
  }, [marketStore?.goodsStore, scrollYProgress]);

  const [data, setData] = useState<IGoodsModel[]>([]);

  useEffect(() => {
    setCurrentCategory(parseInt(category || '0'));
  }, [category]);

  useEffect(() => {
    marketStore?.goodsStore.setMode('goods');
    marketStore?.goodsStore.search({ category: currentCategory, page: 1 });
  }, [currentCategory, marketStore?.goodsStore]);

  const [listType, setListType] = useState<'grid' | 'list'>('grid');
  const handleChangeListType = useCallback((type: 'grid' | 'list') => {
    setListType(type);
  }, []);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertContent, setAlertContent] = useState('');
  const [alertHasCancelButton, setAlertHasCancelButton] = useState(false);

  const { isAuthenticated } = useAuthContext();
  const handleOnToggleCart = useCallback(
    (data: IGoodsModel) => {
      if (data.saleStateCd?.code !== 200102) {
        setAlertMessage('판매중인 상품이 아닙니다.');
        setAlertOpen(true);
        return;
      }
      // 로그인 여부 체크
      if (!isAuthenticated) {
        setAlertMessage('로그인 후 이용해주세요.');
        setAlertContent('로그인 페이지로 이동하시겠습니까?');
        setAlertOpen(true);
        setAlertHasCancelButton(true);
        return;
      }
      if (data.purchaseYn) {
        setAlertMessage('이미 구매한 상품입니다.');
        setAlertOpen(true);
        return;
      }
      marketStore?.toggleGoodsToCart(data);
    },
    [isAuthenticated, marketStore],
  );

  /**
   * 상품 상세 보기를 위한 상품 선택
   */
  const handleOnClick = useCallback(
    (data: IGoodsModel) => {
      navigate(`/market/goods/${data.goodsSid!}`);
    },
    [navigate],
  );

  /**
   * 상품을 장바구니에 담거나 장바구니에서 제거
   */
  const handleOnToggle = (data: IGoodsModel) => {
    data.toggle();
  };

  const handleChangeSortMethod = (code: TGoodsOrderTypeCd) => {
    marketStore.goodsStore.search({ category: currentCategory, page: 1, sortBy: code });
  };

  const toolbarProps: IToolbarProps = {
    numberOfGoods: marketStore?.goodsStore?.pagination.totalElements,
    // sortMethods: useCodes('GOODS_ORDER_TYPE_CD')[0],
    sortBy: marketStore?.goodsStore?.sortBy,
    listType,
    onChangeListType: handleChangeListType,
    onChangeSortBy: handleChangeSortMethod,
    selectedGoods: marketStore?.goodsStore?.selectedGoods,
    isSelectedAll: marketStore?.goodsStore?.isSelectedAll,
    toggleSelectAllGoods: marketStore?.goodsStore?.toggleSelectAllGoods,
  };

  useEffect(() => {
    if (marketStore) {
      setData(marketStore.goodsStore.list);
    }
  }, [marketStore]);
  /**
   * 바탕색
   *
   * 영양소: #fff8e1
   * 운동: #e1f2fe
   * 피부/모발: #fff1ef
   * 식습관: #e9f7ef
   * 개인특성: #ebf0ff
   * 건강관리 : #ebeafe
   */

  return (
    <Box sx={{ p: 2.5, pt: 0 }}>
      <Toolbar {...toolbarProps} />
      <Box
        sx={{
          flexGrow: 1,
          paddingTop: pxToRem(12),
          pb: `${HEADER.H_MOBILE * 2}px`,
        }}
      >
        <Grid container spacing={1} columns={12}>
          {data.map((item, index) => (
            <GoodsListItem
              key={index}
              data={item}
              listType={listType}
              onClick={handleOnClick}
              onToggle={handleOnToggle}
              toggleCart={handleOnToggleCart}
            />
          ))}
        </Grid>
      </Box>

      <CAlert
        isAlertOpen={alertOpen}
        alertCategory={'f2d'}
        alertTitle={alertMessage}
        alertContent={alertContent}
        hasCancelButton={alertHasCancelButton}
        handleAlertClose={() => {
          setAlertOpen(false);
        }}
        callBack={() => navigate('/login')}
      ></CAlert>

      <GoodsListFooter />
    </Box>
  );
});
