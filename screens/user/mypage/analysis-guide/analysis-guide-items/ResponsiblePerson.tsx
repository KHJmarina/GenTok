import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite";
import { useStores } from "../../../../../models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import { Stack, Typography, Divider, Grid } from '@mui/material';
import { pxToRem } from 'src/theme/typography';
import Image from 'src/components/image/Image';
import sign1 from 'src/assets/images/sign1.svg'
import sign2 from 'src/assets/images/sign2.svg'
import sign3 from 'src/assets/images/sign3.svg'
import sign4 from 'src/assets/images/sign4.svg'
import sampleSign from 'src/assets/images/sampleSign.svg'
/**
 * ## ResponsiblePerson 설명
 *
 */
interface Props {
  labSupvrList : any;
}
export const ResponsiblePerson = observer(( { labSupvrList } : Props ) => {

  const rootStore = useStores();
  const { loadingStore } = rootStore;
  const theme = useTheme();
  const { REACT_APP_IMAGE_STORAGE } = process.env;

  return (
    <>
    <Stack sx ={{ textAlign:'left', mx: pxToRem(20), my:pxToRem(40) }} >
      <Typography variant='Kor_16_b'> 검사실 책임자 확인 / 검사결과지 작성 책임자 </Typography>
      <Typography variant='Kor_14_r' sx={{ lineHeight: pxToRem(22), my:pxToRem(20) }} > 
        본 검사대상물은 질병관리청의 관리 감독을 받는 ‘유전체분석 전문기업 ’
        마크로젠의 숙련된 검사 담당자에 의해 소중히 다루어지며, 
        검사실 내 · 외부 정도관리 지침에 따른 기준을 통과하여 위와 같이 결과를 보고합니다.
      </Typography>
      {/* <Box sx= {{ display: 'grid',  gridTemplateRows: "1fr ", gridTemplateColumns: "1fr 1fr", }} > */}
        {/* {labSupvrList.map((item : any, index : number) => {
          return(
            <>
            {index%2 !=0 ?  <Divider sx={{ borderWidth: '0.5px', borderColor:'#EEEEEE !important', mb: pxToRem(12)}} ></Divider> : null}
            <Box sx= {{ display: 'grid',  gridTemplateRows: "1fr ", gridTemplateColumns: "1fr 1fr", }} >
              <Box sx={{ display: 'flex', flexDirection: 'column'  }} >
                <Typography variant='Kor_12_r' sx={{ color: '#C6C7CA' }} >{item.position}</Typography>
                <Typography variant='Eng_12_b'>{item.name}</Typography>
                <Image src={item.signImgPath} />
              </Box>
            </Box>
            </>
          )
        })} */}
        {/* </Box> */}
      <Box sx= {{ display: 'grid',  gridTemplateRows: "1fr ", gridTemplateColumns: "1fr 1fr", }} >
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between'  }} >
          <Box sx={{  display: 'flex', flexDirection:'column', justifyContent:'flex-start' }}>
            <Typography variant='Kor_12_r' sx={{ color: '#C6C7CA' }} >{labSupvrList[0].position}</Typography>
            <Typography variant='Eng_12_b'>{labSupvrList[0].name}</Typography>
          </Box>
          <Image src={REACT_APP_IMAGE_STORAGE + labSupvrList[0].signImgPath} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between'   }} >
          <Box sx={{  display: 'flex', flexDirection:'column', justifyContent:'flex-start' }}>
            <Typography variant='Kor_12_r' sx={{ color: '#C6C7CA' }} >{labSupvrList[1].position}</Typography>
            <Typography variant='Eng_12_b'>{labSupvrList[1].name}</Typography>
          </Box>  
          <Image src={REACT_APP_IMAGE_STORAGE + labSupvrList[1].signImgPath} />
        </Box>
      </Box>
      
      <Divider sx={{ borderWidth: '0.5px', borderColor:'#EEEEEE !important', my: pxToRem(12)}} ></Divider>  
      
      <Box sx= {{ display: 'grid',  gridTemplateRows: "1fr ", gridTemplateColumns: "1fr 1fr", }} >
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between'  }} >
          <Box sx={{  display: 'flex', flexDirection:'column', justifyContent:'flex-start' }}>
            <Typography variant='Kor_12_r' sx={{ color: '#C6C7CA' }} >{labSupvrList[2].position}</Typography>
            <Typography variant='Eng_12_b'>{labSupvrList[2].name}</Typography>
          </Box>  
          <Image src={REACT_APP_IMAGE_STORAGE + labSupvrList[2].signImgPath} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between'  }} >
          <Box sx={{  display: 'flex', flexDirection:'column', justifyContent:'flex-start' }}>  
            <Typography variant='Kor_12_r' sx={{ color: '#C6C7CA' }} >{labSupvrList[3].position}</Typography>
            <Typography variant='Eng_12_b'>{labSupvrList[3].name}</Typography>
          </Box>
          <Image src={REACT_APP_IMAGE_STORAGE + labSupvrList[3].signImgPath} />
        </Box>
      </Box>
      
    </Stack> 
    <Divider></Divider>
    </>
  );
});

export default ResponsiblePerson;