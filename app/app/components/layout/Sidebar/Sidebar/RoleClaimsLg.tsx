import React, { useCallback, useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import themeStore from "@/app/zustandData/theme.zustand";
import useStore from "@/app/hooks/useStore";
import colorStore from "@/app/zustandData/color.zustand";
import activeStore from "@/app/zustandData/activate.zustand";
import { useRouter } from "next/navigation";
import {
  OpenNewDocumentModel,
  Response,
  DraftModel,
  LayoutsModel,
  GetDocTypes,
} from "@/app/models/Automation/NewDocumentModels";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Radio,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { ActionMeta, SingleValue } from "react-select";
import Select2 from "react-select";
import CategoryIcon from "@mui/icons-material/Category";
import useAxios from "@/app/hooks/useAxios";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import ApartmentIcon from "@mui/icons-material/Apartment";
import SaveIcon from "@mui/icons-material/Save";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
// ***icons
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import HistoryIcon from "@mui/icons-material/History";
import VerifiedIcon from "@mui/icons-material/Verified";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import MailIcon from "@mui/icons-material/Mail";
import ArchiveIcon from "@mui/icons-material/Archive";
import PostAddIcon from "@mui/icons-material/PostAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupsIcon from "@mui/icons-material/Groups";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SearchIcon from "@mui/icons-material/Search";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ListAltIcon from "@mui/icons-material/ListAlt";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import DirectionsBoatFilledIcon from "@mui/icons-material/DirectionsBoatFilled";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import GavelIcon from "@mui/icons-material/Gavel";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DatasetIcon from "@mui/icons-material/Dataset";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { ReportProblem } from "@mui/icons-material/";
import MemoryIcon from "@mui/icons-material/Memory";
import FormatShapesIcon from "@mui/icons-material/FormatShapes";

const RoleClaimsDesktop = (props: any) => {
  const router = useRouter();
  const activeState = activeStore();
  const color = useStore(colorStore, (state) => state);
  const themeMode = useStore(themeStore, (state) => state);
  const [open, setOpen] = useState<boolean>(false);
  const handleNewDocument = () => {
    setOpen(!open);
  };
  const { AxiosRequest } = useAxios();

  let LayoutSizes = [
    {
      label: "پیش فرض ها",
      value: 2,
    },
    {
      label: "A5",
      value: 1,
    },
    {
      label: "A4",
      value: 0,
    },
  ];

  let InitialsState = {
    drafts: [],
    layoutSize: [],
    formatId: undefined,
    documentType: 1,
    documentSize: 0,
    draftId: "",
  };

  const [newDocAutomationState, setNewDocAutomationState] = useState<OpenNewDocumentModel>(InitialsState);
  const OpenNewDocument = () => {
    if (router) {
      router.push(
        `/Home/NewDocument?doctypeid=${newDocAutomationState.documentType}&id=${newDocAutomationState.draftId}&layoutsize=${newDocAutomationState.documentSize}&templateId=${newDocAutomationState.formatId?.id}`
      );
      handleNewDocument();
    }
    setNewDocAutomationState((prev) => ({ ...prev, documentType: 1 }));
  };
  const [docTypes, setDocTypes] = useState<GetDocTypes[]>([]);

  useEffect(() => {
    const GetDrafts = async () => {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getdrafts`;
      let data = {};
      let method = "get";
      let response: AxiosResponse<Response<DraftModel[]>> = await AxiosRequest({
        url,
        method,
        data,
        credentials: true,
      });
      if (response && response?.data.data != null && response?.data.data.length > 0) {
        setNewDocAutomationState((state) => ({
          ...state,
          drafts: response.data.data.map((option: DraftModel, num: number) => {
            return {
              label: option.title,
              value: option.id,
              id: option.id,
              title: option.title,
            };
          }),
        }));
      }
    };
    const GetDocTypes = async () => {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getdoctypes`;
      let method = "get";
      let data = {};
      let response: AxiosResponse<Response<GetDocTypes[]>> = await AxiosRequest({
        url,
        method,
        data,
        credentials: true,
      });
      if (response) {
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
          setDocTypes(
            response.data.data.map((item) => ({
              id: item.id,
              name: item.name,
              faName: item.faName,
              moduleId: item.moduleId,
              moduleName: item.moduleName,
              value: item.id,
              label: item.faName,
            }))
          );
        }
        setDocTypes([]);
      }
    };
    GetDocTypes();
    GetDrafts();
  }, []);

  const GetLayoutSize = useCallback(async () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getdocLayouts?docTypeId=${newDocAutomationState.documentType}`;
    let method = "get";
    let data = {};
    let response: AxiosResponse<Response<LayoutsModel[]>> = await AxiosRequest({
      url,
      method,
      data,
      credentials: true,
    });
    if (response.data.data != null && response.data.data.length > 0) {
      setNewDocAutomationState((state: any) => ({
        ...state,
        layoutSize: response.data.data.map((item: LayoutsModel) => {
          return {
            label: item.name,
            value: item.id,
            path: item.path,
            isMain: item.isMain,
            id: item.id,
            name: item.name,
          };
        }),
        formatId: response.data.data.find((item: LayoutsModel) => item.isMain == true),
      }));
    }
  }, [newDocAutomationState.documentType]);

  useEffect(() => {
    GetLayoutSize();
  }, [GetLayoutSize]);

  const handleToggle = (e: any) => {
    const spanContent = e.currentTarget.querySelector("span").textContent;
    activeStore.setState((state) => ({
      ...state,
      activate: state.activate == spanContent ? "" : spanContent,
      activeSubLink: "",
    }));
  };

  const handleToggleSubMenu = (e: any) => {
    const spanContent = e.currentTarget.querySelector("span").textContent;
    activeStore.setState((state) => ({
      ...state,
      activeSubMenu: state.activeSubMenu == spanContent ? "" : spanContent,
    }));
  };

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimate(true);
    }, 10); // short delay to trigger transition

    return () => clearTimeout(timeout);
  }, []);
  return (
    <>
      <ul
        className={`nav-menu w-[95%] overflow-x-hidden ${
          !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
        }`}
        style={{
          transition: "all 0.5s ease-in-out",
          transform: animate ? "scale(1)" : "scale(0.8)",
          opacity: animate ? 1 : 0.2,
        }}
      >
        {props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter(
            (item: any) => item.key == "RulesAndRegulations" && (item.value == "ManageRules" || item.value == "Viewer")
          ).length != 0 && (
          <li className="w-[100%]">
            <div
              onClick={(e) => handleToggle(e)}
              className={`${
                activeState.activate === "Rules & Regulations"
                  ? `active ${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"}`
                  : ""
              } nav-item cursor-pointer`}
            >
              <GavelIcon
                style={{
                  background: `${activeState.activate === "Rules & Regulations" ? color?.color : ""}`,
                  color: `${activeState.activate === "Rules & Regulations" ? "white" : ""}`,
                  borderRadius: "50%",
                  fontSize: "28px",
                }}
                className={`p-1 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
              />
              <span className="px-[20px] select-none text-sm capitalize">Rules & Regulations</span>
              <div
                style={{
                  boxShadow: `0 20px 0 0 ${!themeMode || themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
              <div
                style={{
                  boxShadow: `0 -20px 0 0 ${!themeMode || themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
            </div>
            {activeState.activate == "Rules & Regulations" ? (
              <ul className="mx-0 px-0 w-[100%] flex-wrap flex justify-end">
                <li
                  onClick={() => {
                    router.push("/Home/RulesAndRegulation"),
                      activeStore.setState((state) => ({
                        ...state,
                        activeSubLink: "Rules Managment",
                      }));
                  }}
                  className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs my-1 cursor-pointer"
                >
                  <ManageSearchIcon
                    sx={{
                      color:
                        activeState.activeSubLink == "Rules Managment"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f",
                      marginLeft: "20px",
                    }}
                    fontSize="small"
                  />
                  <span
                    style={{
                      color: `${
                        activeState.activeSubLink == "Rules Managment"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f"
                      }`,
                    }}
                    className={`px-[8px] select-none opacity-90 capitalize ${
                      !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                    } `}
                  >
                    rules management
                  </span>
                </li>
              </ul>
            ) : null}
          </li>
        )}

        {props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter(
            (item: any) => (item.key == "UserManagement" || item.key == "HumanResource") && item.value == "Admin"
          ).length != 0 && (
          <li className="w-[100%]">
            <div
              onClick={(e) => handleToggle(e)}
              className={`${
                activeState.activate === "User Management"
                  ? `active ${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"}`
                  : ""
              } nav-item cursor-pointer`}
            >
              <ManageAccountsIcon
                style={{
                  background: `${activeState.activate === "User Management" ? color?.color : ""}`,
                  color: `${activeState.activate === "User Management" ? "white" : ""}`,
                  borderRadius: "50%",
                  fontSize: "30px",
                }}
                className={`p-1 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
              />
              <span className="px-[20px] select-none text-sm capitalize">User Management</span>
              <div
                style={{
                  boxShadow: `0 20px 0 0 ${!themeMode || themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
              <div
                style={{
                  boxShadow: `0 -20px 0 0 ${!themeMode || themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
            </div>
            {activeState.activate == "User Management" ? (
              <ul className="mx-0 px-0 w-[100%] flex-wrap flex justify-end">
                {
                  <li
                    onClick={(e) => {
                      handleToggleSubMenu(e);
                    }}
                    className="p-[2px] w-[96%] mx-auto transition-[0.4s] text-sm  my-1.5 cursor-pointer"
                  >
                    <PeopleIcon
                      fontSize="small"
                      sx={{
                        color:
                          activeState.activeSubMenu == "Acs Users"
                            ? color?.color
                            : !themeMode || themeMode?.stateMode
                            ? "white"
                            : "#463b2f",
                        marginLeft: "20px",
                      }}
                    />
                    <span
                      style={{
                        color: ` ${
                          activeState.activeSubMenu == "Acs Users"
                            ? color?.color
                            : !themeMode || themeMode?.stateMode
                            ? "white"
                            : "#463b2f"
                        }`,
                      }}
                      className={`px-[8px] select-none capitalize ${
                        !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                      }`}
                    >
                      Acs Users
                    </span>
                  </li>
                }
                {activeState.activeSubMenu == "Acs Users" ? (
                  <ul className="mx-0 px-0 w-[100%] flex-wrap flex justify-end">
                    <li
                      onClick={() => {
                        router.push("/Home/UsersList"),
                          activeStore.setState((state) => ({
                            ...state,
                            activeSubLink: "Acs Users / Users List",
                          }));
                      }}
                      className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                    >
                      <GroupsIcon
                        fontSize="small"
                        sx={{
                          color:
                            activeState.activeSubLink == "Acs Users / Users List"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f",
                          marginLeft: "20px",
                        }}
                      />
                      <span
                        style={{
                          color: ` ${
                            activeState.activeSubLink == "Acs Users / Users List"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f"
                          }`,
                        }}
                        className={`px-[8px] select-none opacity-90 capitalize ${
                          !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                        } `}
                      >
                        Users list
                      </span>
                    </li>
                    {props.props.userInfo?.actors
                      ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
                      .claims.filter((item: any) => item.key == "UserManagement").length > 0 && (
                      <li
                        onClick={() => {
                          router.push("/Home/AddUser"),
                            activeStore.setState((state) => ({
                              ...state,
                              activeSubLink: "Acs Users / Add User",
                            }));
                        }}
                        className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                      >
                        <PersonAddIcon
                          fontSize="small"
                          sx={{
                            color:
                              activeState.activeSubLink == "Acs Users / Add User"
                                ? color?.color
                                : !themeMode || themeMode?.stateMode
                                ? "#bdbcbc"
                                : "#75634f",
                            marginLeft: "20px",
                          }}
                        />
                        <span
                          style={{
                            color: ` ${
                              activeState.activeSubLink == "Acs Users / Add User"
                                ? color?.color
                                : !themeMode || themeMode?.stateMode
                                ? "#bdbcbc"
                                : "#75634f"
                            }`,
                          }}
                          className={`px-[8px] select-none opacity-90 capitalize ${
                            !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                          } `}
                        >
                          Add User
                        </span>
                      </li>
                    )}
                    {props.props.userInfo?.actors
                      ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
                      .claims.filter((item: any) => item.key == "UserManagement").length > 0 && (
                      <li
                        onClick={() => {
                          router.push("/Home/Roles"),
                            activeStore.setState((state) => ({
                              ...state,
                              activeSubLink: "Acs Users / Manage Role",
                            }));
                        }}
                        className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                      >
                        <ManageAccountsIcon
                          fontSize="small"
                          sx={{
                            color:
                              activeState.activeSubLink == "Acs Users / Manage Role"
                                ? color?.color
                                : !themeMode || themeMode?.stateMode
                                ? "#bdbcbc"
                                : "#75634f",
                            marginLeft: "20px",
                          }}
                        />
                        <span
                          style={{
                            color: ` ${
                              activeState.activeSubLink == "Acs Users / Manage Role"
                                ? color?.color
                                : !themeMode || themeMode?.stateMode
                                ? "#bdbcbc"
                                : "#75634f"
                            }`,
                          }}
                          className={`px-[8px] select-none opacity-90 capitalize ${
                            !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                          } `}
                        >
                          Manage Roles
                        </span>
                      </li>
                    )}
                  </ul>
                ) : null}
                {props.props.userInfo?.actors
                  ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
                  .claims.filter((item: any) => item.key == "UserManagement").length > 0 && (
                  <li
                    onClick={(e) => {
                      handleToggleSubMenu(e);
                    }}
                    className="p-[2px] w-[96%] mx-auto transition-[0.4s] text-sm  my-1.5 cursor-pointer"
                  >
                    <PeopleOutlineIcon
                      fontSize="small"
                      sx={{
                        color:
                          activeState.activeSubMenu == "Status Users"
                            ? color?.color
                            : !themeMode || themeMode?.stateMode
                            ? "white"
                            : "#463b2f",
                        marginLeft: "20px",
                      }}
                    />
                    <span
                      style={{
                        color: ` ${
                          activeState.activeSubMenu == "Status Users"
                            ? color?.color
                            : !themeMode || themeMode?.stateMode
                            ? "white"
                            : "#463b2f"
                        }`,
                      }}
                      className={`px-[8px] select-none capitalize ${
                        !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                      }`}
                    >
                      Status Users
                    </span>
                  </li>
                )}
                {activeState.activeSubMenu == "Status Users" &&
                props.props.userInfo?.actors
                  ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
                  .claims.filter((item: any) => item.key == "UserManagement").length > 0 ? (
                  <ul className="mx-0 px-0 w-[100%] flex-wrap flex justify-end">
                    <li
                      onClick={() => {
                        router.push("/Home/AddStatusUser"),
                          activeStore.setState((state) => ({
                            ...state,
                            activeSubLink: "Status Users / Add User",
                          }));
                      }}
                      className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                    >
                      <PersonAddIcon
                        fontSize="small"
                        sx={{
                          color:
                            activeState.activeSubLink == "Status Users / Add User"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f",
                          marginLeft: "20px",
                        }}
                      />
                      <span
                        style={{
                          color: ` ${
                            activeState.activeSubLink == "Status Users / Add User"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f"
                          }`,
                        }}
                        className={`px-[8px] select-none opacity-90 capitalize ${
                          !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                        } `}
                      >
                        Add Status User
                      </span>
                    </li>
                    <li
                      onClick={() => {
                        router.push("/Home/StatusList"),
                          activeStore.setState((state) => ({
                            ...state,
                            activeSubLink: "Status Users / Status Users List",
                          }));
                      }}
                      className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                    >
                      <GroupsIcon
                        fontSize="small"
                        sx={{
                          color:
                            activeState.activeSubLink == "Status Users / Status Users List"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f",
                          marginLeft: "20px",
                        }}
                      />
                      <span
                        style={{
                          color: ` ${
                            activeState.activeSubLink == "Status Users / Status Users List"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f"
                          }`,
                        }}
                        className={`px-[8px] select-none opacity-90 capitalize ${
                          !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                        } `}
                      >
                        Status Users list
                      </span>
                    </li>
                  </ul>
                ) : null}
                {props.props.userInfo?.actors
                  ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
                  .claims.filter((item: any) => item.key == "UserManagement").length > 0 && (
                  <li
                    onClick={() => {
                      router.push("/Home/BaseInfoManagement"),
                        activeStore.setState((state) => ({
                          ...state,
                          activeSubLink: "Base Info Management",
                        }));
                    }}
                    className="p-[2px] w-[96%] mx-auto transition-[0.4s] text-xs  my-1.5 cursor-pointer"
                  >
                    <SettingsApplicationsIcon
                      fontSize="small"
                      sx={{
                        color:
                          activeState.activeSubLink == "Base Info Management"
                            ? color?.color
                            : !themeMode || themeMode?.stateMode
                            ? "#bdbcbc"
                            : "#75634f",
                        marginLeft: "20px",
                      }}
                    />
                    <span
                      style={{
                        color: ` ${
                          activeState.activeSubLink == "Base Info Management"
                            ? color?.color
                            : !themeMode || themeMode?.stateMode
                            ? "#bdbcbc"
                            : "#75634f"
                        }`,
                      }}
                      className={`px-[8px] select-none opacity-90 capitalize ${
                        !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                      } `}
                    >
                      base info management
                    </span>
                  </li>
                )}
                {props.props.userInfo?.actors
                  ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
                  .claims.filter((item: any) => item.key == "UserManagement").length > 0 && (
                  <li
                    onClick={() => {
                      router.push("/Home/DepartmentsManagement"),
                        activeStore.setState((state) => ({
                          ...state,
                          activeSubLink: "Department Management",
                        }));
                    }}
                    className="p-[2px] w-[96%] mx-auto transition-[0.4s] text-xs  my-1.5 cursor-pointer"
                  >
                    <ApartmentIcon
                      fontSize="small"
                      sx={{
                        color:
                          activeState.activeSubLink == "Department Management"
                            ? color?.color
                            : !themeMode || themeMode?.stateMode
                            ? "#bdbcbc"
                            : "#75634f",
                        marginLeft: "20px",
                      }}
                    />
                    <span
                      style={{
                        color: ` ${
                          activeState.activeSubLink == "Department Management"
                            ? color?.color
                            : !themeMode || themeMode?.stateMode
                            ? "#bdbcbc"
                            : "#75634f"
                        }`,
                      }}
                      className={`px-[8px] select-none opacity-90 capitalize ${
                        !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                      } `}
                    >
                      departments management
                    </span>
                  </li>
                )}
                {props.props.userInfo?.actors
                  ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
                  .claims.filter((item: any) => item.key == "UserManagement").length > 0 && (
                  <li
                    onClick={() => {
                      router.push("/Home/OrgManagement"),
                        activeStore.setState((state) => ({
                          ...state,
                          activeSubLink: "Organization Management",
                        }));
                    }}
                    className="p-[2px] w-[96%] mx-auto transition-[0.4s] text-xs  my-1.5 cursor-pointer"
                  >
                    <AccountTreeIcon
                      fontSize="small"
                      sx={{
                        color:
                          activeState.activeSubLink == "Organization Management"
                            ? color?.color
                            : !themeMode || themeMode?.stateMode
                            ? "#bdbcbc"
                            : "#75634f",
                        marginLeft: "20px",
                      }}
                    />
                    <span
                      style={{
                        color: ` ${
                          activeState.activeSubLink == "Organization Management"
                            ? color?.color
                            : !themeMode || themeMode?.stateMode
                            ? "#bdbcbc"
                            : "#75634f"
                        }`,
                      }}
                      className={`px-[8px] select-none opacity-90 capitalize ${
                        !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                      } `}
                    >
                      organizations management
                    </span>
                  </li>
                )}
              </ul>
            ) : null}
          </li>
        )}
        {props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter((item: any) => item.key == "HumanResource" && item.value == "Admin").length != 0 && (
          <li className="w-[100%]">
            <div
              onClick={(e: any) => handleToggle(e)}
              className={`${
                activeState.activate === "Human Resource"
                  ? `active ${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"}`
                  : ""
              } nav-item cursor-pointer`}
            >
              <SupervisedUserCircleIcon
                style={{
                  background: `${activeState.activate === "Human Resource" ? color?.color : ""}`,
                  color: `${activeState.activate === "Human Resource" ? "white" : ""}`,
                  borderRadius: "50%",
                  fontSize: "30px",
                }}
                className={`p-1 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
              />
              <span className="px-[20px] text-sm capitalize select-none">Human Resource</span>
              <div
                style={{
                  boxShadow: `0 20px 0 0 ${!themeMode || themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
              <div
                style={{
                  boxShadow: `0 -20px 0 0 ${!themeMode || themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
            </div>
            {activeState.activate == "Human Resource" ? (
              <ul className="mx-0 px-0 w-[100%] flex-wrap flex justify-end">
                <li
                  onClick={() => {
                    router.push("/Home/ManageResume"),
                      activeStore.setState((state) => ({
                        ...state,
                        activeSubLink: "Manage Resume",
                      }));
                  }}
                  className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                >
                  <ContactPageIcon
                    fontSize="small"
                    sx={{
                      color:
                        activeState.activeSubLink == "Manage Resume"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f",
                      marginLeft: "20px",
                    }}
                  />
                  <span
                    style={{
                      color: ` ${activeState.activeSubLink == "Manage Resume" ? color?.color : ""}`,
                    }}
                    className={`px-[8px] opacity-90 capitalize select-none ${
                      !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                    }`}
                  >
                    manage Resume
                  </span>
                </li>
              </ul>
            ) : null}
            {activeState.activate == "Human Resource" ? (
              <ul className="mx-0 px-0 w-[100%] flex-wrap flex justify-end">
                <li
                  onClick={() => {
                    router.push("/Home/Defects"),
                      activeStore.setState((state) => ({
                        ...state,
                        activeSubLink: "Defects",
                      }));
                  }}
                  className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                >
                  <ReportProblem
                    fontSize="small"
                    sx={{
                      color:
                        activeState.activeSubLink == "Defects"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f",
                      marginLeft: "20px",
                    }}
                  />
                  <span
                    style={{
                      color: ` ${activeState.activeSubLink == "Defects" ? color?.color : ""}`,
                    }}
                    className={`px-[8px] opacity-90 capitalize select-none ${
                      !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                    }`}
                  >
                    Defects
                  </span>
                </li>
              </ul>
            ) : null}
          </li>
        )}
        {props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter((item: any) => item.key == "History").length != 0 && (
          <li className="w-[100%]">
            <div
              onClick={(e: any) => handleToggle(e)}
              className={`${
                activeState.activate === "History"
                  ? `active ${themeMode?.stateMode ? "contentDark" : "contentLight"}`
                  : ""
              } nav-item cursor-pointer`}
            >
              <HistoryIcon
                style={{
                  background: `${activeState.activate === "History" ? color?.color : ""}`,
                  color: `${activeState.activate === "History" ? "white" : ""}`,
                  borderRadius: "50%",
                  fontSize: "30px",
                }}
                className={`p-1 ${themeMode?.stateMode ? "lightText" : "darkText"}`}
              />
              <span className="px-[20px] text-sm capitalize select-none">History</span>
              <div
                style={{
                  boxShadow: `0 20px 0 0 ${themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
              <div
                style={{
                  boxShadow: `0 -20px 0 0 ${themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
            </div>
            {activeState.activate == "History" ? (
              <ul className="mx-0 px-0 w-[100%] flex-wrap flex justify-end">
                {props.props.userInfo?.actors
                  ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
                  .claims.filter((item: any) => item.key == "History" && item.value == "TabViewer").length != 0 && (
                  <li
                    onClick={() => {
                      router.push("/Home/Tabs"),
                        activeStore.setState((state) => ({
                          ...state,
                          activeSubLink: "Tabs",
                        }));
                    }}
                    className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                  >
                    <ManageSearchIcon
                      fontSize="small"
                      sx={{
                        color:
                          activeState.activeSubLink == "Tabs"
                            ? color?.color
                            : themeMode?.stateMode
                            ? "#bdbcbc"
                            : "#75634f",
                        marginLeft: "20px",
                      }}
                    />
                    <span
                      style={{
                        color: ` ${activeState.activeSubLink == "Tabs" ? color?.color : ""}`,
                      }}
                      className={`px-[8px] opacity-90 capitalize select-none ${
                        themeMode?.stateMode ? "lightText" : "darkText"
                      }`}
                    >
                      Tabs
                    </span>
                  </li>
                )}
                {props.props.userInfo?.actors
                  ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
                  .claims.filter(
                    (item: any) =>
                      item.key == "History" &&
                      (item.value == "HArchiveAdd" || item.value == "HArchiveEdit" || item.value == "HArchiveViewer")
                  ).length != 0 && (
                  <li
                    onClick={() => {
                      router.push("/Home/ArchiveHistory"),
                        activeStore.setState((state) => ({
                          ...state,
                          activeSubLink: "Archive History",
                        }));
                    }}
                    className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                  >
                    <FolderSpecialIcon
                      fontSize="small"
                      sx={{
                        color:
                          activeState.activeSubLink == "Archive History"
                            ? color?.color
                            : themeMode?.stateMode
                            ? "#bdbcbc"
                            : "#75634f",
                        marginLeft: "20px",
                      }}
                    />
                    <span
                      style={{
                        color: ` ${activeState.activeSubLink == "Archive History" ? color?.color : ""}`,
                      }}
                      className={`px-[8px] opacity-90 capitalize select-none ${
                        themeMode?.stateMode ? "lightText" : "darkText"
                      }`}
                    >
                      Archive
                    </span>
                  </li>
                )}
              </ul>
            ) : null}
          </li>
        )}
        {props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter((item: any) => item.key == "Timesheet" && item.value == "User").length != 0 && (
          <li className="w-[100%]">
            <div
              onClick={(e: any) => handleToggle(e)}
              className={`${
                activeState.activate === "Timesheet"
                  ? `active ${themeMode?.stateMode ? "contentDark" : "contentLight"}`
                  : ""
              } nav-item cursor-pointer`}
            >
              <ListAltIcon
                style={{
                  background: `${activeState.activate === "Timesheet" ? color?.color : ""}`,
                  color: `${activeState.activate === "Timesheet" ? "white" : ""}`,
                  borderRadius: "50%",
                  fontSize: "30px",
                }}
                className={`p-1 ${themeMode?.stateMode ? "lightText" : "darkText"}`}
              />
              <span className="px-[20px] text-sm capitalize select-none">Timesheet</span>
              <div
                style={{
                  boxShadow: `0 20px 0 0 ${themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
              <div
                style={{
                  boxShadow: `0 -20px 0 0 ${themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
            </div>
            {activeState.activate == "Timesheet" ? (
              <ul className="mx-0 px-0 w-[100%] flex-wrap flex justify-end">
                <li
                  onClick={() => {
                    router.push("/Home/Enterdata"),
                      activeStore.setState((state) => ({
                        ...state,
                        activeSubLink: "Enterdata",
                      }));
                  }}
                  className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                >
                  <DatasetIcon
                    fontSize="small"
                    sx={{
                      color:
                        activeState.activeSubLink == "Enterdata"
                          ? color?.color
                          : themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f",
                      marginLeft: "20px",
                    }}
                  />
                  <span
                    style={{
                      color: ` ${activeState.activeSubLink == "Enterdata" ? color?.color : ""}`,
                    }}
                    className={`px-[8px] opacity-90 capitalize select-none ${
                      themeMode?.stateMode ? "lightText" : "darkText"
                    }`}
                  >
                    Enter Data
                  </span>
                </li>
                {props.props.userInfo?.actors
                  ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
                  .claims.filter((item: any) => item.key == "Timesheet" && item.value == "ReportViewer").length !=
                  0 && (
                  <li
                    onClick={() => {
                      router.push("/Home/Report"),
                        activeStore.setState((state) => ({
                          ...state,
                          activeSubLink: "Report",
                        }));
                    }}
                    className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                  >
                    <ReceiptLongIcon
                      fontSize="small"
                      sx={{
                        color:
                          activeState.activeSubLink == "Report"
                            ? color?.color
                            : themeMode?.stateMode
                            ? "#bdbcbc"
                            : "#75634f",
                        marginLeft: "20px",
                      }}
                    />
                    <span
                      style={{
                        color: ` ${activeState.activeSubLink == "Report" ? color?.color : ""}`,
                      }}
                      className={`px-[8px] opacity-90 capitalize select-none ${
                        themeMode?.stateMode ? "lightText" : "darkText"
                      }`}
                    >
                      Report
                    </span>
                  </li>
                )}
              </ul>
            ) : null}
          </li>
        )}
        {props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter((item: any) => item.key == "Education" && item.value == "Admin").length != 0 && (
          <li className="w-[100%]">
            <div
              onClick={(e: any) => handleToggle(e)}
              className={`${
                activeState.activate === "Education"
                  ? `active ${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"}`
                  : ""
              } nav-item cursor-pointer`}
            >
              <CastForEducationIcon
                style={{
                  background: `${activeState.activate === "Education" ? color?.color : ""}`,
                  color: `${activeState.activate === "Education" ? "white" : ""}`,
                  borderRadius: "50%",
                  fontSize: "30px",
                }}
                className={`p-1 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
              />
              <span className="px-[20px] text-sm select-none capitalize">Education</span>
              <div
                style={{
                  boxShadow: `0 20px 0 0 ${!themeMode || themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
              <div
                style={{
                  boxShadow: `0 -20px 0 0 ${!themeMode || themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
            </div>
            {activeState.activate == "Education" ? (
              <ul className="mx-0 px-0 w-[100%] flex-wrap flex justify-end">
                <li
                  onClick={() => {
                    router.push("/Home/Category"),
                      activeStore.setState((state) => ({
                        ...state,
                        activeSubLink: "Categories",
                      }));
                  }}
                  className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                >
                  <CategoryIcon
                    fontSize="small"
                    sx={{
                      color:
                        activeState.activeSubLink == "Categories"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f",
                      marginLeft: "20px",
                    }}
                  />
                  <span
                    style={{
                      color: ` ${activeState.activeSubLink == "Categories" ? color?.color : ""}`,
                    }}
                    className={`px-[8px] opacity-90 capitalize select-none ${
                      !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                    }`}
                  >
                    Categories
                  </span>
                </li>
                <li
                  onClick={() => {
                    router.push("/Home/Course"),
                      activeStore.setState((state) => ({
                        ...state,
                        activeSubLink: "Courses",
                      }));
                  }}
                  className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                >
                  <SchoolIcon
                    fontSize="small"
                    sx={{
                      color:
                        activeState.activeSubLink == "Courses"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f",
                      marginLeft: "20px",
                    }}
                  />
                  <span
                    style={{
                      color: ` ${activeState.activeSubLink == "Courses" ? color?.color : ""}`,
                    }}
                    className={`px-[8px] opacity-90 capitalize select-none ${
                      !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                    }`}
                  >
                    Courses
                  </span>
                </li>
                <li
                  onClick={() => {
                    router.push("/Home/Program"),
                      activeStore.setState((state) => ({
                        ...state,
                        activeSubLink: "Programs",
                      }));
                  }}
                  className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                >
                  <BorderColorIcon
                    fontSize="small"
                    sx={{
                      color:
                        activeState.activeSubLink == "Programs"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f",
                      marginLeft: "20px",
                    }}
                  />
                  <span
                    style={{
                      color: ` ${activeState.activeSubLink == "Programs" ? color?.color : ""}`,
                    }}
                    className={`px-[8px] opacity-90 capitalize select-none ${
                      !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                    }`}
                  >
                    Program
                  </span>
                </li>
                {props.props.userInfo?.actors
                  ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
                  .claims.filter((item: any) => item.key == "EducationCertificate" && item.value == "Approver")
                  .length != 0 && (
                  <li
                    onClick={() => {
                      router.push("/Home/FinalIssue"),
                        activeStore.setState((state) => ({
                          ...state,
                          activeSubLink: "FinalIssue",
                        }));
                    }}
                    className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                  >
                    <VerifiedIcon
                      fontSize="small"
                      sx={{
                        color:
                          activeState.activeSubLink == "FinalIssue"
                            ? color?.color
                            : !themeMode || themeMode?.stateMode
                            ? "#bdbcbc"
                            : "#75634f",
                        marginLeft: "20px",
                      }}
                    />
                    <span
                      style={{
                        color: ` ${activeState.activeSubLink == "FinalIssue" ? color?.color : ""}`,
                      }}
                      className={`px-[8px] opacity-90 capitalize select-none ${
                        !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                      }`}
                    >
                      Final Issue
                    </span>
                  </li>
                )}
              </ul>
            ) : null}
          </li>
        )}
        {props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter((item: any) => item.key == "Automation").length != 0 && (
          <li className="w-[100%]">
            <div
              onClick={(e: any) => handleToggle(e)}
              className={`${
                activeState.activate === "Automation"
                  ? `active ${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"}`
                  : ""
              } nav-item cursor-pointer`}
            >
              <MailIcon
                style={{
                  background: `${activeState.activate === "Automation" ? color?.color : ""}`,
                  color: `${activeState.activate === "Automation" ? "white" : ""}`,
                  borderRadius: "50%",
                  fontSize: "30px",
                }}
                className={`p-1 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
              ></MailIcon>
              <span className="px-[20px] select-none text-sm capitalize">Automation</span>
              <div
                style={{
                  boxShadow: `0 20px 0 0 ${!themeMode || themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
              <div
                style={{
                  boxShadow: `0 -20px 0 0 ${!themeMode || themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
            </div>
            {activeState.activate == "Automation" ? (
              <ul className="mx-0 px-0 w-[100%] flex-wrap flex justify-end">
                <li
                  onClick={() => {
                    activeStore.setState((state) => ({
                      ...state,
                      activeSubLink: "New Document",
                    }));
                    handleNewDocument();
                  }}
                  className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                >
                  <NoteAddIcon
                    sx={{
                      color:
                        activeState.activeSubLink == "New Document"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f",
                      marginLeft: "20px",
                    }}
                    fontSize="small"
                  />
                  <span
                    style={{
                      color: ` ${
                        activeState.activeSubLink == "New Document"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f"
                      }`,
                    }}
                    className={`px-[8px] select-none opacity-90 capitalize ${
                      !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                    } `}
                  >
                    new doucument
                  </span>
                </li>
                <li
                  onClick={() => {
                    router.push("/Home/Cartable"),
                      activeStore.setState((state) => ({
                        ...state,
                        activeSubLink: "Cartable",
                      }));
                  }}
                  className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                >
                  <FolderOpenIcon
                    fontSize="small"
                    sx={{
                      color:
                        activeState.activeSubLink == "Cartable"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f",
                      marginLeft: "20px",
                    }}
                  />
                  <span
                    style={{
                      color: ` ${
                        activeState.activeSubLink == "Cartable"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f"
                      }`,
                    }}
                    className={`px-[8px] select-none opacity-90 capitalize ${
                      !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                    } `}
                  >
                    cartable
                  </span>
                </li>
                <li
                  onClick={() => {
                    router.push("/Home/Archive"),
                      activeStore.setState((state) => ({
                        ...state,
                        activeSubLink: "Archive",
                      }));
                  }}
                  className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                >
                  <FolderSpecialIcon
                    sx={{
                      color:
                        activeState.activeSubLink == "Archive"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f",
                      marginLeft: "20px",
                    }}
                    fontSize="small"
                  />
                  <span
                    style={{
                      color: ` ${
                        activeState.activeSubLink == "Archive"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f"
                      }`,
                    }}
                    className={`px-[8px] select-none opacity-90 capitalize ${
                      !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                    } `}
                  >
                    archive
                  </span>
                </li>
                <li
                  onClick={() => {
                    router.push("/Home/Search"),
                      activeStore.setState((state) => ({
                        ...state,
                        activeSubLink: "Search",
                      }));
                  }}
                  className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                >
                  <SearchIcon
                    sx={{
                      color:
                        activeState.activeSubLink == "Search"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f",
                      marginLeft: "20px",
                    }}
                    fontSize="small"
                  />
                  <span
                    style={{
                      color: ` ${
                        activeState.activeSubLink == "Search"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f"
                      }`,
                    }}
                    className={`px-[8px] select-none opacity-90 capitalize ${
                      !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                    } `}
                  >
                    search
                  </span>
                </li>
                <li
                  onClick={() => {
                    router.push("/Home/GroupManagement"),
                      activeStore.setState((state) => ({
                        ...state,
                        activeSubLink: "Group Management",
                      }));
                  }}
                  className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                >
                  <GroupsIcon
                    sx={{
                      color:
                        activeState.activeSubLink == "Group Management"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f",
                      marginLeft: "20px",
                    }}
                    fontSize="small"
                  />
                  <span
                    style={{
                      color: ` ${
                        activeState.activeSubLink == "Group Management"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f"
                      }`,
                    }}
                    className={`px-[8px] select-none opacity-90 capitalize ${
                      !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                    } `}
                  >
                    groups management
                  </span>
                </li>
                <li
                  onClick={() => {
                    router.push("/Home/DraftManagement"),
                      activeStore.setState((state) => ({
                        ...state,
                        activeSubLink: "Draft Management",
                      }));
                  }}
                  className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                >
                  <DescriptionIcon
                    sx={{
                      color:
                        activeState.activeSubLink == "Draft Management"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f",
                      marginLeft: "20px",
                    }}
                    fontSize="small"
                  />
                  <span
                    style={{
                      color: ` ${
                        activeState.activeSubLink == "Draft Management"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f"
                      }`,
                    }}
                    className={`px-[8px] select-none opacity-90 capitalize ${
                      !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                    } `}
                  >
                    draft management
                  </span>
                </li>
              </ul>
            ) : null}
          </li>
        )}

        {props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter((item: any) => item.key == "VesselPagesViewer").length != 0 && (
          <li className="w-[100%]">
            <div
              onClick={(e: any) => handleToggle(e)}
              className={`${
                activeState.activate === "Vessels"
                  ? `active ${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"}`
                  : ""
              } nav-item cursor-pointer`}
            >
              <DirectionsBoatFilledIcon
                style={{
                  background: `${activeState.activate === "Vessels" ? color?.color : ""}`,
                  color: `${activeState.activate === "Vessels" ? "white" : ""}`,
                  borderRadius: "50%",
                  fontSize: "30px",
                }}
                className={`p-1 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
              />
              <span className="px-[20px] select-none text-sm capitalize">Vessels</span>
              <div
                style={{
                  boxShadow: `0 20px 0 0 ${!themeMode || themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
              <div
                style={{
                  boxShadow: `0 -20px 0 0 ${!themeMode || themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
            </div>
            {activeState.activate == "Vessels" ? (
              <ul className="mx-0 px-0 w-[100%] flex-wrap flex justify-end">
                <li
                  onClick={() => {
                    router.push("/Home/Status"),
                      activeStore.setState((state) => ({
                        ...state,
                        activeSubLink: "Status",
                      }));
                  }}
                  className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                >
                  <QueryStatsIcon
                    fontSize="small"
                    sx={{
                      color:
                        activeState.activeSubLink == "Status"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f",
                      marginLeft: "20px",
                    }}
                  />
                  <span
                    style={{
                      color: ` ${activeState.activeSubLink == "Status" ? color?.color : ""}`,
                    }}
                    className={`px-[8px] select-none opacity-90 capitalize ${
                      !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                    } `}
                  >
                    status
                  </span>
                </li>
              </ul>
            ) : null}
          </li>
        )}
        {props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter((item: any) => item.key == "Audit").length != 0 && (
          <li className="w-[100%]">
            <div
              onClick={(e: any) => handleToggle(e)}
              className={`${
                activeState.activate === "Audit"
                  ? `active ${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"}`
                  : ""
              } nav-item cursor-pointer`}
            >
              <ListAltIcon
                style={{
                  background: `${activeState.activate === "Audit" ? color?.color : ""}`,
                  color: `${activeState.activate === "Audit" ? "white" : ""}`,
                  borderRadius: "50%",
                  fontSize: "30px",
                }}
                className={`p-1 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
              ></ListAltIcon>
              <span className="px-[20px] text-sm capitalize select-none">Audit</span>
              <div
                style={{
                  boxShadow: `0 20px 0 0 ${!themeMode || themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
              <div
                style={{
                  boxShadow: `0 -20px 0 0 ${!themeMode || themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
            </div>
            {activeState.activate == "Audit" ? (
              <ul className="mx-0 px-0 w-[100%] flex-wrap flex justify-end">
                <li
                  onClick={() => {
                    router.push("/Home/LogTable"),
                      activeStore.setState((state) => ({
                        ...state,
                        activeSubLink: "Log Table",
                      }));
                  }}
                  className="p-[5px] cursor-pointer w-[92%] mx-auto transition-[0.4s] text-xs my-1"
                >
                  <InsertChartIcon
                    sx={{
                      color:
                        activeState.activeSubLink == "Log Table"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f",
                      marginLeft: "20px",
                    }}
                    fontSize="small"
                  />
                  <span
                    style={{
                      color: ` ${
                        activeState.activeSubLink == "Log Table"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f"
                      }`,
                    }}
                    className={`px-[8px] select-none opacity-90 capitalize ${
                      !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                    } `}
                  >
                    log table
                  </span>
                </li>
              </ul>
            ) : null}
          </li>
        )}
        {props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter((item: any) => item.key == "ProjectManagement").length != 0 && (
          <li className="w-[100%]">
            <div
              onClick={(e: any) => handleToggle(e)}
              className={`${
                activeState.activate === "Project Management"
                  ? `active ${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"}`
                  : ""
              } nav-item cursor-pointer`}
            >
              <BusinessCenterIcon
                style={{
                  background: `${activeState.activate === "Project Management" ? color?.color : ""}`,
                  color: `${activeState.activate === "Project Management" ? "white" : ""}`,
                  borderRadius: "50%",
                  fontSize: "30px",
                }}
                className={`p-1 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
              />
              <span className="px-[20px] text-[13px] select-none capitalize">Project Management</span>
              <div
                style={{
                  boxShadow: `0 20px 0 0 ${!themeMode || themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
              <div
                style={{
                  boxShadow: `0 -20px 0 0 ${!themeMode || themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
            </div>
            {activeState.activate == "Project Management" ? (
              <ul className="mx-0 px-0 w-[100%] flex-wrap flex justify-end">
                <li
                  onClick={() => {
                    router.push("/Home/InitializeProject"),
                      activeStore.setState((state) => ({
                        ...state,
                        activeSubLink: "Initialize Project",
                      }));
                  }}
                  className="p-[5px] w-[92%] mx-auto cursor-pointer transition-[0.4s] text-xs my-1"
                >
                  <SettingsIcon
                    sx={{
                      color:
                        activeState.activeSubLink == "Initialize Project"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f",
                      marginLeft: "20px",
                    }}
                    fontSize="small"
                  />
                  <span
                    style={{
                      color: ` ${
                        activeState.activeSubLink == "Initialize Project"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f"
                      }`,
                    }}
                    className={`px-[8px] select-none capitalize opacity-90 ${
                      !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                    }`}
                  >
                    Initialize Project
                  </span>
                </li>
              </ul>
            ) : null}
          </li>
        )}
        {/* 
                <li className="w-[100%]">
                    <div onClick={() => activeStore.setState((state) => ({ ...state, activate: "Process production engine", activeSubLink: "" }))}
                        className={`${activeState.activate === "Process production engine" ? `active ${!themeMode ||themeMode?.stateMode ? 'contentDark' : 'contentLight'}` : ""
                            } nav-item cursor-pointer`}>
                        <AccountTreeIcon style={{ background: `${activeState.activate === "Process production engine" ? color?.color : ''}`, color: `${activeState.activate === "Process production engine" ? 'white' : ''}`, borderRadius: "50%", fontSize: "30px" }} className={`p-1 ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`} />
                        <span className="px-[10px] text-[12.2px] capitalize">Process production engine</span>
                        <div style={{ boxShadow: `0 20px 0 0 ${!themeMode ||themeMode?.stateMode === false ? '#eeeae6' : ' #22303c'}` }}></div>
                        <div style={{ boxShadow: `0 -20px 0 0 ${!themeMode ||themeMode?.stateMode === false ? '#eeeae6' : ' #22303c'}` }}></div>
                    </div>
                    {activeState.activate === "Process production engine" && (
                        <ul className="mx-0 px-0 w-[100%] flex-wrap flex justify-end">
                            <li onClick={() => { router.push("/Home/ProcessProductionEng"), activeStore.setState((state) => ({ ...state, activeSubLink: "process" })) }} className="p-[5px] w-[92%] mx-auto cursor-pointer transition-[0.4s] text-xs my-1">
                                <AccountTreeIcon sx={{ color: activeState.activeSubLink == "process" ? color?.color : !themeMode ||themeMode?.stateMode ? "#bdbcbc" : '#75634f', marginLeft: "20px" }} fontSize='small' />
                                <span style={{ color: ` ${activeState.activeSubLink == "process" ? color?.color : !themeMode ||themeMode?.stateMode ? "#bdbcbc" : '#75634f'}` }} className={"px-[8px] capitalize opacity-90 " + themeMode?.textColor}>
                                    process
                                </span>
                            </li>
                        </ul>
                    )}
                </li> */}
        {props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter((item: any) => item.key == "Archive").length != 0 && (
          <li className="w-[100%]">
            <div
              onClick={(e: any) => handleToggle(e)}
              className={`${
                activeState.activate === "Archive"
                  ? `active ${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"}`
                  : ""
              } nav-item cursor-pointer`}
            >
              <ArchiveIcon
                style={{
                  background: `${activeState.activate === "Archive" ? color?.color : ""}`,
                  color: `${activeState.activate === "Archive" ? "white" : ""}`,
                  borderRadius: "50%",
                  fontSize: "30px",
                }}
                className={`p-1 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
              ></ArchiveIcon>
              <span className="px-[20px] select-none text-sm capitalize">Archive</span>
              <div
                style={{
                  boxShadow: `0 20px 0 0 ${!themeMode || themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
              <div
                style={{
                  boxShadow: `0 -20px 0 0 ${!themeMode || themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
            </div>
            {activeState.activate == "Archive" ? (
              <ul className="mx-0 px-0 w-[100%] flex-wrap flex justify-end">
                <li
                  onClick={() => {
                    router.push("/Home/AddDocument"),
                      activeStore.setState((state) => ({
                        ...state,
                        activeSubLink: "Add Document",
                      }));
                  }}
                  className="p-[5px] cursor-pointer w-[92%] mx-auto  transition-[0.4s] text-xs my-1"
                >
                  <PostAddIcon
                    sx={{
                      color:
                        activeState.activeSubLink == "Add Document"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f",
                      marginLeft: "20px",
                    }}
                    fontSize="small"
                  />
                  <span
                    style={{
                      color: ` ${
                        activeState.activeSubLink == "Add Document"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f"
                      }`,
                    }}
                    className={`px-[20px] select-none opacity-90 capitalize ${
                      !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                    }`}
                  >
                    Add Document
                  </span>
                </li>
                <li
                  onClick={() => {
                    router.push("/Home/ViewDocument"),
                      activeStore.setState((state) => ({
                        ...state,
                        activeSubLink: "View Document",
                      }));
                  }}
                  className="p-[5px]  cursor-pointer w-[92%] mx-auto transition-[0.4s] text-xs my-1"
                >
                  <VisibilityIcon
                    sx={{
                      color:
                        activeState.activeSubLink == "View Document"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f",
                      marginLeft: "20px",
                    }}
                    fontSize="small"
                  />
                  <span
                    style={{
                      color: ` ${
                        activeState.activeSubLink == "View Document"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f"
                      }`,
                    }}
                    className={`px-[20px] select-none opacity-90 capitalize ${
                      !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                    }`}
                  >
                    View Document
                  </span>
                </li>
              </ul>
            ) : null}
          </li>
        )}

        {(props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter((item: any) => item.key == "Process").length != 0 ||
          //ignore condition for TEST
          true) && (
          <li className="w-[100%]">
            <div
              onClick={(e: any) => handleToggle(e)}
              className={`${
                activeState.activate === "Process Engine"
                  ? `active ${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"}`
                  : ""
              } nav-item cursor-pointer`}
            >
              <MemoryIcon
                style={{
                  background: `${activeState.activate === "Process Engine" ? color?.color : ""}`,
                  color: `${activeState.activate === "Process Engine" ? "white" : ""}`,
                  borderRadius: "50%",
                  fontSize: "30px",
                }}
                className={`p-1 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
              />
              <span className="px-[20px] select-none text-sm capitalize">Process Engine</span>
              <div
                style={{
                  boxShadow: `0 20px 0 0 ${!themeMode || themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
              <div
                style={{
                  boxShadow: `0 -20px 0 0 ${!themeMode || themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
                }}
              ></div>
            </div>
            {activeState.activate == "Process Engine" ? (
              <ul className="mx-0 px-0 w-[100%] flex-wrap flex justify-end">
                <li
                  onClick={() => {
                    router.push("/Home/process/processes"),
                      activeStore.setState((state) => ({
                        ...state,
                        activeSubLink: "processes",
                      }));
                  }}
                  className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
                >
                  <FormatShapesIcon
                    fontSize="small"
                    sx={{
                      color:
                        activeState.activeSubLink == "processes"
                          ? color?.color
                          : !themeMode || themeMode?.stateMode
                          ? "#bdbcbc"
                          : "#75634f",
                      marginLeft: "20px",
                    }}
                  />
                  <span
                    style={{
                      color: ` ${activeState.activeSubLink == "processes" ? color?.color : ""}`,
                    }}
                    className={`px-[8px] select-none opacity-90 capitalize ${
                      !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                    } `}
                  >
                    Processes
                  </span>
                </li>
              </ul>
            ) : null}
          </li>
        )}
      </ul>
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
        className={`${!themeMode || themeMode?.stateMode ? "cardDark" : "cardLight"} absolute top-0 min-h-[50vh] `}
        open={open}
        handler={handleNewDocument}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <DialogHeader
          dir="rtl"
          className={`${
            !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
          } flex justify-between sticky top-0 left-0`}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          انتخاب مدرک
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => {
              handleNewDocument();
              setNewDocAutomationState((prev) => ({
                ...prev,
                documentType: 1,
              }));
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </IconButton>
        </DialogHeader>

        <DialogBody
          className="w-full"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <section className="w-full grid grid-cols-1 gap-y-4 ">
            <div dir="rtl" className=" w-full my-2">
              <Tooltip
                className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                content="Save Softwares"
                placement="top"
              >
                <Button
                  onClick={() => {
                    OpenNewDocument();
                  }}
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
            <Select2
              isRtl
              className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"} w-[100%] z-[999999]`}
              placeholder="نوع مدرک"
              options={[
                { label: "نامه وارده", value: 4 },
                { label: "نامه اداری", value: 1 },
                { label: "کاور لتر", value: 5 },
              ]}
              onChange={(option: SingleValue<{ label: string; value: number }>) => {
                setNewDocAutomationState((state: any) => ({
                  ...state,
                  documentType: option?.value,
                  draftId: "",
                  documentSize: 0,
                }));
              }}
              defaultValue={[
                { label: "نامه وارده", value: 4 },
                { label: "نامه اداری", value: 1 },
              ].find((item) => item.value == 1)}
              maxMenuHeight={220}
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
                  neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                  neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#75634f"}`,
                },
              })}
            />
            {/* <Select2 isRtl
                                className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] z-[999999]`} placeholder="نوع مدرک" options={[{ label: "نامه وارده", value: 4 }, { label: "نامه اداری", value: 1 }]}
                                onChange={(option: SingleValue<{ label: string, value: number }>) => { setNewDocAutomationState((state: any) => ({ ...state, documentType: option?.value, draftId: "", documentSize: 0 })) }}
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
                                        neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                        neutral80: `${!themeMode || themeMode?.stateMode ? "#bdbcbc" : '#75634f'}`
                                    },
                                })}
                            /> */}
            {newDocAutomationState.documentType !== 4 && (
              <>
                <Select2
                  key={newDocAutomationState.formatId?.id}
                  isRtl
                  maxMenuHeight={220}
                  options={newDocAutomationState.layoutSize}
                  className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"} w-[100%] z-[900000]`}
                  placeholder="انتخاب قالب چاپ پیش فرض"
                  defaultValue={newDocAutomationState.layoutSize.find((item: LayoutsModel) => item.isMain == true)}
                  onChange={(option: any) => {
                    setNewDocAutomationState((state) => ({
                      ...state,
                      formatId: option,
                    }));
                  }}
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
                      neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                      neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                    },
                  })}
                />
                {(newDocAutomationState.documentType == 1 || newDocAutomationState.documentType == 5) && (
                  <div className="flex justify-around items-center w-full">
                    {LayoutSizes.map((value: any, index: number) => {
                      return (
                        <Radio
                          defaultChecked={LayoutSizes.find((item) => item.value == 0) ? true : false}
                          onClick={() =>
                            setNewDocAutomationState((state) => ({
                              ...state,
                              documentSize: value.value,
                              draftId: "",
                            }))
                          }
                          key={"LayoutSizes" + index}
                          crossOrigin=""
                          name="docSize"
                          color="blue-gray"
                          ripple={false}
                          className="border-blue-gray-600/10 bg-blue-gray-600/5 p-0 transition-all hover:before:opacity-0"
                          label={
                            <Typography
                              color="blue-gray"
                              className={`font-normal ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                              placeholder={undefined}
                              onPointerEnterCapture={undefined}
                              onPointerLeaveCapture={undefined}
                            >
                              {value.label}
                            </Typography>
                          }
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                      );
                    })}
                  </div>
                )}
                {(newDocAutomationState.documentType == 1 || newDocAutomationState.documentType == 5) &&
                  newDocAutomationState.documentSize == 2 && (
                    <div className="flex justify-around items-center w-full">
                      <Select2
                        isRtl
                        className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"} w-[100%]`}
                        placeholder="نوع مدرک"
                        options={newDocAutomationState.drafts}
                        onChange={(option: SingleValue<DraftModel>, actionMeta: ActionMeta<DraftModel>) => {
                          setNewDocAutomationState((state: any) => ({
                            ...state,
                            draftId: option?.id,
                          }));
                        }}
                        maxMenuHeight={220}
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
                            neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                            neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#75634f"}`,
                          },
                        })}
                      />
                    </div>
                  )}
              </>
            )}
          </section>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default RoleClaimsDesktop;
