import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useTheme, IconButton, Typography, Stack, Badge } from '@mui/material';
import { CustomerHeader } from 'src/components/CustomerHeader';
import { CallApiToStore } from 'src/utils/common';
import { ICustomerAlarm, ICustomerAlarmSnapshot } from 'src/models';
import { HEADER } from 'src/config-global';
import Iconify from 'src/components/iconify/Iconify';
import CAlert from 'src/components/CAlert';
import moment from 'moment';
import { toJS } from 'mobx';
import { pxToRem } from 'src/theme/typography';
import BackHeader from 'src/components/BackHeader';
import CHeader from 'src/components/CHeader';

/**
 * ## Alarm 설명
 *
 */
type Props = {
  handleClose: VoidFunction;
};

export const Alarm = observer(({ handleClose }: Props) => {
  const rootStore = useStores();
  const { customerAlarmStore, loadingStore, responseStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();

  const [click, setClick] = useState(false);
  const [edit, setEdit] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [deleteSid, setDeleteSid] = useState(0);
  const [checkYn, setCheckYn] = useState(false);
  const getData = async () => {
    CallApiToStore(customerAlarmStore.gets(), 'api', loadingStore).then(() => {
      console.log(toJS(customerAlarmStore.customerAlarms));
    });
  };

  const check = async () => {
    await CallApiToStore(customerAlarmStore.put(), 'api', loadingStore);
  };

  const deleteData = async () => {
    if (deleteSid > 0) {
      CallApiToStore(customerAlarmStore.delete(deleteSid), 'api', loadingStore)
        .then(() => {
          getData();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  useEffect(() => {
    getData();
    check();
    // return () => {
    //   check();
    // };
  }, []);

  const options: any = {
    showMainIcon: 'back',
    handleMainIcon: () => {
      navigate(-1);
      check();
    },
    showEditIcon: customerAlarmStore.customerAlarms.length < 1 ? false : true, // '<' 로 수정해야함
    changeEditIcon: edit === true ? '적용' : '편집',
    handleEdit: () => {
      edit === true ? setEdit(false) : setEdit(true);
      check();
    },
  };

  return (
    <>
      <CHeader title="알림" {...options} />
      <Box
        sx={{
          backgroundColor: theme.palette.grey[100],
          color: theme.palette.grey[500],
          px: pxToRem(20),
          py: pxToRem(12),
          textAlign: 'left',
          fontWeight: 400,
          lineHeight: 18 / 14,
          fontSize: pxToRem(14),
          letterSpacing: '-0.03em',
        }}
      >
        <IconButton sx={{ color: theme.palette.grey[500], p: 0, mr: pxToRem(5) }}>
          <Iconify
            icon={'mdi:warning-circle-outline'}
            sx={{ width: pxToRem(16), height: pxToRem(16) }}
          />
        </IconButton>
        받은 알림은 30일 동안 보관됩니다.
      </Box>
      {customerAlarmStore.customerAlarms.length < 1 ? (
        <Typography
          variant={'body1'}
          color={theme.palette.grey[500]}
          sx={{
            position: 'absolute',
            top: '30vh',
            left: '50vw',
            transform: 'translate(-50%, 0)',
          }}
        >
          알림 내역이 없습니다.
        </Typography>
      ) : (
        <Stack
          spacing={2}
          sx={{
            flex: 1,
            pb: `${HEADER.H_MOBILE * 2}px`,
            overflowY: 'auto',
            scrollMarginTop: '100px',
            px: 3,
            py: {
              md: 2,
            },
            borderBottom: 0,
            overflowX: 'scroll',
            background: '#FFFFFF',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {customerAlarmStore.customerAlarms.map((alarms: ICustomerAlarm, i: number) => {
              // // 30일 지난 경우 삭제
              // if (alarms.date)
              //   if (moment().diff(alarms.date, 'day') > 30) {
              //     deleteData();
              //   } else
              return (
                <Stack
                  key={`alarm` + i}
                  sx={{
                    textAlign: 'left',
                    pt: 3,
                    py: 2,
                  }}
                >
                  <Typography variant={'body2'} sx={{ borderBottom: '1px solid #f5f5f5', mb: 1 }}>
                    {alarms.date}
                  </Typography>
                  {alarms.notifList.map((list: any, i: number) => {
                    return (
                      <Stack
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: 3,
                          py: 1.5,
                          justifyContent: 'space-between',
                        }}
                        key={`alarmStack` + i}
                      >
                        <Box sx={{ display: 'flex' }}>
                          <Badge
                            color="warning"
                            variant="dot"
                            invisible={list.checkYn}
                            sx={{
                              '& .MuiBadge-badge': {
                                minHeight: 4,
                                minWidth: 4,
                                height: 4,
                                width: 4,
                              },
                            }}
                          >
                            <Box>
                              <IconButton
                                sx={{
                                  p: 0.8,
                                  backgroundColor: theme.palette.grey[100],
                                  borderRadius: 5,
                                  fontSize: 15,
                                }}
                              >
                                <Icon icon="fluent:megaphone-loud-16-regular" />
                              </IconButton>
                            </Box>
                          </Badge>

                          <Typography variant={'body1'} sx={{ ml: 2, mr: 1 }}>
                            {list.notifConts}
                          </Typography>
                        </Box>

                        <IconButton
                          onClick={() => {
                            setDeleteSid(list.notifSid);
                            setAlertOpen(true);
                          }}
                          sx={{
                            m: 0,
                            p: 0,
                            fontSize: 20,
                            display: edit === true ? 'block' : 'none',
                            color: theme.palette.grey[500],
                          }}
                        >
                          <Icon icon="mdi:trash-outline" />
                        </IconButton>
                      </Stack>
                    );
                  })}
                </Stack>
              );
            })}
          </Box>
        </Stack>
      )}

      {alertOpen && (
        <CAlert
          isAlertOpen={true}
          alertCategory={'success'}
          alertTitle={'정말 삭제하시겠습니까?'}
          hasCancelButton={true}
          handleAlertClose={() => {
            setAlertOpen(false);
          }}
          callBack={() => {
            deleteData();
          }}
        ></CAlert>
      )}
    </>
  );
});

export default Alarm;
