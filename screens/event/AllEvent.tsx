import {
  Badge,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ReactComponent as IconArrowDown } from 'src/assets/icons/ico-arrow-down.svg';
import { ReactComponent as CheckIcon } from 'src/assets/icons/ico-check.svg';
import { ReactComponent as CloseIcon } from 'src/assets/icons/ico-close-small.svg';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image/Image';
import { IEventSnapshot } from 'src/models';
import { useStores } from 'src/models/root-store/root-store-context';
import { pxToRem } from 'src/theme/typography';
import { bgBlur } from 'src/utils/cssStyles';

type Props = {
  handleClick: Function;
  getData: VoidFunction;
  setOrderingNum: React.Dispatch<React.SetStateAction<number>>;
  slickIndex: number;
};

/**
 * ## AllEvent 설명
 *
 */
export const AllEvent = observer(({ handleClick, getData, setOrderingNum, slickIndex }: Props) => {
  const rootStore = useStores();
  const { eventStore } = rootStore;
  const theme = useTheme();
  const { REACT_APP_IMAGE_STORAGE } = process.env;

  /** 정렬기준 */
  const [orderType, setOrderType] = useState<100601 | 100602 | 100603>(100601);
  const [openOrderType, setOpenOrderType] = useState(false);

  useEffect(() => {
    eventStore.resetEvents();
    eventStore.pagination_all.setProps({ page: 1 });
    getData();
  }, [orderType]);

  return (
    <>
      {/* 정렬기준 버튼 */}
      <Box display={'flex'}>
        <Button
          variant={'text'}
          disableFocusRipple
          disableRipple
          disableTouchRipple
          endIcon={<Iconify width={14} icon={'ep:arrow-down'} />}
          sx={{
            // fontVariant: 'Kor_12_r',
            p: 0,
            ml: pxToRem(13),
            fontWeight: 400,
            fontSize: pxToRem(12),
            color: theme.palette.common.black,
            '&:hover': {
              background: 'none',
            },
          }}
          onClick={() => {
            setOpenOrderType(true);
          }}
        >
          {orderType === 100601 ? '최신순' : orderType === 100602 ? '마감순' : '인기순'}
        </Button>
      </Box>

      {/* 전체 이벤트 목록 */}
      <List>
        {
        slickIndex === 0 &&
          eventStore.events.map((event: IEventSnapshot) => {
            return (
              <ListItem
                key={`allevent_li-${event.eventSid}`}
                sx={{
                  flexDirection: 'column',
                  p: 0,
                  px: pxToRem(20),
                  width: '100%',
                  wordBreak: 'keep-all',
                }}
              >
                <Button
                  variant="text"
                  disableRipple
                  disableFocusRipple
                  disableTouchRipple
                  onClick={() => {
                    handleClick(event);
                  }}
                  sx={{
                    display: 'flex',
                    width: '100%',
                    p: 0,
                    py: pxToRem(18),
                    borderRadius: 0,
                    color: 'inherit',
                    textAlign: 'left',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      background: 'none',
                    },
                  }}
                >
                  <Stack direction={'row'} width={'100%'}>
                    <Badge
                      color={'primary'}
                      overlap="rectangular"
                      badgeContent={`D-${moment
                        .duration(moment(event.applyEdDay).diff(moment().format('YYYY-MM-DD')))
                        .asDays()}`}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      sx={{
                        '& .MuiBadge-badge': {
                          mt: pxToRem(13),
                          ml: pxToRem(23),
                          width: pxToRem(36),
                          height: pxToRem(16),
                          fontSize: pxToRem(10),
                        },
                      }}
                      invisible={
                        moment
                          .duration(moment(event.applyEdDay).diff(moment().format('YYYY-MM-DD')))
                          .asDays() > 5
                          ? true
                          : moment
                              .duration(
                                moment(event.applyEdDay).diff(moment().format('YYYY-MM-DD')),
                              )
                              .asDays() < 0
                          ? true
                          : false
                      }
                    >
                      <Box
                        minWidth={pxToRem(100)}
                        borderRadius={pxToRem(10)}
                        mr={pxToRem(16)}
                        position={'relative'}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                      >
                        <Image
                          ratio="1/1"
                          disabledEffect
                          src={
                            event.thumbnlPath
                              ? REACT_APP_IMAGE_STORAGE + event.thumbnlPath
                              : '/assets/placeholder.svg'
                          }
                          onError={(e: any) => {
                            e.target.src = '/assets/placeholder.svg';
                          }}
                          sx={{ borderRadius: pxToRem(10) }}
                        />
                        {moment(event.applyEdDay) < moment() && (
                          <Box
                            width={'100%'}
                            height={'100%'}
                            borderRadius={pxToRem(10)}
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            sx={{
                              position: 'absolute',
                              ...bgBlur({ blur: 1, color: theme.palette.background.default }),
                            }}
                          >
                            {/* <Image
                              src="https://png.pngtree.com/png-clipart/20221223/big/pngtree-stylish-ripped-torn-paper-texture-background-transparent-png-image_8797584.png"
                              sx={{ position: 'absolute', top: '30%' }}
                            /> */}
                            <Typography align="center" variant="body2">
                              지난 이벤트
                            </Typography>
                          </Box>
                        )}
                        {moment(event.applyStDay) > moment() && (
                          <Box
                            width={'100%'}
                            height={'100%'}
                            borderRadius={pxToRem(10)}
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            sx={{
                              position: 'absolute',
                              ...bgBlur({ blur: 1, color: theme.palette.background.default }),
                            }}
                          >
                            {/* <Image
                              src="https://png.pngtree.com/png-clipart/20221223/big/pngtree-stylish-ripped-torn-paper-texture-background-transparent-png-image_8797584.png"
                              sx={{ position: 'absolute', top: '30%' }}
                            /> */}
                            <Typography align="center" variant="body2">
                              다가오는 이벤트
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Badge>

                    <Stack gap={pxToRem(4)}>
                      <Typography variant="Kor_16_b" sx={{ wordBreak: 'keep-all' }}>
                        {event.eventNm}
                      </Typography>
                      <Typography variant="Kor_12_r" color={theme.palette.grey[500]}>
                        {moment(event.applyStDay).format('YYYY.MM.DD')}~
                        {moment(event.applyEdDay).format('YYYY.MM.DD')}
                      </Typography>
                    </Stack>
                  </Stack>
                </Button>
              </ListItem>
              // <Divider
              //   key={`allevent_divider-${event.eventSid}`}
              //   variant="middle"
              //   sx={{
              //     borderWidth: 1,
              //   }}
              // />
            );
          })}
      </List>

      {eventStore.events.length < 1 ? (
        <Typography
          variant="Kor_16_r"
          component={'h5'}
          color={theme.palette.grey[500]}
          mt={`${pxToRem(40)} !important`}
        >
          아직 등록된 이벤트가 없습니다.
        </Typography>
      ) : (
        <></>
      )}

      {/* 더보기 버튼 */}
      {eventStore.events.length > 0 && eventStore.pagination_all.totalElements > 0 && (
        <Button
          variant={'text'}
          sx={{
            p: 0,
            mb: pxToRem(80),
            color: theme.palette.common.black,
            fontWeight: 400,
            fontSize: pxToRem(14),
            '&.Mui-disabled': {
              fontSize: pxToRem(14),
              fontWeight: 400,
              background: '#FFFFFF',
              color: '#999999',
            },
          }}
          disabled={eventStore.pagination_all.totalElements - 1 < eventStore.events.length}
          onClick={() => {
            eventStore.pagination_all.setProps({
              page: eventStore.pagination_all.page + 1,
            });
            getData();
          }}
        >
          {eventStore.pagination_all.totalElements < 1 ? (
            '등록된 이벤트가 없습니다.'
          ) : eventStore.pagination_all.totalElements - 1 < eventStore.events.length ? (
            '더이상 불러올 이벤트가 없습니다.'
          ) : (
            <>
              더보기
              {/* <IconArrowDown color={theme.palette.common.black} /> */}
              <Iconify width={pxToRem(12)} ml={pxToRem(6)} icon={'simple-line-icons:arrow-down'} />
            </>
          )}
        </Button>
      )}

      {/* 정렬기준 */}
      <Drawer
        open={openOrderType}
        onClose={() => {
          setOpenOrderType(false);
        }}
        PaperProps={{
          sx: {
            pb: 3,
            width: '100%',
            borderRadius: pxToRem(25),
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            maxWidth: 'md',
            marginX: 'auto',
          },
        }}
        anchor={'bottom'}
      >
        <Stack spacing={pxToRem(20)} sx={{ p: pxToRem(26) }}>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            sx={{ cursor: 'pointer' }}
          >
            <Typography
              variant={'Kor_18_b'}
              // sx={{ textAlign: 'left', color: '#000000', fontWeight: 700 }}
            >
              정렬 기준 선택
            </Typography>
            <CloseIcon
              fill={theme.palette.common.black}
              onClick={() => {
                setOpenOrderType(false);
              }}
            />
          </Stack>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              setOrderType(100601);
              setOrderingNum(100601);
              setOpenOrderType(false);
            }}
          >
            <Typography
              variant={'Kor_16_r'}
              sx={{
                textAlign: 'left',
                ...(orderType === 100601
                  ? { color: theme.palette.secondary.light }
                  : { color: theme.palette.common.black }),
              }}
            >
              최신순
            </Typography>
            <CheckIcon
              fill={
                orderType === 100601 ? theme.palette.secondary.light : theme.palette.common.white
              }
            />
          </Stack>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              setOrderType(100602);
              setOrderingNum(100602);
              setOpenOrderType(false);
            }}
          >
            <Typography
              variant={'Kor_16_r'}
              sx={{
                textAlign: 'left',
                ...(orderType === 100602
                  ? { color: theme.palette.secondary.light }
                  : { color: theme.palette.common.black }),
              }}
            >
              마감순
            </Typography>
            <CheckIcon
              fill={
                orderType === 100602 ? theme.palette.secondary.light : theme.palette.common.white
              }
            />
          </Stack>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              setOrderType(100603);
              setOrderingNum(100603);
              setOpenOrderType(false);
            }}
          >
            <Typography
              variant={'Kor_16_r'}
              sx={{
                textAlign: 'left',
                ...(orderType === 100603
                  ? { color: theme.palette.secondary.light }
                  : { color: theme.palette.common.black }),
              }}
            >
              인기순
            </Typography>
            <CheckIcon
              fill={
                orderType === 100603 ? theme.palette.secondary.light : theme.palette.common.white
              }
            />
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
});

export default AllEvent;
