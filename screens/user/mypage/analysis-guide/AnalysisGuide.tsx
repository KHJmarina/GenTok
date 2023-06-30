import Box from '@mui/material/Box';
import { Divider, Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { CHeader } from 'src/components/CHeader';
import { HEADER } from 'src/config-global';
import { useNavigate, useParams } from 'react-router';
import ReportCode from './analysis-guide-items/ReportCode'
import QCResultInfo from './analysis-guide-items/QCResultInfo';
import ResponsiblePerson from './analysis-guide-items/ResponsiblePerson';
import LabInfo from './analysis-guide-items/LabInfo';
import AnalysisGuideFooter from './analysis-guide-items/AnalysisGuideFooter';
import { CallApiToStore } from 'src/utils/common';
import { AnalysisGuideStore } from 'src/models';

/**
 * ## AnalysisGuide 설명
 *
 */
export const AnalysisGuide = observer(() => {
  const rootStore = useStores();
  const { analysisGuideStore, loadingStore } = rootStore;
  const theme = useTheme();
  const { orderNo: orderNo } = useParams();
  const [render, setRender] = useState(false);
  
  const options: any = {
    showMainIcon: 'none',
    showXIcon: true
  };
  
  useEffect(() => {
    const param = orderNo || '0';
    
    CallApiToStore(analysisGuideStore.getAnlysisInfo(param), 'api', loadingStore).then(() => {
      setRender(true);
    }).catch((e) => {
      console.log(e.errors);
     });
    
  }, [orderNo]);
  
  return (
    <>
    {render &&
      <Stack>
        <CHeader title={'분석안내서'} {...options} />
        <Divider sx={{ borderWidth:'1px', borderColor:'#EEEEEE' }}></Divider>
        
        <ReportCode analssInfo={analysisGuideStore.analysisGuide?.analssInfo} />
        <QCResultInfo qcResult={analysisGuideStore.analysisGuide?.qcResult}/>
        <ResponsiblePerson labSupvrList={analysisGuideStore.analysisGuide?.labSupvrList} />
        <LabInfo labAddr={analysisGuideStore.analysisGuide?.labAddr} labCertifPeriod={analysisGuideStore.analysisGuide?.labCertifPeriod}/>
        <AnalysisGuideFooter />
        
      </Stack>
    }
    </>
  );
});

export default AnalysisGuide;
