import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import React from 'react';
import {
  Badge,
  Button,
  Checkbox,
  Divider,
  List,
  ListItem,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import moment from 'moment';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image/Image';
import { bgBlur } from '../../utils/cssStyles';
import { IEventSnapshot } from 'src/models';
import { ReactComponent as IconArrowDown } from 'src/assets/icons/ico-arrow-down.svg';
import { pxToRem } from 'src/theme/typography';

type Props = {
  handleClick: Function;
  getData: VoidFunction;
  setFilter: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  slickIndex: number;
};

/**
 * ## MyEvent 설명
 *
 */
export const MyEvent = observer(({ handleClick, getData, setFilter, slickIndex }: Props) => {
  const rootStore = useStores();
  const { eventStore } = rootStore;
  const theme = useTheme();

  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const [check, setCheck] = useState(false);

  useEffect(() => {
    setFilter(check === true ? true : undefined);
  }, [check]);

  const contentRef = useRef<any>(null);

  return (
    <>
      {/* 전체건수 및 당첨이벤트 필터링 버튼 */}
      <Stack
        direction={'row'}
        mx={pxToRem(20)}
        justifyContent={'space-between'}
        alignItems={'center'}
        sx={{
          position: 'sticky',
          top: 0,
          backgroundColor: theme.palette.common.white,
          ...bgBlur({ color: theme.palette.background.default }),
          zIndex: 100,
        }}
      >
        {/* 총 건수 */}
        <Stack direction={'row'}>
          <Typography variant="Kor_12_r">총 </Typography>
          <Typography variant="Kor_12_r" color={theme.palette.secondary.light}>
            {eventStore.myEvents.length}
          </Typography>
          <Typography variant="Kor_12_r">건</Typography>
        </Stack>

        {/* 당첨이벤트 필터링 */}
        <Stack direction={'row'} alignContent={'center'} alignItems={'center'}>
          <Checkbox
            name="winYn"
            disableRipple
            disableFocusRipple
            disableTouchRipple
            sx={{
              p: 0,
            }}
            icon={
              <Iconify
                icon={'material-symbols:check-small-rounded'}
                color={theme.palette.grey[400]}
              />
            }
            checkedIcon={
              <Iconify
                icon={'material-symbols:check-small-rounded'}
                color={theme.palette.secondary.light}
              />
            }
            checked={!!check}
            onClick={(e: any) => {
              if (e.nativeEvent.target.checked !== undefined) {
                setCheck(e.nativeEvent.target.checked);
              }
            }}
          />

          <Button
            variant={'text'}
            disableRipple
            disableFocusRipple
            disableTouchRipple
            onClick={() => {
              setCheck(!check);
            }}
            sx={{
              p: 0,
              color: 'inherit',
              fontWeight: 400,
              fontSize: pxToRem(12),
              '&:hover': {
                background: 'none',
              },
            }}
          >
            당첨 이벤트 보기
          </Button>
        </Stack>
      </Stack>

      {/* my event 목록 */}
      <List>
        {slickIndex === 1 &&
          eventStore.myEvents.map((event: IEventSnapshot) => {
            return (
              <ListItem
                key={`myevent_li-${event.eventSid}`}
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
                      <Box minWidth={pxToRem(100)} borderRadius={pxToRem(10)} mr={pxToRem(16)}>
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
              //   key={`myevent_divider-${event.eventSid}`}
              //   variant="middle"
              //   sx={{
              //     borderWidth: 1,
              //   }}
              // />
            );
          })}
      </List>

      {eventStore.myEvents.length < 1 ? (
        check === true ? (
          <Typography
            variant="Kor_16_r"
            component={'h5'}
            color={theme.palette.grey[500]}
            mt={`${pxToRem(40)} !important`}
          >
            아직 당첨된 이벤트가 없습니다.
          </Typography>
        ) : (
          <Typography
            variant="Kor_16_r"
            component={'h5'}
            color={theme.palette.grey[500]}
            mt={`${pxToRem(40)} !important`}
          >
            아직 참여한 이벤트가 없습니다.
          </Typography>
        )
      ) : (
        <></>
      )}

      {/* 더보기 버튼 */}
      {eventStore.events.length > 0 && eventStore.pagination_my.totalElements > 0 && (
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
          disabled={eventStore.pagination_my.totalElements - 1 < eventStore.events.length}
          onClick={() => {
            eventStore.pagination_my.setProps({
              page: eventStore.pagination_my.page + 1,
            });
            getData();
          }}
        >
          {eventStore.pagination_my.totalElements - 1 < eventStore.events.length ? (
            '더이상 불러올 이벤트가 없습니다.'
          ) : (
            <>
              더보기
              {/* <IconArrowDown /> */}
              <Iconify width={pxToRem(12)} ml={pxToRem(6)} icon={'simple-line-icons:arrow-down'} />
            </>
          )}
        </Button>
      )}
    </>
  );
});

export default MyEvent;
