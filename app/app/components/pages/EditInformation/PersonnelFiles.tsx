"use client";
import { ImageTypes } from "@/app/Application-AsiaApp/Utils/shared";
import MyCustomComponent from "@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui";
import DatePickare from "@/app/EndPoints-AsiaApp/Components/Shared/DatePickareComponent";
import useAxios from "@/app/hooks/useAxios";
import useStore from "@/app/hooks/useStore";
import {
  FileAttachmentTypes,
  GetAttachmentTypes,
  GetFileModel,
  PersonelFileType,
} from "@/app/models/HR/models";
import { Response } from "@/app/models/HR/sharedModels";
import { UserProfileDocumentsModel } from "@/app/models/HR/userInformation";
import { LoadingModel, ViewAttachments } from "@/app/models/sharedModels";
import colorStore from "@/app/zustandData/color.zustand";
import themeStore from "@/app/zustandData/theme.zustand";
import UpdateUsersStore from "@/app/zustandData/updateUsers";
import UpdateUserStore from "@/app/zustandData/UserManagementUpdate.zustand";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  CardBody,
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Checkbox, FormControlLabel } from "@mui/material";
import { AxiosResponse } from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_en from "react-date-object/locales/persian_en";
import { useForm } from "react-hook-form";
import { DateObject } from "react-multi-date-picker";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import "react-multi-date-picker/styles/backgrounds/bg-gray.css";
import "react-multi-date-picker/styles/layouts/mobile.css";
import Select, { ActionMeta, SingleValue } from "react-select";
import Swal from "sweetalert2";
import * as yup from "yup";
import AcsPdfViewer from "../../pdfViewer/AcsPdfViewer";
import Loading from "../../shared/loadingResponse";
import TableSkeleton from "../../shared/TableSkeleton";
import UpdatePersonelFiles from "./UpdatePersonelFiles";

