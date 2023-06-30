import { Stack, Typography, Drawer, Button, alpha } from '@mui/material';
import { observer } from "mobx-react-lite";
import { useState } from 'react';
import { useTheme } from '@mui/material';
import Iconify from 'src/components/iconify';
import { ReactComponent as CheckIcon } from 'src/assets/icons/ico-check.svg';
import { ReactComponent as CloseIcon } from 'src/assets/icons/ico-close-small.svg';
import { HEADER } from 'src/config-global';
import { pxToRem } from 'src/theme/typography';
import AllDnaResult from './dna-result-item/AllDnaResult';
import MyDnaResult from './dna-result-item/MyDnaResult';
import EmptyMyDnaResult from './dna-result-item/EmptyMyDnaResult';
import { IDnaResultCard } from 'src/models';

/**
 * ## DnaList 설명
 *
 */

interface Props {
  myResultList: IDnaResultCard[];
  allResultList: IDnaResultCard[];
  params: any;
}

const filterCode = [
  {
    code: '',
    value: '기본순',
  },
  {
    code: '100603',
    value: '카드 랭킹순',
  },
];

export const DnaList = observer(({ myResultList, allResultList, params }: Props) => {
  const theme = useTheme();
  const [openFilter, setOpenFilter] = useState(false);
  const filter = filterCode.find((filter) => filter.code === params.code);
  const value = filter?.value;

  return (
    <Stack>
      <Stack 
        sx={{
          position: 'sticky',
          top: `${HEADER.H_MOBILE}px`,
          width: '100%',
          height: '100%',
          zIndex: 101,
          background: '#FFFFFF',
        }}
      >
        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ mb: pxToRem(8) }}>
          <Button
            variant={'text'}
            disableFocusRipple
            disableRipple
            disableTouchRipple
            endIcon={<Iconify width={pxToRem(20)} icon={'ep:arrow-down'} />}
            sx={{ 
              fontSize: pxToRem(12), 
              color: alpha(theme.palette.common.black, .7),
              '&:hover': { background: 'none' },
              ml: pxToRem(16)
            }}
            onClick={() => {
              setOpenFilter(true);
            }}
          >
            {value}
          </Button>

          <Button
            sx={{
              fontWeight: 600,
              fontSize: pxToRem(12),
              color: params.onlyMine ? '#202123' : '#C6C7CA',
              mr: pxToRem(16),
              '&:hover': {background: 'none'},
            }}
            onClick={
              ()=>{
                params.handleFilterChange(!params.onlyMine, params.code);
              }
            }
          >
            <CheckIcon fill={params.onlyMine ? theme.palette.primary.main : '#C6C7CA'} />
            결과카드만 보기
          </Button>
        </Stack>
      </Stack>

      {params.onlyMine // 내 결과만 보기
        ? (myResultList.length === 0 // 내 결과가 없는 경우
            ? <EmptyMyDnaResult />
            : <MyDnaResult myResultList={myResultList}/>
        )
        : <AllDnaResult allResultList={allResultList}/>
      }

      <Drawer
        open={openFilter}
        onClose={() => { setOpenFilter(false) }}
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
          <Stack direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            sx={{ cursor: 'pointer', mb: pxToRem(20) }}
          >
            <Typography sx={{ fontSize: pxToRem(20), fontWeight: 500, lineHeight: pxToRem(23.87), textAlign: 'left' }}>
              정렬 기준 선택
            </Typography>
            <CloseIcon fill={theme.palette.common.black} onClick={() => { setOpenFilter(false); }} />
          </Stack>
          {filterCode.map((f) => {
            return (
              <Stack key={`type-filter-${f.code}`} direction={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
                sx={{ cursor: 'pointer', mt: '0px !important', mb: `${pxToRem(20)} !important` }}
                onClick={() => {
                  setOpenFilter(false);
                  params.handleFilterChange(params.onlyMine, f.code);
                }}
              >
                <Typography variant={'Kor_16_r'} sx={{ textAlign: 'left', color: params.code === f.code ? '#008FF8' : '#202123' }}>
                  {f.value}
                </Typography>
                <CheckIcon fill={params.code === f.code ? theme.palette.secondary.main : theme.palette.grey[300]} />
              </Stack>
            )
          })}
        </Stack>
      </Drawer>
    </Stack>
  );
});
export default DnaList;