import { Box, Button, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/models';
import { Card } from '../components/Card';
import { ContentBox } from './ContentBox';
import Image from 'src/components/image';
import { ReactComponent as SlotMachine } from '../assets/images/slot-machine.svg';
import { ReactComponent as SlotMachineAfter } from '../assets/images/slot-machine-after.svg';
import { pxToRem } from 'src/theme/typography';
import { useState } from 'react';

export interface ICardGoldClassProps {}

export const CardGoldClass = observer(({}: ICardGoldClassProps) => {
  const {} = useStores();
  const [slotMachineState, setSlotMachineState] = useState(false);

  return (
    <Card>
      <Typography
        variant="Kor_22_b"
        component={'p'}
        sx={{
          textAlign: 'left',
          wordBreak: 'keep-all',
        }}
      >
        한국인 골드 클래스만 받아가는
        <br />
        황금카드
      </Typography>
      <Typography
        variant="Kor_16_r"
        component={'p'}
        sx={{
          mt: 0.5,
          color: '#9DA0A5',
          textAlign: 'left',
          wordBreak: 'keep-all',
        }}
      >
        지금까지 받아간 사람은 참가자 중에 몇 프로일까?
      </Typography>
      <ContentBox sx={{ alignContent: 'center', pl:pxToRem(58.5), pr:pxToRem(58.5) }}>
        {!slotMachineState && <SlotMachine />}

        {slotMachineState && <SlotMachineAfter />}

        {!slotMachineState && (
          <Button
            onClick={() => setSlotMachineState(true)}
            variant="outlined"
            sx={{
              width: 'fit-content',
              alignSelf: 'center',
              borderRadius: pxToRem(40),
              mt: 2,
              borderColor: '#FF7F3F',
              pl: pxToRem(40),
              pr: pxToRem(40),
              pt: pxToRem(12),
              pb: pxToRem(12),
            }}
          >
            <Typography variant="Kor_16_r" sx={{ color: '#000' }}>
              🕹️ 당기세요
            </Typography>
          </Button>
        )}

        {slotMachineState && (
          <Box>
            <Box>
              <Typography variant="Kor_16_b" component={'p'} sx={{ color: '#FF7F3F' }}>
                식욕
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
              <Typography
                variant="h1"
                component={'p'}
                sx={{ color: '#000', fontsize: pxToRem(40), lineHeight: pxToRem(40) }}
              >
                0.04
                <Typography
                  variant="Kor_24_b"
                  component={'span'}
                  sx={{ color: '#000', lineHeight: pxToRem(36), verticalAlign: 'middle' }}
                >
                  %
                </Typography>
              </Typography>
            </Box>
          </Box>
        )}
      </ContentBox>
    </Card>
  );
});
