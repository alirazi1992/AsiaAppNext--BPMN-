import MyCustomComponent from "@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui";
import DatePickare from "@/app/EndPoints-AsiaApp/Components/Shared/DatePickareComponent";
import useAxios from "@/app/hooks/useAxios";
import useStore from "@/app/hooks/useStore";
import {
  GetFileModel,
  GetJobExperienceModels,
  JobExprienceModel,
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
import { TextField, Typography } from "@mui/material";
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
import UpdateJobExperience from "./UpdateJobExperience";

const WorkingExperience = () => {
  const { AxiosRequest } = useAxios();
  const User = UpdateUsersStore((state) => state);
  const color = useStore(colorStore, (state) => state);
  const themeMode = useStore(themeStore, (state) => state);
  const schema = yup.object().shape({
    RelatedJobs: yup
      .object()
      .shape({
        employerName: yup.string().required("اجباری"),
        startDate: yup.string().required("اجباری"),
        finishDate: yup.string().optional().nullable(),
        role: yup.string().required("اجباری"),
        activityDesc: yup.string().required("اجباری"),
      })
      .required(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    reset,
    formState,
    control,
    trigger,
  } = useForm<JobExprienceModel>({
    defaultValues: {
      RelatedJobs: {
        activityDesc: "",
        attachmentId: 0,
        attachmentFile: "",
        attachmentName: "",
        attachmentType: "",
        employerName: "",
        endDate: "",
        role: "",
        startDate: "",
      },
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const errors = formState.errors;

  const [jobsList, setJobsList] = useState<GetJobExperienceModels[]>([]);
  let loading = {
    loadingTable: false,
    loadingRes: false,
  };
  const [attachment, setAttachment] = useState<ViewAttachments>({
    base64: "",
    type: "",
  });
  const [loadings, setLoadings] = useState<LoadingModel>(loading);

  const fileRef = useRef() as any;
  const OnSubmit = async () => {
    Swal.fire({
      background:
        !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "ذخیره سوابق شغلی",
      text: "آیا از ذخیره این سابقه ی شغلی اطمینان دارید؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      confirmButtonText: "yes, Save it!",
      cancelButtonColor: "#f43f5e",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (!errors.RelatedJobs) {
          setLoadings((state) => ({ ...state, loadingRes: true }));
          let url: string;
          let data: any;
          let method = "put";
          if (User.userId != null) {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/AddExpreince`;
            data = {
              artemisAspNetUserId: User.userId,
              experinces: {
                attachmentId: getValues("RelatedJobs.attachmentId"),
                employerName: getValues("RelatedJobs.employerName"),
                startDate: getValues("RelatedJobs.startDate"),
                endDate: getValues("RelatedJobs.endDate"),
                role: getValues("RelatedJobs.role"),
                activityDesc: getValues("RelatedJobs.activityDesc"),
                attachmentFile: getValues("RelatedJobs.attachmentFile"),
                attachmantName: getValues("RelatedJobs.attachmentName"),
                fileType: getValues("RelatedJobs.attachmentType"),
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
                setJobsList((state) => [
                  ...state,
                  {
                    activityDesc: data.experinces.activityDesc,
                    attachmentId: response.data.data.attachmentId,
                    employerName: data.experinces.employerName,
                    endDate: data.experinces.endDate,
                    id: response.data.data.id,
                    role: data.experinces.role,
                    startDate: data.experinces.startDate,
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
                  title: "ذخیره سوابق شغلی",
                  text: response.data.message,
                  icon: response.data.status ? "warning" : "error",
                  confirmButtonColor: "#22c55e",
                  confirmButtonText: "OK",
                });
              }
            }
          } else {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/AddCurentUserExpreince`;
            data = {
              attachmentId: getValues("RelatedJobs.attachmentId"),
              employerName: getValues("RelatedJobs.employerName"),
              startDate: getValues("RelatedJobs.startDate"),
              endDate: getValues("RelatedJobs.endDate"),
              role: getValues("RelatedJobs.role"),
              activityDesc: getValues("RelatedJobs.activityDesc"),
              attachmentFile: getValues("RelatedJobs.attachmentFile"),
              attachmantName: getValues("RelatedJobs.attachmentName"),
              fileType: getValues("RelatedJobs.attachmentType"),
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
                setJobsList((state) => [
                  ...state,
                  {
                    activityDesc: data.activityDesc,
                    attachmentId: response.data.data.attachmentId,
                    employerName: data.employerName,
                    endDate: data.endDate,
                    id: response.data.data.id,
                    role: data.role,
                    startDate: data.startDate,
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
                  title: "ذخیره سوابق شغلی",
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
            title: "ذخیره سوابق شغلی",
            text: "از درستی و تکمیل موارد اضافه شده اطمینان حاصل فرمایید و مجددا تلاش کنید",
            icon: "warning",
            confirmButtonColor: "#22c55e",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  const DeleteJobsExperience = async (id: number) => {
    let url: string;
    if (User.userId != null) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteUserJobExperience?id=${id}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteCurrentUserJobExperience?id=${id}`;
    }
    Swal.fire({
      background:
        !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "حذف سوابق شغلی",
      text: "آیا از حذف این نرم افزار تخصصی اطمینان دارید؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      confirmButtonText: "yes, Delete it",
      cancelButtonColor: "#f43f5e",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (!errors.RelatedJobs) {
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
              let array = jobsList.filter((item) => item.id !== id);
              setJobsList([...array]);
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
                title: "حذف سوابق شغلی",
                text: response.data.message,
                icon: response.data.status ? "warning" : "error",
                confirmButtonColor: "#22c55e",
                confirmButtonText: "OK",
              });
            }
          }
        }
      }
    });
  };

  const [open, setOpen] = useState<boolean>(false);
  const handleOpenDocument = () => setOpen(!open);

  const handleFile = async () => {
    const file = fileRef.current?.files && fileRef.current?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        let base64String = reader!.result!.toString();
        base64String = base64String.split(",")[1];
        setValue(`RelatedJobs.attachmentName`, fileRef.current.files[0]?.name);
        setValue(`RelatedJobs.attachmentType`, file.type);
        setValue(`RelatedJobs.attachmentFile`, base64String);
        trigger();
      };
    }
  };

  const ViewDocument = async (id: number, index: number) => {
    if (User.userId != null) {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserJobExperienceDocumentAttachment?id=${id}`;
      let method = "get";
      let data = {};
      if (id != null) {
        let response: AxiosResponse<Response<GetFileModel>> =
          await AxiosRequest({ url, method, data, credentials: true });
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
      } else {
        const byteArray = Uint8Array.from(
          atob(getValues(`RelatedJobs.attachmentFile`)!),
          (c) => c.charCodeAt(0)
        );
        const blob = new Blob([byteArray], {
          type: getValues(`RelatedJobs.attachmentType`),
        });
        const objectUrl = URL.createObjectURL(blob);
        setAttachment({
          base64: objectUrl,
          type: getValues(`RelatedJobs.attachmentType`)!,
        });
        handleOpenDocument();
      }
    } else {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetCurrentUserJobExperinceDocumentAttachment?id=${id}`;
      let method = "get";
      let data = {};
      if (id != null) {
        let response: AxiosResponse<Response<GetFileModel>> =
          await AxiosRequest({ url, method, data, credentials: true });
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
      } else {
        const byteArray = Uint8Array.from(
          atob(getValues(`RelatedJobs.attachmentFile`)!),
          (c) => c.charCodeAt(0)
        );
        const blob = new Blob([byteArray], {
          type: getValues(`RelatedJobs.attachmentType`),
        });
        const objectUrl = URL.createObjectURL(blob);
        setAttachment({
          base64: objectUrl,
          type: getValues(`RelatedJobs.attachmentType`)!,
        });
        handleOpenDocument();
      }
    }
  };

  useEffect(() => {
    const GetJobsList = async () => {
      setLoadings((state) => ({ ...state, loadingTable: true }));
      let url: string;
      if (User.userId != null) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserJobExperiences?userId=${User.userId}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetCurrentUserJobExperiences`;
      }
      let data = {};
      let method = "get";
      let response: AxiosResponse<Response<GetJobExperienceModels[]>> =
        await AxiosRequest({ url, data, method, credentials: true });
      if (response) {
        setLoadings((state) => ({ ...state, loadingTable: false }));
        if (response.data.status && response.data.data.length > 0) {
          if (response.data.status && response.data.data.length > 0) {
            setJobsList(response.data.data);
          } else {
            setJobsList([]);
          }
        }
      }
    };
    GetJobsList();
  }, [User.userName, User.userId]);

  const [item, setItem] = useState<GetJobExperienceModels | null>(null);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const handleUpdateDoc = () => setOpenUpdate(!openUpdate);

  const handleData = (data: GetJobExperienceModels) => {
    let index: number = jobsList.indexOf(
      jobsList.find((x) => x.id == data.id)!
    );
    let option: GetJobExperienceModels = jobsList.find((x) => x.id == data.id)!;
    data != null
      ? jobsList.splice(index, 1, {
          ...option,
          activityDesc: data.activityDesc,
          employerName: data.employerName,
          endDate: data.endDate,
          role: data.role,
          startDate: data.startDate,
        })
      : null;
  };

  const UpdateItem = (op: GetJobExperienceModels) => {
    setItem(op);
    handleUpdateDoc();
  };

  const handleState = (data: boolean) => {
    setOpenUpdate(data);
  };

  const [state, setState] = useState<{
    startDate: {
      format: string;
      gregorian?: string;
      persian?: string;
      date?: DateObject | null;
    };
    finishDate: {
      format: string;
      gregorian?: string;
      persian?: string;
      date?: DateObject | null;
    };
  }>({
    startDate: { format: "YYYY/MM/DD" },
    finishDate: { format: "YYYY/MM/DD" },
  });

  const ConvertStartDate = (
    date: DateObject,
    format: string = state.startDate.format
  ) => {
    let object = { date, format };
    setValue(
      "RelatedJobs.startDate",
      new DateObject(object).convert(gregorian, gregorian_en).format()
    );
    trigger("RelatedJobs.startDate");
    setState((prevState) => ({
      ...prevState,
      startDate: {
        gregorian: new DateObject(object).format(),
        persian: new DateObject(object).convert(persian, persian_en).format(),
        ...object,
      },
    }));
  };
  const ConvertFinishDate = (
    date: DateObject,
    format: string = state.finishDate.format
  ) => {
    let object = { date, format };
    setValue(
      "RelatedJobs.endDate",
      new DateObject(object).convert(gregorian, gregorian_en).format()
    );
    trigger("RelatedJobs.endDate");
    setState((prevState) => ({
      ...prevState,
      finishDate: {
        gregorian: new DateObject(object).format(),
        persian: new DateObject(object).convert(persian, persian_en).format(),
        ...object,
      },
    }));
  };

  return (
    <>
      <MyCustomComponent>
        <>
          {loadings.loadingRes && <Loading />}
          <CardBody
            className={`${
              !themeMode || themeMode?.stateMode ? "cardDark" : "cardLight"
            }  h-auto mx-auto `}
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
              <section className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-6 gap-x-1 gap-y-5 my-2">
                <div className="p-1 relative">
                  <TextField
                    autoComplete="off"
                    sx={{ fontFamily: "FaLight" }}
                    tabIndex={1}
                    {...register(`RelatedJobs.employerName`)}
                    error={
                      errors?.RelatedJobs &&
                      errors?.RelatedJobs?.employerName &&
                      true
                    }
                    className="w-full lg:my-0 font-[FaLight]"
                    size="small"
                    label="نام محل کار"
                    InputProps={{
                      style: {
                        color: errors?.RelatedJobs?.employerName
                          ? "#b91c1c"
                          : !themeMode || themeMode?.stateMode
                          ? "white"
                          : "#463b2f",
                      },
                    }}
                  />
                  <label className="text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400">
                    {errors?.RelatedJobs &&
                      errors?.RelatedJobs?.employerName?.message}
                  </label>
                </div>
                <Tooltip
                  className={
                    !themeMode || themeMode?.stateMode
                      ? "cardDark lightText"
                      : "cardLight darkText"
                  }
                  content="تاریخ شروع همکاری"
                  placement="top"
                >
                  <div className="p-1 relative">
                    <DatePickare
                      register={{ ...register(`RelatedJobs.startDate`) }}
                      label="تاریخ شروع همکاری"
                      value={state.startDate.date}
                      onChange={(date: DateObject) => ConvertStartDate(date)}
                      error={
                        errors?.RelatedJobs &&
                        errors?.RelatedJobs?.startDate &&
                        true
                      }
                      focused={watch(`RelatedJobs.startDate`)}
                    />
                    <label className="text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400">
                      {errors?.RelatedJobs &&
                        errors?.RelatedJobs!.startDate?.message}
                    </label>
                  </div>
                </Tooltip>
                <Tooltip
                  className={
                    !themeMode || themeMode?.stateMode
                      ? "cardDark lightText"
                      : "cardLight darkText"
                  }
                  content="تاریخ پایان همکاری"
                  placement="top"
                >
                  <div className="p-1 relative">
                    <DatePickare
                      register={{ ...register(`RelatedJobs.endDate`) }}
                      label="تاریخ اتمام همکاری"
                      value={state.finishDate.date}
                      onChange={(date: DateObject) => ConvertFinishDate(date)}
                      error={
                        errors?.RelatedJobs &&
                        errors?.RelatedJobs?.endDate &&
                        true
                      }
                      focused={watch(`RelatedJobs.endDate`)}
                    />
                    <label className="text-[10px] flex w-full justify-end font-[FaBold] text-start text-red-400">
                      {errors?.RelatedJobs?.endDate &&
                        errors?.RelatedJobs!.endDate?.message}
                    </label>
                  </div>
                </Tooltip>
                <div className="p-1 relative ">
                  <TextField
                    autoComplete="off"
                    dir="rtl"
                    sx={{ fontFamily: "FaLight" }}
                    tabIndex={4}
                    {...register(`RelatedJobs.role`)}
                    error={
                      errors?.RelatedJobs && errors?.RelatedJobs?.role && true
                    }
                    className="w-full lg:my-0 font-[FaLight]"
                    size="small"
                    label="سمت"
                    InputProps={{
                      style: {
                        color: errors?.RelatedJobs?.role
                          ? "#b91c1c"
                          : !themeMode || themeMode?.stateMode
                          ? "white"
                          : "#463b2f",
                      },
                    }}
                  />
                  <label className="text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400">
                    {errors?.RelatedJobs && errors?.RelatedJobs?.role?.message}
                  </label>
                </div>
                <div className="p-1 relative">
                  <textarea
                    onFocus={(e) => (e.target.rows = 4)}
                    rows={1}
                    {...register(`RelatedJobs.activityDesc`)}
                    className={
                      errors?.RelatedJobs && errors?.RelatedJobs!.activityDesc
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
                    placeholder="اهم فعالیت ها"
                  />
                  <label className="absolute top-[100%] left-0 text-[10px] font-[FaBold] text-start text-red-400">
                    {errors?.RelatedJobs?.activityDesc &&
                      errors?.RelatedJobs!.activityDesc?.message}
                  </label>
                </div>
                <div className="p-1 relative ">
                  <input
                    type="file"
                    autoComplete="off"
                    accept="application/pdf"
                    {...register(`RelatedJobs.attachmentFile`)}
                    ref={fileRef}
                    onChange={async () => await handleFile()}
                    className={
                      errors?.RelatedJobs && errors?.RelatedJobs?.attachmentFile
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
                    {errors?.RelatedJobs &&
                      errors?.RelatedJobs?.attachmentFile?.message}
                  </label>
                </div>
              </section>
            </form>
          </CardBody>
        </>
      </MyCustomComponent>
      <section
        dir="rtl"
        className="w-[100%] h-auto lg:h-[72vh] mx-auto p-0 my-3"
      >
        <Tooltip
          className={
            !themeMode || themeMode?.stateMode
              ? "cardDark lightText"
              : "cardLight darkText"
          }
          content="(سوابق کاری مرتبط (لطفا به ترتیب تاریخ, لحاظ کنید"
          placement="top"
        >
          {loadings.loadingTable == false ? (
            <table
              dir="rtl"
              className={`${
                !themeMode || themeMode?.stateMode ? "tableDark" : "tableLight"
              } w-full max-h-[70vh] md:relative text-center `}
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
                      className={`${
                        !themeMode || themeMode?.stateMode
                          ? "lightText"
                          : "darkText"
                      } p-1.5 text-sm font-[FaBold] whitespace-nowrap leading-none`}
                    >
                      نام محل کار
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
                      شروع همکاری
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
                      پایان همکاری
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
                      سمت
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
                      اهم فعالیت ها
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
                {jobsList.length > 0 &&
                  jobsList.map(
                    (item: GetJobExperienceModels, index: number) => {
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
                            style={{ width: "24%", minWidth: "120px" }}
                            className="p-1 relative "
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
                              {item.employerName}
                            </Typography>
                          </td>
                          <td
                            style={{ width: "160px" }}
                            className="p-1 relative   "
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
                              {new DateObject(item.startDate)
                                .convert(persian, persian_en)
                                .format()}
                            </Typography>
                          </td>
                          <td
                            style={{ width: "160px" }}
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
                              {item.endDate
                                ? new DateObject(item.endDate)
                                    .convert(persian, persian_en)
                                    .format()
                                : ""}
                            </Typography>
                          </td>
                          <td
                            style={{ width: "20%", minWidth: "100px" }}
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
                              {item.role}
                            </Typography>
                          </td>
                          <td
                            style={{ width: "35%" }}
                            className="pt-3 h-full relative"
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
                              {item.activityDesc}
                            </Typography>
                          </td>
                          <td style={{ width: "3%" }} className="px-1">
                            <div className="container-fluid mx-auto px-0.5">
                              <div className="flex flex-row justify-evenly">
                                {item.attachmentId && (
                                  <Button
                                    onClick={() =>
                                      ViewDocument(item.attachmentId!, index)
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
                                  style={{ background: color?.color }}
                                  size="sm"
                                  className="p-1 mx-1"
                                  onClick={() => UpdateItem(item)}
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
                                  style={{ background: color?.color }}
                                  size="sm"
                                  className="p-1 mx-1"
                                  onClick={() => DeleteJobsExperience(item.id)}
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
                    }
                  )}
              </tbody>
            </table>
          ) : (
            <TableSkeleton />
          )}
        </Tooltip>
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
          } flex justify-between sticky top-0 left-0 z-[85858]`}
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
          <UpdateJobExperience
            getData={item}
            setNewData={handleData}
            state={handleState}
          />
        </DialogBody>
      </Dialog>
    </>
  );
};

export default WorkingExperience;
