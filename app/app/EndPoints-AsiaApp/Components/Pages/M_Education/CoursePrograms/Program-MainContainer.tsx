'use client';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import ProgramsTable from './CourseProgramTable';
import { usePrograms } from '@/app/Application-AsiaApp/M_Education/fetchPrograms';
import { initializeProgramState } from '@/app/Application-AsiaApp/Utils/M_Education.ts/data';
import { EducationalCourseProgramsModel, GetCoursesListModel, GetEducationalCourseProgramModel, ProgramItemsModel, SearchProgramModel } from '@/app/Domain/M_Education/Programs';
import CustomizedPagination from '../../../Shared/Pagination';
import AddProgramForm from './AddProgram';
import { useCoursesList } from '@/app/Application-AsiaApp/M_Education/fetchCourses';
import { loading } from '@/app/Application-AsiaApp/Utils/shared';
import { InsertingCourseProgram } from '@/app/Application-AsiaApp/M_Education/InsertCreatedCourseProgramToTable';
import { RemovingProgramFromList } from '@/app/Application-AsiaApp/M_Education/RemoveCourseProgram';
import { UpdatingCourseProgram } from '@/app/Application-AsiaApp/M_Education/UpdateCourseProgram';
import UpdateProgramComponent from './UpdateProgram';
import Participants from './Participants';
import { Tabs, Tab, TabPanel, TabsBody, TabsHeader, Tooltip } from '@material-tailwind/react';
import SearchProgramForm from './SearchPrograms';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Loading from '@/app/components/shared/loadingResponse';
import TableSkeleton from '@/app/components/shared/TableSkeleton';

