import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "../../../../../models/root-store/root-store-context"
import { 
  useTheme,
  Stack,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  List,
  Grid,
  ListItem
} from '@mui/material';
import { useNavigate } from 'react-router';
import { pxToRem } from 'src/theme/typography';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ReactComponent as IconDeliveryStatus } from 'src/assets/icons/ico-delivery-status.svg';

/**
 * ## OrderHistoryTimeline 설명
 *
 */
interface Props {
  data: any;
}

export const OrderHistoryTimeline = observer(({data}: Props) => {

  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();
  const [testOpen, setTestOpen] = useState<boolean>(false);

  const handleClickTest = () => {
    setTestOpen(!testOpen);
  };

  const makeDateFormat = (date: number)=>{
    const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];
    let tempDate = new Date(date);
    let month = ("0" + (1 + tempDate.getMonth())).slice(-2);
    let day = ("0" + tempDate.getDate()).slice(-2);
    let weekdays = WEEKDAY[tempDate.getDay()]

    return `${month}월 ${day}일 ${weekdays}요일`;
  }

  const makeTimeFormat = (date: number)=>{
    let tempDate = new Date(date);
    let hour = tempDate.getHours();
    let minute = ("0" + tempDate.getMinutes()).slice(-2);

    return `${hour}:${minute}`;
  }

  const drawTimelineMinimum = ()=>{
    let timelineDiv = "";
    if(!data.orderStateCdChgLogList || data.orderStateCdChgLogList.length == 0)
      return "";
    
    for(let i=0; i<data.orderStateCdChgLogList.length && i<2; i++){
      let item = data.orderStateCdChgLogList[i];
      timelineDiv += (
        <TimelineContent sx={{ pt: 0 }}>
          <Typography
            sx={{
              color: '#9DA0A5',
              fontSize: pxToRem(12),
              fontWeight: 400,
              mb: pxToRem(12),
            }}
          >
            {makeDateFormat(item.stateChgDt)}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant={'Kor_14_b'} sx={{ color: '#202123' }}>
              {item.chgState?.value}
            </Typography>
            <Typography variant={'Kor_12_r'} sx={{ color: '#9DA0A5' }}>
              {makeTimeFormat(item.stateChgDt)}
            </Typography>
          </Box>
        </TimelineContent>
      )
    }

    return timelineDiv;
  }

  const drawTimelineMaximum = ()=>{
    let timelineDiv = "";
    if(!data.orderStateCdChgLogList || data.orderStateCdChgLogList.length == 0)
      return "";
    
    for(let j=2; j<data.orderStateCdChgLogList.length; j++){
      let item = data.orderStateCdChgLogList[j];
      timelineDiv += (
        <TimelineContent sx={{ pt: 0 }}>
          <Typography
            sx={{
              color: '#9DA0A5',
              fontSize: pxToRem(12),
              fontWeight: 400,
              mb: pxToRem(12),
            }}
          >
            {makeDateFormat(item.stateChgDt)}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant={'Kor_14_b'} sx={{ color: '#202123' }}>
              {item.chgState?.value}
            </Typography>
            <Typography variant={'Kor_12_r'} sx={{ color: '#9DA0A5' }}>
              {makeTimeFormat(item.stateChgDt)}
            </Typography>
          </Box>
        </TimelineContent>
      )
    }

    return timelineDiv;
  }

  return (
    <>
      { 
        data.orderStateCdChgLogList && data.orderStateCdChgLogList.length > 0 && (
        <Box sx={{ mt: pxToRem(30), mb:pxToRem(20), mx:pxToRem(20) }}>
          <Timeline
            sx={{
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
              },
              padding:0
            }}
          >
            {
              data.orderStateCdChgLogList.map((item: any, index: number)=>{
                if(index > 1) return;
                return (
                  <TimelineItem key={index}>
                    <TimelineSeparator sx={{ color: '#EEEEEE' , pl:pxToRem(20), pt: pxToRem(2.5) }}>
                      <IconDeliveryStatus stroke={index==0 ? '#FF7F3F' : '#DFE0E2'} style={{ marginBottom: pxToRem(4) }} />
                      <TimelineConnector />
                    </TimelineSeparator>

                    <TimelineContent sx={{ pt: 0 }}>
                      <Typography
                        sx={{
                          color: '#9DA0A5',
                          fontSize: pxToRem(12),
                          fontWeight: 400,
                          mb: pxToRem(12),
                        }}
                      >
                        {makeDateFormat(item.stateChgDt)}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Typography variant={'Kor_14_b'} sx={{ color: '#202123' }}>
                          {item.chgState?.value}
                        </Typography>
                        <Typography variant={'Kor_12_r'} sx={{ color: '#9DA0A5' }}>
                          {makeTimeFormat(item.stateChgDt)}
                        </Typography>
                      </Box>
                    </TimelineContent>
                  </TimelineItem>
                )
              })
            }

            { data.orderStateCdChgLogList.length > 2 && testOpen == false ? (
              <>
                <Divider sx={{ border: '1px dashed #EEEEEE' }} />
                <Box onClick={handleClickTest} sx={{ mt: 2 , mx:2, cursor:'pointer' }}>
                  <Typography
                    variant={'Kor_14_r'}
                    sx={{
                      color: '#9DA0A5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    유전자 검사 현황 전체보기
                    <KeyboardArrowDownIcon sx={{ color: '#C6C7CA' }} />
                  </Typography>
                </Box>
              </>
            ) : 
              data.orderStateCdChgLogList.length > 2 ? (
                <>
                  {
                    data.orderStateCdChgLogList.map((item: any, index: number)=>{
                      if(index > 2){
                        return (
                        <TimelineItem key={index}>
                          <TimelineSeparator sx={{ color: '#EEEEEE' , pl:pxToRem(20), pt: pxToRem(2.5) }}>
                            <IconDeliveryStatus stroke={'#DFE0E2'} style={{ marginBottom: pxToRem(4) }} />
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent key={index} sx={{ pt: 0 }}>
                            <Typography
                              sx={{
                                color: '#9DA0A5',
                                fontSize: pxToRem(12),
                                fontWeight: 400,
                                mb: pxToRem(12),
                              }}
                            >
                              {makeDateFormat(item.stateChgDt)}
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <Typography variant={'Kor_14_b'} sx={{ color: '#202123' }}>
                                {item.chgState?.value}
                              </Typography>
                              <Typography variant={'Kor_12_r'} sx={{ color: '#9DA0A5' }}>
                                {makeTimeFormat(item.stateChgDt)}
                              </Typography>
                            </Box>
                          </TimelineContent>
                        </TimelineItem>)
                      }
                    })
                  }
                  <Divider sx={{ border: '1px dashed #EEEEEE' }} />
                  <Box onClick={handleClickTest} sx={{  mt: 2 , mx:2 , cursor:'pointer' }}>
                    <Typography
                      variant={'Kor_14_r'}
                      sx={{
                        color: '#9DA0A5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      유전자 검사 현황 전체보기
                      <KeyboardArrowUpIcon sx={{ color: '#C6C7CA' }} />
                    </Typography>
                  </Box>
                </>
              ) : 
              <Divider sx={{ border: '1px dashed #EEEEEE' }} />
            }
          </Timeline>
        </Box>)
      }
    </>
  );
});

export default OrderHistoryTimeline;