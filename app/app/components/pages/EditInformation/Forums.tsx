"use client";
import MyCustomComponent from "@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui";
import DatePickare from "@/app/EndPoints-AsiaApp/Components/Shared/DatePickareComponent";
import useAxios from "@/app/hooks/useAxios";
import useStore from "@/app/hooks/useStore";
import {
  ForumsType,
  GetFileModel,
  GetUserAssociations,
} from "@/app/models/HR/models";
import { Response } from "@/app/models/HR/sharedModels";
import { LoadingModel, ViewAttachments } from "@/app/models/sharedModels";
import colorStore from "@/app/zustandData/color.zustand";
import themeStore from "@/app/zustandData/theme.zustand";
import UpdateUsersStore from "@/app/zustandData/updateUsers";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  CardBody,
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosResponse } from "axios";
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
import Swal from "sweetalert2";
import * as yup from "yup";
import AcsPdfViewer from "../../pdfViewer/AcsPdfViewer";
import Loading from "../../shared/loadingResponse";
import TableSkeleton from "../../shared/TableSkeleton";
import UpdateForums from "./UpdateForums";

const Forums = () => {
  const { AxiosRequest } = useAxios();
  let loading = {
    loadingTable: false,
    loadingRes: false,
  };
  const [attachment, setAttachment] = useState<ViewAttachments>({
    base64: "",
    type: "",
  });
  const [loadings, setLoadings] = useState<LoadingModel>(loading);
  const User = UpdateUsersStore((state) => state);
  const [open, setOpen] = useState<boolean>(false);
  const handleOpenDocument = () => setOpen(!open);
  const color = useStore(colorStore, (state) => state);
  const themeMode = useStore(themeStore, (state) => state);
  const schema = yup.object({
    Forums: yup
      .object()
      .shape({
        title: yup.string().required("اجباری"),
        ExpirationDate: yup.string().when("isMortal", ([isMortal], sch) => {
          return isMortal == true ? sch.required("اجباری") : sch.nullable();
        }),
        attachmentFile: yup
          .string()
          .when(
            ["hasCertificate", "attachmentId"],
            ([hasCertificate, attachmentId], sch) => {
              return hasCertificate == true && attachmentId == 0
                ? sch.required("اجباری")
                : sch.nullable();
            }
          ),
        attachmentType: yup
          .string()
          .when(
            ["hasCertificate", "attachmentId"],
            ([hasCertificate, attachmentId], sch) => {
              return hasCertificate == true && attachmentId == 0
                ? sch.required("اجباری")
                : sch.nullable();
            }
          ),
        attachmentName: yup
          .string()
          .when(
            ["hasCertificate", "attachmentId"],
            ([hasCertificate, attachmentId], sch) => {
              return hasCertificate == true && attachmentId == 0
                ? sch.required("اجباری")
                : sch.nullable();
            }
          ),
      })
      .required(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState,
    control,
    watch,
    trigger,
  } = useForm<ForumsType>({
    defaultValues: {
      Forums: {
        attachmentFile: "",
        attachmentId: 0,
        attachmentName: "",
        attachmentType: "",
        ExpirationDate: "",
        hasCertificate: false,
        isMortal: false,
        title: "",
      },
    },
    mode: "all",
    resolver: yupResolver(schema),
  });

  const errors = formState.errors;

  const fileRef = useRef() as any;
  const [list, setList] = useState<GetUserAssociations[]>([]);
  const OnSubmit = async () => {
    Swal.fire({
      background:
        !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "ذخیره عضویت در انجمن ها",
      text: "آیا از ذخیره این تغییرات اطمینان دارید؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      confirmButtonText: "yes, save it!",
      cancelButtonColor: "#f43f5e",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (!errors.Forums) {
          setLoadings((state) => ({ ...state, loadingRes: true }));
          let url: string;
          let data: any;
          let method = "put";
          if (User.userId != null) {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/SaveUserAssociations`;
            data = {
              userId: User.userId,
              associations: {
                attachmentId: getValues("Forums.attachmentId"),
                certificateFile: getValues("Forums.attachmentFile"),
                fileTitle: getValues("Forums.attachmentName"),
                fileType: getValues("Forums.attachmentType"),
                name: getValues("Forums.title"),
                hasDocument: getValues("Forums.hasCertificate") ?? false,
                isExpirable: getValues("Forums.isMortal") ?? false,
                expireDate: getValues("Forums.ExpirationDate") ?? "",
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
              if (response.data.status && response.data.data) {
                setList((state) => [
                  ...state,
                  {
                    attachmentId: response.data.data.attachmentId,
                    expireDate: data.associations.expireDate,
                    hasDocument: data.associations.hasDocument,
                    id: response.data.data.id,
                    isExpirable: data.associations.isExpirable,
                    name: data.associations.name,
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
                  title: "ذخیره عضویت در انجمن ها",
                  text: response.data.message,
                  icon: response.data.status ? "warning" : "error",
                  confirmButtonColor: "#22c55e",
                  confirmButtonText: "OK!",
                });
              }
            }
          } else {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/SaveCurrentUserAssociations`;
            let data = {
              attachmentId: getValues("Forums.attachmentId"),
              certificateFile: getValues("Forums.attachmentFile"),
              fileTitle: getValues("Forums.attachmentName"),
              fileType: getValues("Forums.attachmentType"),
              name: getValues("Forums.title"),
              hasDocument: getValues("Forums.hasCertificate") ?? false,
              isExpirable: getValues("Forums.isMortal") ?? false,
              expireDate: getValues("Forums.ExpirationDate") ?? "",
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
              if (response.data.status && response.data.data) {
                setList((state) => [
                  ...state,
                  {
                    attachmentId: response.data.data.attachmentId,
                    expireDate: data.expireDate,
                    hasDocument: data.hasDocument,
                    id: response.data.data.id,
                    isExpirable: data.isExpirable,
                    name: data.name,
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
                  title: "ذخیره عضویت در انجمن ها",
                  text: response.data.message,
                  icon: response.data.status ? "warning" : "error",
                  confirmButtonColor: "#22c55e",
                  confirmButtonText: "OK!",
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
            title: "ذخیره عضویت در انجمن ها",
            text: "از درستی و تکمیل موارد اضافه شده اطمینان حاصل فرمایید و مجددا تلاش کنید",
            icon: "warning",
            confirmButtonColor: "#22c55e",
            confirmButtonText: "OK!",
          });
        }
      }
    });
  };

  const handleFile = async () => {
    const file = fileRef.current.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        let base64String = reader!.result!.toString();
        base64String = base64String.split(",")[1];
        setValue(`Forums.attachmentType`, file.type);
        setValue(`Forums.attachmentName`, fileRef.current.files[0]?.name);
        setValue(`Forums.attachmentFile`, base64String);
        trigger();
      };
    }
  };

  const ViewDocument = async (id: number) => {
    let url: string;
    if (User.userId != null) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserAssociationDocumentAttachment?id=${id}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetCurrentUserAssociationDocumentAttachment?id=${id}`;
    }
    let method = "get";
    let data = {};
    if (id != null) {
      let response: AxiosResponse<Response<GetFileModel>> = await AxiosRequest({
        url,
        method,
        data,
        credentials: true,
      });
      const byteArray = Uint8Array.from(atob(response.data.data.file!), (c) =>
        c.charCodeAt(0)
      );
      const blob = new Blob([byteArray], {
        type: response.data.data.fileType!,
      });
      const objectUrl = URL.createObjectURL(blob);
      setAttachment({
        base64: objectUrl,
        type: response.data.data.fileType!,
      });
      handleOpenDocument();
    }
  };

  useEffect(() => {
    const GetAssociationsList = async () => {
      setLoadings((state) => ({ ...state, loadingTable: true }));
      let url: string;
      if (User.userId != null) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserAssociations?userId=${User.userId}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetCurrentUserAssociations`;
      }
      let data = {};
      let method = "get";
      let response: AxiosResponse<Response<GetUserAssociations[]>> =
        await AxiosRequest({ url, data, method, credentials: true });
      if (response) {
        setLoadings((state) => ({ ...state, loadingTable: false }));
        if (response.data.status && response.data.data.length > 0) {
          if (response.data.status && response.data.data.length > 0) {
            setList(response.data.data);
          } else {
            setList([]);
          }
        }
      }
    };
    GetAssociationsList();
  }, [User.userName, User.userId]);

  const DeleteAssociation = async (id: number) => {
    let url: string;
    if (User.userId != null) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteUserAssociation?id=${id}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteCurrentUserAssociation?id=${id}`;
    }
    Swal.fire({
      background:
        !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "حذف عضویت درانجمن ها",
      text: "آیا از حذف این دوره اطمینان دارید؟",
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
            let array = list.filter((item) => item.id !== id);
            setList([...array]);
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
              title: "حذف عضویت درانجمن ها",
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

  const [item, setItem] = useState<GetUserAssociations | null>(null);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const handleUpdateDoc = () => setOpenUpdate(!openUpdate);

  const handleData = (data: GetUserAssociations) => {
    let index: number = list.indexOf(list.find((x) => x.id == data.id)!);
    let option: GetUserAssociations = list.find((x) => x.id == data.id)!;
    data != null
      ? list.splice(index, 1, {
          ...option,
          expireDate: data.expireDate,
          isExpirable: data.isExpirable,
          name: data.name,
        })
      : null;
  };

  const UpdateItem = (op: GetUserAssociations) => {
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
      "Forums.ExpirationDate",
      new DateObject(object).convert(gregorian, gregorian_en).format()
    );
    trigger("Forums.ExpirationDate");
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
        <CardBody
          className={`${
            !themeMode || themeMode?.stateMode ? "cardDark" : "cardLight"
          } rounded-lg shadow-md  h-auto mx-auto `}
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
                content="Save Associations"
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
            <section className="grid grid-cols-1 md:grid-cols-5 gap-x-1 gap-y-5 my-2">
              <div className="p-1 relative">
                <TextField
                  autoComplete="off"
                  sx={{ fontFamily: "FaLight" }}
                  tabIndex={15}
                  {...register(`Forums.title`)}
                  error={errors?.Forums && errors?.Forums?.title && true}
                  className="w-full lg:my-0 font-[FaLight]"
                  size="small"
                  label="نام انجمن"
                  InputProps={{
                    style: {
                      color: errors?.Forums?.title
                        ? "#b91c1c"
                        : !themeMode || themeMode?.stateMode
                        ? "white"
                        : "#463b2f",
                    },
                  }}
                />
                <label className="text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400">
                  {errors?.Forums && errors?.Forums?.title?.message}
                </label>
              </div>
              <div className="p-1 relative ">
                <FormControlLabel
                  className={`${
                    !themeMode || themeMode?.stateMode
                      ? "lightText"
                      : "darkText"
                  }`}
                  control={
                    <Checkbox
                      sx={{
                        color: color?.color,
                        "&.Mui-checked": {
                          color: color?.color,
                        },
                      }}
                      {...register("Forums.hasCertificate")}
                      checked={watch("Forums.hasCertificate")}
                      onChange={(event) => {
                        setValue(`Forums.hasCertificate`, event.target.checked),
                          trigger();
                      }}
                    />
                  }
                  label="مدرک عضویت"
                />
              </div>
              <div className="p-1 relative ">
                <input
                  type="file"
                  autoComplete="off"
                  accept="application/pdf"
                  {...register(`Forums.attachmentFile`)}
                  ref={fileRef}
                  onChange={async () => await handleFile()}
                  className={
                    errors?.Forums && errors?.Forums?.attachmentFile
                      ? "border-red-400 border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused text-red-400 "
                      : `${
                          !themeMode || themeMode?.stateMode
                            ? "lightText"
                            : "darkText"
                        } border-[#607d8b] border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused `
                  }
                />
                <label className="absolute bottom-[-15px] left-0 text-[11px] font-[FaBold] text-start text-red-900">
                  {errors?.Forums && errors?.Forums?.attachmentFile?.message}
                </label>
              </div>
              <div className="p-1 relative ">
                <FormControlLabel
                  className={`${
                    !themeMode || themeMode?.stateMode
                      ? "lightText"
                      : "darkText"
                  }`}
                  control={
                    <Checkbox
                      sx={{
                        color: color?.color,
                        "&.Mui-checked": {
                          color: color?.color,
                        },
                      }}
                      {...register("Forums.isMortal")}
                      checked={watch("Forums.isMortal")}
                      onChange={(event) => {
                        setValue(`Forums.isMortal`, event.target.checked),
                          trigger();
                      }}
                    />
                  }
                  label="مدت دار"
                />
              </div>
              <Tooltip
                className={
                  !themeMode || themeMode?.stateMode
                    ? "cardDark lightText"
                    : "cardLight darkText"
                }
                content="تاریخ انقضاء"
                placement="top"
              >
                <div className="p-1 relative">
                  <DatePickare
                    register={{ ...register(`Forums.ExpirationDate`) }}
                    label="تاریخ انقضاء"
                    value={state.date == null ? "" : state.date}
                    onChange={(date: DateObject) => convert(date)}
                    error={
                      errors?.Forums && errors?.Forums.ExpirationDate && true
                    }
                    focused={watch(`Forums.ExpirationDate`)}
                    disabled={!watch(`Forums.isMortal`)}
                  />
                  <label className="text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400">
                    {errors?.Forums && errors?.Forums!.ExpirationDate?.message}
                  </label>
                </div>
              </Tooltip>
            </section>
          </form>
        </CardBody>
        <section
          dir="rtl"
          className="w-[100%] h-auto lg:h-[72vh] mx-auto  p-0 my-3"
        >
          {loadings.loadingTable == false ? (
            <table
              dir="rtl"
              className={`${
                !themeMode || themeMode?.stateMode ? "tableDark" : "tableLight"
              } w-full max-h-[70vh] relative text-center `}
            >
              <thead className="sticky z-[3] top-0 left-0 w-full">
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
                    >
                      نام انجمن
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
                    >
                      مدرک عضویت
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
                    >
                      تاریخ انقضاء
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
                      className={`${
                        !themeMode || themeMode?.stateMode
                          ? "lightText"
                          : "darkText"
                      } p-1.5 whitespace-nowrap text-sm font-[FaBold] leading-none`}
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
                {list.length > 0 &&
                  list.map((item: GetUserAssociations, index: number) => {
                    return (
                      <tr
                        key={index}
                        style={{ height: "55px" }}
                        className={`${
                          index % 2
                            ? !themeMode || themeMode?.stateMode
                              ? "breadDark"
                              : "breadLight"
                            : !themeMode || themeMode?.stateMode
                            ? "tableDark"
                            : "tableLight"
                        } py-5 border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}
                      >
                        <td
                          className="p-1 relative"
                          style={{ width: "25%", minWidth: "130px" }}
                        >
                          <Typography
                            dir="ltr"
                            color="blue-gray"
                            className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${
                              !themeMode || themeMode?.stateMode
                                ? "lightText"
                                : "darkText"
                            }`}
                          >
                            {item.name}
                          </Typography>
                        </td>
                        <td style={{ width: "10%" }} className=" relative">
                          <Checkbox
                            checked={item.hasDocument}
                            sx={{
                              color: color?.color,
                              "&.Mui-checked": {
                                color: color?.color,
                              },
                            }}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </td>
                        <td style={{ width: "10%" }} className="relative">
                          <Checkbox
                            checked={item.isExpirable}
                            sx={{
                              color: color?.color,
                              "&.Mui-checked": {
                                color: color?.color,
                              },
                            }}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </td>
                        <td style={{ width: "130px" }} className="md:relative">
                          <Typography
                            dir="ltr"
                            color="blue-gray"
                            className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${
                              !themeMode || themeMode?.stateMode
                                ? "lightText"
                                : "darkText"
                            }`}
                          >
                            {item.isExpirable == true && item.expireDate
                              ? new DateObject(item.expireDate)
                                  .convert(persian, persian_en)
                                  .format()
                              : ""}
                          </Typography>
                        </td>
                        <td style={{ width: "3%" }} className="px-1">
                          <div className="container-fluid mx-auto px-0.5">
                            <div className="flex flex-row justify-evenly">
                              {item.attachmentId && (
                                <Button
                                  onClick={() =>
                                    ViewDocument(item.attachmentId!)
                                  }
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
                              )}
                              <Button
                                size="sm"
                                className="p-1 mx-1"
                                onClick={() => UpdateItem(item)}
                                style={{ background: color?.color }}
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
                                size="sm"
                                className="p-1 mx-1"
                                onClick={() => DeleteAssociation(item.id)}
                                style={{ background: color?.color }}
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
                    );
                  })}
              </tbody>
            </table>
          ) : (
            <TableSkeleton />
          )}
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
          className={`absolute top-0 bottom-0 overflow-y-scroll  ${
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
          <section className="w-full h-fit p-2">
            <div style={{ height: "100vh", width: "100%" }}>
              <AcsPdfViewer base64={attachment.base64} />
            </div>
          </section>
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
          className={`absolute top-0 min-h-[55vh] overflow-y-scroll  ${
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
            <UpdateForums
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

export default Forums;
