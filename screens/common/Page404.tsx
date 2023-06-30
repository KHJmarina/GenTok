import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { MotionContainer, varBounce } from 'src/components/animate';
import { PageNotFoundIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <>
      <Helmet>
        <title>GenTok</title>
      </Helmet>

      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            Sorry, page not found!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be
            sure to check your spelling.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <PageNotFoundIllustration
            sx={{
              height: { xs: 150, md: 260 },
              my: { xs: 20, sm: 15 },
            }}
          />
        </m.div>

        <Button component={RouterLink} to="/" size="large" variant="contained" sx={{ width: '100%', borderRadius: 5 }}>
          홈으로 이동
        </Button>
      </MotionContainer>
    </>
  );
}
