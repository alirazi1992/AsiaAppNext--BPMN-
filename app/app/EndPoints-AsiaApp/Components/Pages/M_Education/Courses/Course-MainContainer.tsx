'use client';
import React, { Fragment, useEffect, useRef, useState } from 'react'
import AddCourse from './AddCourse';
import CustomizedSearched from '../../../Shared/SearchComponent';
import { loading } from '@/app/Application-AsiaApp/Utils/shared';
import Loading from '@/app/components/shared/loadingResponse';
import { CourseItemsModel, EducationCoursesModel, GetCategoriesListModel, GetCoursesModel, GetGeneralTemplateModel, InitializeStateCourseModel } from '@/app/Domain/M_Education/Courses';
import { initializeCourseState } from '@/app/Application-AsiaApp/Utils/M_Education.ts/data';
import CustomizedPagination from '../../../Shared/Pagination';
import CoursesTable from './CoursesTable';
import { useCourses } from '@/app/Application-AsiaApp/M_Education/fetchCourses';
import { RemovingCourseFromList } from '@/app/Application-AsiaApp/M_Education/RemoveEducationCourse';
import { InsertingCourse } from '@/app/Application-AsiaApp/M_Education/InsertCreatedCourseToTable';
import { UpdatingEducationalCourse } from '@/app/Application-AsiaApp/M_Education/UpdateCourse';
import UpdateCourseComponent from './UpdateCourse';
import { useCategoriesList } from '@/app/Application-AsiaApp/M_Education/fetchCategories';
import { useCoursesTemplates } from '@/app/Application-AsiaApp/M_Education/fetchGeneralTemplates';

const EducationCourse = () => {
  const [loadings, setLoadings] = useState(loading)
  const [state, setState] = useState<InitializeStateCourseModel>(initializeCourseState)

  const { fetchCourses } = useCourses();
  const { AddCourses } = InsertingCourse();
  const { RemoveCourse } = RemovingCourseFromList();
  const { updateCourse } = UpdatingEducationalCourse();
  const { fetchCategoriesList } = useCategoriesList();
  const { fetchTemplates } = useCoursesTemplates();

  // let courses: GetCoursesModel | undefined;
  // let categories: GetCategoriesListModel[] | undefined;
  // let templates: GetGeneralTemplateModel[] | undefined;
  const AddCourseRef = useRef<{ ResetMethod: () => void }>(null);
  const UpdateRef = useRef<{ handleOpen: () => void }>(null);

  // get categories in first
  useEffect(() => {
    const loadInitialCourses = async () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const res = await fetchCourses().then((result) => {
        if (result) {
          if (typeof result == 'object' && result !== null)
            setState((prev) => ({ ...prev, courses: result?.educationalCourses, totalCount: Math.ceil(Number(result!.totalCount) / 10) }));
        }
      })
    };
    const loadInitialCategoriesList = async () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const res = await fetchCategoriesList().then((result) => {
        if (result) {
          if (Array.isArray(result)) {
            setState(prev => ({ ...prev, categories: result }))
          }
        }
      })
    };

    const loadInitialTemplatesList = async () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const res = await fetchTemplates().then((result) => {
        if (result) {
          if (Array.isArray(result)) {
            setState(prev => ({ ...prev, templates: result }))
          }
        }
      })
    };
    loadInitialCourses();
    loadInitialCategoriesList();
    loadInitialTemplatesList();
  }, [])

  //  get categories by searchKey
  const handleGetSearchKey = async (data: string) => {
    const res = await fetchCourses(data, 1).then((result) => {
      if (result) {
        if (typeof result == 'object') {
          setState((state) => ({ ...state, searchKey: data, totalCount: Math.ceil(Number(result!.totalCount) / 10), courses: result!.educationalCourses }))
        }
      }
    })
  }

  //  get categories on Clicked on pagination Buttons
  const handleGetPageNo = async (page: number) => {
    const res = await fetchCourses(state.searchKey, page).then((result) => {
      if (result) {
        if (typeof result == 'object') {
          setState((prev) => ({ ...prev, courses: result!.educationalCourses }));
        }
      }
    })
  }

  // remove Course item
  const handleRemoveCourse = async (id: number) => {
    let optionIndex = state.courses!.indexOf(state.courses!.find((item) => item.id == id)!)
    setLoadings((state) => ({ ...state, response: true }))
    const res = await RemoveCourse(id).then((res) => {
      setLoadings((state) => ({ ...state, response: false })),
        res == true && (optionIndex != -1 && state.courses?.splice(optionIndex, 1))

    })
  }

  //Add Course
  const handleAddCourse = async (data: CourseItemsModel) => {
    setLoadings((state) => ({ ...state, response: true }))
    const res = await AddCourses(data).then((result) => {
      setLoadings((state) => ({ ...state, response: false }));
      if (result) {
        if (AddCourseRef.current) {
          AddCourseRef.current.ResetMethod()
          typeof result == 'object' ?
            setState((prev) => ({ ...prev, courses: prev.courses!.length > 0 ? [...prev.courses!, result!] : [result!] })) :
            setState((prev) => ({ ...prev, courses: [...prev.courses!] }))
        }
      }
    })
  }

  //Update Course
  const handleUpdateCourse = async (data: CourseItemsModel) => {
    let option = state.courses!.find((item) => item.id == data.id)!
    setLoadings((state) => ({ ...state, response: true }))
    const res = await updateCourse(data).then((result) => {
      setLoadings((state) => ({ ...state, response: false }));
      setState(prev => ({ ...prev, selectedCourse: undefined }))
      if (result == true) {
        state.courses!.splice(state.courses!.indexOf(option!), 1,
          {
            ...option,
            faName: data.faName,
            name: data.name,
            courseDesc: data.courseDesc ?? '',
            courseFaDesc: data.faCourseDesc ?? '',
            categoryFaName: state.categories!.find(item => item.id == data.courseCategoryId)!.faName,
            categoryName: state.categories!.find(item => item.id == data.courseCategoryId)!.name,
            templateName: state.templates!.find(item => item.id == data.templateId)!.name,
            courseCode: data.courseCode ?? ''
          })
      }
    })
  }
  //Select-Course to update
  const handleSelectedCourse = (data: EducationCoursesModel) => {
    setState((prev) => ({ ...prev, selectedCourse: data }))
    if (UpdateRef.current) {
      UpdateRef.current.handleOpen()
    }
  }

  return (
    <section className='p-1'>
      {loadings.response == true && <Loading />}
      <AddCourse ref={AddCourseRef} categories={state.categories} templates={state.templates} onSubmit={handleAddCourse} />
      <CustomizedSearched searchKey={handleGetSearchKey} />
      <CoursesTable courses={state.courses} selectedCourse={handleSelectedCourse} removeCourseId={handleRemoveCourse} />
      <CustomizedPagination count={state.totalCount} handlePage={handleGetPageNo} />
      <UpdateCourseComponent ref={UpdateRef} categories={state.categories} templates={state.templates} course={state.selectedCourse} onSubmit={handleUpdateCourse} />
    </section>
  )
}

export default EducationCourse