const EducationCourseProgram = () => {
  const { fetchCoursePrograms } = usePrograms();
  const { fetchCoursesList } = useCoursesList()
  const { AddPrograms } = InsertingCourseProgram()
  const { RemoveProgram } = RemovingProgramFromList()
  const { UpdateProgram } = UpdatingCourseProgram()

  const [state, setState] = useState(initializeProgramState)
  const [loadings, setLoadings] = useState(loading)
  const [activate, setActivate] = useState<string>('Add')
  const themeMode = useStore(themeStore, (state) => state)
  const color = useStore(colorStore, (state) => state)

  const [isPending, startTransition] = useTransition()

  // let programs: GetEducationalCourseProgramModel | undefined;
  // let courses: GetCoursesListModel[] | undefined;

  const AddProgramRef = useRef<{ ResetMethod: () => void }>(null);
  const UpdateRef = useRef<{ handleOpen: () => void }>(null);
  const ParticipantRef = useRef<{ handleOpen: () => void }>(null);

  useEffect(() => {
    const loadInitialCoursePrograms = () => {
      startTransition(async () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const res = await fetchCoursePrograms(state.searchKey, 1).then((result) => {
          if (typeof result == 'object') {
            setState((prev) => ({ ...prev, programs: result!.coursePrograms, totalCount: Math.ceil(Number(result!.coursePrograms) / 10) }));
          }
        })
      })
    };
    const loadInitialCoursesList = async () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const res = await fetchCoursesList().then((result) => {
        if (result) {
          if (Array.isArray(result)) {
            setState(prev => ({ ...prev, courses: result }))
          }
        }
      })
    };
    loadInitialCoursesList()
    loadInitialCoursePrograms();
  }, [])


  const handleGetPageNo = async (page: number) => {
    const res = await fetchCoursePrograms(state.searchKey, page).then((result) => {
      if (result) {
        if (typeof result == 'object') {
          setState((prev) => ({ ...prev, programs: result!.coursePrograms }));
        }
      }
    })
  }

  const handleAddProgram = async (data: ProgramItemsModel) => {
    setLoadings((state) => ({ ...state, response: true }))
    const res = await AddPrograms(data).then((result) => {
      setLoadings((state) => ({ ...state, response: false }));
      if (result) {
        if (typeof result == 'object' && 'id' in result) {
          setState((prev) => ({ ...prev, programs: prev.programs!.length > 0 ? [...prev.programs!, result!] : [result!] }))
        }
        if (AddProgramRef.current) {
          AddProgramRef.current.ResetMethod();
        }

      }
    })
  }
  const handleRemoveProgram = async (id: number) => {
    let index = state.programs!.indexOf(state.programs!.find((item) => item.id == id)!)
    setLoadings((state) => ({ ...state, response: true }))
    const res = await RemoveProgram(id).then((res) => {
      setLoadings((state) => ({ ...state, response: false })),
        res == true && (index != -1 && state.programs?.splice(index, 1))

    })
  }

  const handleSelectedProgram = (data: EducationalCourseProgramsModel, icon: string) => {
    (setState((prev) => ({ ...prev, selectedProgram: data })))
    if (icon == 'edit' && UpdateRef.current) {
      UpdateRef.current.handleOpen()
    }
    if (icon == 'participants' && ParticipantRef.current) {
      ParticipantRef.current.handleOpen()
    }
  }

  const handleUpdateProgram = async (data: ProgramItemsModel) => {
    let option = state.programs!.find((item) => item.id == data.id)!;
    let index = state.programs!.indexOf(option)
    setLoadings((state) => ({ ...state, response: true }))
    const res = await UpdateProgram(data).then((result: any) => {
      setLoadings((state) => ({ ...state, response: false }))
      if (result != null) {
        state.programs!.splice(index, 1, {
          ...option,
          couchName: result.couchName,
          faCouchName: result.faCouchName,
          faInstitute: result.faInstitute,
          finishDate: result.finishDate,
          validPeriod: result.validPeriod,
          faPage2Desc: result.faPage2Desc,
          institute: result.institute,
          page2Desc: result.page2Desc,
          duration: result.duration,
          durationUnit: result.durationUnit,
          faDurationUnit: result.faDurationUnit,
          faName: result.faName,
          name: result.name,
          courseCode: result.courseCode
        })
      } else {
        setState((prev) => ({ ...prev, programs: prev.programs }))
      }
    })
  }

  const handleSearchProgram = async (data: SearchProgramModel) => {
    const res = await fetchCoursePrograms({ courseCode: data.courseCode, categoryName: data.categoryName, coachName: data.coachName, creationDateAfter: data.creationDateAfter, creationDateBefore: data.creationDateBefore, finishDateAfter: data.finishDateAfter, finishDateBefore: data.finishDateBefore, instituteName: data.instituteName, name: data.name, participant: data.participant, personnel: data.personnel }, 1).then((result) => {
      if (result) {
        if (typeof result == 'object' && result !== null) {
          setState((prev) => ({ ...prev, programs: result!.coursePrograms, totalCount: Math.ceil(Number(result!.coursePrograms) / 10) }));
        }
      }
    })
  }

  return (
    <section className='p-1'>
      {loadings.response == true && <Loading />}
      <Tabs dir="ltr" value="Add" className="w-full h-auto">
        <TabsHeader
          className={`${!themeMode || themeMode?.stateMode ? 'contentDark' : 'contentLight'} m-2 max-w-[80px] `}
          indicatorProps={{
            style: {
              background: color?.color,
              color: "white",
            },
            className: `shadow `,
          }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          <Tab onClick={() => {
            setActivate('Add');
          }} value="Add" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <Tooltip className={`${!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}  z-[1000000]`} content='Add Program' placement="top">
              <AddCircleOutlineIcon fontSize='small' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} style={{ color: `${activate == "Add" ? "white" : ""}` }} />
            </Tooltip>
          </Tab>
          <Tab onClick={() => {
            setActivate('Search');
          }} value="Search" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <Tooltip className={`${!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}  z-[1000000]`} content='Search Programs' placement="top">
              < SearchIcon fontSize='small' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} style={{ color: `${activate == "Search" ? "white" : ""}` }} />
            </Tooltip>
          </Tab>
        </TabsHeader>
        <TabsBody
          animate={{
            initial: { x: 50 },
            mount: { x: 0 },
            unmount: { x: 140 },
          }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          <TabPanel value="Add">
            <AddProgramForm ref={AddProgramRef} courses={state.courses} onSubmit={handleAddProgram} />
          </TabPanel>
          <TabPanel value='Search'>
            <SearchProgramForm onSubmit={handleSearchProgram} />
          </TabPanel>
        </TabsBody>
        {isPending == false ? <ProgramsTable programs={state.programs} selectedProgram={handleSelectedProgram} removeProgramId={handleRemoveProgram} /> : <TableSkeleton />}
        <CustomizedPagination count={state.totalCount} handlePage={handleGetPageNo} />
        <UpdateProgramComponent ref={UpdateRef} courses={state.courses} program={state.selectedProgram} onSubmit={handleUpdateProgram} />
        <Participants ref={ParticipantRef} program={state.selectedProgram} />
      </Tabs >
    </section>
  )
}

export default EducationCourseProgram