const PersonalFile = () => {
  const { AxiosRequest } = useAxios();
  let loading = {
    loadingTable: false,
    loadingRes: false,
  };
  const [loadings, setLoadings] = useState<LoadingModel>(loading);
  const [open, setOpen] = useState<boolean>(false);
  const handleOpenDocument = () => setOpen(!open);
  const [attachment, setAttachment] = useState<ViewAttachments>({
    base64: "",
    type: "",
  });
  const color = useStore(colorStore, (state) => state);
  const themeMode = useStore(themeStore, (state) => state);
  const User = UpdateUsersStore((state) => state);
  const Update = useStore(UpdateUserStore, (state) => state);
  const [item, setItem] = useState<UserProfileDocumentsModel | null>(null);
  const schema = yup.object({
    PersonnelFiles: yup
      .object()
      .shape({
        fileType: yup.number().required().min(1, "اجباری"),
        ExpireDate: yup.string().when("isMortal", ([isMortal], sch) => {
          return isMortal == true ? sch.required("اجباری") : sch.nullable();
        }),
        attachmentFile: yup.string().required("اجباری"),
        attachmentType: yup.string().required("اجباری"),
        attachmentName: yup.string().required("اجباری"),
      })
      .required(),
  });
  const {
    reset,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState,
    control,
    watch,
    trigger,
    clearErrors,
  } = useForm<PersonelFileType>({
    defaultValues: {
      PersonnelFiles: {
        attachmentFile: "",
        attachmentName: "",
        attachmentType: "",
        ExpireDate: "",
        fileType: 0,
        isMortal: false,
      },
    },
    mode: "all",
    resolver: yupResolver(schema),
  });
  const errors = formState.errors;
  const [profileDocument, setProfileDocument] = useState<
    UserProfileDocumentsModel[]
  >([]);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const handleUpdateDoc = () => setOpenUpdate(!openUpdate);
  const DeleteUserAttachments = (id: number) => {
    let url: string;
    if (User.userId != null) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteUserProfileDocument?documentId=${id}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteCurrentUserProfileDocument?documentId=${id}`;
    }
    Swal.fire({
      background:
        !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "حذف مدرک",
      text: "آیا از حذف این مورد اطمینان دارید!؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      confirmButtonText: "yes, Delete it!",
      cancelButtonColor: "#f43f5e",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadings((state) => ({ ...state, loadingRes: true }));
        let method = "delete";
        let data = {};
        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({
          url,
          method,
          data,
          credentials: true,
        });
        if (response) {
          setLoadings((state) => ({ ...state, loadingRes: false }));
          if (response.data.status && response.data.data) {
            let newDocuments = profileDocument.filter((item) => item.id != id);
            setProfileDocument([...newDocuments]);
          } else {
            Swal.fire({
              background:
                !themeMode || themeMode?.stateMode == true
                  ? "#22303c"
                  : "#eee3d7",
              color:
                !themeMode || themeMode?.stateMode == true
                  ? "white"
                  : "#463b2f",
              allowOutsideClick: false,
              title: "حذف مدرک",
              text: response.data.message,
              icon: response.data.status ? "warning" : "error",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK!",
            });
          }
        }
      }
    });
  };

  const [fileType, setFileType] = useState<GetAttachmentTypes[]>([]);

  const OnSubmit = async () => {
    Swal.fire({
      background:
        !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "ذخیره مدارک پرسنلی",
      text: "آیا از ذخیره مدرک پرسنلی اطمینان دارید؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      confirmButtonText: "yes, save it!",
      cancelButtonColor: "#f43f5e",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (!errors.PersonnelFiles) {
          setLoadings((state) => ({ ...state, loadingRes: true }));
          let url: string;
          let data: any;
          let method = "put";
          if (User.userId != null) {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/AddUserProfileDocument`;
            let data = {
              userId: User.userId,
              attachment: {
                expireDate: getValues("PersonnelFiles.ExpireDate"),
                attachmentTypeId: getValues("PersonnelFiles.fileType"),
                attachmentFile: getValues("PersonnelFiles.attachmentFile"),
                attachmentType: getValues("PersonnelFiles.attachmentType"),
                attachmentTitle: getValues("PersonnelFiles.attachmentName"),
              },
            };
            let response: AxiosResponse<Response<any>> = await AxiosRequest({
              url,
              method,
              data,
              credentials: true,
            });
            if (response) {
              reset();
              setState((prev) => ({ ...prev, date: null }));
              setLoadings((state) => ({ ...state, loadingRes: false }));
              if (response.data.status && response.data.data != 0) {
                setProfileDocument((state) => [
                  ...state,
                  {
                    expireDate:
                      data.attachment.expireDate == ""
                        ? null
                        : data.attachment.expireDate!,
                    id: response.data.data,
                    profileAttachmentTypeId: data.attachment.attachmentTypeId,
                    userId: Update!.id!,
                  },
                ]);
              } else {
                Swal.fire({
                  background:
                    !themeMode || themeMode?.stateMode == true
                      ? "#22303c"
                      : "#eee3d7",
                  color:
                    !themeMode || themeMode?.stateMode == true
                      ? "white"
                      : "#463b2f",
                  allowOutsideClick: false,
                  title: "ذخیره مدارک پرسنلی",
                  text: response.data.message,
                  icon: response.data.status ? "warning" : "error",
                  confirmButtonColor: "#22c55e",
                  confirmButtonText: "OK!",
                });
              }
            }
          } else {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/AddCurrentUserProfileDocument`;
            data = {
              expireDate: getValues("PersonnelFiles.ExpireDate"),
              attachmentTypeId: getValues("PersonnelFiles.fileType"),
              attachmentFile: getValues("PersonnelFiles.attachmentFile"),
              attachmentType: getValues("PersonnelFiles.attachmentType"),
              attachmentTitle: getValues("PersonnelFiles.attachmentName"),
            };
            let response: AxiosResponse<Response<number>> = await AxiosRequest({
              url,
              method,
              data,
              credentials: true,
            });
            if (response) {
              reset();
              setState((prev) => ({ ...prev, date: null }));
              setLoadings((state) => ({ ...state, loadingRes: false }));
              if (response.data.status && response.data.data != 0) {
                setProfileDocument((state) => [
                  ...state,
                  {
                    expireDate: data.expireDate == "" ? null : data.expireDate!,
                    id: response.data.data,
                    profileAttachmentTypeId: data.attachmentTypeId,
                    userId: Update!.id!,
                  },
                ]);
              } else {
                Swal.fire({
                  background:
                    !themeMode || themeMode?.stateMode == true
                      ? "#22303c"
                      : "#eee3d7",
                  color:
                    !themeMode || themeMode?.stateMode == true
                      ? "white"
                      : "#463b2f",
                  allowOutsideClick: false,
                  title: "ذخیره مدارک پرسنلی",
                  text: response.data.message,
                  icon: response.data.status ? "warning" : "error",
                  confirmButtonColor: "#22c55e",
                  confirmButtonText: "OK",
                });
              }
            }
          }
        } else {
          Swal.fire({
            background:
              !themeMode || themeMode?.stateMode == true
                ? "#22303c"
                : "#eee3d7",
            color:
              !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "ذخیره مدارک پرسنلی",
            text: "از درستی و تکمیل موارد اضافه شده اطمینان حاصل فرمایید و مجددا تلاش کنید",
            icon: "warning",
            confirmButtonColor: "#22c55e",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };
  const fileRef = useRef() as any;
  const handleFile = async () => {
    const file = fileRef.current?.files && fileRef.current?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        let base64String = reader!.result!.toString();
        base64String = base64String.split(",")[1];
        setValue(
          `PersonnelFiles.attachmentName`,
          fileRef.current.files[0]?.name
        );
        setValue(`PersonnelFiles.attachmentType`, file.type);
        setValue(`PersonnelFiles.attachmentFile`, base64String);
        trigger([
          `PersonnelFiles.attachmentName`,
          `PersonnelFiles.attachmentType`,
          `PersonnelFiles.attachmentFile`,
        ]);
      };
    }
  };
  const GetUserAttachmnets = async (id: number) => {
    let url: string;
    if (User.userId != null) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserProfileDocumentAttachmnet?id=${id}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetCurrentUserProfileDocumentAttachmnet?id=${id}`;
    }
    let method = "get";
    let data = {};
    let response: AxiosResponse<Response<GetFileModel>> = await AxiosRequest({
      url,
      method,
      data,
      credentials: true,
    });
    const byteArray = Uint8Array.from(atob(response.data.data.file!), (c) =>
      c.charCodeAt(0)
    );
    const blob = new Blob([byteArray], { type: response.data.data.fileType! });
    const objectUrl = URL.createObjectURL(blob);
    setAttachment({
      base64: objectUrl,
      type: response.data.data.fileType!,
    });
    handleOpenDocument();
  };
  useEffect(() => {
    const GetAttachmentTypes = async () => {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/profile/GetAttachmentTypes?categoryId=1`;
      let method = "get";
      let data = {};
      let response: AxiosResponse<Response<GetAttachmentTypes[]>> =
        await AxiosRequest({ url, method, data, credentials: true });
      if (response) {
        response.data.status && response.data.data.length > 0
          ? setFileType(
              response.data.data.map((item) => {
                return {
                  faTitle: item.faTitle,
                  id: item.id,
                  label: item.faTitle,
                  title: item.title,
                  value: item.id,
                  defaultExpireByDay: item.defaultExpireByDay,
                  isExpirable: item.isExpirable,
                };
              })
            )
          : setFileType([]);
      }
    };
    GetAttachmentTypes();
  }, []);

  useEffect(() => {
    const GetProfileDocuments = async () => {
      setLoadings((state) => ({ ...state, loadingTable: true }));
      let url: string;
      if (User.userId != null && User.userId != undefined) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserProfileDocuments?userId=${User.userId}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetCurrentUserProfileDocuments`;
      }
      let data = {};
      let method = "get";
      let response: AxiosResponse<Response<UserProfileDocumentsModel[]>> =
        await AxiosRequest({ url, data, method, credentials: true });
      if (response) {
        setLoadings((state) => ({ ...state, loadingTable: false }));
        if (response.data.status && response.data.data.length > 0) {
          setProfileDocument(response.data.data);
        } else {
          setProfileDocument([]);
        }
      }
    };
    GetProfileDocuments();
  }, [User.userId, User.userName]);

  const handleData = (data: UserProfileDocumentsModel) => {
    let index: number = profileDocument.indexOf(
      profileDocument.find((x) => x.id == data.id)!
    );
    let option: UserProfileDocumentsModel = profileDocument.find(
      (x) => x.id == data.id
    )!;
    data != null
      ? profileDocument.splice(index, 1, {
          ...option,
          expireDate: data.expireDate == null ? null : data.expireDate,
          profileAttachmentTypeId: data.profileAttachmentTypeId,
        })
      : null;
  };

  const UpdateItem = (op: UserProfileDocumentsModel) => {
    setItem(op);
    handleUpdateDoc();
  };

  const handleState = (data: boolean) => {
    setOpenUpdate(data);
  };

  const [state, setState] = useState<{
    format: string;
    gregorian?: string;
    persian?: string;
    date?: DateObject | null;
  }>({ format: "YYYY/MM/DD" });

  const convert = (date: DateObject, format: string = state.format) => {
    let object = { date, format };
    setValue(
      "PersonnelFiles.ExpireDate",
      new DateObject(object).convert(gregorian, gregorian_en).format()
    );
    trigger("PersonnelFiles.ExpireDate");
    setState({
      gregorian: new DateObject(object).format(),
      persian: new DateObject(object).convert(persian, persian_en).format(),
      ...object,
    });
  };

  return (
    <MyCustomComponent>
      <>
        {loadings.loadingRes == true && <Loading />}
        <section className="w-full h-auto  ">
          <CardBody
            className={`${
              !themeMode || themeMode?.stateMode ? "cardDark" : "cardLight"
            } rounded-lg shadow-md h-full mx-auto `}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <form
              dir="rtl"
              onSubmit={handleSubmit(OnSubmit)}
              className="relative z-[10]"
            >
              <div className="w-max ">
                <Tooltip
                  className={
                    !themeMode || themeMode?.stateMode
                      ? "cardDark lightText"
                      : "cardLight darkText"
                  }
                  content="Save Personnel Files"
                  placement="top"
                >
                  <Button
                    type="submit"
                    size="sm"
                    style={{ background: color?.color }}
                    className="text-white capitalize p-1"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <SaveIcon className="p-1" />
                  </Button>
                </Tooltip>
              </div>
              <section className="grid grid-cols-1 md:grid-cols-3 md:gap-y-5 my-2">
                <div className="p-1 ">
                  <Select
                    isRtl
                    id="JobsInput"
                    isSearchable
                    {...register(`PersonnelFiles.fileType`)}
                    value={
                      fileType.find(
                        (item) => item.id == watch(`PersonnelFiles.fileType`)
                      ) ?? null
                    }
                    minMenuHeight={300}
                    className={`${
                      !themeMode || themeMode?.stateMode
                        ? "lightText"
                        : "darkText"
                    } w-full z-[90000]`}
                    placeholder="نوع مدرک"
                    options={fileType}
                    theme={(theme) => ({
                      ...theme,
                      height: 10,
                      borderRadius: 5,
                      colors: {
                        ...theme.colors,
                        color: "#607d8b",
                        neutral10: `${color?.color}`,
                        primary25: `${color?.color}`,
                        primary: "#607d8b",
                        neutral0: `${
                          !themeMode || themeMode?.stateMode
                            ? "#1b2b39"
                            : "#ded6ce"
                        }`,
                        neutral80: `${
                          !themeMode || themeMode?.stateMode
                            ? "white"
                            : "#463b2f"
                        }`,
                        neutral20: errors?.PersonnelFiles?.fileType
                          ? "#d32f3c"
                          : "#607d8b",
                        neutral30: errors?.PersonnelFiles?.fileType
                          ? "#d32f3c"
                          : "#607d8b",
                        neutral50: errors?.PersonnelFiles?.fileType
                          ? "#d32f3c"
                          : "#607d8b",
                      },
                    })}
                    onChange={(
                      option: SingleValue<FileAttachmentTypes>,
                      actionMeta: ActionMeta<FileAttachmentTypes>
                    ) => {
                      reset(),
                        setValue(
                          "PersonnelFiles.isMortal",
                          fileType.find((item) => item.id == option!.id)
                            ?.isExpirable
                        ),
                        setValue(`PersonnelFiles.fileType`, option!.id),
                        clearErrors(),
                        trigger();
                    }}
                  />
                  <label className="text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400">
                    {errors?.PersonnelFiles &&
                      errors?.PersonnelFiles?.fileType?.message}
                  </label>
                </div>

                <div className="p-1 relative">
                  <input
                    type="file"
                    autoComplete="off"
                    {...register(`PersonnelFiles.attachmentFile`)}
                    ref={fileRef}
                    onChange={async () => await handleFile()}
                    className={
                      errors?.PersonnelFiles &&
                      errors?.PersonnelFiles?.attachmentFile
                        ? `${
                            !themeMode || themeMode?.stateMode
                              ? "lightText"
                              : "darkText"
                          } border-red-400 border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused text-red-400 `
                        : `${
                            !themeMode || themeMode?.stateMode
                              ? "lightText"
                              : "darkText"
                          } border-[#607d8b] border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused `
                    }
                  />
                  <label className="absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900">
                    {errors?.PersonnelFiles &&
                      errors?.PersonnelFiles.attachmentFile?.message}
                  </label>
                </div>
                <section
                  className={`${
                    fileType.find(
                      (item) => item.id == watch("PersonnelFiles.fileType")
                    )?.isExpirable == false ||
                    watch("PersonnelFiles.fileType") == 0
                      ? " hidden"
                      : "grid grid-cols-2"
                  }`}
                >
                  <div className="p-1">
                    <FormControlLabel
                      className={`${
                        !themeMode || themeMode?.stateMode
                          ? "lightText"
                          : "darkText"
                      }`}
                      control={
                        <Checkbox
                          {...register(`PersonnelFiles.isMortal`)}
                          checked={watch("PersonnelFiles.isMortal")}
                          sx={{
                            color: color?.color,
                            "&.Mui-checked": {
                              color: color?.color,
                            },
                          }}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                      label="مدت دار"
                    />
                  </div>
                  <div className="p-1 relative">
                    <DatePickare
                      register={{ ...register(`PersonnelFiles.ExpireDate`) }}
                      label="تاریخ انقضاء"
                      value={state.date == null ? "" : state.date}
                      onChange={(date: DateObject) => convert(date)}
                      error={
                        errors?.PersonnelFiles &&
                        errors?.PersonnelFiles.ExpireDate &&
                        true
                      }
                      focused={watch(`PersonnelFiles.ExpireDate`)}
                      disabled={!watch(`PersonnelFiles.isMortal`)}
                    />
                    <label className="text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400">
                      {errors?.PersonnelFiles &&
                        errors?.PersonnelFiles!.ExpireDate?.message}
                    </label>
                  </div>
                </section>
              </section>
            </form>
          </CardBody>
          <section
            dir="rtl"
            className="w-[100%] h-auto lg:h-[72vh]  mx-auto  p-0 my-3"
          >
            {loadings.loadingTable == false ? (
              profileDocument.length > 0 && (
                <div className="w-full  overflow-y-auto max-[100%] ">
                  <table
                    dir="rtl"
                    className={`${
                      !themeMode || themeMode?.stateMode
                        ? "tableDark"
                        : "tableLight"
                    } w-full  max-h-[70vh] md:max-h-auto relative text-center `}
                  >
                    <thead className="sticky z-[5] top-0 left-0 w-full">
                      <tr
                        className={
                          !themeMode || themeMode?.stateMode
                            ? "themeDark"
                            : "themeLight"
                        }
                      >
                        <th
                          style={{ borderBottomColor: color?.color }}
                          className={`${
                            !themeMode || themeMode?.stateMode
                              ? "themeDark"
                              : "themeLight"
                          } p-3 sticky top-0 border-b-2 `}
                        >
                          <Typography
                            color="blue-gray"
                            className={`p-1.5 text-sm font-[FaBold] leading-none ${
                              !themeMode || themeMode?.stateMode
                                ? "lightText"
                                : "darkText"
                            }`}
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            ردیف
                          </Typography>
                        </th>
                        <th
                          style={{ borderBottomColor: color?.color }}
                          className={`${
                            !themeMode || themeMode?.stateMode
                              ? "themeDark"
                              : "themeLight"
                          } p-3 sticky top-0 border-b-2 `}
                        >
                          <Typography
                            color="blue-gray"
                            className={`p-1.5 text-sm font-[FaBold] leading-none ${
                              !themeMode || themeMode?.stateMode
                                ? "lightText"
                                : "darkText"
                            }`}
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            نوع
                          </Typography>
                        </th>

                        <th
                          style={{ borderBottomColor: color?.color }}
                          className={`${
                            !themeMode || themeMode?.stateMode
                              ? "themeDark"
                              : "themeLight"
                          } p-3 sticky top-0 border-b-2 `}
                        >
                          <Typography
                            color="blue-gray"
                            className={`p-1.5 text-sm font-[FaBold] leading-none ${
                              !themeMode || themeMode?.stateMode
                                ? "lightText"
                                : "darkText"
                            }`}
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            مدت دار
                          </Typography>
                        </th>
                        <th
                          style={{ borderBottomColor: color?.color }}
                          className={`${
                            !themeMode || themeMode?.stateMode
                              ? "themeDark"
                              : "themeLight"
                          } p-3 sticky top-0 border-b-2 `}
                        >
                          <Typography
                            color="blue-gray"
                            className={`p-1.5 text-sm font-[FaBold] leading-none ${
                              !themeMode || themeMode?.stateMode
                                ? "lightText"
                                : "darkText"
                            }`}
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            تاریخ انقضا
                          </Typography>
                        </th>
                        <th
                          style={{ borderBottomColor: color?.color }}
                          className={`${
                            !themeMode || themeMode?.stateMode
                              ? "themeDark"
                              : "themeLight"
                          } p-3 sticky top-0 border-b-2 `}
                        >
                          <Typography
                            color="blue-gray"
                            className={`p-1.5 text-sm font-[FaBold] leading-none ${
                              !themeMode || themeMode?.stateMode
                                ? "lightText"
                                : "darkText"
                            }`}
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            عملیات
                          </Typography>
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y divide-${
                        !themeMode || themeMode?.stateMode
                          ? "themeDark"
                          : "themeLight"
                      }`}
                    >
                      {profileDocument.map(
                        (file: UserProfileDocumentsModel, index: number) => (
                          <tr
                            className={`${
                              index % 2
                                ? !themeMode || themeMode?.stateMode
                                  ? "breadDark"
                                  : "breadLight"
                                : !themeMode || themeMode?.stateMode
                                ? "tableDark"
                                : "tableLight"
                            } border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75 py-1`}
                            key={"file" + index}
                          >
                            <td style={{ width: "5%" }} className="p-1">
                              <Typography
                                dir="ltr"
                                variant="small"
                                color="blue-gray"
                                className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${
                                  !themeMode || themeMode?.stateMode
                                    ? "lightText"
                                    : "darkText"
                                }`}
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                {index + 1}
                              </Typography>
                            </td>
                            <td
                              style={{ width: "25%" }}
                              className="p-1 relative"
                            >
                              <Typography
                                dir="ltr"
                                variant="small"
                                color="blue-gray"
                                className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${
                                  !themeMode || themeMode?.stateMode
                                    ? "lightText"
                                    : "darkText"
                                }`}
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                {
                                  fileType.find(
                                    (item) =>
                                      item.id == file.profileAttachmentTypeId
                                  )?.faTitle
                                }
                              </Typography>
                            </td>
                            <td
                              style={{ minWidth: "110px", width: "20%" }}
                              className=" relative"
                            >
                              <FormControlLabel
                                className={`${
                                  !themeMode || themeMode?.stateMode
                                    ? "lightText"
                                    : "darkText"
                                }`}
                                control={
                                  <Checkbox
                                    checked={
                                      file.expireDate !== null ? true : false
                                    }
                                    sx={{
                                      color: color?.color,
                                      "&.Mui-checked": {
                                        color: color?.color,
                                      },
                                    }}
                                    inputProps={{ "aria-label": "controlled" }}
                                  />
                                }
                                label=""
                              />
                            </td>
                            <td
                              style={{ width: "25%" }}
                              className="py-3 h-full relative"
                            >
                              <Typography
                                dir="ltr"
                                variant="small"
                                color="blue-gray"
                                className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${
                                  !themeMode || themeMode?.stateMode
                                    ? "lightText"
                                    : "darkText"
                                }`}
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                {file.expireDate && file.expireDate !== null
                                  ? new DateObject(file.expireDate)
                                      .convert(persian, persian_en)
                                      .format()
                                  : ""}
                              </Typography>
                            </td>

                            <td style={{ width: "7%" }} className="p-1">
                              <div className="container-fluid mx-auto p-0.5">
                                <div className="flex flex-row justify-evenly">
                                  <Button
                                    onClick={() => GetUserAttachmnets(file.id)}
                                    style={{ background: color?.color }}
                                    size="sm"
                                    className="p-1 mx-1"
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                  >
                                    <VisibilityIcon
                                      fontSize="small"
                                      className="p-1"
                                      onMouseEnter={(
                                        event: React.MouseEvent<any>
                                      ) =>
                                        event.currentTarget.classList.add(
                                          "menuIconStyle"
                                        )
                                      }
                                      onMouseLeave={(
                                        event: React.MouseEvent<any>
                                      ) =>
                                        event.currentTarget.classList.remove(
                                          "menuIconStyle"
                                        )
                                      }
                                    />
                                  </Button>
                                  <Button
                                    onClick={() => UpdateItem(file)}
                                    style={{ background: color?.color }}
                                    size="sm"
                                    className="p-1 mx-1"
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                  >
                                    <EditIcon
                                      fontSize="small"
                                      className="p-1"
                                      onMouseEnter={(
                                        event: React.MouseEvent<any>
                                      ) =>
                                        event.currentTarget.classList.add(
                                          "menuIconStyle"
                                        )
                                      }
                                      onMouseLeave={(
                                        event: React.MouseEvent<any>
                                      ) =>
                                        event.currentTarget.classList.remove(
                                          "menuIconStyle"
                                        )
                                      }
                                    />
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      DeleteUserAttachments(file.id)
                                    }
                                    style={{ background: color?.color }}
                                    size="sm"
                                    className="p-1 mx-1"
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                  >
                                    <DeleteIcon
                                      fontSize="small"
                                      className="p-1"
                                      onMouseEnter={(
                                        event: React.MouseEvent<any>
                                      ) =>
                                        event.currentTarget.classList.add(
                                          "menuIconStyle"
                                        )
                                      }
                                      onMouseLeave={(
                                        event: React.MouseEvent<any>
                                      ) =>
                                        event.currentTarget.classList.remove(
                                          "menuIconStyle"
                                        )
                                      }
                                    />
                                  </Button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <TableSkeleton />
            )}
          </section>
        </section>
        <Dialog
          dismiss={{
            escapeKey: true,
            referencePress: true,
            referencePressEvent: "click",
            outsidePress: false,
            outsidePressEvent: "click",
            ancestorScroll: false,
            bubbles: true,
          }}
          size="xl"
          className={`absolute top-0 bottom-0   ${
            !themeMode || themeMode?.stateMode ? "cardDark" : "cardLight"
          }`}
          open={open}
          handler={handleOpenDocument}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <DialogHeader
            dir="rtl"
            className={`${
              !themeMode || themeMode?.stateMode
                ? "cardDark lightText"
                : "cardLight darkText"
            } flex justify-between sticky z-[85858] top-0 left-0`}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <IconButton
              variant="text"
              color="blue-gray"
              onClick={() => {
                handleOpenDocument();
              }}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </DialogHeader>
          {ImageTypes.includes(attachment!.type) ? (
            <figure className="h-full w-full bg-blue-gray-50/10 shadow-sm flex justify-center items-center">
              <Image
                src={attachment?.base64}
                alt="view-attachment"
                width={100}
                height={100}
              />
            </figure>
          ) : (
            <section className="w-full h-fit p-2">
              <div style={{ height: "100vh", width: "100%" }}>
                <AcsPdfViewer base64={attachment.base64} />
              </div>
            </section>
          )}
        </Dialog>
        <Dialog
          dismiss={{
            escapeKey: true,
            referencePress: true,
            referencePressEvent: "click",
            outsidePress: false,
            outsidePressEvent: "click",
            ancestorScroll: false,
            bubbles: true,
          }}
          size="sm"
          className={`absolute top-0 min-h-[55vh]  ${
            !themeMode || themeMode?.stateMode ? "cardDark" : "cardLight"
          }`}
          open={openUpdate}
          handler={handleUpdateDoc}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <DialogHeader
            dir="rtl"
            className={`${
              !themeMode || themeMode?.stateMode
                ? "cardDark lightText"
                : "cardLight darkText"
            } flex justify-between sticky top-0 left-0`}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <IconButton
              variant="text"
              color="blue-gray"
              onClick={() => {
                handleUpdateDoc();
              }}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </DialogHeader>
          <DialogBody
            dir="rtl"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <UpdatePersonelFiles
              getData={item}
              setNewData={handleData}
              state={handleState}
            />
          </DialogBody>
        </Dialog>
      </>
    </MyCustomComponent>
  );
};

export default React.memo(PersonalFile);
