import { useTheme, Tabs, Tab } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { styled } from '@mui/material/styles';
import { IDnaCategory } from 'src/models/dna-result/DnaResult';
import { convertCtegryToValue } from 'src/screens/user/mypage/Mypage';
import { pxToRem } from 'src/theme/typography';

/**
 * ## DnaCategoryTab 설명
 *
 */

interface Props {
  currentCtegry: IDnaCategory;
  ctegryList: IDnaCategory[];
  handleTabChange: any;
}

export const DnaCategoryTab = observer(({ currentCtegry, ctegryList, handleTabChange }: Props) => {
  const theme = useTheme();
  
  return (
    <TabsStyle>
      <Tabs
        scrollButtons={false}
        allowScrollButtonsMobile
        variant="scrollable"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'auto',
          mt: pxToRem(20),
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '& .MuiTabs-flexContainer': {
            pr: pxToRem(20), 
            display: 'block',
            width: 'fit-content',
          },
        }}
        value={currentCtegry.ordr ? Number(currentCtegry.ordr) : 0}
        onChange={handleTabChange}
      >
        { ctegryList.map((ctegry: IDnaCategory, index: number) => {
            return (
              <Tab
                key={index}
                label={`${ctegry.ctegryNm}`}
                sx={{
                  height: pxToRem(32),
                  color:
                    ctegry.ctegrySid === currentCtegry.ctegrySid
                      ? theme.palette.common.white
                      : `${
                          theme.palette.dna[convertCtegryToValue(Number(ctegry.ctegrySid))].chip
                        } !important`,
                  backgroundColor:
                    ctegry.ctegrySid === currentCtegry.ctegrySid
                      ? `${
                          theme.palette.dna[convertCtegryToValue(Number(ctegry.ctegrySid))].chip
                        } !important`
                      : null,
                  border: `1px solid ${
                    theme.palette.dna[convertCtegryToValue(Number(ctegry.ctegrySid))].chip
                  }`,
                  fontSize: theme.typography.pxToRem(14),
                  borderRadius: pxToRem(999),
                  px: pxToRem(12),
                  minHeight: 'auto',
                  marginRight: `${pxToRem(8)} !important`,
                  fontWeight: 400,
                  '&:not(.Mui-selected)': {
                    color: '#FFFFFF'
                  },
                  '&:first-of-type': {
                    ml: `${pxToRem(20)} !important`,
                  },
                  '&:last-of-type': {
                    mr: `${pxToRem(20)} !important`,
                  },
                }}
              />
            );
          })}
      </Tabs>
    </TabsStyle>
  );
});

export default DnaCategoryTab;

const TabsStyle = styled('span')({
  '.MuiTabs-indicator': {
    height: 0,
  },
});