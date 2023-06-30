import { Box, Grid } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { HEADER } from 'src/config-global';
import { ICodeItemModel, useStores } from 'src/models';
import { PackageItem } from './PackageItem';
import { IToolbarProps, Toolbar } from './Toolbar';
import { useEffect, useLayoutEffect, useState } from 'react';
import { TGoodsOrderTypeCd } from 'src/services/market';

export interface IPackageListProps {}

export const PackageList = observer(({}: IPackageListProps) => {
  const rootStore = useStores();
  const { marketStore } = rootStore;
  // const [sortMethods, setSortMethods] = useState<ICodeItemModel[] | undefined>([]);

  useLayoutEffect(() => {
    marketStore?.goodsStore.setMode('package');
    marketStore?.goodsStore.search({ category: 0, page: 1 });
  }, [marketStore?.goodsStore]);

  // useEffect(() => {
  //   if (rootStore.getCodeList) {
  //     setSortMethods(rootStore.getCodeList('GOODS_ORDER_TYPE_CD'));
  //   }
  // }, [rootStore, rootStore.codeListStore.list.length]);

  const handleOnClick = () => {
    console.log('handleOnClick');
  };

  const handleChangeSortMethod = (code: TGoodsOrderTypeCd) => {
    marketStore.goodsStore.search({ category: 0, page: 1, sortBy: code });
  };

  const toolbarProps: IToolbarProps = {
    numberOfGoods: marketStore?.goodsStore?.pagination.totalElements,
    // sortMethods,
    sortBy: marketStore?.goodsStore?.sortBy,
    onChangeSortBy: handleChangeSortMethod,
  };

  return (
    <Box sx={{ p: 2.5, pt: 0 }}>
      <Toolbar {...toolbarProps} />
      <Box sx={{ flexGrow: 1, pt: 1.5, pb: `${HEADER.H_MOBILE * 2}px` }}>
        <Grid container spacing={1} columns={12}>
          {marketStore?.goodsStore?.list.map((data) => {
            return <PackageItem key={data.goodsSid} data={data} onClick={handleOnClick} />;
          })}
        </Grid>
      </Box>
    </Box>
  );
});
