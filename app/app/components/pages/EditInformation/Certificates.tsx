"use client";
import {
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  CertificateType,
  GetCertificateModels,
  GetFileModel,
} from "@/app/models/HR/models";
import Swal from "sweetalert2";
import SaveIcon from "@mui/icons-material/Save";
import moment from "jalali-moment";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useStore from "@/app/hooks/useStore";
import colorStore from "@/app/zustandData/color.zustand";
import themeStore from "@/app/zustandData/theme.zustand";
import {
  Tooltip,
  Button,
  IconButton,
  Dialog,
  DialogHeader,
  CardBody,
  DialogBody,
} from "@material-tailwind/react";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";
import { Response } from "@/app/models/HR/sharedModels";
import Loading from "@/app/components/shared/loadingResponse";
import UpdateUsersStore from "@/app/zustandData/updateUsers";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { LoadingModel, ViewAttachments } from "@/app/models/sharedModels";
import TableSkeleton from "../../shared/TableSkeleton";
import EditIcon from "@mui/icons-material/Edit";
import UpdateCertificates from "./UpdateCertificates";
import { DateObject } from "react-multi-date-picker";
import MyCustomComponent from "@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui";
import "react-multi-date-picker/styles/layouts/mobile.css";
import persian from "react-date-object/calendars/persian";
import persian_en from "react-date-object/locales/persian_en";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import "react-multi-date-picker/styles/backgrounds/bg-gray.css";
import DatePickare from "@/app/EndPoints-AsiaApp/Components/Shared/DatePickareComponent";
import { SaveUserCertificates } from "@/app/Domain/M_HumanRecourse/UserProfile";
import AcsPdfViewer from "../../pdfViewer/AcsPdfViewer";

