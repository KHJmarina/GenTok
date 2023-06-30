import { Typography, Stack, Chip, Divider, Fade } from '@mui/material';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { pxToRem } from 'src/theme/typography';
import kitGuide_01 from '../../../assets/images/kitGuide_01.svg';
import kitGuide_02 from '../../../assets/images/kitGuide_02.svg';
import kitGuide_03 from '../../../assets/images/kitGuide_03.svg';
import kitGuide_04 from '../../../assets/images/kitGuide_04.svg';
import kitGuide_05 from '../../../assets/images/kitGuide_05.svg';
import kitGuide_06 from '../../../assets/images/kitGuide_06.svg';
import { ReactComponent as IcoHome } from 'src/assets/icons/ico-home.svg';
import { ReactComponent as IcoCart } from 'src/assets/icons/ico-cart.svg';
import { ReactComponent as IconBack } from 'src/assets/icons/ico-back.svg';
import Iconify from 'src/components/iconify';
import { useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import CHeader from 'src/components/CHeader';

/**
 * ## 기능 설명
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */
export const KitGuide = observer(() => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { scrollY } = useScroll();
  const [showHeader, setShowHeader] = useState(false);
  useEffect(() => {
    scrollY.on('change', (v) => {
      if (v > 70) {
        setShowHeader(true);
      } else { 
        setShowHeader(false);
      }
    });
  }, [scrollY]);
  const options: any = {
    showMainIcon: 'back',
    showHomeIcon: true,
    showCartIcon: true,
  };

  return (
    <>
      <Stack
        sx={{
          maxWidth: '100%',
        }}
      >
        <Stack sx={{ mb: pxToRem(10) }}>
        <CHeader {...options} />
          {showHeader && (
            <Fade in={showHeader} timeout={{ enter: 600, exit: 600 }}>
              <Typography
                p={0}
                sx={{
                  color: showHeader ? theme.palette.common.black : theme.palette.common.white,
                  p: pxToRem(20),
                  position: 'fixed',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  alignItems: 'center',
                  minWdith: 'md',
                  mx: 'auto',
                  zIndex: 2,
                  height: '64px',
                  fontWeight: 500,
                  fontSize: pxToRem(20),
                  lineHeight: pxToRem(24),
                }}
              >
                키트 사용법
              </Typography>
            </Fade>
          )}
        </Stack>

        <Stack
          sx={{
            px: pxToRem(30),
            pt: pxToRem(10),
            pb: pxToRem(40),
            textAlign: 'left',
            borderBottom: theme.palette.grey[500],
          }}
        >
          <Typography variant="Eng_30_r">
            집에서 1분 만에 하는 <br />
            유전자 검사
          </Typography>
          <Typography variant="Eng_18_r" sx={{ mt: pxToRem(15), color: theme.palette.grey[500] }}>
            젠톡 키트 사용법, 간단해요!
          </Typography>
        </Stack>

        <Divider sx={{ borderBottomWidth: pxToRem(1), bgcolor: theme.palette.action.hover }} />

        <Box sx={{ pt: pxToRem(40), px: pxToRem(30) }}>
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white,
              borderRadius: pxToRem(10),
              maxWidth: '100%',
              p: pxToRem(16),
              display: 'flex',
              textAlign: 'left',
              fontWeight: 600, lineHeight: 18 / 12, fontSize: pxToRem(12), letterSpacing: '-0.01em', wordBreak: 'keep-all',
            }}
          >
            <Iconify
              icon={'mdi:warning-circle-outline'}
              sx={{ width: pxToRem(20), height: pxToRem(20), mr: pxToRem(5) }}
            />
            <Box sx={{ maxWidth: '100%', wordBreak: 'keep-all', wordWrap: 'break-word' }}>
              샘플링 30분 전부터 양치 및 식사(커피 포함) 금지 <br />
              립스틱, 틴트, 립밤 지우기
            </Box>
          </Box>
        </Box>

        <Stack sx={{ py: pxToRem(5), px: pxToRem(30) }}>
          {/* 01 */}
          <Stack
            sx={{
              borderBottom: '1px dashed #eeeeee',
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              py: pxToRem(26),
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                maxWidth: '60%',
                mr: pxToRem(12),
                display: 'flex',
                order: 0,
                flexGrow: 0,
              }}
            >
              <Box sx={{ alignItems: 'flex-start' }}>
                <Typography
                  variant="Kor_18_b"
                  sx={{
                    color: theme.palette.primary.main,
                    display: 'block',
                    mr: pxToRem(8),
                  }}
                >
                  01
                </Typography>
              </Box>

              <Typography
                variant="Kor_18_b"
                sx={{
                  display: 'block',
                  textAlign: 'left',
                  wordBreak: 'keep-all',
                  wordWrap: 'break-word',
                }}
              >
                턱 아래 침샘을 <br />
                10초간 마사지 하기
              </Typography>
            </Box>
            <Box>
              <Box component={'img'} src={kitGuide_01} />
            </Box>
          </Stack>

          {/* 02 */}
          <Stack
            sx={{
              borderBottom: '1px dashed #eeeeee',
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              py: pxToRem(26),
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                maxWidth: '60%',
                mr: pxToRem(12),
                display: 'flex',
                order: 0,
                flexGrow: 0,
              }}
            >
              <Box sx={{ alignItems: 'flex-start' }}>
                <Typography
                  variant="Kor_18_b"
                  sx={{
                    color: theme.palette.primary.main,
                    display: 'block',
                    mr: pxToRem(8),
                  }}
                >
                  02
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'left' }}>
                <Typography
                  variant="Kor_18_b"
                  sx={{ display: 'block', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                >
                  빨간색 표시선까지 <br />침 담고 보존액 채우기
                </Typography>
                <Typography
                  sx={{
                    mt: pxToRem(10),
                    color: theme.palette.grey[500],
                    wordWrap: 'break-word',
                    fontWeight: 400,
                    lineHeight: 22 / 14,
                    fontSize: pxToRem(14),
                    letterSpacing: '-0.01em',
                  }}
                >
                  거품과 가래를 제외한 <br />
                  침을 담아주세요
                </Typography>
              </Box>
            </Box>
            <Box>
              <Box component={'img'} src={kitGuide_02} />
            </Box>
          </Stack>

          {/* 03 */}
          <Stack
            sx={{
              borderBottom: '1px dashed #eeeeee',
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              py: pxToRem(32),
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                maxWidth: '60%',
                mr: pxToRem(12),
                display: 'flex',
                order: 0,
                flexGrow: 0,
              }}
            >
              <Box sx={{ alignItems: 'flex-start' }}>
                <Typography
                  variant="Kor_18_b"
                  sx={{
                    color: theme.palette.primary.main,
                    display: 'block',
                    mr: pxToRem(8),
                  }}
                >
                  03
                </Typography>
              </Box>
              <Typography
                variant="Kor_18_b"
                sx={{
                  display: 'block',
                  textAlign: 'left',
                  wordBreak: 'keep-all',
                  wordWrap: 'break-word',
                }}
              >
                깔대기 제거 후 <br />
                뚜껑을 꼭 닫고 <br />
                5초간 힘차게 섞기
              </Typography>
            </Box>
            <Box>
              <Box component={'img'} src={kitGuide_03} />
            </Box>
          </Stack>

          {/* 04 */}
          <Stack
            sx={{
              borderBottom: '1px dashed #eeeeee',
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              py: pxToRem(26),
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                maxWidth: '60%',
                mr: pxToRem(12),
                display: 'flex',
                order: 0,
                flexGrow: 0,
              }}
            >
              <Box sx={{ alignItems: 'flex-start' }}>
                <Typography
                  variant="Kor_18_b"
                  sx={{
                    color: theme.palette.primary.main,
                    display: 'block',
                    mr: pxToRem(8),
                  }}
                >
                  04
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'left' }}>
                <Typography
                  variant="Kor_18_b"
                  sx={{ display: 'block', wordBreak: 'keep-all', wordWrap: 'break-word' }}
                >
                  반송용 봉투에 넣고
                  <br />
                  반송용 스티커 붙이기
                </Typography>
                <Typography
                  variant="Kor_14_r"
                  sx={{
                    mt: pxToRem(35),
                    color: theme.palette.grey[500],
                    wordBreak: 'keep-all',
                    wordWrap: 'break-word',
                  }}
                >
                  실온상태를 유지해주세요
                </Typography>
                <Stack sx={{ display: 'flex', flexDirection: 'row', mt: pxToRem(8) }}>
                  {['냉장 X', '냉동 X', '가열 X'].map((row: string, i: number) => {
                    return (
                      <Chip
                        key={`kit-chip-${i}`}
                        label={row}
                        size={'small'}
                        variant="outlined"
                        sx={{
                          py: pxToRem(2),
                          color: theme.palette.grey[500],
                          mr: pxToRem(5),
                        }}
                      />
                    );
                  })}
                </Stack>
              </Box>
            </Box>
            <Box>
              <Box component={'img'} src={kitGuide_04} />
            </Box>
          </Stack>

          {/* 05 */}
          <Stack
            sx={{
              borderBottom: '1px dashed #eeeeee',
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              py: pxToRem(28),
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                maxWidth: '60%',
                mr: pxToRem(12),
                display: 'flex',
                order: 0,
                flexGrow: 0,
              }}
            >
              <Box sx={{ alignItems: 'flex-start' }}>
                <Typography
                  variant="Kor_18_b"
                  sx={{
                    color: theme.palette.primary.main,
                    display: 'block',
                    mr: pxToRem(8),
                  }}
                >
                  05
                </Typography>
              </Box>
              <Typography
                variant="Kor_18_b"
                sx={{
                  display: 'block',
                  textAlign: 'left',
                  wordBreak: 'keep-all',
                  wordWrap: 'break-word',
                }}
              >
                젠톡 접속하여
                <br />
                키트 반송접수!
              </Typography>
            </Box>
            <Box>
              <Box component={'img'} src={kitGuide_05} />
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
});

export default KitGuide;
