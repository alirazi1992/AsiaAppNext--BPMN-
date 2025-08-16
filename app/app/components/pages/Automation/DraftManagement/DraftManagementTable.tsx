'use client';
import React, { useEffect, useState } from 'react';
import { Button, CardBody, Typography } from '@material-tailwind/react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useAxios from '@/app/hooks/useAxios';
import { AxiosResponse } from 'axios';
import Swal from 'sweetalert2';
import useStore from "@/app/hooks/useStore";
import DeleteIcon from '@mui/icons-material/Delete';
import { DraftModel, Response } from "@/app/models/Automation/NewDocumentModels"
import TableSkeleton from '@/app/components/shared/TableSkeleton';
import Loading from '@/app/components/shared/loadingResponse';
import { loadingModel } from '@/app/models/Automation/DraftModel';

const DraftManagementTable = () => {
  const { AxiosRequest } = useAxios()
  const themeMode = useStore(themeStore, (state) => state);
  const color = useStore(colorStore, (state) => state)
  const [draftsList, SetDraftsList] = useState<DraftModel[]>([]);

  let loadingDraft = {
    loadingTable: false,
    loadingResponse: false
  }
  const [loading, setLoading] = useState<loadingModel>(loadingDraft);

  const RemoveDraft = async (id: number, target: Element) => {
    Swal.fire({
      background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "Remove Draft",
      text: "Are you sure you want to remove this Draft?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "yes, remove it!",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading((state) => ({ ...state, loadingResponse: true }))
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/removedraft`;
        let data = { id: id };
        let method = "delete";
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
          setLoading((state) => ({ ...state, loadingResponse: false }))
          if (response.data.status && response.data.data != 0) {
            setLoading((state) => ({ ...state, loadingDelete: false }))
            let index = draftsList.indexOf(draftsList.find(p => p.id == id)!);
            if (index !== -1) {
              let Array = [...draftsList]
              Array.splice(index, 1)
              SetDraftsList([...Array])
            }
          } else {
            Swal.fire({
              background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "Remove Draft",
              text: response.data.message,
              icon: !response.data.status ? "warning" : 'error',
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK!",
            })
          }
        }
      }
    })
  }


  useEffect(() => {
    const GetDrafts = async () => {
      setLoading((state) => ({ ...state, loadingTable: true }))
      let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getdrafts`;
      let data = {};
      let method = "get";
      let response: AxiosResponse<Response<DraftModel[]>> = await AxiosRequest({ url, method, data, credentials: true });
      if (response) {
        setLoading((state) => ({ ...state, loadingTable: false }))
        if (response.data.status) {
          SetDraftsList(response.data.data);
          return
        }
        // Swal.fire({
        //   background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
        //   color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
        //   allowOutsideClick: false,
        //   title: "لیست پیش فرض ها",
        //   text: response.data.message,
        //   icon: "warning",
        //   confirmButtonText: "OK"
        // })
      }
    }
    GetDrafts();
  }, [])
  return (
    <>
      {loading.loadingResponse == true && <Loading />}
      <CardBody dir='rtl' className='w-[95%] h-[500px] md:w-[90%]  mx-auto relative rounded-lg overflow-auto p-0 my-3'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        {loading.loadingTable == false ? (<table className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center h-auto `}>
          <thead >
            <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
              <th style={{ borderBottomColor: color?.color }}
                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                  #
                </Typography>
              </th>
              <th style={{ borderBottomColor: color?.color }}
                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                  لیست پیش فرض ها
                </Typography>
              </th>
              <th style={{ borderBottomColor: color?.color }}
                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                  عملیات
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
            {draftsList && draftsList.length > 0 && draftsList.map((draft: DraftModel, index: number) => {
              return (
                <tr style={{ height: "40px" }} key={index} id={"draft" + draft.id} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                  <td style={{ width: '5%' }} className='p-1'>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`font-[700] text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                      {index + 1}
                    </Typography>
                  </td>
                  <td className='p-1'>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`font-[500] text-[13px] whitespace-nowrap p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                      {draft.title}
                    </Typography>
                  </td>

                  <td style={{ width: "3%" }} className='p-1'>
                    <div className='container-fluid mx-auto p-0.5'>
                      <div className="flex flex-row justify-evenly">
                        <Button
                          onClick={(e) => RemoveDraft(draft.id, e.currentTarget)}
                          size="sm"
                          className="p-1 mx-1"
                          style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                          <DeleteIcon
                            fontSize='small'
                            className='p-1'
                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                          />
                        </Button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>) : < TableSkeleton className=" md:px-4" />}
      </CardBody>
    </>
  )
};
export default DraftManagementTable;