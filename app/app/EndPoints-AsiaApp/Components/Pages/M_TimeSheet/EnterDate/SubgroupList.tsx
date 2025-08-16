'use client';
import { Card, List, ListItem, Typography } from '@material-tailwind/react'
import React, { useContext, useEffect, useState } from 'react'
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';
import { UnderneathUserNames } from '@/app/Application-AsiaApp/M_Timesheet/fetchUnderneathUserNames';
import { EnterDataContext } from './EnterData-MainContainer';
import IframeSkeleton from '@/app/components/shared/IframeSkeleton';
import CustomizedSearched from '../../../Shared/SearchComponent';
import { GetUnderneathUserNamesModel } from '@/app/Domain/M_Timesheet/model';
const SubgroupList = () => {
  const themeMode = useStore(themeStore, (state) => state)
  const { fetchUnderneathUserNames } = UnderneathUserNames()
  const { setSubgroupList, selected, subgroupList, loadings, setLoadings, setSelected } = useContext(EnterDataContext)
  const [searchResult, setSearchResult] = useState<GetUnderneathUserNamesModel[]>([])


  useEffect(() => {
    const loadSubodinateList = async () => {
      setLoadings({ ...loadings, iframeLoading: true })
      const res = await fetchUnderneathUserNames();
      if (res) {
        setLoadings({ ...loadings, iframeLoading: false })
        Array.isArray(res) && res.length > 0 ?
          (setSelected(res[0].userId), setSubgroupList(res), setSearchResult(res))
          : setSubgroupList([])
      }
    }
    loadSubodinateList()
  }, [])

  const handleSeachKey = (data: string) => {
    if (!data) {
      setSubgroupList(searchResult);
      return;
    }
    const filtered = searchResult.filter(item => item.name.includes(data));
    setSubgroupList(filtered);
  }

  return (
    <>
      {loadings.iframeLoading == true ? <IframeSkeleton /> :
        <>
          <CustomizedSearched className='w-full' searchKey={handleSeachKey} />
          <Card placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className={`w-full border-black overflow-hidden ${themeMode?.stateMode ? 'tableDark' : 'tableLight'}`}>
            <List dir='rtl' className='w-[98%] px-0 mx-auto' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              {subgroupList.map((item, index: number) => {
                return (
                  <ListItem onClick={() => { setSelected(item.userId) }} key={index} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} ripple={false} style={{ background: selected == item.userId ? ' rgb(176 190 197 / 0.3)' : '' }} className="hover:bg-blue-gray-200/30" >
                    <Typography className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} text-sm px-2`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      {item.name}
                    </Typography>
                  </ListItem>)
              })}

            </List >
          </Card >
        </>
      }
    </>
  )
}

export default SubgroupList