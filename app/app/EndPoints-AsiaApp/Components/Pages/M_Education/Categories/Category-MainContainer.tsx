'use client';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import AddCategory from '@/app/EndPoints-AsiaApp/Components/Pages/M_Education/Categories/AddCategory'
import CategoriesTable from '@/app/EndPoints-AsiaApp/Components/Pages/M_Education/Categories/CategoriesTable'
import CustomizedSearch from '@/app/EndPoints-AsiaApp/Components/Shared/SearchComponent'
import { useCategories } from '@/app/Application-AsiaApp/M_Education/fetchCategories';
import { CategoryItemsModel, CourseCategoriesModels, GetCourseCategoriesModel, InitializeStateCategoryModel } from '@/app/Domain/M_Education/Categories';
import { InsertingCategory } from '@/app/Application-AsiaApp/M_Education/InsertCreatedCategoryToTable';
import CustomizedPagination from '@/app/EndPoints-AsiaApp/Components/Shared/Pagination';
import { initializeCategoryState } from '@/app/Application-AsiaApp/Utils/M_Education.ts/data';
import { loading } from '@/app/Application-AsiaApp/Utils/shared';
import Loading from '@/app/components/shared/loadingResponse';
import { RemovingCategoryFromList } from '@/app/Application-AsiaApp/M_Education/RemoveCategory';
import UpdateCategory from './UpdateCategory';
import { UpdatingCategory } from '@/app/Application-AsiaApp/M_Education/UpdateCategory';

const EducationCategory = () => {
  const [state, setState] = useState<InitializeStateCategoryModel>(initializeCategoryState)
  const [loadings, setLoadings] = useState(loading)
  const { fetchCategories } = useCategories();
  const { AddCategories } = InsertingCategory();
  const { RemoveCategory } = RemovingCategoryFromList();
  const { updateCategory } = UpdatingCategory();

  // let categories: GetCourseCategoriesModel | string | undefined;
  const AddCategoryRef = useRef<{ ResetMethod: () => void }>(null);
  const UpdateRef = useRef<{ handleOpen: () => void }>(null);
  // get categories in first
  useEffect(() => {
    const loadInitialCategories = async () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const res = await fetchCategories().then((result) => {
        if (result) {
          if (typeof result == 'object' && 'categoriesList' in result) {
            setState((prev) => ({ ...prev, list: result!.categoriesList, totalCount: Math.ceil(Number(result!.totalCount) / 10) }));
          }
        }

      });
    };
    loadInitialCategories();
  }, [])

  //  get categories by searchKey
  const handleGetSearchKey = async (data: string) => {
    const res = await fetchCategories(data, 1).then((result) => {
      if (result) {
        if (typeof result == 'object' && 'categoriesList' in result) {
          setState((state) => ({ ...state, searchKey: data, totalCount: Math.ceil(Number(result!.totalCount) / 10), list: result!.categoriesList }))
        }
      }
    })
  }

  //  get categories on Clicked on pagination Buttons
  const handleGetPageNo = async (page: number) => {
    const res = await fetchCategories(state.searchKey, page).then((result) => {
      if (result) {
        if (typeof result == 'object' && 'categoriesList' in result) {
          setState((prev) => ({ ...prev, list: result!.categoriesList }));
        }
      }
    })
  }

  // add category item
  const handleAddCategory = async (data: CategoryItemsModel) => {
    const res = await AddCategories(data).then((result) => {
      setLoadings((state) => ({ ...state, response: true }))
      if (result) {
        setLoadings((state) => ({ ...state, response: false }));
        if (typeof result == 'object' && 'id' in result) {
          setState((prev) => ({ ...prev, list: prev.list!.length > 0 ? [...prev.list!, result!] : [result!] }));
        }
        if (AddCategoryRef.current) {
          AddCategoryRef.current.ResetMethod()
        }
      }
    })
  }
  // Update category item
  const handleSelectedCategory = (data: CourseCategoriesModels) => {
    setState((prev) => ({ ...prev, selectedCategory: data }))
    if (UpdateRef.current) {
      UpdateRef.current.handleOpen()
    }
  }

  const handleUpdateCategory = async (data: CategoryItemsModel) => {
    let option = state.list!.find((item) => item.id == data.id)!
    setLoadings((state) => ({ ...state, response: true }))
    const res = await updateCategory(data).then((result) => {
      setLoadings((state) => ({ ...state, response: false }));
      setState(prev => ({ ...prev, selectedCategory: undefined }))
      if (result == true) {
        state.list!.splice(state.list!.indexOf(option!), 1, { ...option, faName: data.faName, name: data.name })
      }
    })
  }
  // remove category item
  const handleRemoveCategory = async (id: number) => {
    let index = state.list!.indexOf(state.list!.find((item) => item.id == id)!)
    setLoadings((state) => ({ ...state, response: true }))
    const res = await RemoveCategory(id).then((res) => {
      setLoadings((state) => ({ ...state, response: false })),
        res == true && (index != -1 && state.list?.splice(index, 1))

    })
  }


  return (
    <section className='p-1'>
      {loadings.response == true && <Loading />}
      <AddCategory ref={AddCategoryRef} onSubmit={handleAddCategory} />
      <CustomizedSearch searchKey={handleGetSearchKey} />
      <CategoriesTable categories={state.list} selectedCategory={handleSelectedCategory} removeCategoryId={handleRemoveCategory} />
      <CustomizedPagination count={state.totalCount} handlePage={handleGetPageNo} />
      <UpdateCategory ref={UpdateRef} category={state.selectedCategory} onSubmit={handleUpdateCategory} />
    </section>
  )
}

export default EducationCategory