const Certificates = () => {
  const { AxiosRequest } = useAxios();
  const [attachment, setAttachment] = useState<ViewAttachments>({
    base64: "",
    type: "",
  });
  let loading = {
    loadingTable: false,
    loadingRes: false,
  };
  const [loadings, setLoadings] = useState<LoadingModel>(loading);
  const User = UpdateUsersStore((state) => state);
  const color = useStore(colorStore, (state) => state);
  const themeMode = useStore(themeStore, (state) => state);
  const [open, setOpen] = useState<boolean>(false);
  const handleOpenDocument = () => {
    setOpen(!open);
  };
  const schema = yup.object({
    Course: yup
      .object()
      .shape({
        title: yup.string().required("اجباری"),
        duration: yup
          .number()
          .required()
          .min(1, "اجباری")
          .typeError("مقدار عددی وارد کنید"),
        institute: yup.string().required("اجباری"),
        finishDate: yup
          .number()
          .required("سال پایان تحصیل را وارد کنید")
          .min(
            +moment
              .from((new Date().getFullYear() - 50).toString(), "YYYY")
              .format("jYYYY"),
            "تاریخ نامعتبر است"
          )
          .max(
            +moment
              .from((new Date().getFullYear() + 1).toString(), "YYYY")
              .format("jYYYY"),
            "تاریخ نامعتبر است"
          )
          .typeError("مقدار عددی وارد کنید"),
        ExpirationDate: yup.string().when("isMortal", ([isMortal], sch) => {
          return isMortal == true ? sch.required("اجباری") : sch.nullable();
        }),
        attachmentFile: yup
          .string()
          .when(
            ["hasCertificate", "certificateAtachmentId"],
            ([hasCertificate, certificateAtachmentId], sch) => {
              return hasCertificate == true && certificateAtachmentId == 0
                ? sch.required("اجباری")
                : sch.nullable();
            }
          ),
        attachmentType: yup
          .string()
          .when(
            ["hasCertificate", "certificateAtachmentId"],
            ([hasCertificate, certificateAtachmentId], sch) => {
              return hasCertificate == true && certificateAtachmentId == 0
                ? sch.required("اجباری")
                : sch.nullable();
            }
          ),
        attachmentName: yup
          .string()
          .when(
            ["hasCertificate", "certificateAtachmentId"],
            ([hasCertificate, certificateAtachmentId], sch) => {
              return hasCertificate == true && certificateAtachmentId == 0
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
    formState,
    reset,
    control,
    watch,
    trigger,
  } = useForm<CertificateType>({
    defaultValues: {
      Course: {
        duration: 0,
        finishDate: 0,
        hasCertificate: false,
        institute: "",
        title: "",
        isMortal: false,
        ExpirationDate: "",
        attachmentFile: "",
        attachmentType: "",
        attachmentName: "",
        certificateAtachmentId: null,
      },
    },
    mode: "all",
    resolver: yupResolver(schema),
  });
  const errors = formState.errors;
  const [course, setCourse] = useState<GetCertificateModels[]>([]);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const handleUpdateDoc = () => setOpenUpdate(!openUpdate);

  const OnSubmit = async () => {
    Swal.fire({
      background:
        !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "ذخیره دوره ها و گواهینامه ها",
      text: "آیا از ذخیره این تغییرات اطمینان دارید؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      confirmButtonText: "Yes, save it!",
      cancelButtonColor: "#f43f5e",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (!errors.Course) {
          setLoadings((state) => ({ ...state, loadingRes: true }));
          let url: string;
          let data: any;
          let method = "put";
          if (User.userId != null) {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/SaveUserCertificates`;
            data = {
              userId: User.userId,
              certificates: {
                attachmentId: getValues("Course.certificateAtachmentId"),
                certificateFile: getValues("Course.attachmentFile"),
                fileTitle: getValues("Course.attachmentName"),
                fileType: getValues("Course.attachmentType"),
                name: getValues("Course.title")!,
                duration: getValues("Course.duration")!,
                finishYear: getValues("Course.finishDate")!,
                institute: getValues("Course.institute")!,
                hasCertificateDocument:
                  getValues("Course.hasCertificate") ?? false,
                isExpirable: getValues("Course.isMortal") ?? false,
                expireDate: getValues("Course.ExpirationDate") ?? null,
              },
            };
            let response: AxiosResponse<Response<SaveUserCertificates>> =
              await AxiosRequest({ url, method, data, credentials: true });
            if (response) {
              reset();
              setState((prev) => ({ ...prev, date: null }));
              setLoadings((state) => ({ ...state, loadingRes: false }));
              if (response.data.status) {
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
                  title: "ذخیره دوره ها و گواهینامه ها",
                  text: response.data.message,
                  icon: "success",
                  confirmButtonColor: "#22c55e",
                  confirmButtonText: "OK!",
                });
                setCourse((state) => [
                  ...state,
                  {
                    certificateAttachmentId: response.data.data.attachmentId,
                    duration: data.certificates!.duration!,
                    expireDate: data.certificates!.expireDate!,
                    finishYear: data.certificates!.finishYear!,
                    hasCertificate: data.certificates!.hasCertificateDocument,
                    id: response.data.data.id,
                    institute: data.certificates!.institute,
                    isExpirable: data.certificates!.isExpirable,
                    name: data.certificates!.name,
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
                  title: "ذخیره دوره ها و گواهینامه ها",
                  text: response.data.message,
                  icon: response.data.status ? "warning" : "error",
                  confirmButtonColor: "#22c55e",
                  confirmButtonText: "OK!",
                });
              }
            }
          } else {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/SaveCurrentUserCertificates`;
            data = {
              attachmentId: getValues("Course.certificateAtachmentId"),
              certificateFile: getValues("Course.attachmentFile"),
              fileTitle: getValues("Course.attachmentName"),
              fileType: getValues("Course.attachmentType"),
              name: getValues("Course.title")!,
              duration: getValues("Course.duration")!,
              finishYear: getValues("Course.finishDate")!,
              institute: getValues("Course.institute")!,
              hasCertificateDocument:
                getValues("Course.hasCertificate") ?? false,
              isExpirable: getValues("Course.isMortal") ?? false,
              expireDate: getValues("Course.ExpirationDate") ?? null,
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
              if (response.data.status) {
                setCourse((state) => [
                  ...state,
                  {
                    certificateAttachmentId:
                      response.data.data.attachmentId ?? null,
                    duration: data.duration!,
                    expireDate: data.expireDate!,
                    finishYear: data.finishYear!,
                    hasCertificate: data.hasCertificateDocument,
                    id: response.data.data.id,
                    institute: data.institute,
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
                  title: "ذخیره دوره ها و گواهینامه ها",
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
            title: "ذخیره دوره ها و گواهینامه ها",
            text: "از درستی و تکمیل موارد اضافه شده اطمینان حاصل فرمایید و مجددا تلاش کنید",
            icon: "warning",
            confirmButtonColor: "#22c55e",
            confirmButtonText: "OK!",
          });
        }
      }
    });
  };

  const DeleteCertificate = async (id: number) => {
    let url: string;
    if (User.userId != null) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteUserCertificate?id=${id}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteCurrentUserCertificate?id=${id}`;
    }
    Swal.fire({
      background:
        !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "حذف دوره ها و گواهینامه ها",
      text: "آیا از حذف این دوره اطمینان دارید؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      confirmButtonText: "Yes, Delete it!",
      cancelButtonColor: "#f43f5e",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (!errors.Course) {
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
              let array = course.filter((item) => item.id !== id);
              setCourse([...array]);
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
                title: "حذف دوره ها و گواهینامه ها",
                text: response.data.message,
                icon: "success",
                confirmButtonColor: "#22c55e",
                confirmButtonText: "OK!",
              });
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
                title: "حذف دوره ها و گواهینامه ها",
                text: response.data.message,
                icon: response.data.status ? "warning" : "error",
                confirmButtonColor: "#22c55e",
                confirmButtonText: "OK!",
              });
            }
          }
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
        setValue(`Course.attachmentName`, fileRef.current.files[0]?.name);
        setValue(`Course.attachmentType`, file.type);
        setValue(`Course.attachmentFile`, base64String);
        trigger();
      };
    }
  };
  const ViewDocument = async (id: number, index: number) => {
    let url: string;
    if (User.userId != null) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserCertificateDocumentAttachment?id=${id}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetCurrentUserCertificateDocumentAttachment?id=${id}`;
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
    const GetCertificateList = async () => {
      setLoadings((state) => ({ ...state, loadingTable: true }));
      let url: string;
      if (User.userId != null) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserCertificates?userId=${User.userId}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetCurrentUserCertificates`;
      }
      let data = {};
      let method = "get";
      let response: AxiosResponse<Response<GetCertificateModels[]>> =
        await AxiosRequest({ url, data, method, credentials: true });
      if (response) {
        setLoadings((state) => ({ ...state, loadingTable: false }));
        if (response.data.status && response.data.data.length > 0) {
          if (response.data.status && response.data.data.length > 0) {
            setCourse(response.data.data);
          } else {
            setCourse([]);
          }
        }
      }
    };
    GetCertificateList();
  }, [User.userId, User.userName]);

  const [item, setItem] = useState<GetCertificateModels | null>(null);

  const handleData = (data: GetCertificateModels) => {
    let index: number = course.indexOf(course.find((x) => x.id == data.id)!);
    let option: GetCertificateModels = course.find((x) => x.id == data.id)!;
    data != null
      ? course.splice(index, 1, {
          certificateAttachmentId: data.certificateAttachmentId,
          duration: data.duration,
          expireDate: data.expireDate == null ? "" : data.expireDate,
          finishYear: data.finishYear,
          id: data.id,
          institute: data.institute,
          isExpirable: data.isExpirable == true ? true : false,
          name: data.name,
          hasCertificate: data.hasCertificate,
        })
      : null;
  };

  const UpdateItem = (op: GetCertificateModels) => {
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
      "Course.ExpirationDate",
      new DateObject(object).convert(gregorian, gregorian_en).format()
    );
    trigger("Course.ExpirationDate");
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
          } rounded-lg shadow-md h-auto mb-5 mx-auto `}
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
                content="Save Certificates"
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
            <section className="grid grid-cols-1 md:grid-cols-4 gap-x-1 gap-y-5 my-2">
              <div className="p-1 relative">
                <TextField
                  autoComplete="off"
                  sx={{ fontFamily: "FaLight" }}
                  tabIndex={15}
                  {...register(`Course.title`)}
                  error={errors?.Course && errors?.Course?.title && true}
                  className="w-full lg:my-0 font-[FaLight]"
                  size="small"
                  label="نام دوره"
                  InputProps={{
                    style: {
                      color: errors?.Course?.title
                        ? "#b91c1c"
                        : !themeMode || themeMode?.stateMode
                        ? "white"
                        : "#463b2f",
                    },
                  }}
                />
                <label className="text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400">
                  {errors?.Course && errors?.Course?.title?.message}
                </label>
              </div>
              <div className="p-1 relative ">
                <TextField
                  autoComplete="off"
                  dir="ltr"
                  type="number"
                  sx={{ fontFamily: "FaLight" }}
                  tabIndex={15}
                  {...register(`Course.duration`)}
                  error={errors?.Course && errors?.Course?.duration && true}
                  className="w-full lg:my-0 font-[FaLight]"
                  size="small"
                  label="مدت (روز)"
                  InputProps={{
                    style: {
                      color: errors?.Course?.duration
                        ? "#b91c1c"
                        : !themeMode || themeMode?.stateMode
                        ? "white"
                        : "#463b2f",
                    },
                  }}
                />
                <label className="text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400">
                  {errors?.Course && errors?.Course?.duration?.message}
                </label>
              </div>
              <div className="p-1 relative">
                <TextField
                  autoComplete="off"
                  dir="ltr"
                  sx={{ fontFamily: "FaLight" }}
                  tabIndex={15}
                  {...register(`Course.finishDate`)}
                  error={errors?.Course && errors?.Course?.finishDate && true}
                  className="w-full lg:my-0 font-[FaLight]"
                  size="small"
                  label="سال اتمام دوره"
                  InputProps={{
                    style: {
                      color: errors?.Course?.finishDate
                        ? "#b91c1c"
                        : !themeMode || themeMode?.stateMode
                        ? "white"
                        : "#463b2f",
                    },
                  }}
                />
                <label className="absolute top-[100%] left-0 text-[10px] font-[FaBold] text-start text-red-400">
                  {errors?.Course?.finishDate &&
                    errors?.Course!.finishDate?.message}
                </label>
              </div>
              <div className="p-1 relative">
                <TextField
                  autoComplete="off"
                  sx={{ fontFamily: "FaLight" }}
                  tabIndex={15}
                  {...register(`Course.institute`)}
                  error={errors?.Course && errors?.Course?.institute && true}
                  className="w-full lg:my-0 font-[FaLight]"
                  size="small"
                  label="محل برگزاری"
                  InputProps={{
                    style: {
                      color: errors?.Course?.institute
                        ? "#b91c1c"
                        : !themeMode || themeMode?.stateMode
                        ? "white"
                        : "#463b2f",
                    },
                  }}
                />
                <label className="absolute top-[100%] left-0 text-[10px] font-[FaBold] text-start text-red-400">
                  {errors?.Course?.institute &&
                    errors?.Course!.institute?.message}
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
                      {...register("Course.hasCertificate")}
                      checked={watch("Course.hasCertificate")}
                      onChange={(event) => {
                        setValue(`Course.hasCertificate`, event.target.checked),
                          trigger(),
                          event.target.checked == false &&
                            (setValue(`Course.attachmentFile`, ""),
                            setValue(`Course.attachmentName`, ""),
                            setValue(`Course.attachmentType`, "")),
                          setValue(`Course.certificateAtachmentId`, undefined);
                      }}
                    />
                  }
                  label="گواهینامه"
                />
              </div>
              <div className="p-1 relative ">
                <input
                  type="file"
                  autoComplete="off"
                  accept="application/pdf"
                  {...register(`Course.attachmentFile`)}
                  ref={fileRef}
                  onChange={async () => await handleFile()}
                  className={
                    errors?.Course && errors?.Course?.attachmentFile
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
                <label className="absolute bottom-[-15px] left-0 text-[11px] font-[FaBold] text-start text-red-900">
                  {errors?.Course && errors?.Course?.attachmentFile?.message}
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
                      {...register("Course.isMortal")}
                      checked={watch("Course.isMortal")}
                      onChange={(event) => {
                        setValue(`Course.isMortal`, event.target.checked),
                          trigger();
                      }}
                    />
                  }
                  label="مدت دار"
                />
              </div>
              <div className="p-1 relative">
                <DatePickare
                  register={{ ...register(`Course.ExpirationDate`) }}
                  label="تاریخ انقضاء"
                  value={state.date == null ? "" : state.date}
                  onChange={(date: DateObject) => convert(date)}
                  error={
                    errors?.Course && errors?.Course.ExpirationDate && true
                  }
                  focused={watch(`Course.ExpirationDate`)}
                  disabled={!watch(`Course.isMortal`)}
                />
                <label className="text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400">
                  {errors?.Course && errors?.Course!.ExpirationDate?.message}
                </label>
              </div>
            </section>
          </form>
        </CardBody>
        <section
          dir="rtl"
          className="w-[100%] h-auto lg:h-[72vh] mx-auto  p-0 my-3"
        >
          {loadings.loadingTable == false ? (
            <div className="overflow-x-auto w-full">
              <table
                dir="rtl"
                className={`${
                  !themeMode || themeMode?.stateMode
                    ? "tableDark"
                    : "tableLight"
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
                        نام دوره
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
                        } p-1.5 text-sm font-[FaBold] whitespace-nowrap leading-none`}
                      >
                        مدت (روز)
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
                        سال اتمام دوره
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
                        محل برگزاری
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
                        گواهینامه
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
                  {course.map((item: GetCertificateModels, index: number) => {
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
                          style={{ width: "15%", minWidth: "130px" }}
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
                        <td
                          style={{ minWidth: "130px" }}
                          className="p-1 relative"
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
                            {item.duration}
                          </Typography>
                        </td>
                        <td
                          style={{ minWidth: "130px" }}
                          className="p-1 relative font-[FaBold] "
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
                            {item.finishYear}
                          </Typography>
                        </td>
                        <td
                          style={{ width: "30%", minWidth: "160px" }}
                          className="p-1 relative"
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
                            {item.institute}
                          </Typography>
                        </td>
                        <td style={{ width: "10%" }} className=" relative">
                          <Checkbox
                            checked={item.hasCertificate}
                            sx={{
                              color: color?.color,
                              "&.Mui-checked": {
                                color: color?.color,
                              },
                            }}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </td>
                        <td style={{ width: "10%" }} className=" relative">
                          <Checkbox
                            checked={item.isExpirable == true ? true : false}
                            sx={{
                              color: color?.color,
                              "&.Mui-checked": {
                                color: color?.color,
                              },
                            }}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </td>
                        <td style={{ minWidth: "130px" }} className=" relative">
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
                        <td style={{ width: "7%" }} className="px-1">
                          <div className="container-fluid mx-auto px-0.5">
                            <div className="flex flex-row justify-evenly">
                              {item.certificateAttachmentId && (
                                <Button
                                  onClick={() =>
                                    ViewDocument(
                                      item.certificateAttachmentId!,
                                      index
                                    )
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
                                onClick={() => DeleteCertificate(item.id)}
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
            </div>
          ) : (
            <TableSkeleton />
          )}
        </section>

        {/* </form> */}
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
            <UpdateCertificates
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

export default Certificates;
