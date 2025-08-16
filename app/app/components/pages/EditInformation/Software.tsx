"use cliet";
import useStore from "@/app/hooks/useStore";
import {
  EducationDegreeModel,
  GetFileModel,
  GetSoftwareModels,
  SoftwareType,
} from "@/app/models/HR/models";
import colorStore from "@/app/zustandData/color.zustand";
import themeStore from "@/app/zustandData/theme.zustand";
import SaveIcon from "@mui/icons-material/Save";
import { outlinedInputClasses, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
//icon
import useAxios from "@/app/hooks/useAxios";
import { Response } from "@/app/models/HR/sharedModels";
import { LoadingModel, ViewAttachments } from "@/app/models/sharedModels";
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  createTheme,
  Theme,
  ThemeProvider,
  useTheme,
} from "@mui/material/styles";
import { AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import Select, { ActionMeta, SingleValue } from "react-select";
import Swal from "sweetalert2";
import * as yup from "yup";
import AcsPdfViewer from "../../pdfViewer/AcsPdfViewer";
import Loading from "../../shared/loadingResponse";
import TableSkeleton from "../../shared/TableSkeleton";
import UpdateSoftware from "./UpdateSoftware";

const Softwares = (props: any) => {
  const { AxiosRequest } = useAxios();
  const User = UpdateUsersStore((state) => state);
  const [dominanceLevels, setDominanceLevels] = useState<
    EducationDegreeModel[]
  >([]);
  const color = useStore(colorStore, (state) => state);
  const themeMode = useStore(themeStore, (state) => state);
  const schema = yup.object({
    Software: yup
      .object()
      .shape({
        softwareName: yup.string().required("نام نرم افزار را وارد کنید"),
        dominantLevel: yup
          .number()
          .required("میزان توانایی استفاده را وارد کنید")
          .min(1, "میزان توانایی استفاده را وارد کنید"),
        attachmentFile: yup.string(),
        attachmentType: yup
          .string()
          .when(
            ["attachmentFile", "attachmentId"],
            ([attachmentFile, attachmentId], sch) => {
              return attachmentFile != "" && attachmentId == 0
                ? sch.required("اجباری")
                : sch.nullable();
            }
          ),
        attachmentName: yup
          .string()
          .when(
            ["attachmentFile", "attachmentId"],
            ([attachmentFile, attachmentId], sch) => {
              return attachmentFile != "" && attachmentId == 0
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
    getValues,
    reset,
    setValue,
    formState,
    watch,
    control,
    trigger,
  } = useForm<SoftwareType>({
    defaultValues: {
      Software: {
        dominantLevel: 0,
        softwareName: "",
        attachmentFile: "",
        attachmentType: "",
        attachmentName: "",
        attachmentId: 0,
      },
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const errors = formState.errors;
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
        setValue(`Software.attachmentFile`, base64String);
        setValue(`Software.attachmentName`, fileRef.current.files[0]?.name);
        setValue(`Software.attachmentType`, file.type);
      };
    }
  };
  const outerTheme = useTheme();
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

  let loading = {
    loadingTable: false,
    loadingRes: false,
  };
  const [attachment, setAttachment] = useState<ViewAttachments>({
    base64: "",
    type: "",
  });
  const [softwares, setSoftwares] = useState<GetSoftwareModels[]>([]);
  const [loadings, setLoadings] = useState<LoadingModel>(loading);
  const OnSubmit = async () => {
    Swal.fire({
      background:
        !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "حذف نرم افزار های تخصصی",
      text: "آیا از ذخیره این زبان خارجی اطمینان دارید؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      confirmButtonText: "yes, save it!",
      cancelButtonColor: "#f43f5e",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (!errors.Software) {
          setLoadings((state) => ({ ...state, loadingRes: true }));
          let url: string;
          let data: any;
          let method = "put";
          if (User.userId != null) {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/SaveUserSoftwaresLearnt`;
            data = {
              userId: User.userId,
              softwaresLearnt: {
                attachmentId: getValues("Software.attachmentId"),
                certificateFile: getValues("Software.attachmentFile"),
                fileTitle: getValues("Software.attachmentName"),
                fileType: getValues("Software.attachmentType"),
                software: getValues("Software.softwareName"),
                dominanceLevelId: getValues("Software.dominantLevel"),
              },
            };
            let response: AxiosResponse<Response<any>> = await AxiosRequest({
              url,
              method,
              data,
              credentials: true,
            });
            if (response) {
              setValue("Software", {
                dominantLevel: 0,
                softwareName: "",
                attachmentFile: "",
                attachmentId: 0,
                attachmentName: "",
                attachmentType: "",
              });
              setLoadings((state) => ({ ...state, loadingRes: false }));
              if (response.data.status && response.data.data) {
                setSoftwares((state) => [
                  ...state,
                  {
                    attachmentId: response.data.data.attachmentId,
                    dominanceLevelId: data.softwaresLearnt.dominanceLevelId,
                    id: response.data.data.id,
                    name: data.softwaresLearnt.software,
                  },
                ]);
                reset();
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
                  title: "حذف نرم افزار های تخصصی",
                  text: response.data.message,
                  icon: response.data.status ? "warning" : "error",
                  confirmButtonColor: "#22c55e",
                  confirmButtonText: "OK",
                });
              }
            }
          } else {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/SaveCurrentUserSoftwaresLearnt`;
            data = {
              attachmentId: getValues("Software.attachmentId"),
              certificateFile: getValues("Software.attachmentFile"),
              fileTitle: getValues("Software.attachmentName"),
              fileType: getValues("Software.attachmentType"),
              software: getValues("Software.softwareName"),
              dominanceLevelId: getValues("Software.dominantLevel"),
            };
            let response: AxiosResponse<Response<any>> = await AxiosRequest({
              url,
              method,
              data,
              credentials: true,
            });
            if (response) {
              setValue("Software", {
                dominantLevel: 0,
                softwareName: "",
                attachmentFile: "",
                attachmentId: 0,
                attachmentName: "",
                attachmentType: "",
              });
              setLoadings((state) => ({ ...state, loadingRes: false }));
              if (response.data.status && response.data.data) {
                reset();
                setSoftwares((state) => [
                  ...state,
                  {
                    attachmentId: response.data.data.attachmentId,
                    dominanceLevelId: data.dominanceLevelId,
                    id: response.data.data.id,
                    name: data.software,
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
                  title: "حذف نرم افزار های تخصصی",
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
            title: "حذف نرم افزار های تخصصی",
            text: "از درستی و تکمیل موارد اضافه شده اطمینان حاصل فرمایید و مجددا تلاش کنید",
            icon: "warning",
            confirmButtonColor: "#22c55e",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  const DeleteSoftwares = async (id: number) => {
    let url: string;
    if (User.userId != null) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteUserSoftwareLearnt?id=${id}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteCurrentUserSoftwareLearnt?id=${id}`;
    }
    Swal.fire({
      background:
        !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "حذف نرم افزار های تخصصی",
      text: "آیا از حذف این نرم افزار تخصصی اطمینان دارید؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      confirmButtonText: "yes, Delete it!",
      cancelButtonColor: "#f43f5e",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (!errors.Software) {
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
              let array = softwares.filter((item) => item.id !== id);
              setSoftwares([...array]);
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
                title: "حذف نرم افزار های تخصصی",
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

  const ViewDocument = async (id: number) => {
    if (User.userId != null) {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserSoftwareDocumentAttachment?id=${id}`;
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
          atob(getValues(`Software.attachmentFile`)!),
          (c) => c.charCodeAt(0)
        );
        const blob = new Blob([byteArray], {
          type: getValues(`Software.attachmentType`),
        });
        const objectUrl = URL.createObjectURL(blob);
        setAttachment({
          base64: objectUrl,
          type: getValues(`Software.attachmentType`)!,
        });
        handleOpenDocument();
      }
    } else {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetCurrentUserSoftwareDocumentAttachment?id=${id}`;
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
          atob(getValues(`Software.attachmentFile`)!),
          (c) => c.charCodeAt(0)
        );
        const blob = new Blob([byteArray], {
          type: getValues(`Software.attachmentType`)!,
        });
        const objectUrl = URL.createObjectURL(blob);
        setAttachment({
          base64: objectUrl,
          type: getValues(`Software.attachmentType`)!,
        });
        handleOpenDocument();
      }
    }
  };

  useEffect(() => {
    const GetSoftwareList = async () => {
      setLoadings((state) => ({ ...state, loadingTable: true }));
      let url: string;
      if (User.userId != null) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserSoftwares?userId=${User.userId}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetCurrentUserSoftwares`;
      }
      let data = {};
      let method = "get";
      let response: AxiosResponse<Response<GetSoftwareModels[]>> =
        await AxiosRequest({ url, data, method, credentials: true });
      if (response) {
        setLoadings((state) => ({ ...state, loadingTable: false }));
        if (response.data.status && response.data.data.length > 0) {
          if (response.data.status && response.data.data.length > 0) {
            setSoftwares(response.data.data);
          } else {
            setSoftwares([]);
          }
        }
      }
    };
    GetSoftwareList();
  }, [User.userName, User.userId]);

  const [item, setItem] = useState<GetSoftwareModels | null>(null);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const handleUpdateDoc = () => setOpenUpdate(!openUpdate);

  const handleData = (data: GetSoftwareModels) => {
    let index: number = softwares.indexOf(
      softwares.find((x) => x.id == data.id)!
    );
    let option: GetSoftwareModels = softwares.find((x) => x.id == data.id)!;
    data != null
      ? softwares.splice(index, 1, {
          ...option,
          dominanceLevelId: data.dominanceLevelId,
          name: data.name,
        })
      : null;
  };

  const UpdateItem = (op: GetSoftwareModels) => {
    setItem(op);
    handleUpdateDoc();
  };

  const handleState = (data: boolean) => {
    setOpenUpdate(data);
  };

  useEffect(() => {
    const GetDominanceLevels = async () => {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/BaseInfo/manage/GetDominanceLevels`;
      let method = "get";
      let data = {};
      let response: AxiosResponse<Response<EducationDegreeModel[]>> =
        await AxiosRequest({ url, method, data, credentials: true });
      if (response) {
        if (response.data.status && response.data.data != null) {
          setDominanceLevels(
            response.data.data.map((item) => {
              return {
                value: item.id,
                label: item.faName,
                faName: item.faName,
                id: item.id,
                name: item.name,
              };
            })
          );
        }
      }
    };
    GetDominanceLevels();
  }, []);

  return (
    <>
      {loadings.loadingRes == true && <Loading />}
      <CardBody
        className={`${
          !themeMode || themeMode?.stateMode ? "cardDark" : "cardLight"
        } h-auto mx-auto `}
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
              content="Save Softwares"
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
            <section className="grid grid-cols-1 md:grid-cols-3 gap-x-1 gap-y-5 my-2">
              <div className="p-1 relative">
                <TextField
                  autoComplete="off"
                  sx={{ fontFamily: "FaLight" }}
                  tabIndex={1}
                  {...register(`Software.softwareName`)}
                  error={
                    errors?.Software && errors?.Software?.softwareName && true
                  }
                  className="w-full lg:my-0 font-[FaLight]"
                  size="small"
                  label="نرم افزار های تخصصی"
                  InputProps={{
                    style: {
                      color: errors?.Software?.softwareName
                        ? "#b91c1c"
                        : !themeMode || themeMode?.stateMode
                        ? "white"
                        : "#463b2f",
                    },
                  }}
                />
                <label className="text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400">
                  {errors?.Software && errors?.Software?.softwareName?.message}
                </label>
              </div>
              <div className="p-1 relative ">
                <Select
                  isRtl
                  placeholder="میزان توانایی استفاده"
                  maxMenuHeight={200}
                  className={`${
                    !themeMode || themeMode?.stateMode
                      ? "lightText"
                      : "darkText"
                  } w-full font-[FaMedium]`}
                  options={dominanceLevels}
                  {...register(`Software.dominantLevel`)}
                  value={
                    dominanceLevels.find(
                      (item) => item.id == getValues(`Software.dominantLevel`)
                    ) ?? null
                  }
                  onChange={(
                    option: SingleValue<EducationDegreeModel>,
                    actionMeta: ActionMeta<EducationDegreeModel>
                  ) => {
                    {
                      setValue(`Software.dominantLevel`, option!.id),
                        trigger(`Software.dominantLevel`);
                    }
                  }}
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
                      neutral20: errors?.Software?.dominantLevel
                        ? "#d32f3c"
                        : "#607d8b",
                      neutral30: errors?.Software?.dominantLevel
                        ? "#d32f3c"
                        : "#607d8b",
                      neutral50: errors?.Software?.dominantLevel
                        ? "#d32f3c"
                        : "#607d8b",
                    },
                  })}
                />
                <label className="absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400">
                  {errors?.Software?.dominantLevel &&
                    errors?.Software!.dominantLevel?.message}
                </label>
              </div>
              <div className="p-1 relative ">
                <input
                  type="file"
                  autoComplete="off"
                  accept="application/pdf"
                  {...register(`Software.attachmentFile`)}
                  ref={fileRef}
                  onChange={async () => await handleFile()}
                  className={
                    errors?.Software && errors?.Software?.attachmentFile
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
                  {errors?.Software &&
                    errors?.Software?.attachmentFile?.message}
                </label>
              </div>
            </section>
          </ThemeProvider>
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
            } w-full max-h-[70vh] md:relative text-center `}
          >
            <thead className="sticky z-[3] top-0 left-3 w-full">
              <tr className="bg-indigo-500">
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
                    نرم افزار های تخصصی
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
                    میزان توانایی استفاده
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
            <tbody className={`divide-y divide-bg-[#93c5fd]`}>
              {softwares.length > 0 &&
                softwares.map((item: GetSoftwareModels, index: number) => {
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
                      <td className="p-1 relative">
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
                      <td style={{ width: "25%" }} className="p-1 relative">
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
                            dominanceLevels.find(
                              (option) => option.id == item.dominanceLevelId
                            )?.faName
                          }
                        </Typography>
                      </td>
                      <td style={{ width: "3%" }} className="px-1">
                        <div className="container-fluid mx-auto px-0.5">
                          <div className="flex flex-row justify-evenly">
                            {item.attachmentId && (
                              <Button
                                onClick={() => ViewDocument(item.attachmentId!)}
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
                              style={{ background: color?.color }}
                              className="p-1 mx-1"
                              onClick={() => UpdateItem(item)}
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
                              size="sm"
                              style={{ background: color?.color }}
                              className="p-1 mx-1"
                              onClick={() => DeleteSoftwares(item.id)}
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
          } flex justify-between sticky z-[8585] top-0 left-0`}
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
          <UpdateSoftware
            getData={item}
            setNewData={handleData}
            state={handleState}
          />
        </DialogBody>
      </Dialog>
    </>
  );
};

export default Softwares;
