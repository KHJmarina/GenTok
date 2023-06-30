import Box from '@mui/material/Box';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useStores } from "../../../models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { isValidToken } from 'src/auth/utils';
import { useAuthContext } from 'src/auth/useAuthContext';

/**
 * ## TokenCheck 설명
 *
 */
export const TokenCheck = observer(() => {

  const rootStore = useStores();
  const auth = useAuthContext();
  const params = useParams();
  const navigate = useNavigate();
  const { token = '', move = '' } = params;
  const { REACT_APP_API_URL } = process.env;

  useEffect(() => {

    (async () => {
      if (token !== '') {

        const tokenstr = token.split('?')[0];
        const searchParams = new URLSearchParams(document.location.search)
        const dlink = searchParams.get('dlink');
        try {
          if (isValidToken(tokenstr)) {
            (async () => {
              return await fetch(REACT_APP_API_URL + '/common/v1/user/login/refresh', {
                method: 'POST',
                body: JSON.stringify({ refreshToken: tokenstr }),
              }).then(async (res) => {
                // alert('🌈 ~ res:' + JSON.stringify(res))
                // alert('json.data' + tokenstr)
                const json = await res.json();
                localStorage.removeItem('navOpen');
                localStorage.setItem('accessToken', json.data.access_token);
                localStorage.setItem('refreshToken', json.data.refresh_token);
                await auth.initialize();
                if (dlink) {
                  const path = new URL(dlink).pathname;
                  // alert('path' + path)
                  navigate(path, { replace: true });
                } else {
                  navigate('/', { replace: true });
                }

              }).catch((e) => {
                // alert(e);
                localStorage.setItem('common_refresh_error', e)
                localStorage.removeItem('navOpen');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('accessToken');
                navigate('/login', {
                  replace: true, state: {
                    dlink: dlink
                  }
                });
              });
            })();
          } else {
            // alert('invalid token');
            navigate('/login', {
              replace: true, state: {
                dlink: dlink
              }
            });
          }
        } catch (e) {
          console.log('🌈 ~ e:', e)
          localStorage.setItem('token-check', e)
          navigate('/login', {
            replace: true, state: {
              dlink: dlink
            }
          });
        }
      }
    })();

    return () => {
    };
  }, [token]);

  return (
    <>
      <Box sx={{}}>
      </Box>
    </>
  );
});

export default TokenCheck;