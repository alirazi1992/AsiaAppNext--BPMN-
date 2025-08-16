"use client";
import MyCustomComponent from "@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui";
import DatePickare from "@/app/EndPoints-AsiaApp/Components/Shared/DatePickareComponent";
import useAxios from "@/app/hooks/useAxios";
import useStore from "@/app/hooks/useStore";
import { DataModel, EducationDegreeModel, InformationModel } from "@/app/models/HR/models";
import { Response } from "@/app/models/HR/sharedModels";
import { GetUserModel } from "@/app/models/HR/userInformation";
import { ViewAttachments } from "@/app/models/sharedModels";
import colorStore from "@/app/zustandData/color.zustand";
import themeStore from "@/app/zustandData/theme.zustand";
import UpdateUserStore from "@/app/zustandData/updateUsers";
import useLoginUserInfo from "@/app/zustandData/useLoginUserInfo";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Tooltip,
} from "@material-tailwind/react";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import PlaceIcon from "@mui/icons-material/Place";
import SaveIcon from "@mui/icons-material/Save";
import { Checkbox, FormControl, FormControlLabel, Radio, RadioGroup, RadioProps, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AxiosResponse } from "axios";
import { useEffect, useMemo, useState } from "react";
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
import IframeSkeleton from "../../shared/IframeSkeleton";
import Loading from "../../shared/loadingResponse";
import PersonalAddress from "./personalAddress";
import PersonalEmails from "./personalEmails";
import PersonalPhone from "./personalPhone";

