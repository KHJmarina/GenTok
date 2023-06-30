import { Button, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { blue } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { useStores } from 'src/models/root-store/root-store-context';
import { useNavigate } from 'react-router-dom';

/**
 * ## 기능 설명
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */
type Props = {
  handleAgree?: VoidFunction;
}
export const Collect = observer(({
  handleAgree
}: Props) => {

  const rootStore = useStores();
  const { loadingStore } = rootStore;

  const { REACT_APP_API_URL } = process.env;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [content, setContent] = useState<any>();

  const cheerio = require('cheerio');

  const getData = async () => {

    const res = await fetch(REACT_APP_API_URL + 'collect', {
      headers: {
        method: 'GET',
        'User-Id': 'adca70c80d91ad42',
        'Token': 'gAAAAABfcsVveH4gVP-h2RsV8Td5rKLQJ4KLQ2tmabV_UKkJNXhmNS37tq-D8O5gOtQccN4xSlschhOHwihPG50WrwshDFceRA=='
        // mode: 'no-cors'
      }
    }).then(async (res: any) => {

      const html = await res.text();
      const $ = cheerio.load(html);
      $('script').remove();
      const body = $('style') + $('body').html();
      setContent({
        __html: body
      });
      setLoading(false);

    }).catch((e: any) => {
      // alert(e)
      setLoadFailed(true);
      setLoading(false);
    })

  }

  useEffect(() => {

    getData();

  }, []);


  return (
    <>
      <Box sx={{
        position: 'relative',
        background: '#FFF',
        textAlign: 'center',
        p: 2
      }}>
        <IconButton sx={{ position: 'absolute', left: 8, top: 11 }} onClick={() => navigate(-1)}><ArrowBackIosIcon fontSize={'small'} /></IconButton>
        <Typography variant={'h5'}>개인정보의 수집 및 이용목적</Typography>
      </Box>
      {
        loading && <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}><CircularProgress sx={{ width: 70, height: 70 }} color={'info'} /></Box>
      }
      {
        loadFailed ?
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}> 데이터를 불러올수 없습니다.</Box>
          :
          <Box sx={{ flex: 1, p: 3, overflowX: 'hidden' }}>
            {content && parse(content.__html)}
          </Box>
      }

      {
        handleAgree &&
        <Stack direction={'row'}>
          <Button variant={'contained'} color={'inherit'} size={'large'} sx={{ flex: .5, borderRadius: 0 }} onClick={() => navigate(-1)}>취소</Button>
          <Button variant={'contained'} color={'secondary'} size={'large'} sx={{ flex: .5, borderRadius: 0, backgroundColor: blue[600] }}
            onClick={handleAgree}
          >동의</Button>
        </Stack>
      }
    </>
  );

});

export default Collect;