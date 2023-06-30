import {
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ICodeItemModel, ICodeItemModelSnapshot } from 'src/models';
import { IGoodsModel } from 'src/models/market-store/Goods';
import { TGoodsOrderTypeCd } from 'src/services/market';
import { pxToRem } from 'src/theme/typography';
import { ReactComponent as CheckIcon } from '../../../assets/icons/ico-check.svg';
import { ReactComponent as CloseIcon } from '../../../assets/icons/ico-close.svg';
import { IconGoodsListCheck } from '../assets/icons/IconGoodsListCheck';
import { IconGoodsSortMethod } from '../assets/icons/IconGoodsSortMethod';
import useCodes from 'src/hooks/useCodes';

export interface IToolbarProps {
  numberOfGoods?: number;
  // sortMethods?: ICodeItemModel[] | ICodeItemModelSnapshot[];
  listType?: 'grid' | 'list';
  onChangeListType?: (type: 'grid' | 'list') => void;
  sortBy?: 230002 | 230003 | 230004 | 230001;
  onChangeSortBy?: (method: TGoodsOrderTypeCd) => void;
  /**
   * 선택된 상품 SID 목록
   */
  selectedGoods?: IGoodsModel[];
  isSelectedAll?: boolean;

  /**
   * 전체 선택/해제
   * @returns never
   */
  toggleSelectAllGoods?: () => void;
}

export const Toolbar = ({
  numberOfGoods = 0,
  // sortMethods = [],
  sortBy,
  // listType = 'grid',
  onChangeListType,
  onChangeSortBy,
  selectedGoods = [],
  isSelectedAll = false,
  toggleSelectAllGoods,
}: IToolbarProps) => {
  const [sortMethods] = useCodes('GOODS_ORDER_TYPE_CD');
  const [currentSortBy, setCurrentSortBy] = React.useState<ICodeItemModelSnapshot>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setCurrentSortBy((s) => sortMethods.find((sm) => sm.code === sortBy) || sortMethods[0]);
  }, [sortBy, sortMethods]);

  const onClickSort = () => {
    setOpen(true);
  };

  const onChangeSort = (method: typeof sortMethods[number]) => {
    setCurrentSortBy(method);
    setOpen(false);
    onChangeSortBy?.(method.code as TGoodsOrderTypeCd);
  };

  const onSelectList = () => {
    onChangeListType?.('list');
  };

  const onSelectGrid = () => {
    onChangeListType?.('grid');
  };

  return (
    <>
      <Box sx={styles.root}>
        <Box sx={styles.buttonGroup} onClick={toggleSelectAllGoods}>
          <IconButton id="btn-market-toolbar__toggle-select-all-goods" sx={{ p: 0 }}>
            <IconGoodsListCheck checked={isSelectedAll} />
          </IconButton>
          <Typography variant="Kor_12_r" color={'#202123'}>
            전체선택
            <span style={{ color: '#9DA0A5', paddingLeft: '4px' }}>
              ({selectedGoods.length}/{numberOfGoods})
            </span>
          </Typography>
          {/* 
          <IconGoodsListShowList active={listType === 'list'} onClick={onSelectList} />
          <IconGoodsListShowGrid active={listType === 'grid'} onClick={onSelectGrid} /> 
          */}
        </Box>
        <Button
          id="btn-market-toolbar__open-sort-methods-drawer"
          sx={styles.sortButton}
          onClick={onClickSort}
        >
          <Typography variant="caption" sx={styles.sortButton.label}>
            {currentSortBy?.value}
          </Typography>
          <IconGoodsSortMethod />
        </Button>
      </Box>

      <Drawer
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        PaperProps={{
          sx: {
            pb: 3,
            width: '100%',
            borderRadius: 3,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
        anchor={'bottom'}
      >
        <Stack spacing={2} sx={{ p: 4, pb: 2 }}>
          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{}}>
            <Typography
              variant={'h6'}
              sx={{ textAlign: 'left', color: '#000000', fontWeight: 700 }}
            >
              정렬 기준 선택
            </Typography>
            <CloseIcon
              stroke={'#000000'}
              onClick={() => {
                setOpen(false);
              }}
            />
          </Stack>
        </Stack>
        <List sx={{ width: '100%', p: 0, pb: 2 }}>
          {sortMethods.map((value) => (
            <ListItem
              key={value.code}
              disableGutters={false}
              secondaryAction={
                <Box aria-label="checked sort method" sx={{ pr: 1.5 }}>
                  {currentSortBy === value && <CheckIcon fill={'#008FF8'} />}
                </Box>
              }
              sx={{ pt: 0, pb: 0, pl: 2, pr: 6 }}
            >
              <ListItemButton
                id={`btn-market-toolbar__select-sort-method-item-${value.value}`}
                onClick={() => {
                  onChangeSort(value);
                }}
              >
                <ListItemText
                  primary={`${value.value}`}
                  sx={{ color: currentSortBy === value ? '#008FF8' : '#000000' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

const styles = {
  root: { display: 'flex', justifyContent: 'space-between', padding: 0 },

  sortButton: {
    display: 'flex',
    alignItems: 'center',
    padding: 0,
    gap: pxToRem(0),
    label: { color: '#000000', fontSize: pxToRem(12), lineHeight: pxToRem(18), fontWeight: 400 },
  },

  buttonGroup: {
    display: 'flex',
    gap: 0.5,
    alignItems: 'center',
  },
};
