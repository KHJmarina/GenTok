import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "../../../models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import Image from 'src/components/image/Image';
import mainBanner_imm from '../../../assets/images/main_image01.svg';
import { useNavigate } from 'react-router';
import { IBannerSnapshot } from 'src/models';
/**
 * ## MainSubBanner 설명
 *
 */
export const MainSubBanner = observer(() => {

  const rootStore = useStores();
  const { homeStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate()
  const {REACT_APP_IMAGE_STORAGE} = process.env;


  return (
    <>
      <Box 
        sx={{ width:'100%', py:'10px', cursor:'pointer'}}
        onClick={()=>{navigate('/event/fcfs')}}
      >
        <Image src={mainBanner_imm} sx={{width:'100%', py:'10px', display:'block'}}/>
        <Box>
          {/* {
            homeStore.home.subBannerList && homeStore.home.subBannerList.map((banner: IBannerSnapshot, i: number) => {
              return (
                <Box key={`sub-banner-${i}`} component={'img'} src={`${REACT_APP_IMAGE_STORAGE}${banner.thumbnlPath}`}
                  sx={{ m: 0, p: 0, overflow: 'hidden', cursor: 'pointer', width:'100%' }}
                  onClick={() => {
                    banner.contsLink?.substr(0, 4) === 'http' ?
                      window.open(banner.contsLink, '')
                      :
                      navigate('/')
                  }} />
              )
            })
          } */}
        </Box>
      </Box>
    </>
  );
});

export default MainSubBanner;