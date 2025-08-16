'use client';
import React, { useEffect, useState } from 'react';
import EditInfoList from './EditInfoList';
import useStore from '@/app/hooks/useStore';
import Loading from '@/app/components/shared/loading';
import useAxios from '@/app/hooks/useAxios';
import { AxiosResponse } from 'axios';
import { GetUserModel } from '@/app/models/HR/userInformation';
import { Response } from '@/app/models/UserManagement/AddUserModel';
import UpdateUserStore, { UpdateUserData } from '@/app/zustandData/updateUsers';
import UpdateUsersStore from '@/app/zustandData/UserManagementUpdate.zustand'

const EditInfoComponent = () => {

  const [loadingState, setLoadingState] = useState<boolean>(false)

  return (
    (loadingState == false ?
      <EditInfoList /> : <Loading />
    )

  )
}

export default EditInfoComponent; 