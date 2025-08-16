'use client';
import React, { useState } from 'react';
import { Button, CardBody, Input, Typography } from '@material-tailwind/react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { useRouter } from 'next/navigation';
//icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import { GetVesselsListItems, Response, VesselsModel } from '@/app/models/VesselsModel/statusTypes';
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
import TableSkeleton from '../../shared/TableSkeleton';
import { Pagination, Stack } from '@mui/material';
import Swal from 'sweetalert2';
type VesselsList = {
  vesselsItems: VesselsModel[],
  loading: boolean,
  searchEntry: string,
  count: number
}
const ArchiveTable = () => {
  const { AxiosRequest } = useAxios()
  const router = useRouter();
  const color = useStore(colorStore, (state) => state)
  const themeMode = useStore(themeStore, (state) => state)

  let variables = {
    vesselsItems: [],
    loading: false,
    searchEntry: '',
    count: 0
  }

  const [statusStates, setStatusStates] = useState<VesselsList>(variables)
  const GetVesselsList = async (pageNo: number = 1) => {
    setStatusStates((state) => ({ ...state, loading: true }))
    let url = `${process.env.NEXT_PUBLIC_API_URL}/Status/GetInformation/GetVesselsList`;
    let method = 'post';
    let data = {
      "searchEntry": statusStates.searchEntry,
      "count": 10,
      "pageNo": pageNo
    }
    if (statusStates.searchEntry != null && statusStates.searchEntry != '') {
      let response: AxiosResponse<Response<GetVesselsListItems>> = await AxiosRequest({ url, method, data, credentials: true })
      if (response) {
        setStatusStates((state) => ({ ...state, loading: false }))
        if (response.data.data != null && response.data.data.vessels.length > 0) {
          setStatusStates((state) => ({ ...state, vesselsItems: response.data.data.vessels }))
          let paginationCount = Math.ceil(Number(response.data.data?.totalCount) / Number(10));
          setStatusStates((state) => ({ ...state, count: paginationCount }))
        }
      }
    } else {
      setStatusStates((state) => ({ ...state, loading: false }))
      Swal.fire({
        background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
        color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
        allowOutsideClick: false,
        title: "Vessels List",
        text: 'The Vessel Info: field is required.',
        icon: "warning",
        confirmButtonColor: "#22c55e",
        confirmButtonText: "OK",
      })
    }
  }

  return (
    <>
      <CardBody onKeyUp={(event) => event.key == 'Enter' && GetVesselsList()} className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} rounded-lg shadow-md w-[98%] md:w-[96%] my-3 mx-auto`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <div className="statusTable relative w-[90%] md:w-[400px] flex ">
          <Input
            crossOrigin=""
            style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray"
            type="text"
            label="search"
            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} pr-20 `}
            containerProps={{
              className: !themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'
            }}
            onChange={(e) => setStatusStates((state) => ({ ...state, searchEntry: e.target.value }))} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          />
          <Button
            size="sm"
            className="!absolute right-1 top-1 rounded"
            style={{ background: color?.color }}
            onClick={() => GetVesselsList()}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          // onKeyUp={(event) => handleSeach(event.key)}
          >
            <i className={"bi bi-search"}></i>
          </Button>
        </div>

      </CardBody>
      <CardBody onKeyUp={(event) => event.key == 'Enter' && GetVesselsList()} className='w-[98%] h-[65vh] md:w-[96%] mx-auto relative rounded-lg overflow-auto p-0'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        {statusStates.loading == false ?
          statusStates.vesselsItems.length > 0 &&
          <>
            <table className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[63vh] `}>
              <thead >
                <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                  <th style={{ borderBottomColor: color?.color }}
                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                      Asiacode
                    </Typography>
                  </th>
                  <th style={{ borderBottomColor: color?.color }}
                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                      Reg. No.
                    </Typography>
                  </th>
                  <th style={{ borderBottomColor: color?.color }}
                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                      Reg. Port
                    </Typography>
                  </th>
                  <th style={{ borderBottomColor: color?.color }}
                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                      Vessel Name
                    </Typography>
                  </th>
                  <th style={{ borderBottomColor: color?.color }}
                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                      IMO No.
                    </Typography>
                  </th>
                  <th style={{ borderBottomColor: color?.color }}
                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                      Vessel Type
                    </Typography>
                  </th>
                  <th style={{ borderBottomColor: color?.color }}
                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                      GT
                    </Typography>
                  </th>
                  <th style={{ borderBottomColor: color?.color }}
                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                      NGT
                    </Typography>
                  </th>
                  <th style={{ borderBottomColor: color?.color }}
                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                      Command
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody className={`statusTable divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                {statusStates.vesselsItems.length > 0 && statusStates.vesselsItems.map((vessel: VesselsModel, index: number) => {
                  return (
                    <tr key={'vessel' + index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none`}>
                      <td style={{ width: '10%' }} className='p-1'>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className={`font-normal p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                          {vessel.asiaCode}
                        </Typography>
                      </td>
                      <td style={{ width: '10%' }} className='p-1'>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className={`font-normal p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                          {vessel.numberOfRegistry}
                        </Typography>
                      </td>
                      <td style={{ width: '10%' }} className='p-1'>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className={`font-normal p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                          {vessel.portOfRegistry}
                        </Typography>
                      </td>
                      <td className='p-1'>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-normal whitespace-nowrap p-0.5`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                          {vessel.vesselName}
                        </Typography>
                      </td>
                      <td style={{ width: '15%' }} className='p-1'>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className={`font-normal p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                          {vessel.imO_No}
                        </Typography>
                      </td>
                      <td className='p-1'>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-normal whitespace-nowrap p-0.5`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                          {vessel.vesselType}
                        </Typography>
                      </td>
                      <td style={{ width: '5%' }} className='p-1'>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className={`font-normal p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                          {vessel.gt}
                        </Typography>
                      </td>
                      <td style={{ width: '5%' }} className='p-1'>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-normal p-0.5`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                          {vessel.ngt}
                        </Typography>
                      </td>
                      <td style={{ width: '7%' }} className='p-1'>
                        <div className='container-fluid mx-auto p-0.5'>
                          <div className="flex flex-row justify-evenly">
                            <Button
                              onClick={() => router.push(`/Home/Status/Info?asiacode=${vessel.asiaCode}`)}
                              size="sm"
                              className="p-1 mx-1"
                              style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                            >
                              <VisibilityIcon
                                fontSize='small'
                                className='p-1'
                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

          </>
          : <TableSkeleton />}
        {statusStates.count > 1 && <section className='flex justify-center my-3'>
          <Stack onClick={(e: any) => { GetVesselsList(e.target.innerText) }} spacing={1}>
            <Pagination hidePrevButton hideNextButton count={statusStates.count} variant="outlined" size="small" shape="rounded" />
          </Stack>
        </section>}
      </CardBody>
    </>
  )
}
export default ArchiveTable;