"use client";
import useAxios from "@/app/hooks/useAxios";
import useStore from "@/app/hooks/useStore";
import {
  EducationDegreeModel,
  EducationType,
  GetFileModel,
  GetUserEducations,
} from "@/app/models/HR/models";
import { Response } from "@/app/models/HR/sharedModels";
import { LoadingModel } from "@/app/models/sharedModels";
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
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import {
  createTheme,
  Theme,
  ThemeProvider,
  useTheme,
} from "@mui/material/styles";
import { AxiosResponse } from "axios";
import moment from "jalali-moment";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Select, {
  ActionMeta,
  components,
  MenuListProps,
  SingleValue,
} from "react-select";
import Swal from "sweetalert2";
import * as yup from "yup";
import AcsPdfViewer from "../../pdfViewer/AcsPdfViewer";
import Loading from "../../shared/loadingResponse";
import TableSkeleton from "../../shared/TableSkeleton";
import UpdateEducation from "./UpdateEducation";

const Education = () => {
  const { AxiosRequest } = useAxios();
  let loading = {
    loadingTable: false,
    loadingRes: false,
  };
  const [loadings, setLoadings] = useState<LoadingModel>(loading);
  const outerTheme = useTheme();
  const User = UpdateUsersStore((state) => state);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const handleUpdateDoc = () => setOpenUpdate(!openUpdate);
  const [educationLevels, setEducationLevels] = useState<
    EducationDegreeModel[]
  >([]);
  const color = useStore(colorStore, (state) => state);
  const themeMode = useStore(themeStore, (state) => state);
  const schema = yup.object({
    EducationState: yup
      .object()
      .shape({
        fieldOfStudy: yup.string().required("اجباری"),
        degree: yup
          .number()
          .required()
          .min(1, "اجباری")
          .typeError("مقدار عددی وارد کنید"),
        university: yup.string().required("اجباری"),
        scoreAverage: yup
          .string()
          .required("اجباری")
          .matches(
            /^\d+(\/\d{0,2})?$/,
            "عدد باید دارای دو رقم اعشار یا کمتر باشد"
          ),
        finishYear: yup
          .number()
          .required("اجباری")
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
        attachmentFile: yup
          .string()
          .when("attachmentId", ([attachmentId], sch) => {
            return attachmentId == null || attachmentId == 0
              ? sch.required("اجباری")
              : sch.nullable().optional();
          }),
        attachmentType: yup
          .string()
          .when("attachmentId", ([attachmentId], sch) => {
            return attachmentId == null || attachmentId == 0
              ? sch.required("اجباری")
              : sch.nullable();
          }),
        attachmentName: yup
          .string()
          .when("attachmentId", ([attachmentId], sch) => {
            return attachmentId == null || attachmentId == 0
              ? sch.required("اجباری")
              : sch.nullable();
          }),
      })
      .required(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState,
    control,
    trigger,
  } = useForm<EducationType>({
    defaultValues: {
      EducationState: {
        attachmentFile: "",
        attachmentName: "",
        attachmentType: "",
        degree: 0,
        fieldOfStudy: "",
        finishYear: 0,
        scoreAverage: "",
        university: "",
        attachmentId: 0,
      },
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const errors = formState.errors;

  const thumb: any = {
    display: "inline-flex",
    borderRadius: 2,
    border: "1px solid #eaeaea",
    width: 50,
    height: 50,
    padding: 4,
    boxSizing: "border-box",
  };
  const thumbInner: any = {
    display: "flex",
    minWidth: 0,
    overflow: "hidden",
  };
  const img: any = {
    display: "block",
    width: "auto",
    height: "100%",
  };

  const [open, setOpen] = useState<boolean>(false);
  const handleOpenDocument = () => setOpen(!open);
  const fileRef = useRef() as any;
  const handleFile = async () => {
    const file = fileRef.current.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        let base64String = reader!.result!.toString();
        base64String = base64String.split(",")[1];
        setValue(
          `EducationState.attachmentName`,
          fileRef.current.files[0]?.name
        );
        setValue(`EducationState.attachmentFile`, base64String);
        setValue(`EducationState.attachmentType`, file.type);
        trigger();
      };
      reader.onerror = function (error) {
        console.error("Error reading the file: ", error);
      };
    } else {
      console.error("No file selected");
    }
  };

  type Attachment = {
    type: string;
    base64: string;
  };
  const [attachment, setAttachment] = useState<Attachment>({
    base64: "",
    type: "",
  });

  const GetEducationLevels = async () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/BaseInfo/manage/GetEducationDegrees`;
    let method = "get";
    let data = {};
    let response: AxiosResponse<Response<EducationDegreeModel[]>> =
      await AxiosRequest({ url, method, data, credentials: true });
    if (response) {
      if (response.data.status && response.data.data.length > 0) {
        setEducationLevels(
          response.data.data.map((item) => {
            return {
              faName: item.faName,
              id: item.id,
              label: item.faName,
              name: item.name,
              value: item.id,
            };
          })
        );
      }
    }
  };

  useEffect(() => {
    GetEducationLevels();
  }, []);

  const [eduState, setEduState] = useState<GetUserEducations[]>([]);
  const MenuList = (props: MenuListProps<EducationDegreeModel, false, any>) => {
    return (
      <components.MenuList {...props}>
        <div className="rtl text-right">{props.children}</div>
      </components.MenuList>
    );
  };

  const OnSubmit = async () => {
    Swal.fire({
      background:
        !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "ذخیره سوابق آموزشی",
      text: "آیا از ذخیره این تغییرات اطمینان دارید؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      confirmButtonText: "Yes, Save it!",
      cancelButtonColor: "#f43f5e",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (!errors.EducationState) {
          setLoadings((state) => ({ ...state, loadingRes: true }));
          let url: string;
          let data: any;
          let method = "put";
          if (User.userId != null) {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/SaveUserEducations`;
            let data = {
              userId: User.userId,
              educations: {
                attachmentId: getValues("EducationState.attachmentId"),
                certificateFile: getValues("EducationState.attachmentFile"),
                fileTitle: getValues("EducationState.attachmentName"),
                fileType: getValues("EducationState.attachmentType"),
                name: getValues("EducationState.fieldOfStudy"),
                educationDegreeId: getValues("EducationState.degree"),
                educationInstitute: getValues("EducationState.university"),
                scoreAverage: Number(
                  getValues("EducationState.scoreAverage").replaceAll("/", ".")
                ).toFixed(2),
                finishYear: getValues("EducationState.finishYear"),
              },
            };
            let response: AxiosResponse<Response<any>> = await AxiosRequest({
              url,
              method,
              data,
              credentials: true,
            });
            if (response) {
              setLoadings((state) => ({ ...state, loadingRes: false }));
              if (response.data.status && response.data.data) {
                reset();
                setEduState((state: GetUserEducations[]) => [
                  ...state,
                  {
                    attachmentId: response.data.data.attachmentId,
                    id: response.data.data.id,
                    educationDegree: data.educations.educationDegreeId,
                    finishYear: data.educations.finishYear,
                    institute: data.educations.educationInstitute,
                    name: data.educations.name,
                    scoreAverage: data.educations.scoreAverage,
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
                  title: "ذخیره سوابق آموزشی",
                  text: response.data.message,
                  icon: response.data.status ? "warning" : "error",
                  confirmButtonColor: "#22c55e",
                  confirmButtonText: "OK!",
                });
              }
            }
          } else {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/SaveCurrentUserEducations`;
            let data = {
              attachmentId: getValues("EducationState.attachmentId"),
              certificateFile: getValues("EducationState.attachmentFile"),
              fileTitle: getValues("EducationState.attachmentName"),
              fileType: getValues("EducationState.attachmentType"),
              name: getValues("EducationState.fieldOfStudy"),
              educationDegreeId: getValues("EducationState.degree"),
              educationInstitute: getValues("EducationState.university"),
              scoreAverage: Number(
                getValues("EducationState.scoreAverage").replaceAll("/", ".")
              ).toFixed(2),
              finishYear: getValues("EducationState.finishYear"),
            };
            let response: AxiosResponse<Response<any>> = await AxiosRequest({
              url,
              method,
              data,
              credentials: true,
            });
            if (response) {
              setLoadings((state) => ({ ...state, loadingRes: false }));
              if (response.data.status && response.data.data) {
                reset();
                setEduState((state: GetUserEducations[]) => [
                  ...state,
                  {
                    attachmentId: response.data.data.attachmentId,
                    id: response.data.data.id,
                    educationDegree: data.educationDegreeId,
                    finishYear: data.finishYear,
                    institute: data.educationInstitute,
                    name: data.name,
                    scoreAverage: data.scoreAverage,
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
                  title: "ذخیره سوابق آموزشی",
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
            title: "ذخیره سوابق آموزشی",
            text: "از درستی و تکمیل موارد اضافه شده اطمینان حاصل فرمایید و مجددا تلاش کنید",
            icon: "warning",
            confirmButtonColor: "#22c55e",
            confirmButtonText: "OK!",
          });
        }
      }
    });
  };

  const ViewDocument = async (id: number, index: number) => {
    let url: string;
    if (User.userId != null) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserEducationDocumentAttachment?id=${id}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetCurrentUserEducationDocumentAttachment?id=${id}`;
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
    const GetUserEducations = async () => {
      let url: string;
      if (User.userId != null) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserEducations?userId=${User.userId}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetCurrentUserEducations`;
      }
      setLoadings((state) => ({ ...state, loadingTable: true }));
      let data = {};
      let method = "get";
      let response: AxiosResponse<Response<GetUserEducations[]>> =
        await AxiosRequest({ url, data, method, credentials: true });
      if (response) {
        setLoadings((state) => ({ ...state, loadingTable: false }));
        if (response.data.status && response.data.data.length > 0) {
          setEduState(response.data.data);
        } else {
          setEduState([]);
        }
      }
    };
    GetUserEducations();
  }, [User.userName, User.userId]);

  const customTheme = (outerTheme: Theme) =>
    createTheme({
      palette: {
        mode: outerTheme.palette.mode,
      },
      typography: {
        fontFamily: "FaLight",
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: `
                      @font-face {
                        font-family: FaLight;
                        src: url('./assets/newFont/font/IranSansX\(Pro\)/FarsiFont/IRANSansXFaNum-Light.ttf') format('truetype'),
                      }
                    `,
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              "--TextField-brandBorderColor": "#607d8b",
              "--TextField-brandBorderHoverColor": "#607d8b",
              "--TextField-brandBorderFocusedColor": "#607d8b",
              "& label.Mui-focused": {
                color: "var(--TextField-brandBorderFocusedColor)",
              },
              "& label": {
                color: "var(--TextField-brandBorderFocusedColor)",
              },
              [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: "var(--TextField-brandBorderHoverColor)",
              },
              [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: "var(--TextField-brandBorderFocusedColor)",
              },
              [`&.Mui-disabled .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: "var(--TextField-brandBorderFocusedColor)",
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            notchedOutline: {
              borderColor: "var(--TextField-brandBorderColor)",
            },
            root: {
              "--TextField-brandBorderColor": "#607d8b",
              "--TextField-brandBorderHoverColor": "#607d8b",
              "--TextField-brandBorderFocusedColor": "#607d8b",
              "& label.Mui-focused": {
                color: "var(--TextField-brandBorderFocusedColor)",
              },
              "& label": {
                color: "var(--TextField-brandBorderFocusedColor)",
              },
              [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: "var(--TextField-brandBorderHoverColor)",
              },
              [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: "var(--TextField-brandBorderFocusedColor)",
              },
              [`&.Mui-disabled .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: "var(--TextField-brandBorderFocusedColor)",
              },
            },
          },
        },
        MuiFilledInput: {
          styleOverrides: {
            root: {
              "--TextField-brandBorderColor": "#607d8b",
              "--TextField-brandBorderHoverColor": "#607d8b",
              "--TextField-brandBorderFocusedColor": "#607d8b",
              "&::before, &::after": {
                borderBottom: "2px solid var(--TextField-brandBorderColor)",
              },
              "&:hover:not(.Mui-disabled, .Mui-error):before": {
                borderBottom:
                  "2px solid var(--TextField-brandBorderHoverColor)",
              },
              "&.Mui-focused:after": {
                borderBottom:
                  "2px solid var(--TextField-brandBorderFocusedColor)",
              },
              "&.Mui-disabled:after": {
                borderBottom:
                  "2px solid var(--TextField-brandBorderFocusedColor)",
              },
            },
          },
        },
        MuiInput: {
          styleOverrides: {
            root: {
              "--TextField-brandBorderColor": "#607d8b",
              "--TextField-brandBorderHoverColor": "#607d8b",
              "--TextField-brandBorderFocusedColor": "#607d8b",
              "&::before": {
                borderBottom: "2px solid var(--TextField-brandBorderColor)",
              },
              "&:hover:not(.Mui-disabled, .Mui-error):before": {
                borderBottom:
                  "2px solid var(--TextField-brandBorderHoverColor)",
              },
              "&.Mui-focused:after": {
                borderBottom:
                  "2px solid var(--TextField-brandBorderFocusedColor)",
              },
              "&.Mui-disabled:after": {
                borderBottom:
                  "2px solid var(--TextField-brandBorderFocusedColor)",
              },
            },
          },
        },
      },
    });

  const DeleteEducation = async (id: number) => {
    let url: string;
    if (User.userId != null) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteUserEducation?id=${id}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteCurrentUserEducation?id=${id}`;
    }
    Swal.fire({
      background:
        !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "حذف سوابق آموزشی",
      text: "آیا از حذف این سابقه تحصیلی اطمینان دارید؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      confirmButtonText: "yes, Delete it!",
      cancelButtonColor: "#f43f5e",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (!errors.EducationState) {
          setLoadings((state) => ({ ...state, loadingRes: true }));
          let method = "Delete";
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
              let array = eduState.filter((item) => item.id !== id);
              setEduState([...array]);
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
                title: "حذف سوابق آموزشی",
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

  const [item, setItem] = useState<GetUserEducations | null>(null);

  const handleData = (data: GetUserEducations) => {
    let index = eduState.indexOf(eduState.find((x) => x.id == data.id)!);
    data != null
      ? eduState.splice(index, 1, {
          educationDegree: data.educationDegree,
          finishYear: data.finishYear,
          id: data.id,
          institute: data.institute,
          name: data.name,
          scoreAverage: data.scoreAverage,
          attachmentId: data.attachmentId,
        })
      : null;
  };

  const UpdateItem = (op: GetUserEducations) => {
    setItem(op);
    handleUpdateDoc();
  };

  const handleState = (data: boolean) => {
    setOpenUpdate(data);
  };

  return (
    <>
      {loadings.loadingRes == true && <Loading />}
      <CardBody
        className={`${
          !themeMode || themeMode?.stateMode ? "cardDark" : "cardLight"
        } rounded-lg shadow-md  mx-auto h-auto mb-5 `}
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
          <ThemeProvider theme={customTheme(outerTheme)}>
            <section className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-6 gap-x-1 gap-y-5 my-2">
              <div className="p-1 relative">
                <TextField
                  autoComplete="off"
                  sx={{ fontFamily: "FaLight" }}
                  tabIndex={15}
                  {...register(`EducationState.fieldOfStudy`)}
                  error={
                    errors?.EducationState &&
                    errors?.EducationState?.fieldOfStudy &&
                    true
                  }
                  className="w-full lg:my-0 font-[FaLight]"
                  size="small"
                  label="رشته ی تحصیلی"
                  InputProps={{
                    style: {
                      color: errors?.EducationState?.fieldOfStudy
                        ? "#b91c1c"
                        : !themeMode || themeMode?.stateMode
                        ? "white"
                        : "#463b2f",
                    },
                  }}
                />
                <label className="text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400">
                  {errors?.EducationState &&
                    errors?.EducationState?.fieldOfStudy?.message}
                </label>
              </div>
              <div className="p-1 relative ">
                <TextField
                  autoComplete="off"
                  sx={{ fontFamily: "FaLight" }}
                  tabIndex={15}
                  {...register(`EducationState.university`)}
                  error={
                    errors?.EducationState &&
                    errors?.EducationState?.university &&
                    true
                  }
                  className="w-full lg:my-0 font-[FaLight]"
                  size="small"
                  label="دانشگاه"
                  InputProps={{
                    style: {
                      color: errors?.EducationState?.university
                        ? "#b91c1c"
                        : !themeMode || themeMode?.stateMode
                        ? "white"
                        : "#463b2f",
                    },
                  }}
                />
                <label className="text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400">
                  {errors?.EducationState &&
                    errors?.EducationState?.university?.message}
                </label>
              </div>
              <div className="p-1 relative">
                <Select
                  isRtl
                  components={{ MenuList }}
                  {...register(`EducationState.degree`)}
                  placeholder="مقطع تحصیلی"
                  value={
                    educationLevels.find(
                      (item) => item.id == getValues(`EducationState.degree`)
                    ) ?? null
                  }
                  onChange={(
                    option: SingleValue<EducationDegreeModel>,
                    actionMeta: ActionMeta<EducationDegreeModel>
                  ) => {
                    {
                      setValue(`EducationState.degree`, option!.id),
                        trigger(`EducationState.degree`);
                    }
                  }}
                  menuPosition="absolute"
                  maxMenuHeight={700}
                  className={`${
                    !themeMode || themeMode?.stateMode
                      ? "lightText"
                      : "darkText"
                  } w-full font-[FaLight] `}
                  options={educationLevels}
                  theme={(theme) => ({
                    ...theme,
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
                        !themeMode || themeMode?.stateMode ? "white" : "#463b2f"
                      }`,
                      neutral20: errors?.EducationState?.degree
                        ? "#d32f3c"
                        : "#607d8b",
                      neutral30: errors?.EducationState?.degree
                        ? "#d32f3c"
                        : "#607d8b",
                      neutral50: errors?.EducationState?.degree
                        ? "#d32f3c"
                        : "#607d8b",
                    },
                  })}
                />
                <label className="absolute top-[100%] left-0 text-[10px] font-[FaBold] text-start text-red-400">
                  {errors?.EducationState?.degree &&
                    errors?.EducationState!.degree?.message}
                </label>
              </div>

              <div className="p-1 relative ">
                <TextField
                  autoComplete="off"
                  sx={{ fontFamily: "FaLight" }}
                  tabIndex={15}
                  {...register(`EducationState.scoreAverage`)}
                  error={
                    errors?.EducationState &&
                    errors?.EducationState?.scoreAverage &&
                    true
                  }
                  className="w-full lg:my-0 font-[FaLight]"
                  size="small"
                  label="معدل"
                  InputProps={{
                    style: {
                      color: errors?.EducationState?.scoreAverage
                        ? "#b91c1c"
                        : !themeMode || themeMode?.stateMode
                        ? "white"
                        : "#463b2f",
                    },
                  }}
                />
                <label className="text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400">
                  {errors?.EducationState &&
                    errors?.EducationState?.scoreAverage?.message}
                </label>
              </div>
              <div className="p-1 relative ">
                <TextField
                  autoComplete="off"
                  sx={{ fontFamily: "FaLight" }}
                  tabIndex={15}
                  {...register(`EducationState.finishYear`)}
                  error={
                    errors?.EducationState &&
                    errors?.EducationState?.finishYear &&
                    true
                  }
                  className="w-full lg:my-0 font-[FaLight]"
                  size="small"
                  label="سال پایان تحصیل"
                  InputProps={{
                    style: {
                      color: errors?.EducationState?.scoreAverage
                        ? "#b91c1c"
                        : !themeMode || themeMode?.stateMode
                        ? "white"
                        : "#463b2f",
                    },
                  }}
                />
                <label className="text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400">
                  {errors?.EducationState &&
                    errors?.EducationState?.scoreAverage?.message}
                </label>
              </div>
              <div className="p-1 relative ">
                <input
                  type="file"
                  autoComplete="off"
                  accept="application/pdf"
                  {...register(`EducationState.attachmentFile`)}
                  ref={fileRef}
                  onChange={async () => await handleFile()}
                  className={
                    errors?.EducationState &&
                    errors?.EducationState?.attachmentFile
                      ? `${
                          !themeMode || themeMode?.stateMode
                            ? "lightText"
                            : "darkText"
                        } border-red-400 border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused text-red-400`
                      : `${
                          !themeMode || themeMode?.stateMode
                            ? "lightText"
                            : "darkText"
                        } border-[#607d8b] border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused `
                  }
                />
                <label className="absolute bottom-[-15px] left-0 text-[11px] font-[FaBold] text-start text-red-900">
                  {errors?.EducationState &&
                    errors?.EducationState?.attachmentFile?.message}
                </label>
              </div>
            </section>
          </ThemeProvider>
        </form>
      </CardBody>
      <section
        dir="rtl"
        className="w-[100%] h-auto lg:h-[72vh]  mx-auto overflow-auto p-0 my-3"
      >
        <Tooltip
          className={
            !themeMode || themeMode?.stateMode
              ? "cardDark lightText"
              : "cardLight darkText"
          }
          content="(سوابق  تحصیلی (لطفا به ترتیب تاریخ, لحاظ کنید"
          placement="top"
        >
          {loadings.loadingTable == false ? (
            <table
              dir="rtl"
              className={`${
                !themeMode || themeMode?.stateMode ? "tableDark" : "tableLight"
              } w-full max-h-[70vh] relative text-center `}
            >
              <thead className="sticky z-[5] top-0 left-3 w-full">
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
                      رشته تحصیلی
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
                      } p-1.5 text-sm font-[FaBold] leading-none`}
                    >
                      مقطع تحصیلی
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
                      } p-1.5 text-sm font-[FaBold] leading-none`}
                    >
                      نام مرکز تحصیلی
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
                      } p-1.5 text-sm font-[FaBold] leading-none`}
                    >
                      معدل
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
                      سال پایان تحصیل
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
                      } p-1.5 text-sm font-[FaBold] leading-none`}
                    >
                      عملیات
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-bg-[#93c5fd]`}>
                {eduState.map((item: GetUserEducations, index: number) => {
                  return (
                    <tr
                      key={index}
                      style={{ height: "50px" }}
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
                        style={{ width: "20%", minWidth: "150px" }}
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
                          {item.name}
                        </Typography>
                      </td>
                      <td
                        style={{ width: "10%", minWidth: "130px" }}
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
                          {
                            educationLevels.find(
                              (edu) => edu.id == item.educationDegree
                            )?.faName
                          }
                        </Typography>
                      </td>
                      <td
                        style={{ width: "20%", minWidth: "150px" }}
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

                      <td
                        style={{ width: "5%", minWidth: "50px" }}
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
                          {item.scoreAverage}
                        </Typography>
                      </td>
                      <td
                        style={{ width: "5%", minWidth: "50px" }}
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
                          {item.finishYear}
                        </Typography>
                      </td>

                      <td
                        style={{ width: "5%", minWidth: "50px" }}
                        className="px-1"
                      >
                        <div className="container-fluid mx-auto px-0.5">
                          <div className="flex flex-row justify-evenly">
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
                                onMouseEnter={(event: React.MouseEvent<any>) =>
                                  event.currentTarget.classList.add(
                                    "menuIconStyle"
                                  )
                                }
                                onMouseLeave={(event: React.MouseEvent<any>) =>
                                  event.currentTarget.classList.remove(
                                    "menuIconStyle"
                                  )
                                }
                              />
                            </Button>
                            <Button
                              onClick={() => UpdateItem(item)}
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
                                onMouseEnter={(event: React.MouseEvent<any>) =>
                                  event.currentTarget.classList.add(
                                    "menuIconStyle"
                                  )
                                }
                                onMouseLeave={(event: React.MouseEvent<any>) =>
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
                              onClick={() => DeleteEducation(item.id)}
                              placeholder={undefined}
                              onPointerEnterCapture={undefined}
                              onPointerLeaveCapture={undefined}
                            >
                              <DeleteIcon
                                fontSize="small"
                                className="p-1"
                                onMouseEnter={(event: React.MouseEvent<any>) =>
                                  event.currentTarget.classList.add(
                                    "menuIconStyle"
                                  )
                                }
                                onMouseLeave={(event: React.MouseEvent<any>) =>
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
          <UpdateEducation
            getData={item!}
            setNewData={handleData}
            state={handleState}
          />
        </DialogBody>
      </Dialog>
    </>
  );
};

export default Education;
