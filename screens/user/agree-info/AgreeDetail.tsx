import { Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/models';
import parse from 'html-react-parser';

const AgreeDetail = observer(() => {
  const rootStore = useStores();
  const { termsStore, loadingStore } = rootStore;

  return (
    <>
      <Typography variant="h4" mb={2}>
        {parse(termsStore.terms.termsNm)}
      </Typography>
      <Typography variant="body1" mb={2}>
        {parse(termsStore.terms.termsConts)}
      </Typography>
    </>
  );
});

export default AgreeDetail;
