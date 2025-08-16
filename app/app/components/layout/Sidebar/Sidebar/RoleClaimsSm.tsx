import React, { useCallback, useEffect, useState } from "react";
import themeStore from "../../../../zustandData/theme.zustand";
import useStore from "../../../../hooks/useStore";
import colorStore from "../../../../zustandData/color.zustand";
import activeStore from "../../../../zustandData/activate.zustand";
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
import SaveIcon from "@mui/icons-material/Save";
import SchoolIcon from "@mui/icons-material/School";
import { ActionMeta, SingleValue } from "react-select";
import Select2 from "react-select";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import { AxiosResponse } from "axios";
import useAxios from "@/app/hooks/useAxios";
import VerifiedIcon from "@mui/icons-material/Verified";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import MailIcon from "@mui/icons-material/Mail";
import DatasetIcon from "@mui/icons-material/Dataset";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import ArchiveIcon from "@mui/icons-material/Archive";
import PostAddIcon from "@mui/icons-material/PostAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupsIcon from "@mui/icons-material/Groups";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import ApartmentIcon from "@mui/icons-material/Apartment";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CategoryIcon from "@mui/icons-material/Category";
import HistoryIcon from "@mui/icons-material/History";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import KeyIcon from "@mui/icons-material/Key";
import SearchIcon from "@mui/icons-material/Search";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ListAltIcon from "@mui/icons-material/ListAlt";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import DirectionsBoatFilledIcon from "@mui/icons-material/DirectionsBoatFilled";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import GavelIcon from "@mui/icons-material/Gavel";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { ReportProblem } from "@mui/icons-material/";
import MemoryIcon from "@mui/icons-material/Memory";
import FormatShapesIcon from "@mui/icons-material/FormatShapes";