type PersonalInfoModel = {
  gender: EducationDegreeModel[];
  militry: DataModel[];
  EducationDegree: EducationDegreeModel[];
};
const PesonalInfo = () => {
  const { AxiosRequest } = useAxios();
  const CurrentUser = useLoginUserInfo.getState();
  const User = UpdateUserStore.getState();
  const schema = yup.object().shape({
    UserInfo: yup
      .object({
        faLastName: yup
          .string()
          .required("نام خانوادگی اجباری")
          .matches(
            /^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/,
            "فقط مجاز به استفاده از حروف فارسی هستید"
          ),
        faTitle: yup
          .string()
          .required("عنوان اجباری")
          .matches(
            /^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/,
            "فقط مجاز به استفاده از حروف فارسی هستید"
          ),
        userName: yup
          .string()
          .required("نام کاربری اجباری")
          .matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, "فقط مجاز به استفاده از حروف لاتین هستید"),
        lastName: yup
          .string()
          .required("نام خانوادگی انگلیسی اجباری")
          .matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, "فقط مجاز به استفاده از حروف لاتین هستید"),
        title: yup
          .string()
          .required("عنوان انگلیسی اجباری")
          .matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, "فقط مجاز به استفاده از حروف لاتین هستید"),
        accessFailedCount: yup.number(),
        personnelCode: yup.number().required("اجباری").typeError("مقدار عددی وارد کنید"),
      })
      .required(),
  });
  const {
    unregister,
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    watch,
    resetField,
    getValues,
    formState,
    trigger,
  } = useForm<InformationModel>({
    defaultValues: {
      UserInfo: {
        isMarried: false,
        genderId: 1,
        twoFactorEnabled: false,
        title: "",
        inssuranceNo: "",
        faTitle: "",
        firstName: "",
        userName: "",
        birthDate: "",
        faLastName: "",
        birthCertificateId: "",
        faFirstName: "",
        fatherName: "",
        lastName: "",
        nationalCode: "",
        militaryServiceId: null,
        birthCertificateIssueanceCity: "",
        childCount: 0,
        lastEducationDegree: 0,
        fieldOfStudy: "",
        employmentDate: "",
        personnelCode: 0,
        accessFailedCount: 0,
        isTechnicalExp: false,
        isRetired: false,
        isActive: false,
        isConfirmed: false,
        lockoutEnd: "",
        lockoutEnabled: false,
      },
    },
    mode: "all",
    resolver: yupResolver(schema),
  });

  const [open, setOpen] = useState<boolean>(false);
  const handlerOpen = () => setOpen(!open);

  useEffect(() => {
    reset(undefined, {
      keepValues: false,
      keepDefaultValues: false,
      keepDirty: false,
      keepDirtyValues: false,
      keepErrors: false,
      keepIsSubmitSuccessful: false,
      keepIsSubmitted: false,
      keepIsValid: false,
      keepIsValidating: false,
      keepSubmitCount: false,
      keepTouched: false,
    });
    GetGender();
    GetEducationLevels();
    GetMilitaryServicesList();
    const GetUser = async () => {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/GetUser?username=${User?.userName}`;
      let method = "get";
      let data = {};
      let response: AxiosResponse<Response<GetUserModel>> = await AxiosRequest({
        url,
        method,
        data,
        credentials: true,
      });
      if (response) {
        if (response.data.status && response.data.data != null) {
          setValue("UserInfo", {
            firstName: response.data.data.firstName,
            faFirstName: response.data.data.faFirstName,
            lastName: response.data.data.lastName,
            faLastName: response.data.data.faLastName,
            userName: response.data.data.userName,
            title: response.data.data.title,
            faTitle: response.data.data.faTitle,
            isMarried: response.data.data.isMarried,
            isConfirmed: response.data.data.isConfirmed,
            isTechnicalExp: response.data.data.isTechnicalExp,
            lockoutEnabled: response.data.data.lockoutEnabled,
            inssuranceNo: response.data.data.inssuranceNo,
            isActive: response.data.data.isActive,
            nationalCode: response.data.data.nationalCode,
            fatherName: response.data.data.fatherName,
            genderId: response.data.data.genderId,
            twoFactorEnabled: response.data.data.twoFactorEnabled,
            militaryServiceId: response.data.data.militaryServiceId,
            birthDate: response.data.data.birthDate,
            birthCertificateId: response.data.data.birthCertificateId,
            birthCertificateIssueanceCity: response.data.data.birthCertificateIssueanceCity,
            childCount: response.data.data.childCount,
            lastEducationDegree: response.data.data.lastEducationDegree,
            fieldOfStudy: response.data.data.fieldOfStudy,
            employmentDate: response.data.data.employmentDate,
            insuranceNumber: response.data.data.inssuranceNo,
            personnelCode: response.data.data.personalCode,
            accessFailedCount: response.data.data.accessFailedCount,
            isRetired: response.data.data.isRetired,
            lockoutEnd: response.data.data.lockoutEnd,
          });
          setState((prevState) => ({
            ...prevState,
            birthDate: {
              ...prevState.birthDate,
              date: response.data.data.birthDate !== null ? new DateObject(response.data.data.birthDate) : null,
            },
            employmentDate: {
              ...prevState.employmentDate,
              date:
                response.data.data.employmentDate !== null ? new DateObject(response.data.data.employmentDate) : null,
            },
          }));
        }
      }
    };
    const GetCurrentUser = async () => {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/GetCurrentUser`;
      let method = "get";
      let data = {};
      let response: AxiosResponse<Response<GetUserModel>> = await AxiosRequest({
        url,
        method,
        data,
        credentials: true,
      });
      if (response) {
        if (response.data.status && response.data.data != null) {
          setValue("UserInfo", {
            firstName: response.data.data.firstName,
            faFirstName: response.data.data.faFirstName,
            lastName: response.data.data.lastName,
            faLastName: response.data.data.faLastName,
            userName: response.data.data.userName,
            title: response.data.data.title,
            faTitle: response.data.data.faTitle,
            isMarried: response.data.data.isMarried,
            isConfirmed: response.data.data.isConfirmed,
            isTechnicalExp: response.data.data.isTechnicalExp,
            lockoutEnabled: response.data.data.lockoutEnabled,
            inssuranceNo: response.data.data.inssuranceNo,
            isActive: response.data.data.isActive,
            nationalCode: response.data.data.nationalCode,
            fatherName: response.data.data.fatherName,
            genderId: response.data.data.genderId,
            twoFactorEnabled: response.data.data.twoFactorEnabled,
            militaryServiceId: response.data.data.militaryServiceId,
            birthDate: response.data.data.birthDate,
            birthCertificateId: response.data.data.birthCertificateId,
            birthCertificateIssueanceCity: response.data.data.birthCertificateIssueanceCity,
            childCount: response.data.data.childCount,
            lastEducationDegree: response.data.data.lastEducationDegree,
            fieldOfStudy: response.data.data.fieldOfStudy,
            employmentDate: response.data.data.employmentDate,
            insuranceNumber: response.data.data.inssuranceNo,
            personnelCode: response.data.data.personalCode,
            accessFailedCount: response.data.data.accessFailedCount,
            isRetired: response.data.data.isRetired,
            lockoutEnd: response.data.data.lockoutEnd,
          });

          setState((prevState) => ({
            ...prevState,
            birthDate: {
              ...prevState.birthDate,
              date: new DateObject({ date: response.data.data.birthDate }),
            },
            employmentDate: {
              ...prevState.employmentDate,
              date: new DateObject({ date: response.data.data.employmentDate }),
            },
          }));
        }
      }
    };
    if (User && User.userName != null) {
      GetUser();
    } else {
      GetCurrentUser();
    }
  }, [User, User.userName, reset, setValue]);

  let personalInfoData: PersonalInfoModel = {
    gender: [],
    militry: [],
    EducationDegree: [],
  };
  const color = useStore(colorStore, (state) => state);
  const themeMode = useStore(themeStore, (state) => state);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadResume, setLoadResume] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("personInfo");
  const [data, setData] = useState(personalInfoData);
  const errors = formState.errors;
  const BpIcon = styled("span")(({ theme }) => ({
    borderRadius: "50%",
    width: 16,
    height: 16,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 0 0 1px rgb(16 22 26 / 40%)"
        : "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
    backgroundColor: theme.palette.mode === "dark" ? "#394b59" : "#f5f8fa",
    backgroundImage:
      theme.palette.mode === "dark"
        ? "linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))"
        : "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
    ".Mui-focusVisible &": {
      outline: "2px auto rgba(19,124,189,.6)",
      outlineOffset: 2,
    },
    "input:hover ~ &": {
      backgroundColor: theme.palette.mode === "dark" ? "#30404d" : "#ebf1f5",
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background: theme.palette.mode === "dark" ? "rgba(57,75,89,.5)" : "rgba(206,217,224,.5)",
    },
  }));
  const BpCheckedIcon = styled(BpIcon)(
    {
      backgroundColor: color?.color,
      backgroundImage: "linear-gradient(180deg,#818cf810,hsla(0,0%,100%,0))",
      "&::before": {
        display: "block",
        width: 16,
        height: 16,
        backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
        content: '""',
      },
      "input:hover ~ &": {
        backgroundColor: color?.color,
      },
    },
    { index: 1 }
  );

  function BpRadio(props: RadioProps) {
    return <Radio disableRipple color="default" checkedIcon={<BpCheckedIcon />} icon={<BpIcon />} {...props} />;
  }

  const married = useMemo(
    () => [
      {
        id: 1,
        title: "single",
        faTitle: "مجرد",
        isMarried: false,
      },
      {
        id: 2,
        title: "married",
        faTitle: "متاهل",
        isMarried: true,
      },
    ],
    []
  );

  const GetEducationLevels = async () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/BaseInfo/manage/GetEducationDegrees`;
    let method = "get";
    let data = {};
    let response: AxiosResponse<Response<EducationDegreeModel[]>> = await AxiosRequest({
      url,
      method,
      data,
      credentials: true,
    });
    if (response) {
      if (response.data.status && response.data.data != null) {
        setData((state) => ({
          ...state,
          EducationDegree: response.data.data.map((item: EducationDegreeModel) => {
            return {
              value: item.id,
              label: item.faName,
              faName: item.faName,
              name: item.name,
              id: item.id,
            };
          }),
        }));
      }
    }
  };
  const GetMilitaryServicesList = async () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/BaseInfo/manage/GetMilitariesList`;
    let method = "get";
    let data = {};
    let response: AxiosResponse<Response<DataModel[]>> = await AxiosRequest({
      url,
      method,
      data,
      credentials: true,
    });
    if (response) {
      if (response.data.status && response.data.data != null) {
        setData((prev) => ({
          ...prev,
          militry:
            response.data.data.length > 0
              ? response.data.data.map((item: DataModel) => {
                  return {
                    value: item.id,
                    label: item.faTitle,
                    faTitle: item.faTitle,
                    id: item.id,
                    title: item.title,
                  };
                })
              : [],
        }));
      }
    }
  };

  const GetGender = async () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetGenders`;
    let method = "GET";
    let data = {};
    let response: AxiosResponse<Response<EducationDegreeModel[]>> = await AxiosRequest({
      url,
      method,
      data,
      credentials: true,
    });
    if (response) {
      if (response.data.status && response.data.data) {
        setData((prev) => ({
          ...prev,
          gender: response.data.data,
        }));
      }
    }
  };

  const OnSubmit = async () => {
    if (!errors.UserInfo) {
      Swal.fire({
        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
        allowOutsideClick: false,
        title: "به روز رسانی کاربر",
        text: "آیا از اعمال تغییرات جدید اطمینان دارید!؟",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#22c55e",
        confirmButtonText: "yes, Update! ",
        cancelButtonColor: "#f43f5e",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setLoading(true);
          let url =
            CurrentUser &&
            CurrentUser.userInfo &&
            CurrentUser.userInfo.actors.some((actor: any) =>
              actor.claims.some(
                (claim: any) =>
                  (claim.key == "UserManagement" && claim.value == "Admin") ||
                  (claim.key == "HumanResource" && claim.value == "Admin")
              )
            )
              ? `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/UpdateUser`
              : `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/UpdateCurrentUser`;
          let method = "patch";
          let data = {
            userName: getValues("UserInfo.userName"),
            accessFailedCount: getValues("UserInfo.accessFailedCount"),
            isActive: getValues("UserInfo.isActive"),
            genderId: getValues("UserInfo.genderId"),
            faFirstName: getValues("UserInfo.faFirstName"),
            faLastName: getValues("UserInfo.faLastName"),
            firstName: getValues("UserInfo.firstName"),
            lastName: getValues("UserInfo.lastName"),
            faTitle: getValues("UserInfo.faTitle"),
            title: getValues("UserInfo.title"),
            nationalCode: getValues("UserInfo.nationalCode"),
            employmentDate: getValues("UserInfo.employmentDate"),
            childCount: getValues("UserInfo.childCount"),
            fatherName: getValues("UserInfo.fatherName"),
            inssuranceNo: getValues("UserInfo.inssuranceNo"),
            birthCertificateId: getValues("UserInfo.birthCertificateId"),
            birthCertificateIssueanceCity: getValues("UserInfo.birthCertificateIssueanceCity"),
            militaryServiceId: getValues(`UserInfo.militaryServiceId`) ? getValues(`UserInfo.militaryServiceId`) : null,
            lastEducationDegree: getValues("UserInfo.lastEducationDegree"),
            fieldOfStudy: getValues("UserInfo.fieldOfStudy"),
            isMarried: getValues("UserInfo.isMarried"),
            personnelCode: getValues("UserInfo.personnelCode"),
            twoFactorEnabled: getValues("UserInfo.twoFactorEnabled"),
            birthDate: getValues("UserInfo.birthDate"),
            isTechnicalExp: getValues("UserInfo.isTechnicalExp"),
            isRetired: getValues("UserInfo.isRetired"),
            isConfirmed: getValues("UserInfo.isConfirmed"),
            lockoutEnabled: getValues("UserInfo.lockoutEnabled"),
          };
          let response: AxiosResponse<Response<string>> = await AxiosRequest({
            url,
            method,
            data,
            credentials: true,
          });
          if (response) {
            setLoading(false);
            if (response.data.data == "" || response.data.data == null) {
              Swal.fire({
                background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                allowOutsideClick: false,
                title: "به روز رسانی کاربر",
                text: response.data.message,
                icon: response.data.status ? "warning" : "error",
                confirmButtonColor: "#22c55e",
                confirmButtonText: "OK",
              });
            }
          }
        }
      });
    } else {
      setLoading(false);
      Swal.fire({
        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
        allowOutsideClick: false,
        text: "از درستی و تکمیل موارد پرشده اطمینان حاصل فرمایید و مجددا تلاش کنید",
        icon: "warning",
        confirmButtonColor: "#22c55e",
        confirmButtonText: "OK",
      });
    }
  };
  const [attachment, setAttachment] = useState<ViewAttachments>({
    base64: "",
    type: "",
  });

  const GetFileResume = async () => {
    handlerOpen();
    setLoadResume(true);
    let url: string;
    if (User.userId != null) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetPersonnelResumePdf?userId=${User.userId}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GenerateCurrentUserResume`;
    }
    let data = {};
    let method = "get";
    let response: AxiosResponse<Response<string>> = await AxiosRequest({
      url,
      data,
      method,
      credentials: true,
    });
    if (response) {
      setLoadResume(false);
      if (response.data.status && response.data.data != null) {
        const byteArray = Uint8Array.from(atob(response.data.data!), (c) => c.charCodeAt(0));
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const objectUrl = URL.createObjectURL(blob);
        setAttachment({
          base64: objectUrl,
          type: "application/pdf"!,
        });
      } else {
        Swal.fire({
          background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
          color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
          allowOutsideClick: false,
          title: "مشاهده ی فایل رزومه",
          text: "فایل مورد نظر یافت نشد",
          icon: "warning",
          confirmButtonColor: "#22c55e",
          confirmButtonText: "OK",
        });
      }
    }
  };
  const [state, setState] = useState<{
    birthDate: {
      format: string;
      gregorian?: string;
      persian?: string;
      date?: DateObject | null;
    };
    employmentDate: {
      format: string;
      gregorian?: string;
      persian?: string;
      date?: DateObject | null;
    };
  }>({
    birthDate: { format: "YYYY/MM/DD" },
    employmentDate: { format: "YYYY/MM/DD" },
  });

  const ConvertBirthDate = (date: DateObject, format: string = state.birthDate.format) => {
    let object = { date, format };
    setValue("UserInfo.birthDate", new DateObject(object).convert(gregorian, gregorian_en).format());
    trigger("UserInfo.birthDate");
    setState((prevState) => ({
      ...prevState,
      birthDate: {
        gregorian: new DateObject(object).format(),
        persian: new DateObject(object).convert(persian, persian_en).format(),
        ...object,
      },
    }));
  };
  const ConvertEmploymentDate = (date: DateObject, format: string = state.employmentDate.format) => {
    let object = { date, format };
    setValue("UserInfo.employmentDate", new DateObject(object).convert(gregorian, gregorian_en).format());
    trigger("UserInfo.employmentDate");
    setState((prevState) => ({
      ...prevState,
      employmentDate: {
        gregorian: new DateObject(object).format(),
        persian: new DateObject(object).convert(persian, persian_en).format(),
        ...object,
      },
    }));
  };

  return (
    <MyCustomComponent>
      <>
        {loading == true && <Loading />}
        <Tabs dir="ltr" value="personInfo" className="w-full mb-3 h-auto">
          <TabsHeader
            className={`${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"} max-w-[200px]`}
            indicatorProps={{
              style: {
                background: color?.color,
                color: "white",
              },
              className: `shadow `,
            }}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <Tab
              onClick={() => {
                setActiveTab("personInfo");
              }}
              value="personInfo"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Tooltip
                className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                content="مشخصات فردی"
                placement="top"
              >
                <AccountBoxIcon
                  fontSize="small"
                  className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                  style={{
                    color: `${activeTab == "personInfo" ? "white" : ""}`,
                  }}
                />
              </Tooltip>
            </Tab>
            <Tab
              onClick={() => {
                setActiveTab("phoneInfo");
              }}
              value="phoneInfo"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Tooltip
                className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                content="شماره تماس"
                placement="top"
              >
                <LocalPhoneIcon
                  fontSize="small"
                  className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                  style={{
                    color: `${activeTab == "phoneInfo" ? "white" : ""}`,
                  }}
                />
              </Tooltip>
            </Tab>
            <Tab
              onClick={() => {
                setActiveTab("addressInfo");
              }}
              value="addressInfo"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Tooltip
                className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                content="آدرس ها"
                placement="top"
              >
                <PlaceIcon
                  fontSize="small"
                  className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                  style={{
                    color: `${activeTab == "addressInfo" ? "white" : ""}`,
                  }}
                />
              </Tooltip>
            </Tab>
            <Tab
              onClick={() => {
                setActiveTab("personInfoEmail");
              }}
              value="personInfoEmail"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Tooltip
                className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                content="ایمیل ها"
                placement="top"
              >
                <EmailIcon
                  fontSize="small"
                  className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                  style={{
                    color: `${activeTab == "personInfoEmail" ? "white" : ""}`,
                  }}
                />
              </Tooltip>
            </Tab>
            <Tab
              onClick={() => {
                setActiveTab("resumeFile"), GetFileResume();
              }}
              value="resumeFile"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Tooltip
                className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                content="مشاهده ی فایل رزومه"
                placement="top"
              >
                <ContactPageIcon
                  fontSize="small"
                  className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                  style={{
                    color: `${activeTab == "resumeFile" ? "white" : ""}`,
                  }}
                />
              </Tooltip>
            </Tab>
          </TabsHeader>
          <TabsBody
            animate={{
              initial: { y: 10 },
              mount: { y: 0 },
              unmount: { y: 250 },
            }}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <TabPanel value="personInfo" className="p-0 w-full px-5 py-2">
              <form onSubmit={handleSubmit(OnSubmit)} className="h-full w-full my-2">
                <div dir="rtl" className="w-max p-2 ">
                  <Tooltip
                    className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                    content="Update User"
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
                <section className=" overflow-y-auto w-full">
                  <section dir="rtl" className="w-full gap-x-4 p-3 grid md:grid-cols-2 lg:grid-cols-3">
                    <section className="flex flex-col gap-y-3 w-[100%] h-full">
                      <section className="my-1 relative w-full">
                        <TextField
                          autoComplete="off"
                          sx={{ fontFamily: "FaLight" }}
                          {...register(`UserInfo.faFirstName`)}
                          tabIndex={1}
                          error={errors?.UserInfo && errors?.UserInfo?.faFirstName && true}
                          className="w-full lg:my-0 font-[FaLight]"
                          dir="rtl"
                          size="small"
                          label="نام"
                          focused={getValues("UserInfo.faFirstName") != "" ? true : false}
                          InputProps={{
                            style: {
                              color: errors?.UserInfo?.faFirstName
                                ? "#b91c1c"
                                : !themeMode || themeMode?.stateMode
                                ? "white"
                                : "#463b2f",
                            },
                          }}
                        />
                        <label className="absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900">
                          {errors?.UserInfo?.faFirstName && errors?.UserInfo?.faFirstName?.message}
                        </label>
                      </section>
                      <section className="my-1 relative w-full">
                        <TextField
                          autoComplete="off"
                          sx={{ fontFamily: "FaLight" }}
                          {...register(`UserInfo.faLastName`)}
                          tabIndex={2}
                          error={errors?.UserInfo && errors?.UserInfo?.faLastName && true}
                          className="w-full lg:my-0 font-[FaLight]"
                          dir="rtl"
                          size="small"
                          label="نام خانوادگی"
                          InputProps={{
                            style: {
                              color: errors?.UserInfo?.faLastName
                                ? "#b91c1c"
                                : !themeMode || themeMode?.stateMode
                                ? "white"
                                : "#463b2f",
                            },
                          }}
                          focused={getValues("UserInfo.faLastName") != "" ? true : false}
                        />
                        <label className="absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900">
                          {errors?.UserInfo?.faLastName && errors?.UserInfo?.faLastName?.message}
                        </label>
                      </section>
                      <section className="my-1 relative w-full">
                        <TextField
                          autoComplete="off"
                          sx={{ fontFamily: "FaLight" }}
                          {...register(`UserInfo.faTitle`)}
                          tabIndex={3}
                          error={errors?.UserInfo && errors?.UserInfo?.faTitle && true}
                          className="w-full lg:my-0 font-[FaLight]"
                          dir="rtl"
                          size="small"
                          label="عنوان"
                          focused={getValues("UserInfo.faTitle") != "" ? true : false}
                          InputProps={{
                            style: {
                              color: errors?.UserInfo?.faTitle
                                ? "#b91c1c"
                                : !themeMode || themeMode?.stateMode
                                ? "white"
                                : "#463b2f",
                            },
                          }}
                        />
                        <label className="absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900">
                          {errors?.UserInfo?.faTitle && errors?.UserInfo?.faTitle?.message}
                        </label>
                      </section>
                      <section className="my-1 relative w-full">
                        <TextField
                          autoComplete="off"
                          {...register(`UserInfo.fatherName`)}
                          sx={{ fontFamily: "FaLight" }}
                          tabIndex={4}
                          className="w-full lg:my-0 font-[FaLight]"
                          dir="rtl"
                          size="small"
                          label="نام پدر"
                          focused={getValues("UserInfo.fatherName") != "" ? true : false}
                          InputProps={{
                            style: {
                              color: errors?.UserInfo?.fatherName
                                ? "#b91c1c"
                                : !themeMode || themeMode?.stateMode
                                ? "white"
                                : "#463b2f",
                            },
                          }}
                          error={errors?.UserInfo && errors?.UserInfo?.fatherName && true}
                        />
                        <label className="absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900">
                          {errors?.UserInfo?.fatherName && errors?.UserInfo?.fatherName?.message}
                        </label>
                      </section>
                      <section dir="rtl" className="relative my-1 w-full ">
                        <DatePickare
                          haveHour={false}
                          {...register(`UserInfo.birthDate`)}
                          label="تاریخ تولد"
                          value={state.birthDate.date}
                          onChange={(date: DateObject) => ConvertBirthDate(date)}
                          error={errors?.UserInfo && errors?.UserInfo?.birthDate && true}
                          focused={watch(`UserInfo.birthDate`)}
                        />
                        <label className="absolute bottom-[-20px] left-3 text-[11px] font-[FaBold] text-start text-red-900">
                          {errors?.UserInfo?.birthDate && errors?.UserInfo?.birthDate?.message}
                        </label>
                      </section>
                      <section className="my-1 relative w-full">
                        <TextField
                          autoComplete="off"
                          sx={{ fontFamily: "FaLight" }}
                          {...register(`UserInfo.nationalCode`)}
                          tabIndex={6}
                          className="w-full lg:my-0 font-[FaLight]"
                          size="small"
                          dir="ltr"
                          focused={getValues("UserInfo.nationalCode") != "" ? true : false}
                          label="شماره ملی"
                          InputProps={{
                            style: {
                              color: errors?.UserInfo?.nationalCode
                                ? "#b91c1c"
                                : !themeMode || themeMode?.stateMode
                                ? "white"
                                : "#463b2f",
                            },
                          }}
                          error={errors?.UserInfo && errors?.UserInfo?.nationalCode && true}
                        />
                        <label className="absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900">
                          {errors?.UserInfo?.nationalCode && errors?.UserInfo?.nationalCode?.message}
                        </label>
                      </section>
                      <section className="my-1 relative w-full">
                        <TextField
                          autoComplete="off"
                          sx={{ fontFamily: "FaLight" }}
                          {...register(`UserInfo.birthCertificateId`)}
                          tabIndex={7}
                          className="w-full lg:my-0 font-[FaLight]"
                          size="small"
                          dir="ltr"
                          focused={getValues("UserInfo.birthCertificateId") != "" ? true : false}
                          label="شماره شناسنامه"
                          InputProps={{
                            style: {
                              color: errors?.UserInfo?.birthCertificateId
                                ? "#b91c1c"
                                : !themeMode || themeMode?.stateMode
                                ? "white"
                                : "#463b2f",
                            },
                          }}
                          error={errors?.UserInfo && errors?.UserInfo?.birthCertificateId && true}
                        />
                        <label className="absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900">
                          {errors?.UserInfo?.birthCertificateId && errors?.UserInfo?.birthCertificateId?.message}
                        </label>
                      </section>
                      <section className="my-1 relative w-full">
                        <TextField
                          autoComplete="off"
                          sx={{ fontFamily: "FaLight" }}
                          {...register(`UserInfo.birthCertificateIssueanceCity`)}
                          tabIndex={8}
                          color="info"
                          className={"w-full lg:my-0 font-[FaLight] "}
                          size="small"
                          focused={getValues("UserInfo.birthCertificateIssueanceCity") != "" ? true : false}
                          label="محل صدور شناسنامه"
                          InputProps={{
                            style: {
                              color: errors?.UserInfo?.birthCertificateIssueanceCity
                                ? "#b91c1c"
                                : !themeMode || themeMode?.stateMode
                                ? "white"
                                : "#463b2f",
                            }, // Customize text color here
                          }}
                          error={errors?.UserInfo && errors?.UserInfo?.birthCertificateIssueanceCity && true}
                        />
                        <label className="absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900">
                          {errors?.UserInfo?.birthCertificateIssueanceCity &&
                            errors?.UserInfo?.birthCertificateIssueanceCity?.message}
                        </label>
                      </section>
                      {CurrentUser &&
                        CurrentUser.userInfo &&
                        CurrentUser.userInfo.actors.some((actor: any) =>
                          actor.claims.some(
                            (claim: any) =>
                              (claim.key == "UserManagement" && claim.value == "Admin") ||
                              (claim.key == "HumanResource" && claim.value == "Admin")
                          )
                        ) && (
                          <section className="flex flex-col w-full">
                            <FormControlLabel
                              className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                              control={
                                <Checkbox
                                  sx={{
                                    color: color?.color,
                                    "&.Mui-checked": {
                                      color: color?.color,
                                    },
                                  }}
                                  {...register("UserInfo.isConfirmed")}
                                  checked={watch("UserInfo.isConfirmed")}
                                  onChange={(event) => {
                                    setValue("UserInfo.isConfirmed", event.target.checked), trigger();
                                  }}
                                />
                              }
                              label="isConfirmed"
                            />
                          </section>
                        )}
                      {CurrentUser &&
                        CurrentUser.userInfo &&
                        CurrentUser.userInfo.actors.some((actor: any) =>
                          actor.claims.some(
                            (claim: any) =>
                              (claim.key == "UserManagement" && claim.value == "Admin") ||
                              (claim.key == "HumanResource" && claim.value == "Admin")
                          )
                        ) && (
                          <section className="flex flex-col w-full">
                            <FormControlLabel
                              className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                              control={
                                <Checkbox
                                  sx={{
                                    color: color?.color,
                                    "&.Mui-checked": {
                                      color: color?.color,
                                    },
                                  }}
                                  {...register("UserInfo.twoFactorEnabled")}
                                  checked={watch("UserInfo.twoFactorEnabled")}
                                  onChange={(event) => {
                                    setValue("UserInfo.twoFactorEnabled", event.target.checked), trigger();
                                  }}
                                />
                              }
                              label="twoFactorEnabled"
                            />
                          </section>
                        )}
                      {CurrentUser &&
                        CurrentUser.userInfo &&
                        CurrentUser.userInfo.actors.some((actor: any) =>
                          actor.claims.some(
                            (claim: any) =>
                              (claim.key == "UserManagement" && claim.value == "Admin") ||
                              (claim.key == "HumanResource" && claim.value == "Admin")
                          )
                        ) && (
                          <section className="flex flex-col w-full">
                            <FormControlLabel
                              className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                              control={
                                <Checkbox
                                  sx={{
                                    color: color?.color,
                                    "&.Mui-checked": {
                                      color: color?.color,
                                    },
                                  }}
                                  {...register("UserInfo.isTechnicalExp")}
                                  checked={watch("UserInfo.isTechnicalExp")}
                                  onChange={(event) => {
                                    setValue("UserInfo.isTechnicalExp", event.target.checked), trigger();
                                  }}
                                />
                              }
                              label="isTechnicalExpert"
                            />
                          </section>
                        )}
                    </section>
                    <section className="flex flex-col h-full gap-y-3 w-[100%]">
                      <section className="relative my-1 w-full">
                        <TextField
                          autoComplete="off"
                          tabIndex={9}
                          {...register(`UserInfo.firstName`)}
                          error={errors?.UserInfo && errors?.UserInfo?.firstName && true}
                          focused={getValues("UserInfo.firstName") != "" ? true : false}
                          className="w-full lg:my-0 font-[FaLight]"
                          size="small"
                          dir="ltr"
                          sx={{ fontFamily: "FaLight" }}
                          label="نام انگلیسی"
                          InputProps={{
                            style: {
                              color: errors?.UserInfo?.firstName
                                ? "#b91c1c"
                                : !themeMode || themeMode?.stateMode
                                ? "white"
                                : "#463b2f",
                            },
                          }}
                        />
                        <label className="absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900">
                          {errors?.UserInfo?.firstName && errors?.UserInfo?.firstName?.message}
                        </label>
                      </section>
                      <section className="my-1 relative w-full">
                        <TextField
                          autoComplete="off"
                          sx={{ fontFamily: "FaLight" }}
                          tabIndex={10}
                          dir="ltr"
                          {...register(`UserInfo.lastName`)}
                          focused={getValues("UserInfo.lastName") != "" ? true : false}
                          error={errors?.UserInfo && errors?.UserInfo?.lastName && true}
                          className="w-full lg:my-0 font-[FaLight]"
                          size="small"
                          label="نام خانوادگی انگلیسی"
                          InputProps={{
                            style: {
                              color: errors?.UserInfo?.lastName
                                ? "#b91c1c"
                                : !themeMode || themeMode?.stateMode
                                ? "white"
                                : "#463b2f",
                            },
                          }}
                        />
                        <label className="absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900">
                          {errors?.UserInfo?.lastName && errors?.UserInfo?.lastName?.message}
                        </label>
                      </section>
                      <section className="my-1 relative w-full">
                        <TextField
                          autoComplete="off"
                          dir="ltr"
                          sx={{ fontFamily: "FaLight" }}
                          {...register(`UserInfo.title`)}
                          focused={getValues("UserInfo.title") != "" ? true : false}
                          tabIndex={11}
                          error={errors?.UserInfo && errors?.UserInfo?.faLastName && true}
                          className="w-full lg:my-0 font-[FaLight]"
                          size="small"
                          label="title"
                          InputProps={{
                            style: {
                              color: errors?.UserInfo?.title
                                ? "#b91c1c"
                                : !themeMode || themeMode?.stateMode
                                ? "white"
                                : "#463b2f",
                            },
                          }}
                        />
                        <label className="absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900">
                          {errors?.UserInfo?.faLastName && errors?.UserInfo?.faLastName?.message}
                        </label>
                      </section>
                      <section dir="rtl" className="relative my-1 w-full ">
                        <DatePickare
                          haveHour={false}
                          {...register(`UserInfo.employmentDate`)}
                          label="تاریخ استخدام"
                          value={state.employmentDate.date}
                          onChange={(date: DateObject) => ConvertEmploymentDate(date)}
                          error={errors?.UserInfo && errors?.UserInfo?.employmentDate && true}
                          focused={watch(`UserInfo.employmentDate`)}
                        />
                        <label className="absolute bottom-[-20px] left-3 text-[11px] font-[FaBold] text-start text-red-900">
                          {errors?.UserInfo?.employmentDate && errors?.UserInfo?.employmentDate?.message}
                        </label>
                      </section>
                      <section className="relative w-full mt-1">
                        <TextField
                          autoComplete="off"
                          tabIndex={18}
                          sx={{ fontFamily: "FaLight" }}
                          {...register(`UserInfo.inssuranceNo`)}
                          InputProps={{
                            style: {
                              color: !themeMode || themeMode?.stateMode ? "white" : "#463b2f",
                            },
                          }}
                          focused={getValues("UserInfo.inssuranceNo") != "" ? true : false}
                          error={errors?.UserInfo && errors?.UserInfo?.inssuranceNo && true}
                          dir="ltr"
                          className="w-full "
                          type="text"
                          size="small"
                          label="شماره بیمه"
                          variant="outlined"
                        />
                        <label className="absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900">
                          {errors?.UserInfo?.inssuranceNo && errors?.UserInfo?.inssuranceNo?.message}
                        </label>
                      </section>
                      <section className="my-1 relative w-full">
                        <TextField
                          autoComplete="off"
                          sx={{ fontFamily: "FaLight" }}
                          tabIndex={13}
                          dir="ltr"
                          {...register(`UserInfo.personnelCode`)}
                          focused={getValues("UserInfo.personnelCode") != 0 ? true : false}
                          error={errors?.UserInfo && errors?.UserInfo?.lastName && true}
                          className="w-full lg:my-0 font-[FaLight]"
                          size="small"
                          label="شماره پرسنلی"
                          InputProps={{
                            style: {
                              color: errors?.UserInfo?.personnelCode
                                ? "#b91c1c"
                                : !themeMode || themeMode?.stateMode
                                ? "white"
                                : "#463b2f",
                            },
                          }}
                        />
                        <label className="absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900">
                          {errors?.UserInfo?.personnelCode && errors?.UserInfo?.personnelCode?.message}
                        </label>
                      </section>
                      <section className="relative my-1.5 w-full ">
                        <Select<EducationDegreeModel, false, any>
                          defaultValue={
                            getValues(`UserInfo.lastEducationDegree`)
                              ? data.EducationDegree.find(
                                  (item: EducationDegreeModel) => item.id == getValues(`UserInfo.lastEducationDegree`)
                                )
                              : data.EducationDegree.find(
                                  (item: EducationDegreeModel) => item.id == getValues(`UserInfo.lastEducationDegree`)
                                )
                          }
                          menuPosition="absolute"
                          maxMenuHeight={400}
                          tabIndex={14}
                          options={data.EducationDegree}
                          className={`${
                            !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                          } w-full font-[FaLight] z-20`}
                          placeholder="آخرین مدرک تحصیلی"
                          {...register(`UserInfo.lastEducationDegree`)}
                          value={data.EducationDegree.find(
                            (item) => item.id == getValues(`UserInfo.lastEducationDegree`)
                          )}
                          onChange={(
                            option: SingleValue<EducationDegreeModel>,
                            _actionMeta: ActionMeta<EducationDegreeModel>
                          ) => {
                            setValue("UserInfo.lastEducationDegree", option!.id);
                            trigger();
                          }}
                          theme={(theme) => ({
                            ...theme,
                            height: 5,
                            borderRadius: 5,
                            colors: {
                              ...theme.colors,
                              color: "#607d8b",
                              neutral10: `${color?.color}`,
                              primary25: `${color?.color}`,
                              primary: "#607d8b",
                              neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                              neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                              neutral20: errors?.UserInfo?.lastEducationDegree ? "#d32f3c" : "#607d8b",
                              neutral30: errors?.UserInfo?.lastEducationDegree ? "#d32f3c" : "#607d8b",
                              neutral50: errors?.UserInfo?.lastEducationDegree ? "#d32f3c" : "#607d8b",
                            },
                          })}
                        />
                        <label className="absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900">
                          {errors?.UserInfo?.lastEducationDegree && errors?.UserInfo?.lastEducationDegree?.message}
                        </label>
                      </section>
                      <section className="my-1 relative w-full">
                        <TextField
                          autoComplete="off"
                          sx={{ fontFamily: "FaLight" }}
                          tabIndex={15}
                          {...register(`UserInfo.fieldOfStudy`)}
                          error={errors?.UserInfo && errors?.UserInfo?.fieldOfStudy && true}
                          focused={getValues("UserInfo.fieldOfStudy") != "" ? true : false}
                          className="w-full lg:my-0 font-[FaLight]"
                          size="small"
                          label="رشته ی تحصیلی"
                          InputProps={{
                            style: {
                              color: errors?.UserInfo?.fieldOfStudy
                                ? "#b91c1c"
                                : !themeMode || themeMode?.stateMode
                                ? "white"
                                : "#463b2f",
                            },
                          }}
                        />
                        <label className="absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900">
                          {errors?.UserInfo?.fieldOfStudy && errors?.UserInfo?.fieldOfStudy?.message}
                        </label>
                      </section>
                      {CurrentUser &&
                        CurrentUser.userInfo &&
                        CurrentUser.userInfo.actors.some((actor: any) =>
                          actor.claims.some(
                            (claim: any) =>
                              (claim.key == "UserManagement" && claim.value == "Admin") ||
                              (claim.key == "HumanResource" && claim.value == "Admin")
                          )
                        ) && (
                          <section className="flex flex-col w-full">
                            <FormControlLabel
                              className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                              control={
                                <Checkbox
                                  sx={{
                                    color: color?.color,
                                    "&.Mui-checked": {
                                      color: color?.color,
                                    },
                                  }}
                                  {...register("UserInfo.lockoutEnabled")}
                                  checked={watch("UserInfo.lockoutEnabled")}
                                  onChange={(event) => {
                                    setValue("UserInfo.lockoutEnabled", event.target.checked), trigger();
                                  }}
                                />
                              }
                              label="LockoutEnabled"
                            />
                          </section>
                        )}
                      {CurrentUser &&
                        CurrentUser.userInfo &&
                        CurrentUser.userInfo.actors.some((actor: any) =>
                          actor.claims.some(
                            (claim: any) =>
                              (claim.key == "UserManagement" && claim.value == "Admin") ||
                              (claim.key == "HumanResource" && claim.value == "Admin")
                          )
                        ) && (
                          <section className="flex flex-col w-full">
                            <FormControlLabel
                              className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                              control={
                                <Checkbox
                                  sx={{
                                    color: color?.color,
                                    "&.Mui-checked": {
                                      color: color?.color,
                                    },
                                  }}
                                  {...register("UserInfo.isActive")}
                                  checked={watch("UserInfo.isActive")}
                                  onChange={(event) => {
                                    setValue("UserInfo.isActive", event.target.checked), trigger();
                                  }}
                                />
                              }
                              label="Is Active"
                            />
                          </section>
                        )}
                      <section className="flex flex-col w-full">
                        <FormControlLabel
                          className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                          control={
                            <Checkbox
                              sx={{
                                color: color?.color,
                                "&.Mui-checked": {
                                  color: color?.color,
                                },
                              }}
                              {...register("UserInfo.isRetired")}
                              checked={watch("UserInfo.isRetired")}
                              onChange={(event) => {
                                setValue("UserInfo.isRetired", event.target.checked), trigger();
                              }}
                            />
                          }
                          label="isRetired"
                        />
                      </section>
                    </section>
                    <section className="flex flex-col h-full gap-y-3 w-[100%]">
                      <section dir="ltr" className="relative w-full mt-1">
                        <TextField
                          {...register(`UserInfo.userName`)}
                          autoComplete="off"
                          size="small"
                          dir="ltr"
                          value={getValues(`UserInfo.userName`)}
                          className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"} no-caret`}
                          label="username"
                          sx={{ width: "100%", color: "#607d8b" }}
                          InputLabelProps={{
                            style: { color: "#607d8b" },
                          }}
                          InputProps={{
                            style: {
                              color: errors?.UserInfo?.userName
                                ? "#b91c1c"
                                : !themeMode || themeMode?.stateMode
                                ? "white"
                                : "#463b2f",
                              background: "#607d8b20",
                            },
                          }}
                          onFocus={(e) => e.target.blur()}
                        />
                      </section>
                      <section className="relative w-full mt-1">
                        <TextField
                          autoComplete="off"
                          tabIndex={18}
                          sx={{ fontFamily: "FaLight" }}
                          {...register(`UserInfo.accessFailedCount`)}
                          InputProps={{
                            style: {
                              color: !themeMode || themeMode?.stateMode ? "white" : "#463b2f",
                            },
                          }}
                          focused={getValues("UserInfo.accessFailedCount") != 0 ? true : false}
                          dir="ltr"
                          className="w-full "
                          type="number"
                          size="small"
                          label="accessFailedCount"
                          variant="outlined"
                        />
                      </section>
                      <section className=" my-1.5 border-select-group">
                        <FormControl className="w-full h-full px-2">
                          <RadioGroup
                            row
                            {...register(`UserInfo.genderId`)}
                            value={getValues("UserInfo.genderId")}
                            aria-labelledby="gender"
                            name="customized-radios"
                            className="font-[FaLight] "
                          >
                            {data.gender.map((gender) => {
                              return (
                                <FormControlLabel
                                  key={gender.id}
                                  defaultChecked={getValues(`UserInfo.genderId`) == gender.id ? true : false}
                                  onChange={() => {
                                    gender.id == 2 && unregister("UserInfo.militaryServiceId"),
                                      setValue("UserInfo.genderId", gender.id, {
                                        shouldTouch: true,
                                        shouldValidate: true,
                                        shouldDirty: true,
                                      });
                                  }}
                                  className={`${
                                    !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                                  } font-[FaLight]`}
                                  control={<BpRadio />}
                                  label={gender.faName}
                                  value={gender.id}
                                />
                              );
                            })}
                          </RadioGroup>
                        </FormControl>
                      </section>
                      {getValues("UserInfo.genderId") != 2 && (
                        <section className="relative my-1.5 w-full ">
                          <Select<DataModel, false, any>
                            defaultValue={
                              getValues("UserInfo.militaryServiceId")
                                ? data.militry.find(
                                    (item: DataModel) => item.id == getValues("UserInfo.militaryServiceId")
                                  )
                                : data.militry.find(
                                    (item: DataModel) => item.id == getValues(`UserInfo.militaryServiceId`)
                                  )
                            }
                            isClearable
                            menuPosition="absolute"
                            maxMenuHeight={400}
                            tabIndex={19}
                            options={data.militry}
                            className={`${
                              !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                            } w-full font-[FaLight] z-20`}
                            placeholder="وضعیت نظام وظیفه"
                            {...register(`UserInfo.militaryServiceId`)}
                            onChange={(option: SingleValue<DataModel>, _actionMeta: ActionMeta<DataModel>) => {
                              setValue("UserInfo.militaryServiceId", option?.id);
                              trigger();
                            }}
                            value={data.militry.find((item) => item.id == getValues(`UserInfo.militaryServiceId`))}
                            theme={(theme) => ({
                              ...theme,
                              height: 5,
                              borderRadius: 5,
                              colors: {
                                ...theme.colors,
                                color: "#607d8b",
                                neutral10: `${color?.color}`,
                                primary25: `${color?.color}`,
                                primary: "#607d8b",
                                neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                                neutral20: errors?.UserInfo?.militaryServiceId ? "#d32f3c" : "#607d8b",
                                neutral30: errors?.UserInfo?.militaryServiceId ? "#d32f3c" : "#607d8b",
                                neutral50: errors?.UserInfo?.militaryServiceId ? "#d32f3c" : "#607d8b",
                              },
                            })}
                          />
                          <label className="absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900">
                            {errors?.UserInfo?.militaryServiceId && errors?.UserInfo?.militaryServiceId?.message}
                          </label>
                        </section>
                      )}
                      <section className=" my-1.5 border-select-group">
                        <FormControl className="w-full h-full px-2">
                          <RadioGroup
                            row
                            {...register(`UserInfo.isMarried`)}
                            value={getValues("UserInfo.isMarried")}
                            aria-labelledby="marriage"
                            name="customized-marriage-radios"
                            className="font-[FaLight]  "
                          >
                            {married.map((marriage) => {
                              return (
                                <FormControlLabel
                                  key={marriage.id}
                                  defaultChecked={getValues(`UserInfo.isMarried`) == marriage.isMarried ? true : false}
                                  onChange={() => {
                                    setValue("UserInfo.isMarried", marriage.isMarried, {
                                      shouldTouch: true,
                                      shouldValidate: true,
                                      shouldDirty: true,
                                    });
                                  }}
                                  className={`${
                                    !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                                  } font-[FaLight]`}
                                  control={<BpRadio />}
                                  label={marriage.faTitle}
                                  value={marriage.isMarried}
                                />
                              );
                            })}
                          </RadioGroup>
                        </FormControl>
                      </section>
                      <section className="relative w-full mt-1">
                        <TextField
                          autoComplete="off"
                          tabIndex={20}
                          sx={{ fontFamily: "FaLight" }}
                          {...register(`UserInfo.childCount`)}
                          InputProps={{
                            style: {
                              color: !themeMode || themeMode?.stateMode ? "white" : "#463b2f",
                            },
                          }}
                          focused={getValues("UserInfo.childCount") != 0 ? true : false}
                          onChange={(event) => {
                            setValue("UserInfo.childCount", Number(event.target.value));
                          }}
                          dir="ltr"
                          className="w-full "
                          type="number"
                          size="small"
                          label="تعداد فرزندان"
                          variant="outlined"
                        />
                      </section>
                    </section>
                  </section>
                </section>
              </form>
            </TabPanel>
            <TabPanel value="phoneInfo" className="p-0 w-full">
              <PersonalPhone />
            </TabPanel>
            <TabPanel value="addressInfo" className="p-0 w-full">
              <PersonalAddress />
            </TabPanel>
            <TabPanel value="personInfoEmail" className="p-0 w-full">
              <PersonalEmails />
            </TabPanel>
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
              className={`${
                !themeMode || themeMode?.stateMode ? "tableDark" : "tableLight"
              } absolute top-0 bottom-0 overflow-y-auto`}
              open={open}
              handler={handlerOpen}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <DialogHeader
                dir="rtl"
                className={`${
                  !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                } flex justify-between sticky top-0 left-0 z-[85858]`}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                مشاهده ی رزومه
                <IconButton
                  variant="text"
                  color="blue-gray"
                  onClick={() => handlerOpen()}
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </IconButton>
              </DialogHeader>
              <DialogBody
                className="overflow-y-auto h-[90vh]"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {loadResume == false ? (
                  <section className="w-full h-fit p-2">
                    <div style={{ height: "100vh", width: "100%" }}>
                      <AcsPdfViewer base64={attachment.base64} />
                    </div>
                  </section>
                ) : (
                  <IframeSkeleton />
                )}
              </DialogBody>
            </Dialog>
          </TabsBody>
        </Tabs>
      </>
    </MyCustomComponent>
  );
};

export default PesonalInfo;
