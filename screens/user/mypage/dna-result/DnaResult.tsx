import { Stack, formControlClasses } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import { useNavigate, useLocation } from 'react-router';
import { CallApiToStore } from 'src/utils/common';
import { PATH_ROOT } from 'src/routes/paths';
import { toJS } from 'mobx';
import { IDnaCategory } from 'src/models/dna-result/DnaResult';
import { CHeader } from 'src/components/CHeader';
import { HEADER } from 'src/config-global';
import { DnaCategoryTab } from './DnaCategoryTab';
import { DnaSlide } from './DnaSlide';
import { DnaList } from './DnaList';
import Footer from 'src/layouts/mobile/Footer';

/**
 * ## DnaResult 설명
 *
 */

export const DnaResult = observer(() => {
  const rootStore = useStores();
  const { loadingStore, dnaResultStore } = rootStore;
  const navigate = useNavigate();
  const { state } = useLocation();
  const [ctegryList, setCtegryList] = useState<Array<IDnaCategory>>([]);

  const searchParams = new URLSearchParams(document.location.search);
  const ctegrySid = Number(searchParams.get('ctegrySid')) || 0;
  const page = searchParams.get('page') || 'slide';
  const onlyMine = searchParams.get('onlyMine') === 'true' ? true : false;
  const code = searchParams.get('code') || '';
  const prevPage = state?.prevPage;

  const [currentCtegry, setCurrentCtegry] = useState<IDnaCategory>({} as IDnaCategory);
  const [currentPage, setCurrentPage] = useState<string>(page);
  const [currentOnlyMine, setCurrentOnlyMine] = useState<boolean>(onlyMine);
  const [currentCode, setCurrentCode] = useState<string>(code);

  const getCategory = async () => {
    // 카테고리 조회
    const tempArr = new Array<IDnaCategory>();

    await CallApiToStore(dnaResultStore.getCategories(), 'api', loadingStore)
      .then(() => {
        let obj = Object.create(
          {},
          {
            ordr: { value: 0 },
            ctegrySid: { value: 0 },
            ctegryNm: { value: '전체' },
          },
        );
        tempArr.push(toJS(obj));

        dnaResultStore.dnaCategories?.map((ctegory) => {
          obj = Object.create(
            {},
            {
              ordr: { value: ctegory.ordr },
              ctegrySid: { value: ctegory.ctegrySid },
              ctegryNm: { value: ctegory.ctegryNm },
            },
          );
          tempArr.push(toJS(obj));
        });
        setCtegryList([...tempArr]);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getMyDna = async (ctegryId: number) => {
    // 나의 카드 조회
    const onlyMine = true;
    const orderTypeCd = 100601;
    const ctegrySid = ctegryId === 0 || !ctegryId ? null : ctegryId;

    await CallApiToStore(
      dnaResultStore.getDna(onlyMine, orderTypeCd, ctegrySid),
      'api',
      loadingStore,
    )
      .then(() => {
        // console.log("myresult : ", toJS(dnaResultStore.myResult.resultList))
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getFilterDna = async (onlyMine: boolean, code: any, ctegryId: number) => {
    const ctegrySid = ctegryId === 0 || !ctegryId ? null : ctegryId;

    await CallApiToStore(
      dnaResultStore.getDna(onlyMine, code, ctegrySid),
      'api',
      loadingStore,
    )
      .then(() => {
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getTitle = () => {
    let title = '';
    switch(currentPage) {
      case 'slide':
        title = '유전자 검사결과';
        break;

      case 'list':
        title = currentCtegry.ctegryNm ? currentCtegry.ctegryNm : '';
        break;
      default:
        break;
    }

    return title;
  }

  const handleTabChange = (event: React.SyntheticEvent, newOrdr: number) => {
    const ctegry = ctegryList.find((ctegry) => ctegry.ordr === newOrdr) as IDnaCategory;
    
    if (typeof window !== 'undefined') {
      if (ctegry && newOrdr !== currentCtegry.ordr) {
        setCurrentCtegry(ctegry);
      
        if (currentPage === 'slide') {
            getMyDna(Number(ctegry.ctegrySid));
        } else if (currentPage === 'list') {
          getFilterDna(currentOnlyMine, currentCode, Number(ctegry.ctegrySid));
        }
        if (currentPage === 'slide') {
          window.history.pushState(null, '', `?ctegrySid=${ctegry.ctegrySid}&page=${currentPage}`);
        } else if (currentPage === 'list') {
          window.history.pushState(null, '', `?ctegrySid=${ctegry.ctegrySid}&page=${currentPage}&onlyMine=${currentOnlyMine}&code=${currentCode}`);
        }
      }
    }
  }

  const handleSlideChange = (next: number) => {
    setCurrentCtegry(ctegryList[next]);
    window.history.pushState(null, '', `?ctegrySid=${ctegryList[next].ctegrySid}&page=${currentPage}`);
  }

  const handlePageChange = () => {
    setCurrentPage('list');
    getFilterDna(currentOnlyMine, currentCode, ctegrySid);
    window.history.pushState(null, '', `?ctegrySid=${ctegrySid}&page=list`);
  }

  const handleFilterChange = (onlyMine: boolean, code: any) => {
    getFilterDna(onlyMine, code, ctegrySid);
    setCurrentOnlyMine(onlyMine);
    setCurrentCode(code);
    window.history.pushState(null, '', `?ctegrySid=${ctegrySid}&page=${currentPage}&onlyMine=${onlyMine}&code=${code}`);
  }

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    if(ctegryList) {
      const ctegry = ctegryList.find((ctegry) => ctegry.ctegrySid === ctegrySid) as IDnaCategory;
      if(ctegry) {
        setCurrentCtegry(ctegry);
      
        if (currentPage === 'slide') {
          getMyDna(ctegrySid);
        } else if (currentPage === 'list') {
          getFilterDna(currentOnlyMine, currentCode, ctegrySid);
        }
      }
    }
  }, [ctegryList, ctegrySid]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page');
        const ctegrySid = Number(params.get('ctegrySid')) || 0;
        const ctegry = ctegryList.find((ctegry) => ctegry.ctegrySid === ctegrySid) as IDnaCategory;
        const onlyMine = params.get('onlyMine') === 'true' ? true : false;
        const code = params.get('code') || '';

        if (page && ctegry) {
          setCurrentPage(page);
          setCurrentCtegry(ctegry);
          setCurrentOnlyMine(onlyMine);
          setCurrentCode(code);

          if(page === 'slide') {
            getMyDna(Number(ctegry.ctegrySid));
          } else if(page === 'list') {
            getFilterDna(onlyMine, code, Number(ctegry.ctegrySid));
          }
        }
      });
    }
  }, [ctegryList]);

  const options: any = {
    showMainIcon: 'logo',
    // showHomeIcon: true,
    showSearchIcon: true,
    showCartIcon: true,
    handleSearch: () => {
      navigate(PATH_ROOT.user.mypage.searchDnaCard);
    },
  };
  
  const listOptions: any = {
    title: getTitle(),
    showMainIcon: 'back',
    handleMainIcon: () => {
      if (prevPage === 'myPage') {
        navigate(PATH_ROOT.user.mypage.main);
      } else {
        setCurrentCode('');
        setCurrentOnlyMine(false);
        setCurrentPage('slide');
        getMyDna(Number(currentCtegry.ctegrySid));
        window.history.pushState(null, '', `?ctegrySid=${currentCtegry.ctegrySid}&page=slide`);
      }
    },
    showHomeIcon: true,
    showSearchIcon: true,
    // showCartIcon: true,
    handleSearch: () => {
      navigate(PATH_ROOT.user.mypage.searchDnaCard);
    },
  };

  const params = {
    ctegrySid: ctegrySid,
    code: currentCode,
    onlyMine: currentOnlyMine,
    handleFilterChange: handleFilterChange,
  }

  return (
    <Stack pb={`${HEADER.H_MOBILE * 2 }px`}>
      {dnaResultStore.isDone && ctegryList && 
        <>
          <CHeader
            {...currentPage == "slide" ? options : listOptions}
          />

          <DnaCategoryTab 
            currentCtegry={currentCtegry}
            ctegryList={ctegryList}
            handleTabChange={handleTabChange}
          />

          {currentPage === 'slide' &&
            <DnaSlide
              currentCtegry={currentCtegry}
              ctegryList={ctegryList}
              myResult={dnaResultStore.myResult}
              handleSlideChange={handleSlideChange}
              handlePageChange={handlePageChange}
            />
          }

          {currentPage === 'list' &&
            <DnaList 
              params={params}
              myResultList={dnaResultStore.myResult.resultList}
              allResultList={dnaResultStore.allResult.resultList}
            />
          }
        </>
      }
      <Footer />
    </Stack>
  );
});

export default DnaResult;