import { Icon } from '@iconify/react';
import ReportIcon from '@iconify/icons-ic/report';
import { Box, Button, Card, Stack, TextField, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { DialogAnimate } from 'src/components/animate';
import { useStores } from 'src/models/root-store/root-store-context';
import { BUTTON_LABEL } from 'src/components/settings/constEnum';
// ----------------------------------------------------------------------

export default observer(function ErrorAlert() {
  const { errorAlertStore } = useStores();

  return (
    <DialogAnimate
      open={errorAlertStore.errorAlert.open}
      onClose={() => { }}
      maxWidth={'md'}
      sx={{ minWidth: 900, maxHeight: '80%', '.MuiDialog-container > .MuiBox-root': { alignItems: 'center' } }}
    >
      <Card>
        <Stack direction="row" sx={{ justifyContent: 'center', margin: '40px', mb: 0 }}>
          <Box
            component={Icon}
            icon={ReportIcon}
            sx={{ fontSize: '6rem', color: 'rgb(255, 72, 66)' }}
          />
        </Stack>
        <Stack direction="row" sx={{ justifyContent: 'center', mb: '10px' }}>
          <Typography variant="h4" sx={{ marginTop: 1, fontWeight: '600', opacity: 0.9 }}>
            ERROR
          </Typography>
        </Stack>

        <TextField
          defaultValue={errorAlertStore.errorAlert.content}
          label="오류 내용"
          color="error"
          inputProps={{
            style: {
              minHeight: '100px',
              fontSize: '20px',
              fontWeight: 700,
              lineHeight: '25px',
              maxHeight: '200px',
            },
            readOnly: true,
          }}
          sx={{ width: '96%', ml: '2%', mt: 1 }}
          multiline
        />
        <Box sx={{ mt: 2, mb: 2, pr: 2, width: '100%' }}>
          <Button
            onClick={() => {
              errorAlertStore.resetErrorAlert();
            }}
          >
            {BUTTON_LABEL.CLOSE}
          </Button>
        </Box>
      </Card>
    </DialogAnimate>
  );
});