const RoleClaimsMobile = (props: any) => {
  const { AxiosRequest } = useAxios();
  const router = useRouter();
  const activeState = activeStore();
  const color = useStore(colorStore, (state) => state);
  const themeMode = useStore(themeStore, (state) => state);
  // ***NewDocument
  const [open, setOpen] = useState<boolean>(false);
  const handleNewDocument = () => {
    setOpen(!open);
  };

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

  return (
    <>
      <ul
        className={`${
          !themeMode || themeMode?.stateMode ? "themeDark" : "themeLight"
        } nav-menu w-100 row g-0 justify-content-end `}
      >
        {props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter((item: any) => item.key == "RulesAndRegulations").length != 0 && (
          <Tooltip
            className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
            placement="right"
            content="Rules & Regulations"
          >
            <li className="flex flex-col items-end">
              <div
                onClick={() => {
                  activeStore.setState((state) => ({
                    ...state,
                    activate: state.activate == "Rules & Regulations" ? "" : "Rules & Regulations",
                    activeSubLink: "",
                  }));
                }}
                className={`${
                  activeState.activate === "Rules & Regulations"
                    ? `active ${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"}`
                    : ""
                } nav-item`}
              >
                <GavelIcon
                  style={{
                    background: `${activeState.activate === "Rules & Regulations" ? color?.color : ""}`,
                    color: `${activeState.activate === "Rules & Regulations" ? "white" : ""}`,
                    borderRadius: "50%",
                    fontSize: "28px",
                  }}
                  className={`p-1 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                ></GavelIcon>
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
              {activeState.activate === "Rules & Regulations" ? (
                <ul className="w-full flex flex-col items-center">
                  <Tooltip
                    className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                    placement="right"
                    content="Rules Managment"
                  >
                    <li
                      onClick={() => {
                        activeStore.setState((state) => ({ ...state, activeSubLink: "Rules Managment" })),
                          router.push("/Home/RulesAndRegulation");
                      }}
                      className="p-[5px]  transition-[0.4s] text-xs my-1"
                    >
                      <ManageSearchIcon
                        sx={{
                          color:
                            activeState.activeSubLink == "Rules Managment"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f",
                        }}
                        fontSize="small"
                        className=" w-full "
                      ></ManageSearchIcon>
                    </li>
                  </Tooltip>
                </ul>
              ) : null}
            </li>
          </Tooltip>
        )}

        {props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter(
            (item: any) => (item.key == "UserManagement" || item.key == "HumanResource") && item.value == "Admin"
          ).length != 0 && (
          <Tooltip
            className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
            placement="right"
            content="User Management"
          >
            <li className="flex flex-col items-end cursor-pointer">
              <div
                onClick={() => {
                  activeStore.setState((state) => ({
                    ...state,
                    activate: state.activate == "User Management" ? "" : "User Management",
                    activeSubLink: "",
                  }));
                }}
                className={`${
                  activeState.activate === "User Management"
                    ? `active ${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"}`
                    : ""
                } nav-item`}
              >
                <ManageAccountsIcon
                  style={{
                    background: `${activeState.activate === "User Management" ? color?.color : ""}`,
                    color: `${activeState.activate === "User Management" ? "white" : ""}`,
                    borderRadius: "50%",
                    fontSize: "28px",
                  }}
                  className={`p-1 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                />
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
              {activeState.activate === "User Management" ? (
                <ul className="w-full flex flex-col items-center">
                  <Tooltip
                    className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                    placement="right"
                    content="Acs Users"
                  >
                    <li
                      onClick={() => {
                        activeStore.setState((state) => ({
                          ...state,
                          activeSubMenu: state.activeSubMenu == "Acs Users" ? "" : "Acs Users",
                        }));
                      }}
                      className="p-[5px]  transition-[0.4s] text-sm my-1 cursor-pointer"
                    >
                      <PeopleIcon
                        sx={{
                          color:
                            activeState.activeSubMenu == "Acs Users"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "white"
                              : "#463b2f",
                        }}
                        fontSize="small"
                        className="w-full "
                      />
                    </li>
                  </Tooltip>
                  {activeState.activeSubMenu === "Acs Users" ? (
                    <ul className="w-full flex flex-col items-center">
                      <Tooltip
                        className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                        placement="right"
                        content="Users List"
                      >
                        <li
                          onClick={() => {
                            router.push("/Home/UsersList"),
                              activeStore.setState((state) => ({ ...state, activeSubLink: "Acs Users / Users List" }));
                          }}
                          className="p-[5px]  transition-[0.4s] text-xs my-1 cursor-pointer"
                        >
                          <GroupsIcon
                            sx={{
                              color:
                                activeState.activeSubLink == "Acs Users / Users List"
                                  ? color?.color
                                  : !themeMode || themeMode?.stateMode
                                  ? "#bdbcbc"
                                  : "#75634f",
                            }}
                            fontSize="small"
                            className="w-full "
                          />
                        </li>
                      </Tooltip>
                      {props.props.userInfo?.actors
                        ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
                        .claims.filter((item: any) => item.key == "UserManagement").length > 0 && (
                        <Tooltip
                          className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                          placement="right"
                          content="Add User"
                        >
                          <li
                            onClick={() => {
                              router.push("/Home/AddUser"),
                                activeStore.setState((state) => ({ ...state, activeSubLink: "Acs Users / Add User" }));
                            }}
                            className="p-[5px]  transition-[0.4s] text-xs my-1 cursor-pointer"
                          >
                            <PersonAddIcon
                              sx={{
                                color:
                                  activeState.activeSubLink == "Acs Users / Add User"
                                    ? color?.color
                                    : !themeMode || themeMode?.stateMode
                                    ? "#bdbcbc"
                                    : "#75634f",
                              }}
                              fontSize="small"
                              className="w-full "
                            />
                          </li>
                        </Tooltip>
                      )}
                      {props.props.userInfo?.actors
                        ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
                        .claims.filter((item: any) => item.key == "UserManagement").length > 0 && (
                        <Tooltip
                          className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                          placement="right"
                          content="Manage Role"
                        >
                          <li
                            onClick={() => {
                              router.push("/Home/Roles"),
                                activeStore.setState((state) => ({
                                  ...state,
                                  activeSubLink: "Acs Users / Manage Role",
                                }));
                            }}
                            className="p-[5px]  transition-[0.4s] text-xs my-1 cursor-pointer"
                          >
                            <ManageAccountsIcon
                              sx={{
                                color:
                                  activeState.activeSubLink == "Acs Users / Manage Role"
                                    ? color?.color
                                    : !themeMode || themeMode?.stateMode
                                    ? "#bdbcbc"
                                    : "#75634f",
                              }}
                              fontSize="small"
                              className="w-full "
                            />
                          </li>
                        </Tooltip>
                      )}
                    </ul>
                  ) : null}
                  {props.props.userInfo?.actors
                    ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
                    .claims.filter((item: any) => item.key == "UserManagement").length > 0 && (
                    <Tooltip
                      className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                      placement="right"
                      content="Status Users"
                    >
                      <li
                        onClick={() => {
                          activeStore.setState((state) => ({
                            ...state,
                            activeSubMenu: state.activeSubMenu == "Status Users" ? "" : "Status Users",
                          }));
                        }}
                        className="p-[5px]  transition-[0.4s] text-sm my-1 cursor-pointer"
                      >
                        <PeopleOutlineIcon
                          sx={{
                            color:
                              activeState.activeSubMenu == "Status Users"
                                ? color?.color
                                : !themeMode || themeMode?.stateMode
                                ? "white"
                                : "#463b2f",
                          }}
                          fontSize="small"
                          className="w-full "
                        />
                      </li>
                    </Tooltip>
                  )}
                  {props.props.userInfo?.actors
                    ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
                    .claims.filter((item: any) => item.key == "UserManagement").length > 0 &&
                  activeState.activeSubMenu === "Status Users" ? (
                    <ul className="w-full flex flex-col items-center">
                      <Tooltip
                        className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                        placement="right"
                        content="Add User"
                      >
                        <li
                          onClick={() => {
                            router.push("/Home/AddStatusUser"),
                              activeStore.setState((state) => ({ ...state, activeSubLink: "Status Users / Add User" }));
                          }}
                          className="p-[5px]  transition-[0.4s] text-xs my-1 cursor-pointer"
                        >
                          <PersonAddIcon
                            sx={{
                              color:
                                activeState.activeSubLink == "Status Users / Add User"
                                  ? color?.color
                                  : !themeMode || themeMode?.stateMode
                                  ? "#bdbcbc"
                                  : "#75634f",
                            }}
                            fontSize="small"
                            className="w-full "
                          />
                        </li>
                      </Tooltip>
                      <Tooltip
                        className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                        placement="right"
                        content="Status Users List"
                      >
                        <li
                          onClick={() => {
                            router.push("/Home/StatusList"),
                              activeStore.setState((state) => ({
                                ...state,
                                activeSubLink: "Status Users / Status Users List",
                              }));
                          }}
                          className="p-[5px]  transition-[0.4s] text-xs my-1 cursor-pointer"
                        >
                          <GroupsIcon
                            sx={{
                              color:
                                activeState.activeSubLink == "Status Users / Status Users List"
                                  ? color?.color
                                  : !themeMode || themeMode?.stateMode
                                  ? "#bdbcbc"
                                  : "#75634f",
                            }}
                            fontSize="small"
                            className="w-full "
                          />
                        </li>
                      </Tooltip>
                    </ul>
                  ) : null}
                  {props.props.userInfo?.actors
                    ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
                    .claims.filter((item: any) => item.key == "UserManagement").length > 0 && (
                    <Tooltip
                      className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                      placement="right"
                      content="Base Info Management"
                    >
                      <li
                        onClick={() => {
                          router.push("/Home/BaseInfoManagement"),
                            activeStore.setState((state) => ({
                              ...state,
                              activeSubLink: "Base Info Management",
                              activeSubMenu: "",
                            }));
                        }}
                        className="p-[5px]  transition-[0.4s] text-xs my-1 cursor-pointer"
                      >
                        <SettingsApplicationsIcon
                          sx={{
                            color:
                              activeState.activeSubLink == "Base Info Management"
                                ? color?.color
                                : !themeMode || themeMode?.stateMode
                                ? "#bdbcbc"
                                : "#75634f",
                          }}
                          fontSize="small"
                          className="w-full "
                        />
                      </li>
                    </Tooltip>
                  )}
                  {props.props.userInfo?.actors
                    ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
                    .claims.filter((item: any) => item.key == "UserManagement").length > 0 && (
                    <Tooltip
                      className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                      placement="right"
                      content="Department Management"
                    >
                      <li
                        onClick={() => {
                          router.push("/Home/DepartmentsManagement"),
                            activeStore.setState((state) => ({
                              ...state,
                              activeSubLink: "Department Management",
                              activeSubMenu: "",
                            }));
                        }}
                        className="p-[5px]  transition-[0.4s] text-xs my-1 cursor-pointer"
                      >
                        <ApartmentIcon
                          sx={{
                            color:
                              activeState.activeSubLink == "Department Management"
                                ? color?.color
                                : !themeMode || themeMode?.stateMode
                                ? "#bdbcbc"
                                : "#75634f",
                          }}
                          fontSize="small"
                          className="w-full "
                        />
                      </li>
                    </Tooltip>
                  )}
                  {props.props.userInfo?.actors
                    ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
                    .claims.filter((item: any) => item.key == "UserManagement").length > 0 && (
                    <Tooltip
                      className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                      placement="right"
                      content="Organization Management"
                    >
                      <li
                        onClick={() => {
                          router.push("/Home/OrgManagement"),
                            activeStore.setState((state) => ({
                              ...state,
                              activeSubLink: "Organization Management",
                              activeSubMenu: "",
                            }));
                        }}
                        className="p-[5px]  transition-[0.4s] text-xs my-1 cursor-pointer"
                      >
                        <AccountTreeIcon
                          sx={{
                            color:
                              activeState.activeSubLink == "Organization Management"
                                ? color?.color
                                : !themeMode || themeMode?.stateMode
                                ? "#bdbcbc"
                                : "#75634f",
                          }}
                          fontSize="small"
                          className="w-full "
                        />
                      </li>
                    </Tooltip>
                  )}
                </ul>
              ) : null}
            </li>
          </Tooltip>
        )}

        {props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter((item: any) => item.key == "HumanResource" && item.value == "Admin").length != 0 && (
          <Tooltip
            className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
            placement="right"
            content="Human Resource"
          >
            <li className="flex flex-col items-end">
              <div
                onClick={() => {
                  activeStore.setState((state) => ({
                    ...state,
                    activate: state.activate == "Human Resource" ? "" : "Human Resource",
                    activeSubLink: "",
                  }));
                }}
                className={`${
                  activeState.activate === "Human Resource"
                    ? `active ${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"}`
                    : ""
                } nav-item`}
              >
                <SupervisedUserCircleIcon
                  style={{
                    background: `${activeState.activate === "Human Resource" ? color?.color : ""}`,
                    color: `${activeState.activate === "Human Resource" ? "white" : ""}`,
                    borderRadius: "50%",
                    fontSize: "28px",
                  }}
                  className={`p-1 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                ></SupervisedUserCircleIcon>
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
              {activeState.activate === "Human Resource" ? (
                <ul className="w-full flex flex-col items-center">
                  <Tooltip
                    className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                    placement="right"
                    content="Manage Resume"
                  >
                    <li
                      onClick={() => {
                        activeStore.setState((state) => ({ ...state, activeSubLink: "Manage Resume" })),
                          router.push("/Home/ManageResume");
                      }}
                      className="p-[5px]  transition-[0.4s] text-xs my-1"
                    >
                      <ContactPageIcon
                        sx={{
                          color:
                            activeState.activeSubLink == "Manage Resume"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f",
                        }}
                        fontSize="small"
                        className=" w-full "
                      ></ContactPageIcon>
                    </li>
                  </Tooltip>
                  {/* <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} placement='right' content="Leave Form Management"><li onClick={() => { activeStore.setState((state) => ({ ...state, activeSubLink: "Leave Form Management" })), router.push("/Home/FormManagement") }} className="p-[5px]  transition-[0.4s] text-xs my-1">
                                    <ListAltIcon sx={{ color: activeState.activeSubLink == "Leave Form Management" ? color?.color : !themeMode || themeMode?.stateMode ? "#bdbcbc" : '#75634f' }} fontSize='small' className=" w-full "></ListAltIcon>
                                </li></Tooltip> */}
                </ul>
              ) : null}

              {activeState.activate === "Human Resource" ? (
                <ul className="w-full flex flex-col items-center">
                  <Tooltip
                    className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                    placement="right"
                    content="Defects"
                  >
                    <li
                      onClick={() => {
                        activeStore.setState((state) => ({ ...state, activeSubLink: "Defects" })),
                          router.push("/Home/Defects");
                      }}
                      className="p-[5px]  transition-[0.4s] text-xs my-1"
                    >
                      <ReportProblem
                        sx={{
                          color:
                            activeState.activeSubLink == "Defects"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f",
                        }}
                        fontSize="small"
                        className=" w-full "
                      ></ReportProblem>
                    </li>
                  </Tooltip>
                </ul>
              ) : null}
            </li>
          </Tooltip>
        )}
        {props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter((item: any) => item.key == "History").length != 0 && (
          <Tooltip
            className={themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
            placement="right"
            content="History"
          >
            <li className="flex flex-col items-end">
              <div
                onClick={() => {
                  activeStore.setState((state) => ({
                    ...state,
                    activate: state.activate == "History" ? "" : "History",
                    activeSubLink: "",
                  }));
                }}
                className={`${
                  activeState.activate === "History"
                    ? `active ${themeMode?.stateMode ? "contentDark" : "contentLight"}`
                    : ""
                } nav-item`}
              >
                <HistoryIcon
                  style={{
                    background: `${activeState.activate === "History" ? color?.color : ""}`,
                    color: `${activeState.activate === "History" ? "white" : ""}`,
                    borderRadius: "50%",
                    fontSize: "28px",
                  }}
                  className={`p-1 ${themeMode?.stateMode ? "lightText" : "darkText"}`}
                ></HistoryIcon>
                <div
                  style={{ boxShadow: `0 20px 0 0 ${themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}` }}
                ></div>
                <div
                  style={{ boxShadow: `0 -20px 0 0 ${themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}` }}
                ></div>
              </div>
              {activeState.activate === "History" ? (
                <ul className="w-full flex flex-col items-center">
                  {props.props.userInfo?.actors
                    ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
                    .claims.filter((item: any) => item.key == "History" && item.value == "TabViewer").length != 0 && (
                    <Tooltip
                      className={themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                      placement="right"
                      content="Tabs"
                    >
                      <li
                        onClick={() => {
                          activeStore.setState((state) => ({ ...state, activeSubLink: "Tabs" })),
                            router.push("/Home/Tabs");
                        }}
                        className="p-[5px]  transition-[0.4s] text-xs my-1"
                      >
                        <ManageSearchIcon
                          sx={{
                            color:
                              activeState.activeSubLink == "Tabs"
                                ? color?.color
                                : themeMode?.stateMode
                                ? "#bdbcbc"
                                : "#75634f",
                          }}
                          fontSize="small"
                          className=" w-full "
                        ></ManageSearchIcon>
                      </li>
                    </Tooltip>
                  )}
                  {props.props.userInfo?.actors
                    ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
                    .claims.filter(
                      (item: any) =>
                        item.key == "History" &&
                        (item.value == "HArchiveAdd" || item.value == "HArchiveEdit" || item.value == "HArchiveViewer")
                    ).length != 0 && (
                    <Tooltip
                      className={themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                      placement="right"
                      content="Archive"
                    >
                      <li
                        onClick={() => {
                          activeStore.setState((state) => ({ ...state, activeSubLink: "Archive History" })),
                            router.push("/Home/ArchiveHistory");
                        }}
                        className="p-[5px]  transition-[0.4s] text-xs my-1"
                      >
                        <FolderSpecialIcon
                          sx={{
                            color:
                              activeState.activeSubLink == "Archive History"
                                ? color?.color
                                : themeMode?.stateMode
                                ? "#bdbcbc"
                                : "#75634f",
                          }}
                          fontSize="small"
                          className=" w-full "
                        ></FolderSpecialIcon>
                      </li>
                    </Tooltip>
                  )}
                </ul>
              ) : null}
            </li>
          </Tooltip>
        )}
        {props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter((item: any) => item.key == "Timesheet" && item.value == "User").length != 0 && (
          <Tooltip
            className={themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
            placement="right"
            content="Timesheet"
          >
            <li className="flex flex-col items-end">
              <div
                onClick={() => {
                  activeStore.setState((state) => ({
                    ...state,
                    activate: state.activate == "Timesheet" ? "" : "Timesheet",
                    activeSubLink: "",
                  }));
                }}
                className={`${
                  activeState.activate === "Timesheet"
                    ? `active ${themeMode?.stateMode ? "contentDark" : "contentLight"}`
                    : ""
                } nav-item`}
              >
                <ListAltIcon
                  style={{
                    background: `${activeState.activate === "Timesheet" ? color?.color : ""}`,
                    color: `${activeState.activate === "Timesheet" ? "white" : ""}`,
                    borderRadius: "50%",
                    fontSize: "28px",
                  }}
                  className={`p-1 ${themeMode?.stateMode ? "lightText" : "darkText"}`}
                ></ListAltIcon>
                <div
                  style={{ boxShadow: `0 20px 0 0 ${themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}` }}
                ></div>
                <div
                  style={{ boxShadow: `0 -20px 0 0 ${themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}` }}
                ></div>
              </div>
              {activeState.activate === "Timesheet" ? (
                <ul className="w-full flex flex-col items-center">
                  <Tooltip
                    className={themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                    placement="right"
                    content="Enterdata"
                  >
                    <li
                      onClick={() => {
                        activeStore.setState((state) => ({ ...state, activeSubLink: "Enterdata" })),
                          router.push("/Home/Enterdata");
                      }}
                      className="p-[5px]  transition-[0.4s] text-xs my-1"
                    >
                      <DatasetIcon
                        sx={{
                          color:
                            activeState.activeSubLink == "Enterdata"
                              ? color?.color
                              : themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f",
                        }}
                        fontSize="small"
                        className=" w-full "
                      ></DatasetIcon>
                    </li>
                  </Tooltip>
                  {props.props.userInfo?.actors
                    ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
                    .claims.filter((item: any) => item.key == "Timesheet" && item.value == "ReportViewer").length !=
                    0 && (
                    <Tooltip
                      className={themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                      placement="right"
                      content="Report"
                    >
                      <li
                        onClick={() => {
                          activeStore.setState((state) => ({ ...state, activeSubLink: "Report" })),
                            router.push("/Home/Report");
                        }}
                        className="p-[5px]  transition-[0.4s] text-xs my-1"
                      >
                        <ReceiptLongIcon
                          sx={{
                            color:
                              activeState.activeSubLink == "Report"
                                ? color?.color
                                : themeMode?.stateMode
                                ? "#bdbcbc"
                                : "#75634f",
                          }}
                          fontSize="small"
                          className=" w-full "
                        ></ReceiptLongIcon>
                      </li>
                    </Tooltip>
                  )}
                </ul>
              ) : null}
            </li>
          </Tooltip>
        )}
        {props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter((item: any) => item.key == "Education" && item.value == "Admin").length != 0 && (
          <Tooltip
            className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
            placement="right"
            content="Education"
          >
            <li className="flex flex-col items-end">
              <div
                onClick={() => {
                  activeStore.setState((state) => ({
                    ...state,
                    activate: state.activate == "Education" ? "" : "Education",
                    activeSubLink: "",
                  }));
                }}
                className={`${
                  activeState.activate === "Education"
                    ? `active ${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"}`
                    : ""
                } nav-item`}
              >
                <CastForEducationIcon
                  style={{
                    background: `${activeState.activate === "Education" ? color?.color : ""}`,
                    color: `${activeState.activate === "Education" ? "white" : ""}`,
                    borderRadius: "50%",
                    fontSize: "28px",
                  }}
                  className={`p-1 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                ></CastForEducationIcon>
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
              {activeState.activate === "Education" ? (
                <ul className="w-full flex flex-col items-center">
                  <Tooltip
                    className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                    placement="right"
                    content="Categories"
                  >
                    <li
                      onClick={() => {
                        activeStore.setState((state) => ({ ...state, activeSubLink: "Categories" })),
                          router.push("/Home/Category");
                      }}
                      className="p-[5px]  transition-[0.4s] text-xs my-1"
                    >
                      <CategoryIcon
                        sx={{
                          color:
                            activeState.activeSubLink == "Categories"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f",
                        }}
                        fontSize="small"
                        className=" w-full "
                      ></CategoryIcon>
                    </li>
                  </Tooltip>
                  <Tooltip
                    className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                    placement="right"
                    content="Courses"
                  >
                    <li
                      onClick={() => {
                        activeStore.setState((state) => ({ ...state, activeSubLink: "Courses" })),
                          router.push("/Home/Course");
                      }}
                      className="p-[5px]  transition-[0.4s] text-xs my-1"
                    >
                      <SchoolIcon
                        sx={{
                          color:
                            activeState.activeSubLink == "Courses"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f",
                        }}
                        fontSize="small"
                        className=" w-full "
                      ></SchoolIcon>
                    </li>
                  </Tooltip>
                  <Tooltip
                    className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                    placement="right"
                    content="Programs"
                  >
                    <li
                      onClick={() => {
                        activeStore.setState((state) => ({ ...state, activeSubLink: "Programs" })),
                          router.push("/Home/Program");
                      }}
                      className="p-[5px]  transition-[0.4s] text-xs my-1"
                    >
                      <BorderColorIcon
                        sx={{
                          color:
                            activeState.activeSubLink == "Programs"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f",
                        }}
                        fontSize="small"
                        className=" w-full "
                      ></BorderColorIcon>
                    </li>
                  </Tooltip>
                  {props.props.userInfo?.actors
                    ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
                    .claims.filter((item: any) => item.key == "EducationCertificate" && item.value == "Approver")
                    .length != 0 && (
                    <Tooltip
                      className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                      placement="right"
                      content="Final Issue"
                    >
                      <li
                        onClick={() => {
                          activeStore.setState((state) => ({ ...state, activeSubLink: "FinalIssue" })),
                            router.push("/Home/FinalIssue");
                        }}
                        className="p-[5px]  transition-[0.4s] text-xs my-1"
                      >
                        <VerifiedIcon
                          sx={{
                            color:
                              activeState.activeSubLink == "FinalIssue"
                                ? color?.color
                                : !themeMode || themeMode?.stateMode
                                ? "#bdbcbc"
                                : "#75634f",
                          }}
                          fontSize="small"
                          className=" w-full "
                        ></VerifiedIcon>
                      </li>
                    </Tooltip>
                  )}
                </ul>
              ) : null}
            </li>
          </Tooltip>
        )}

        {props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter((item: any) => item.key == "Automation").length != 0 && (
          <Tooltip
            className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
            placement="right"
            content="Automation"
          >
            <li className="flex flex-col items-end cursor-pointer">
              <div
                onClick={() => {
                  activeStore.setState((state) => ({
                    ...state,
                    activate: state.activate == "Automation" ? "" : "Automation",
                    activeSubLink: "",
                  }));
                }}
                className={`${
                  activeState.activate === `Automation`
                    ? `active ${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"}`
                    : ""
                } nav-item`}
              >
                <MailIcon
                  style={{
                    background: `${activeState.activate === `Automation` ? color?.color : ""}`,
                    color: `${activeState.activate === `Automation` ? "white" : ""}`,
                    borderRadius: "50%",
                    fontSize: "28px",
                  }}
                  className={`p-1 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                />
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
              {activeState.activate === "Automation" ? (
                <ul className="w-full flex flex-col items-center">
                  <Tooltip
                    className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                    placement="right"
                    content="New Document"
                  >
                    <li
                      onClick={() => {
                        handleNewDocument(),
                          activeStore.setState((state) => ({ ...state, activeSubLink: "New Document" }));
                      }}
                      className="p-[5px]  transition-[0.4s] text-xs my-1 cursor-pointer"
                    >
                      <NoteAddIcon
                        sx={{
                          color:
                            activeState.activeSubLink == "New Document"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f",
                        }}
                        fontSize="small"
                        className="w-full "
                      />
                    </li>
                  </Tooltip>
                  <Tooltip
                    className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                    placement="right"
                    content="Cartable"
                  >
                    <li
                      onClick={() => {
                        activeStore.setState((state) => ({ ...state, activeSubLink: "Cartable" })),
                          router.push("/Home/Cartable");
                      }}
                      className="p-[5px] transition-[0.4s] text-xs my-1 cursor-pointer"
                    >
                      <FolderOpenIcon
                        sx={{
                          color:
                            activeState.activeSubLink == "Cartable"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f",
                        }}
                        fontSize="small"
                        className="w-full "
                      />
                    </li>
                  </Tooltip>
                  <Tooltip
                    className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                    placement="right"
                    content="Archive"
                  >
                    <li
                      onClick={() => {
                        router.push("/Home/Archive"),
                          activeStore.setState((state) => ({ ...state, activeSubLink: "Archive" }));
                      }}
                      className="p-[5px]  transition-[0.4s] text-xs my-1 cursor-pointer"
                    >
                      <FolderSpecialIcon
                        sx={{
                          color:
                            activeState.activeSubLink == "Archive"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f",
                        }}
                        fontSize="small"
                        className="w-full "
                      />
                    </li>
                  </Tooltip>
                  <Tooltip
                    className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                    placement="right"
                    content="Search"
                  >
                    <li
                      onClick={() => {
                        router.push("/Home/Search"),
                          activeStore.setState((state) => ({ ...state, activeSubLink: "Search" }));
                      }}
                      className="p-[5px]  transition-[0.4s] text-xs my-1 cursor-pointer"
                    >
                      <SearchIcon
                        sx={{
                          color:
                            activeState.activeSubLink == "Search"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f",
                        }}
                        fontSize="small"
                        className="w-full "
                      />
                    </li>
                  </Tooltip>
                  <Tooltip
                    className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                    placement="right"
                    content="Group Management"
                  >
                    <li
                      onClick={() => {
                        router.push("/Home/GroupManagement"),
                          activeStore.setState((state) => ({ ...state, activeSubLink: "Group Management" }));
                      }}
                      className="p-[5px]  transition-[0.4s] text-xs my-1 cursor-pointer"
                    >
                      <GroupsIcon
                        sx={{
                          color:
                            activeState.activeSubLink == "Group Management"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f",
                        }}
                        fontSize="small"
                        className="w-full "
                      />
                    </li>
                  </Tooltip>
                  <Tooltip
                    className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                    placement="right"
                    content="Draft Management"
                  >
                    <li
                      onClick={() => {
                        router.push("/Home/DraftManagement"),
                          activeStore.setState((state) => ({ ...state, activeSubLink: "Draft Management" }));
                      }}
                      className="p-[5px]  transition-[0.4s] text-xs my-1 cursor-pointer"
                    >
                      <DescriptionIcon
                        sx={{
                          color:
                            activeState.activeSubLink == "Draft Management"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f",
                        }}
                        fontSize="small"
                        className="w-full "
                      />
                    </li>
                  </Tooltip>
                </ul>
              ) : null}
            </li>
          </Tooltip>
        )}

        {props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter((item: any) => item.key == "VesselPagesViewer").length != 0 && (
          <Tooltip
            className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
            placement="right"
            content="Vessels"
          >
            <li className="flex flex-col items-end">
              <div
                onClick={() => {
                  activeStore.setState((state) => ({
                    ...state,
                    activate: state.activate == "Vessels" ? "" : "Vessels",
                    activeSubLink: "",
                  }));
                }}
                className={`${
                  activeState.activate === "Vessels"
                    ? `active ${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"}`
                    : ""
                } nav-item`}
              >
                <DirectionsBoatFilledIcon
                  style={{
                    background: `${activeState.activate === "Vessels" ? color?.color : ""}`,
                    color: `${activeState.activate === "Vessels" ? "white" : ""}`,
                    borderRadius: "50%",
                    fontSize: "28px",
                  }}
                  className={`p-1 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                ></DirectionsBoatFilledIcon>
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
              {activeState.activate === "Vessels" ? (
                <ul className="w-full flex flex-col items-center">
                  <Tooltip
                    className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                    placement="right"
                    content="Status"
                  >
                    <li
                      onClick={() => {
                        activeStore.setState((state) => ({ ...state, activeSubLink: "Status" })),
                          router.push("/Home/Status");
                      }}
                      className="p-[5px]  transition-[0.4s] text-xs my-1"
                    >
                      <QueryStatsIcon
                        sx={{
                          color:
                            activeState.activeSubLink == "Status"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f",
                        }}
                        fontSize="small"
                        className=" w-full "
                      ></QueryStatsIcon>
                    </li>
                  </Tooltip>
                </ul>
              ) : null}
            </li>
          </Tooltip>
        )}

        {props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter((item: any) => item.key == "Audit").length != 0 && (
          <Tooltip
            className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
            placement="right"
            content="Audit"
          >
            <li className="flex flex-col items-end">
              <div
                onClick={() => {
                  activeStore.setState((state) => ({
                    ...state,
                    activate: state.activate == "Audit" ? "" : "Audit",
                    activeSubLink: "",
                  }));
                }}
                className={`${
                  activeState.activate === `Audit`
                    ? `active ${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"}`
                    : ""
                } nav-item`}
              >
                <ListAltIcon
                  style={{
                    background: `${activeState.activate === `Audit` ? color?.color : ""}`,
                    color: `${activeState.activate === `Audit` ? "white" : ""}`,
                    borderRadius: "50%",
                    fontSize: "28px",
                  }}
                  className={`p-1 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                ></ListAltIcon>
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
              {activeState.activate === "Audit" ? (
                <ul className="w-full flex flex-col items-center">
                  <Tooltip
                    className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                    placement="right"
                    content="Log Table"
                  >
                    <li
                      onClick={() => {
                        activeStore.setState((state) => ({ ...state, activeSubLink: "Log Table" })),
                          router.push("/Home/LogTable");
                      }}
                      className="p-[5px]  transition-[0.4s] text-xs my-1"
                    >
                      <InsertChartIcon
                        sx={{
                          color:
                            activeState.activeSubLink == "Log Table"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f",
                        }}
                        fontSize="small"
                        className=" w-full "
                      ></InsertChartIcon>
                    </li>
                  </Tooltip>
                </ul>
              ) : null}
            </li>
          </Tooltip>
        )}

        {props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter((item: any) => item.key == "ProjectManagement").length != 0 && (
          <Tooltip
            className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
            placement="right"
            content="Project Management"
          >
            <li className="flex flex-col items-end cursor-pointer">
              <div
                onClick={() => {
                  activeStore.setState((state) => ({
                    ...state,
                    activate: state.activate == "Project Management" ? "" : "Project Management",
                    activeSubLink: "",
                  }));
                }}
                className={`${
                  activeState.activate === `Project Management`
                    ? `active ${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"}`
                    : ""
                } nav-item`}
              >
                <BusinessCenterIcon
                  style={{
                    background: `${activeState.activate === `Project Management` ? color?.color : ""}`,
                    color: `${activeState.activate === `Project Management` ? "white" : ""}`,
                    borderRadius: "50%",
                    fontSize: "28px",
                  }}
                  className={`p-1 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                />
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
              {activeState.activate === "Project Management" ? (
                <ul className="w-full flex flex-col items-center">
                  <Tooltip
                    className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                    placement="right"
                    content="Initialize Project"
                  >
                    <li
                      onClick={() => {
                        activeStore.setState((state) => ({ ...state, activeSubLink: "Initialize Project" })),
                          router.push("/Home/InitializeProject");
                      }}
                      className="p-[5px]  transition-[0.4s] text-xs my-1 cursor-pointer"
                    >
                      <SettingsIcon
                        sx={{
                          color:
                            activeState.activeSubLink == "Initialize Project"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f",
                        }}
                        fontSize="small"
                        className=" w-full "
                      />
                    </li>
                  </Tooltip>
                </ul>
              ) : null}
            </li>
          </Tooltip>
        )}

        {/* <li onClick={() => activeStore.setState((state) => ({ ...state, activate: "Process production engine" }))} className='flex flex-col items-end cursor-pointer'  >
                    <div onClick={() => activeStore.setState((state) => ({ ...state, activate: "Process production engine", activeSubLink: "" }))} className={`${activeState.activate === "Process production engine" ? `active ${!themeMode ||themeMode?.stateMode ? 'contentDark' : 'contentLight'}` : ""} nav-item`}>
                        <AccountTreeIcon style={{ background: `${activeState.activate === "Process production engine" ? color?.color : ''}`, color: `${activeState.activate === "Process production engine" ? 'white' : ''}`, borderRadius: "50%", fontSize: "28px" }} className={`p-1 ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`} />
                        <div style={{ boxShadow: `0 20px 0 0 ${!themeMode ||themeMode?.stateMode === false ? '#eeeae6' : ' #22303c'}` }}></div>
                        <div style={{ boxShadow: `0 -20px 0 0 ${!themeMode ||themeMode?.stateMode === false ? '#eeeae6' : ' #22303c'}` }}></div>
                    </div>
                    {activeState.activate === "Process production engine" && (<ul className='w-full flex flex-col items-center' >
                        <li onClick={() => { activeStore.setState((state) => ({ ...state, activeSubLink: "process" })), router.push("/Home/ProcessProductionEng") }} className="p-[5px]  transition-[0.4s] text-xs my-1 cursor-pointer">
                            <AccountTreeIcon sx={{ color: activeState.activeSubLink == "process" ? color?.color : !themeMode ||themeMode?.stateMode ? "#bdbcbc" : '#75634f' }} fontSize='small' className=" w-full " />
                        </li>
                    </ul>)}
                </li> */}

        {props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter((item: any) => item.key == "Archive").length != 0 && (
          <Tooltip
            className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
            placement="right"
            content="Archive"
          >
            <li className="flex flex-col items-end cursor-pointer">
              <div
                onClick={() => {
                  activeStore.setState((state) => ({
                    ...state,
                    activate: state.activate == "Archive" ? "" : "Archive",
                    activeSubLink: "",
                  }));
                }}
                className={`${
                  activeState.activate === `Archive`
                    ? `active ${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"}`
                    : ""
                } nav-item`}
              >
                <ArchiveIcon
                  style={{
                    background: `${activeState.activate === `Archive` ? color?.color : ""}`,
                    color: `${activeState.activate === `Archive` ? "white" : ""}`,
                    borderRadius: "50%",
                    fontSize: "28px",
                  }}
                  className={`p-1 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                />
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
              {activeState.activate === "Archive" ? (
                <ul className="w-full flex flex-col items-center">
                  <Tooltip
                    className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                    placement="right"
                    content="Add Document"
                  >
                    <li
                      onClick={() => {
                        router.push("/Home/AddDocument"),
                          activeStore.setState((state) => ({
                            ...state,
                            activate: "Archive",
                            activeSubLink: "Add Document",
                          }));
                      }}
                      className="p-[5px]  transition-[0.4s] text-xs my-1 cursor-pointer"
                    >
                      <PostAddIcon
                        sx={{
                          color:
                            activeState.activeSubLink == "Add Document"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f",
                        }}
                        fontSize="small"
                        className=" w-full "
                      />
                    </li>
                  </Tooltip>
                  <Tooltip
                    className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                    placement="right"
                    content="View Document"
                  >
                    <li
                      onClick={() => {
                        router.push("/Home/ViewDocument"),
                          activeStore.setState((state) => ({
                            ...state,
                            activate: "Archive",
                            activeSubLink: "View Document",
                          }));
                      }}
                      className="p-[5px]  transition-[0.4s] text-xs my-1 cursor-pointer"
                    >
                      <VisibilityIcon
                        sx={{
                          color:
                            activeState.activeSubLink == "View Document"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f",
                        }}
                        fontSize="small"
                        className=" w-full "
                      />
                    </li>
                  </Tooltip>
                </ul>
              ) : null}
            </li>
          </Tooltip>
        )}

        {(props.props.userInfo?.actors
          ?.filter((item: any) => item.roleName == props.props.userInfo?.activeRole)[0]
          .claims.filter((item: any) => item.key == "Process").length != 0 ||
          //ignore condition for TEST
          true) && (
          <Tooltip
            className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
            placement="right"
            content="Process Engine"
          >
            <li className="flex flex-col items-end cursor-pointer">
              <div
                onClick={() => {
                  activeStore.setState((state) => ({
                    ...state,
                    activate: state.activate == "Process Engine" ? "" : "Process Engine",
                    activeSubLink: "",
                  }));
                }}
                className={`${
                  activeState.activate === `Process Engine`
                    ? `active ${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"}`
                    : ""
                } nav-item`}
              >
                <MemoryIcon
                  style={{
                    background: `${activeState.activate === `Process Engine` ? color?.color : ""}`,
                    color: `${activeState.activate === `Process Engine` ? "white" : ""}`,
                    borderRadius: "50%",
                    fontSize: "28px",
                  }}
                  className={`p-1 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                />
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
              {activeState.activate === "Process Engine" ? (
                <ul className="w-full flex flex-col items-center">
                  <Tooltip
                    className={!themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"}
                    placement="right"
                    content="Processes"
                  >
                    <li
                      onClick={() => {
                        router.push("/Home/process/processes"),
                          activeStore.setState((state) => ({
                            ...state,
                            activate: "Process Engine",
                            activeSubLink: "processes",
                          }));
                      }}
                      className="p-[5px]  transition-[0.4s] text-xs my-1 cursor-pointer"
                    >
                      <FormatShapesIcon
                        sx={{
                          color:
                            activeState.activeSubLink == "processes"
                              ? color?.color
                              : !themeMode || themeMode?.stateMode
                              ? "#bdbcbc"
                              : "#75634f",
                        }}
                        fontSize="small"
                        className=" w-full "
                      />
                    </li>
                  </Tooltip>
                </ul>
              ) : null}
            </li>
          </Tooltip>
          //   <li className="w-[100%]">
          //     <div
          //       onClick={(e: any) => handleToggle(e)}
          //       className={`${
          //         activeState.activate === "Process"
          //           ? `active ${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"}`
          //           : ""
          //       } nav-item cursor-pointer`}
          //     >
          //       <MemoryIcon
          //         style={{
          //           background: `${activeState.activate === "Process" ? color?.color : ""}`,
          //           color: `${activeState.activate === "Process" ? "white" : ""}`,
          //           borderRadius: "50%",
          //           fontSize: "30px",
          //         }}
          //         className={`p-1 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
          //       />
          //       <span className="px-[20px] select-none text-sm capitalize">Process Engine</span>
          //       <div
          //         style={{
          //           boxShadow: `0 20px 0 0 ${!themeMode || themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
          //         }}
          //       ></div>
          //       <div
          //         style={{
          //           boxShadow: `0 -20px 0 0 ${!themeMode || themeMode?.stateMode === false ? "#eeeae6" : " #22303c"}`,
          //         }}
          //       ></div>
          //     </div>
          //     {activeState.activate == "Process" ? (
          //       <ul className="mx-0 px-0 w-[100%] flex-wrap flex justify-end">
          //         <li
          //           onClick={() => {
          //             router.push("/Home/process/bpmn"),
          //               activeStore.setState((state) => ({
          //                 ...state,
          //                 activeSubLink: "bpmn",
          //               }));
          //           }}
          //           className="p-[5px] w-[92%] mx-auto transition-[0.4s] text-xs  my-1 cursor-pointer"
          //         >
          //           <FormatShapesIcon
          //             fontSize="small"
          //             sx={{
          //               color:
          //                 activeState.activeSubLink == "bpmn"
          //                   ? color?.color
          //                   : !themeMode || themeMode?.stateMode
          //                   ? "#bdbcbc"
          //                   : "#75634f",
          //               marginLeft: "20px",
          //             }}
          //           />
          //           <span
          //             style={{
          //               color: ` ${activeState.activeSubLink == "bpmn" ? color?.color : ""}`,
          //             }}
          //             className={`px-[8px] select-none opacity-90 capitalize ${
          //               !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
          //             } `}
          //           >
          //             bpmn
          //           </span>
          //         </li>
          //       </ul>
          //     ) : null}
          //   </li>
        )}

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
          className={`absolute top-0 min-h-[55vh] ${!themeMode || themeMode?.stateMode ? "cardDark" : "cardLight"}`}
          open={open}
          handler={handleNewDocument}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <DialogHeader
            dir="rtl"
            className={`${
              !themeMode || themeMode?.stateMode ? "cardDark lightText" : "cardLight darkText"
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
                setNewDocAutomationState((prev) => ({ ...prev, documentType: 1 }));
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
              {newDocAutomationState.documentType !== 4 && (
                <>
                  <Select2
                    isRtl
                    maxMenuHeight={220}
                    options={newDocAutomationState.layoutSize}
                    className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"} w-[100%] z-[900000]`}
                    placeholder="انتخاب قالب چاپ پیش فرض"
                    defaultValue={newDocAutomationState.layoutSize.find((item: LayoutsModel) => item.isMain == true)}
                    onChange={(option: any) => {
                      setNewDocAutomationState((state) => ({ ...state, formatId: option }));
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
                            key={"LayoutSize" + index}
                            crossOrigin=""
                            name="docSize"
                            color="blue-gray"
                            ripple={false}
                            className="border-blue-gray-600/10 bg-blue-gray-600/5 p-0 transition-all hover:before:opacity-0"
                            label={
                              <Typography
                                color="blue-gray"
                                className={`font-normal ${
                                  !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                                }`}
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
                            setNewDocAutomationState((state: any) => ({ ...state, draftId: option?.id }));
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
                              neutral80: `${!themeMode || themeMode?.stateMode ? "#bdbcbc" : "#75634f"}`,
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
      </ul>
    </>
  );
};
export default RoleClaimsMobile;
