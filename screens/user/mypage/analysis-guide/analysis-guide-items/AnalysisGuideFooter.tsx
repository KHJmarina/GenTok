import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { Stack, Typography, Divider, List, ListItem } from '@mui/material';
import { pxToRem } from 'src/theme/typography';

/**
 * ## AnalysisGuideFooter 설명
 *
 */
export const AnalysisGuideFooter = observer(() => {
  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();

  return (
    <>
      <Stack sx={{ pl: pxToRem(20), textAlign: 'left', backgroundColor: '#FAFAFA' }}>
        <List sx={{ listStyleType:'disc', px:pxToRem(20), my: pxToRem(40), py:0 }}>
          <ListItem sx= {{ display: 'list-item', px: 0}}>
            <Typography variant="Kor_14_r">본 검사는 보험비등재 조제시약 검사(검사실 자체 개발 검사)입니다.</Typography>
          </ListItem>
          <ListItem  sx= {{ display: 'list-item', px: 0}}>
            <Typography variant="Kor_14_r">본 검사는 마이크로어레이 기술에 기반하고 있으며, 검사항목에 필요한 유전자형은 내외부정도관리(표준물질)를 통해 실험정확도(예: GG 유전형을 GG 로 분석)를 검증 하고 있습니다.</Typography>
          </ListItem>
          <ListItem  sx= {{ display: 'list-item', px: 0}}>
            <Typography variant="Kor_14_r">본 검사 결과는 질병의 진단 및 치료의 목적으로 사용될 수 없으며, 의학적인 소견이 필요한 경우 의사와 상담하시기 바랍니다.</Typography>
          </ListItem>
        </List>
      </Stack>
    </>
  );
});

export default AnalysisGuideFooter;
