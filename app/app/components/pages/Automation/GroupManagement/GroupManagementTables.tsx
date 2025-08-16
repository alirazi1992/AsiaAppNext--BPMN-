"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, Checkbox, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Textarea, Typography } from "@material-tailwind/react";
import colorStore from "@/app/zustandData/color.zustand";
import themeStore from "@/app/zustandData/theme.zustand";
import useAxios from "@/app/hooks/useAxios";
import Select2 from 'react-select';
import useStore from "@/app/hooks/useStore";
import { AxiosResponse } from "axios";
import {
  Response,
  GroupManagementModel,
  GroupMember,
  ReceiversModel,
  SelectReceiversModel,
  MemberInformaionModel,
  LoadingModel
} from "@/app/models/Automation/GroupManagementModel";
import ButtonComponent from "@/app/components/shared/ButtonComponent";
import Swal from "sweetalert2";
import { ActionMeta, SingleValue } from "react-select";
import { RecieveTypes } from "@/app/models/Automation/NewDocumentModels";
import TableSkeleton from "@/app/components/shared/TableSkeleton";
import Loading from '@/app/components/shared/loadingResponse';
// ****icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import InputSkeleton from "@/app/components/shared/InputSkeleton";

const GroupManagementTablesComponent = () => {
  const { AxiosRequest } = useAxios()
  const themeMode = useStore(themeStore, (state) => state);
  const color = useStore(colorStore, (state) => state);
  const [Groups, SetGroups] = useState<GroupManagementModel[]>();
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [openAddMemebr, setOpenAddMember] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>("")
  const [SelectedGroup, SetSelectedGroup] = useState<number>(0);
  const [GroupName, SetGroupName] = useState<string>("");
  const [receiversState, setReceiversState] = useState<SelectReceiversModel[]>();
  const [receiveTypes, setReceiveTypes] = useState<RecieveTypes[]>([])
  const [selectedMember, setSelectedMember] = useState<GroupMember>({
    actorId: 0,
    actorName: "",
    desc: "",
    id: 0,
    isHidden: false,
    label: "",
    level: 0,
    receiveTypeId: 0,
    value: 0
  })
  const [loadings, setLoadings] = useState<LoadingModel>({
    loadingGroup: false,
    loadingMember: false,
    loadingResponse: false,
    loadingReceiveType: false,
    loadingGetReceivers: false
  })



  const handleEditMemberInfo = () => setEditOpen(!editOpen)
  const handleAddFolderArchive = () => setOpen(!open);
  const handleAddMember = () => setOpenAddMember(!openAddMemebr);
  let info = {
    desc: "",
    receiveTypeId: 0,
    isHidden: false,
    receiver: null,
  }
  const [memberInfo, setMemberInfo] = useState<MemberInformaionModel>(info)
  let SelectReceiverRef = useRef() as any;
  const GetReceivers = async () => {
    setLoadings((state) => ({ ...state, loadingGetReceivers: true }))
    let url =
      `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getreceivers`;
    let method = "get";
    let data = {};
    let response: AxiosResponse<Response<ReceiversModel[]>> =
      await AxiosRequest({ url, method, data, credentials: true });
    if (response) {
      setLoadings((state) => ({ ...state, loadingGetReceivers: false }))
      setReceiversState(response.data.data.map((option) => (
        {
          title: option.title,
          actorId: option.actorId,
          level: option.level,
          label: option.title
        }
      )));
    }
  };

  const GetRecieveTypes = async () => {
    setLoadings((state) => ({ ...state, loadingReceiveType: true }))
    let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getreceivetypes?doctypeid=1`;
    let method = "get";
    let data = {};
    let response: AxiosResponse<Response<RecieveTypes[]>> = await AxiosRequest({ url, method, data, credentials: true });
    if (response) {
      setLoadings((state) => ({ ...state, loadingReceiveType: false }))
      if (response.data.data != null && response.data.data.length > 0 && response.data.status) {
        setReceiveTypes(response.data.data.map((item) => {
          return {
            label: item.faTitle,
            value: item.id,
            isDefault: item.isDefault,
            title: item.title,
            faTitle: item.faTitle,
            id: item.id
          }
        }))
      }
    }
  }

  const GetGroups = async () => {
    setLoadings((state) => ({ ...state, loadingGroup: true }))
    let url =
      `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getgroups`;
    let method = "get";
    let data = {};
    let response: AxiosResponse<Response<GroupManagementModel[]>> = await AxiosRequest({ url, method, data, credentials: true });
    if (response) {
      setLoadings((state) => ({ ...state, loadingGroup: false }))
      if (response.data.status) {
        SetGroups(response.data.data);
      }
    }
  };

  useEffect(() => {
    GetGroups();
    GetReceivers();
    GetRecieveTypes();
  }, []);


  const DeleteItem = async (option: number) => {
    Swal.fire({
      background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "Remove Member",
      text: "Are you sure you want to remove this member?!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "yes, remove member!",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadings((state) => ({ ...state, loadingResponse: true }))
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/removemember`;
        let method = "delete";
        let data = { id: option }
        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
          setLoadings((state) => ({ ...state, loadingResponse: false }))
          if (response.data.status && response.data.data) {
            let group: GroupMember[] = Groups?.filter(p => p.id == SelectedGroup)[0].receiverGroupMembers!
            let index = group.indexOf(group.find(p => p.id == option)!);
            if (index !== -1) {
              let Array = [...group]
              Array.splice(index, 1)
              Groups!.filter(p => p.id == SelectedGroup)[0].receiverGroupMembers = Array
              SetGroups([...Groups!])
            }
          } else {
            Swal.fire({
              background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "Remove Member",
              text: response.data.message,
              icon: !response.data.status ? "error" : "warning",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK!",
            })
          }
        }
      }
    });
  }

  const DeleteGroup = async (option: number) => {
    Swal.fire({
      background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "Remove Group",
      text: "Are you sure you want to remove this group?!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "yes, remove it!",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadings((state) => ({ ...state, loadingResponse: true }))
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/removegroup`;
        let method = "delete";
        let data = { id: option }
        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
          setLoadings((state) => ({ ...state, loadingResponse: false }))
          if (response.data.status && response.data.data) {
            let index = Groups!.indexOf(Groups!.find(p => p.id == option)!);
            if (index !== -1) {
              let Array = [...Groups!]
              Array.splice(index, 1)
              SetGroups([...Array])
            }
          } else {
            Swal.fire({
              background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "Remove Group",
              text: response.data.message,
              icon: !response.data.status ? "error" : "warning",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK!",
            })
          }
        }
      }
    });
  }

  const AddGroup = async () => {
    Swal.fire({
      background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "Add Group",
      text: "Are you sure you want to add the group?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "yes, add it!",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadings((state) => ({ ...state, loadingResponse: true }))
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/addgroup`;
        let method = "put";
        let data = { groupName: GroupName }
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
          setLoadings((state) => ({ ...state, loadingResponse: false }))
          if (response.data.status && response.data.data != 0) {
            let group: GroupManagementModel = { id: response.data.data, name: GroupName, receiverGroupMembers: [] }
            Groups!.push(group);
            SetGroups([...Groups!])
          } else {
            Swal.fire({
              background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "Add Group",
              text: response.data.message,
              icon: !response.data.status ? "error" : "warning",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK!",
            })
          }
        }
      }
    });
  }

  const AddMember = async () => {
    Swal.fire({
      background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "Add Member",
      text: "Are you sure you want to add the member?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "yes, add member!",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadings((state) => ({ ...state, loadingResponse: true }))
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/addmember`;
        let method = "put";
        let data = {
          "groupId": SelectedGroup,
          "actorId": memberInfo!.receiver!.actorId,
          "level": memberInfo!.receiver!.level,
          "desc": memberInfo.desc,
          "isHidden": memberInfo.isHidden,
          "receiveTypeId": memberInfo.receiveTypeId
        }
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
          setLoadings((state) => ({ ...state, loadingResponse: false }))
          if (response.data.status && response.data.data != 0) {
            setMemberInfo((state) => ({ ...state, id: response.data.data }))
            let member: GroupMember = {
              id: response.data.data,
              actorName: memberInfo.receiver!.title,
              level: data.level,
              actorId: data.actorId,
              label: memberInfo.receiver!.title,
              value: memberInfo.receiver!.actorId,
              desc: data.desc,
              isHidden: data.isHidden,
              receiveTypeId: data.receiveTypeId
            };
            let group: GroupManagementModel = Groups!.find(p => p.id == SelectedGroup)!;
            group.receiverGroupMembers == null ? group.receiverGroupMembers = [member] : group.receiverGroupMembers.push(member);
            let index = Groups!.indexOf(Groups!.find(p => p.id == SelectedGroup)!);
            if (index !== -1) {
              let Array = [...Groups!]
              Array.splice(index, 1, group)
              SetGroups([...Array])
            }
          } else {
            Swal.fire({
              background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "Add Member",
              text: response.data.message,
              icon: !response.data.status ? "error" : "warning",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK!",
            })
          }
        }
      }
    });
  }
  const EditMember = async () => {
    Swal.fire({
      background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "Update Member",
      text: "Are you sure you want to update the member?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "yes, update!",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadings((state) => ({ ...state, loadingResponse: true }))
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/updatemember`;
        let method = "patch";
        let data = {
          "desc": selectedMember!.desc,
          "receiveTypeId": selectedMember!.receiveTypeId,
          "isHidden": selectedMember!.isHidden,
          "id": selectedMember!.id,
          "groupId": SelectedGroup
        }
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
          setLoadings((state) => ({ ...state, loadingResponse: false }))
          if (response.data.status && response.data.data != 0) {
            setMemberInfo((state) => ({ ...state }))
            let member: GroupMember = {
              id: response.data.data,
              actorName: selectedMember.actorName,
              level: selectedMember!.level,
              actorId: selectedMember!.actorId,
              label: selectedMember!.actorName,
              value: selectedMember!.actorId,
              desc: data.desc,
              isHidden: data.isHidden,
              receiveTypeId: data.receiveTypeId
            };
            let group: GroupManagementModel = Groups!.find(p => p.id == SelectedGroup)!;
            let Array = [...Groups!]

            let x = group.receiverGroupMembers;
            let index = x.indexOf(x.find((item) => item.actorId == member.actorId && item.level == member.level)!)
            x.splice(index, 1)
            x.push(member)
            Array.splice(index, 1, group)
            SetGroups([...Array])
          } else {
            Swal.fire({
              background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "Update Member",
              text: response.data.message,
              icon: !response.data.status ? "error" : "warning",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK!",
            })
          }
        }
      }
    });
  }

  return (
    <>
      {loadings.loadingResponse == true && <Loading />}
      <div className="flex flex-col-reverse md:flex-row items-center justify-center md:justify-around md:items-start my-3 ">
        <CardBody className="w-[95%] mx-auto md:w-[59%]  my-4 md:my-0 p-0 rounded-2xl overflow-hidden"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          {(SelectedGroup != 0 && Groups?.find(p => p.id == SelectedGroup) != null) ?
            <table dir="rtl" className={"w-full relative text-center max-h-[400px] rounded-lg"}>
              <thead>
                <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                  <th style={{ borderBottomColor: color?.color }}
                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                      عنوان
                    </Typography>
                  </th>
                  <th style={{ borderBottomColor: color?.color }}
                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                      <IconButton className="flex justify-center items-center mx-auto p-1" onClick={handleAddMember} style={{ background: color?.color }} size="sm"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <AddIcon
                          className='p-1'
                          onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                          onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                        />
                      </IconButton>
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                {Groups?.filter((option: GroupManagementModel) => option.id == SelectedGroup)[0].receiverGroupMembers?.map((option: GroupMember, num: number) => {
                  return (
                    <tr key={num} id={(option.id).toString()} className={`${num % 2 ? !themeMode ||themeMode?.stateMode ? 'braedDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                      <td style={{ width: '100%' }} className='p-1'>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className={`font-[500] text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                          {option.actorName}
                        </Typography>
                      </td>
                      <td style={{ width: '60px' }} className='p-1'>
                        <div className='container-fluid mx-auto p-0.5'>
                          <div className="flex flex-row justify-evenly">
                            <Button
                              onClick={() => DeleteItem(option.id)}
                              style={{ background: color?.color }} size="sm"
                              className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              <DeleteIcon
                                fontSize="small"
                                className='p-1'
                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                              />
                            </Button>
                            <Button
                              onClick={() => { setSelectedMember(option), handleEditMemberInfo(); } }
                              style={{ background: color?.color }} size="sm"
                              className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              <EditIcon
                                fontSize="small"
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
            </table> : ""}
        </CardBody>
        <CardBody className="w-[95%] mx-auto md:w-[39%] my-4 md:my-0 p-0 rounded-2xl overflow-hidden"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          {loadings.loadingGroup == false ? <table dir="rtl" className={"w-full relative text-center max-h-[400px] rounded-lg"}>
            <thead>
              <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                <th style={{ borderBottomColor: color?.color }}
                  className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    عنوان
                  </Typography>
                </th>
                <th style={{ borderBottomColor: color?.color }}
                  className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    <IconButton className="flex justify-center items-center mx-auto p-1" onClick={handleAddFolderArchive} style={{ background: color?.color }} size="sm"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      <AddIcon
                        className='p-1'
                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                      />
                    </IconButton>
                  </Typography>
                </th>

              </tr>
            </thead>
            <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
              {Groups?.map((option: GroupManagementModel, num: number) => {
                return (
                  <tr key={num} id={(option.id).toString()} className={`${num % 2 ? !themeMode ||themeMode?.stateMode ? 'braedDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                    <td className='p-1'>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className={`font-normal p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                      >
                        {option.name}
                      </Typography>
                    </td>
                    <td style={{ width: '60px' }} className='p-1'>
                      <div className='container-fluid mx-auto p-0.5'>
                        <div className="flex flex-row justify-evenly">
                          <Button
                            onClick={() => { DeleteGroup(option.id); } }
                            style={{ background: color?.color }} size="sm"
                            className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <DeleteIcon fontSize="small"
                              className='p-1'
                              onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                              onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                            />
                          </Button>
                          <Button
                            onClick={() => SetSelectedGroup(option.id)}
                            style={{ background: color?.color }} size="sm"
                            className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <ArrowBackIcon fontSize="small"
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
          </table> : < TableSkeleton />}
        </CardBody>
        <Dialog className={`absolute top-0 ' ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={open} handler={handleAddFolderArchive}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>افزودن پوشه</DialogHeader>
          <DialogBody  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <section dir="ltr" className='flex justify-start flex-col gap-6'>
              <div dir="ltr">
                <Input dir="rtl" onBlur={(e) => SetGroupName(e.currentTarget.value)} crossOrigin="" size="md" label="نام" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" value={groupName} onChange={(e: any) => setGroupName(e.target.value)} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              </div>
            </section>
          </DialogBody>
          <DialogFooter className='w-full flex flex-row flex-nowrap justify-between items-center'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <section className='flex justify-center'>
              <ButtonComponent onClick={handleAddFolderArchive}>انصراف</ButtonComponent>
            </section>
            <section className='flex justify-center'>
              <ButtonComponent onClick={AddGroup}>تائید</ButtonComponent>
            </section>
          </DialogFooter>
        </Dialog>

        <Dialog className={`absolute top-0 ' ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={openAddMemebr} handler={handleAddMember}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>افزودن عضو</DialogHeader>
          <DialogBody  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
            <section className='flex flex-col gap-3'>
              {loadings.loadingGetReceivers == false ? <Select2 isRtl
                className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%]`} ref={SelectReceiverRef} placeholder="نام اعضا"
                options={receiversState}
                onChange={(option: SingleValue<SelectReceiversModel>, actionMeta: ActionMeta<SelectReceiversModel>) => { setMemberInfo((state: MemberInformaionModel) => ({ ...state, receiver: { actorId: option!.actorId, label: option!.label, level: option!.level, title: option!.title } })) }}
                maxMenuHeight={220}
                theme={(theme) => ({
                  ...theme,
                  height: 10,
                  borderRadius: 5,
                  colors: {
                    ...theme.colors,
                    color: '#607d8b',
                    neutral10: `${color?.color}`,
                    primary25: `${color?.color}`,
                    primary: '#607d8b',
                    neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                    neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}`
                  },
                })}
              /> : <InputSkeleton />}
              <Textarea dir="rtl" onBlur={(e: any) => setMemberInfo((state: MemberInformaionModel) => ({ ...state, desc: e.target.value }))} style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" variant="outlined" label="توضیحات" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              {loadings.loadingReceiveType == false ? <Select2 isRtl
                className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full`}
                options={receiveTypes}
                maxMenuHeight={220}
                defaultValue={receiveTypes.find((item: RecieveTypes) => item.isDefault == true)}
                onChange={(option: SingleValue<RecieveTypes>, actionMeta: ActionMeta<RecieveTypes>) => { setMemberInfo((state: MemberInformaionModel) => ({ ...state, receiveTypeId: option!.id })) }}
                value={receiveTypes?.find((p) => p.id == memberInfo.receiveTypeId)}
                theme={(theme) => ({
                  ...theme,
                  height: 10,
                  borderRadius: 5,
                  colors: {
                    ...theme.colors,
                    color: '#607d8b',
                    neutral10: `${color?.color}`,
                    primary25: `${color?.color}`,
                    primary: '#607d8b',
                    neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                    neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}`
                  },
                })}
              /> : <InputSkeleton />}
              <Checkbox onChange={(e) => { setMemberInfo((state) => ({ ...state, isHidden: e.currentTarget?.checked })); } } dir="rtl" crossOrigin={""} color='blue-gray'
              label={<Typography className={`flex font-medium ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                مخفی
              </Typography>} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}              />
            </section>
          </DialogBody>
          <DialogFooter className='w-full flex flex-row flex-nowrap justify-between items-center'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <section className='flex justify-center'>
              <ButtonComponent onClick={handleAddMember}>انصراف</ButtonComponent>
            </section>
            <section className='flex justify-center'>
              <ButtonComponent onClick={AddMember}>تائید</ButtonComponent>
            </section>
          </DialogFooter>
        </Dialog>
        <Dialog className={`absolute top-0 ' ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={editOpen} handler={handleEditMemberInfo}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>ویرایش عضو</DialogHeader>
          <DialogBody  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
            <section className='flex flex-col gap-3'>
              <Select2 isRtl
                maxMenuHeight={220}
                isSearchable={false}
                className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%]`} ref={SelectReceiverRef} placeholder="نام اعضا"
                value={receiversState?.find((item: SelectReceiversModel) => item.actorId == selectedMember?.actorId && item.level == selectedMember.level)}
                theme={(theme) => ({
                  ...theme,
                  height: 10,
                  borderRadius: 5,
                  colors: {
                    ...theme.colors,
                    color: '#607d8b',
                    neutral10: `${color?.color}`,
                    primary25: `${color?.color}`,
                    primary: '#607d8b',
                    neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                    neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}`
                  },
                })}
              />
              <Textarea dir="rtl" value={selectedMember!.desc} onChange={(e: any) => setSelectedMember((state: GroupMember) => ({ ...state, desc: e.target.value }))} style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" variant="outlined" label="توضیحات" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              <Select2 isRtl
                maxMenuHeight={220}
                className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full`}
                options={receiveTypes}
                defaultValue={receiveTypes.find((item: RecieveTypes) => item.isDefault == true)}
                onChange={(option: SingleValue<RecieveTypes>, actionMeta: ActionMeta<RecieveTypes>) => { setSelectedMember((state: GroupMember) => ({ ...state, receiveTypeId: option!.id })) }}
                value={receiveTypes?.find((p) => p.id == selectedMember!.receiveTypeId)}
                theme={(theme) => ({
                  ...theme,
                  height: 10,
                  borderRadius: 5,
                  colors: {
                    ...theme.colors,
                    color: '#607d8b',
                    neutral10: `${color?.color}`,
                    primary25: `${color?.color}`,
                    primary: '#607d8b',
                    neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                    neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}`
                  },
                })}
              />
              <Checkbox defaultChecked={selectedMember?.isHidden} onBlur={(e) => { setSelectedMember((state) => ({ ...state, isHidden: e.currentTarget?.checked })); } } dir="rtl" crossOrigin={""} color='blue-gray' label={<Typography className={`flex font-medium ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                مخفی
              </Typography>} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </section>
          </DialogBody>
          <DialogFooter className='w-full flex flex-row flex-nowrap justify-between items-center'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <section className='flex justify-center'>
              <ButtonComponent onClick={handleEditMemberInfo}>انصراف</ButtonComponent>
            </section>
            <section className='flex justify-center'>
              <ButtonComponent onClick={EditMember}>تائید</ButtonComponent>
            </section>
          </DialogFooter>
        </Dialog>
      </div>
    </>
  )
};

export default GroupManagementTablesComponent;
