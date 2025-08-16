import MyCustomComponent from "@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui";
import DatePickare from "@/app/EndPoints-AsiaApp/Components/Shared/DatePickareComponent";
import useAxios from "@/app/hooks/useAxios";
import useStore from "@/app/hooks/useStore";
import {
  GetCheckUpDataModel,
  GetFileModel,
  PriodicalCheckUpsModel,
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
import { Typography } from "@mui/material";
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
import UpdateCheckeUp from "./UpdateCheckup";

const PriodicalCheckUps = () => {
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
  const color = useStore(colorStore, (state) => state);
  const themeMode = useStore(themeStore, (state) => state);
  const schema = yup.object().shape({
    PriodicalCheckUps: yup
      .object()
      .shape({
        checkUpDate: yup.string().required("اجباری"),
        attachmentFile: yup.string().required("اجباری"),
        attachmentName: yup.string().required("اجباری"),
        attachmentType: yup.string().required("اجباری"),
      })
      .required(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    resetField,
    formState,
    control,
    watch,
    trigger,
  } = useForm<PriodicalCheckUpsModel>({
    defaultValues: {
      PriodicalCheckUps: {
        attachmentFile: "",
        attachmentId: 0,
        attachmentName: "",
        attachmentType: "",
        checkUpDate: "",
      },
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const [list, setList] = useState<GetCheckUpDataModel[]>([]);
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
        setValue(
          `PriodicalCheckUps.attachmentName`,
          fileRef.current.files[0]?.name
        );
        setValue(`PriodicalCheckUps.attachmentFile`, base64String);
        setValue(
          `PriodicalCheckUps.attachmentType`,
          fileRef.current.files[0]?.type
        );
        trigger([
          "PriodicalCheckUps.attachmentFile",
          "PriodicalCheckUps.attachmentType",
          "PriodicalCheckUps.attachmentName",
        ]);
      };
    }
  };

  const OnSubmit = async () => {
    Swal.fire({
      background:
        !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "ذخیره معاینات ادواری",
      text: "آیا از ذخیره این تغییرات اطمینان دارید؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      confirmButtonText: "Yes, save it!",
      cancelButtonColor: "#f43f5e",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (!errors.PriodicalCheckUps) {
          setLoadings((state) => ({ ...state, loadingRes: true }));
          let url: string;
          let data: any;
          let method = "put";
          if (User.userId != null) {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/SaveUserPriodicalCheckUps`;
            data = {
              userId: User.userId,
              periodicalCheckUps: {
                attachmentId: getValues("PriodicalCheckUps.attachmentId"),
                checkUpDate: getValues("PriodicalCheckUps.checkUpDate"),
                resultFile: getValues("PriodicalCheckUps.attachmentFile"),
                fileTitle: getValues("PriodicalCheckUps.attachmentName"),
                fileType: getValues("PriodicalCheckUps.attachmentType"),
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
                    checkUpDate: data.periodicalCheckUps.checkUpDate,
                    id: response.data.data.id,
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
                  title: "ذخیره معاینات ادواری",
                  text: response.data.message,
                  icon: response.data.status ? "warning" : "error",
                  confirmButtonColor: "#22c55e",
                  confirmButtonText: "OK!",
                });
              }
            }
          } else {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/SaveCurrentUserPriodicalCheckUps`;
            let data = {
              attachmentId: getValues("PriodicalCheckUps.attachmentId"),
              checkUpDate: getValues("PriodicalCheckUps.checkUpDate"),
              resultFile: getValues("PriodicalCheckUps.attachmentFile"),
              fileTitle: getValues("PriodicalCheckUps.attachmentName"),
              fileType: getValues("PriodicalCheckUps.attachmentType"),
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
              if (response.data.status && response.data.data != null) {
                setList((state) => [
                  ...state,
                  {
                    attachmentId: response.data.data.attachmentId,
                    checkUpDate: data.checkUpDate,
                    id: response.data.data.id,
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
                  title: "ذخیره معاینات ادواری",
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
            title: "ذخیره معاینات ادواری",
            text: "از درستی و تکمیل موارد اضافه شده اطمینان حاصل فرمایید و مجددا تلاش کنید",
            icon: "warning",
            confirmButtonColor: "#22c55e",
            confirmButtonText: "OK!",
          });
        }
      }
    });
  };

  const ViewDocument = async (id: number) => {
    let url: string;
    if (User.userId != null) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserCheckUpAttachment?id=${id}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetCurrentUserCheckUpDocumentAttachment?id=${id}`;
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
    const GetPriodicalCheckups = async () => {
      setLoadings((state) => ({ ...state, loadingTable: true }));
      let url: string;
      if (User.userId != null) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserPriodicalCheckups?userId=${User.userId}`;
      } else {
        url =
          url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetCurrentUserPriodicalCheckups`;
      }
      let data = {};
      let method = "get";
      let response: AxiosResponse<Response<GetCheckUpDataModel[]>> =
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
    GetPriodicalCheckups();
  }, [User.userId, User.userName]);

  const DeleteCheckUpItem = async (id: number) => {
    let url: string;
    if (User.userId != null) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteUserPriodicalCheckup?id=${id}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteCurrentUserPriodicalCheckup?id=${id}`;
    }
    Swal.fire({
      background:
        !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "حذف معاینات ادواری",
      text: "آیا از حذف این دوره اطمینان دارید؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      confirmButtonText: "Yes, Delete it!",
      cancelButtonColor: "#f43f5e",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (!errors.PriodicalCheckUps) {
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
                title: "حذف معاینات ادواری",
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
  const [item, setItem] = useState<GetCheckUpDataModel | null>(null);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const handleUpdateDoc = () => setOpenUpdate(!openUpdate);

  const handleData = (data: GetCheckUpDataModel) => {
    let index: number = list.indexOf(list.find((x) => x.id == data.id)!);
    let option: GetCheckUpDataModel = list.find((x) => x.id == data.id)!;
    data != null
      ? list.splice(index, 1, {
          ...option,
          checkUpDate: data.checkUpDate,
        })
      : null;
  };

  const UpdateItem = (op: GetCheckUpDataModel) => {
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
      "PriodicalCheckUps.checkUpDate",
      new DateObject(object).convert(gregorian, gregorian_en).format()
    );
    trigger("PriodicalCheckUps.checkUpDate");
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
          } rounded-lg shadow-md h-auto mx-auto `}
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
                content="Save Priodical CheckUps"
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
              <Tooltip
                className={
                  !themeMode || themeMode?.stateMode
                    ? "cardDark lightText"
                    : "cardLight darkText"
                }
                content="تاریخ انجام معاینات"
                placement="top"
              >
                <div className="p-1 relative">
                  <DatePickare
                    register={{ ...register(`PriodicalCheckUps.checkUpDate`) }}
                    label="تاریخ انجام معاینات"
                    value={state.date}
                    onChange={(date: DateObject) => convert(date)}
                    error={
                      errors?.PriodicalCheckUps &&
                      errors?.PriodicalCheckUps.checkUpDate &&
                      true
                    }
                    focused={watch(`PriodicalCheckUps.checkUpDate`)}
                  />
                  <label className="text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400">
                    {errors?.PriodicalCheckUps &&
                      errors?.PriodicalCheckUps!.checkUpDate?.message}
                  </label>
                </div>
              </Tooltip>
              <div className="p-1 relative ">
                <input
                  type="file"
                  autoComplete="off"
                  accept="application/pdf"
                  {...register(`PriodicalCheckUps.attachmentFile`)}
                  ref={fileRef}
                  onChange={async () => await handleFile()}
                  className={
                    errors?.PriodicalCheckUps &&
                    errors?.PriodicalCheckUps?.attachmentFile
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
                  {errors?.PriodicalCheckUps &&
                    errors?.PriodicalCheckUps?.attachmentFile?.message}
                </label>
              </div>
            </section>
          </form>
        </CardBody>
        <section
          dir="rtl"
          className="w-[100%] h-auto lg:h-[72vh] mx-auto  p-0 my-3"
        >
          <table
            dir="rtl"
            className={`${
              !themeMode || themeMode?.stateMode ? "tableDark" : "tableLight"
            } w-full max-h-[70vh] md:relative text-center`}
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
                    } p-1.5 whitespace-nowrap text-sm font-[FaBold] leading-none`}
                  >
                    تاریخ انجام معاینات
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
                !themeMode || themeMode?.stateMode ? "themeDark" : "themeLight"
              }`}
            >
              {list.length > 0 &&
                list.map((item: GetCheckUpDataModel, index: number) => {
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
                          {item.checkUpDate
                            ? new DateObject(item.checkUpDate)
                                .convert(persian, persian_en)
                                .format()
                            : ""}
                        </Typography>
                      </td>

                      <td style={{ width: "7%" }} className="px-1">
                        <div className="container-fluid mx-auto px-0.5">
                          <div className="flex flex-row justify-evenly">
                            {item.attachmentId && (
                              <Button
                                style={{ background: color?.color }}
                                size="sm"
                                className="p-1 mx-1"
                                onClick={() => ViewDocument(item.attachmentId!)}
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
                              onClick={() => DeleteCheckUpItem(item.id)}
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
            } flex justify-between sticky top-0 left-0 p-[85858]`}
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
            <UpdateCheckeUp
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

export default PriodicalCheckUps;
