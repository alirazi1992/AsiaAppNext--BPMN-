import useStore from "@/app/hooks/useStore";
import {
  CategoriesProps,
  CustomerOptionProps,
  CustomerProps,
  JobOptionProps,
  JobsProps,
  WorkOrderProps,
} from "@/app/models/Archive/ViewDocumentFormModels";
import serverCall from "@/app/Utils/serverCall";
import ArchiveJobFilterStore from "@/app/zustandData/ArchiveJobFilter.zustand";
import colorStore from "@/app/zustandData/color.zustand";
import themeStore from "@/app/zustandData/theme.zustand";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Tab,
  Tabs,
  TabsHeader,
  Tooltip,
} from "@material-tailwind/react";
import CloseIcon from "@mui/icons-material/Close";
import PeopleIcon from "@mui/icons-material/People";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import WorkIcon from "@mui/icons-material/Work";
import { CircularProgress, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select, { ActionMeta, SingleValue } from "react-select";
import AsyncSelect from "react-select/async";
import useSWR, { mutate } from "swr";
import { useArchiveDocumentInfo } from "./ArchiveDocumentInfoContext";
import Swal from "sweetalert2";
import { createKeyForSwrRequest } from "./utilityFunctions";
import { ViewDocumentListTableModel } from "@/app/models/Archive/ViewDocumentListTable";

type Props = {
  open: boolean;
  handleOpen: () => void;
};
type FormItemType = {
  categoryId: number;
  workOrderId: number | undefined;
  jobId: number;
};

const TransferAllListDialog = ({ open, handleOpen }: Props) => {
  let customerTimeOut: any;
  let jobTimeOut: any;
  const themeMode = useStore(themeStore, (state) => state);
  const themeIsNotActive = !themeMode || themeMode?.stateMode;

  const color = useStore(colorStore, (state) => state);
  const [searchBased, setSearchBased] = useState<"Customer" | "Job">("Customer");
  const [selectStates, setSelectStates] = useState<{
    orgs: any;
    jobs: any;
    workOrders: WorkOrderProps[];
    orgId: number;
    jobId: number;
    workOrderId: number;
  }>({
    orgs: [],
    jobs: [],
    workOrders: [],
    orgId: 0,
    jobId: 0,
    workOrderId: 0,
  });

  const { data, isLoading } = useSWR<ServerResponse<CategoriesProps[]>, Error, string>(
    "categories",
    () => serverCall("archive/Manage/Categories"),
    {
      revalidateOnFocus: false, // don't revalidate on window focus
      revalidateOnReconnect: false, // don't revalidate when reconnecting
      refreshInterval: 0, // don't poll the server
      dedupingInterval: 1000 * 60 * 60 * 24, // cache for 24 hours
    }
  );

  const filterSearchCustomers = async (searchInputValue: string) => {
    if (Boolean(searchInputValue?.trim())) {
      let res: ServerResponse<CustomerProps[]> = await serverCall(
        `identity/manage/searchCustomers?searchkey=${searchInputValue}`,
        {
          method: "GET",
          withCredentials: true,
        }
      );
      let options: CustomerOptionProps[] =
        res.data != null
          ? res.data?.map((item: CustomerProps, index: number) => {
              return {
                value: item.id,
                label: item.faName + ` _ ` + item.nationalCode,
                name: item.name,
                faName: item.faName,
                nationalCode: item.nationalCode,
                id: item.id,
              };
            })
          : [];
      return options.filter((i: CustomerOptionProps) => i.label.toLowerCase().includes(searchInputValue.toLowerCase()));
    } else {
      return [];
    }
  };
  const loadSearchedCustomerOptions = (
    searchinputValue: string,
    callback: (options: CustomerOptionProps[]) => void
  ) => {
    clearTimeout(customerTimeOut);
    customerTimeOut = setTimeout(async () => {
      callback(await filterSearchCustomers(searchinputValue));
    }, 1000);
  };

  const filterSearchJobs = async (searchInputValue: string) => {
    setSelectStates((state) => ({ ...state, jobs: [], workOrders: [] }));

    if (Boolean(searchInputValue?.trim())) {
      let resJobs: ServerResponse<JobsProps[]> = await serverCall(
        `base/manage/SearchJobs?searchKey=${searchInputValue}`,
        {
          method: "GET",
          withCredentials: true,
        }
      );
      let options: JobOptionProps[] = resJobs.data.map((item: JobsProps, index: number) => {
        return {
          value: item.id,
          label: item.isActive ? item.faTitle : "غیر فعال - " + item.faTitle,
          organizationId: item.organizationId,
          createDate: item.createDate,
          subJob: item.subJob,
          relatedJob: item.relatedJob,
          faTitle: item.faTitle,
          title: item.title,
          isActive: item.isActive,
        };
      });
      return options.filter((i: JobOptionProps) => i.label.toLowerCase().includes(searchInputValue.toLowerCase()));
    } else {
      return [];
    }
  };
  const loadSearchedJobsOptions = (searchinputValue: string, callback: (options: JobOptionProps[]) => void) => {
    clearTimeout(jobTimeOut);
    jobTimeOut = setTimeout(async () => {
      callback(await filterSearchJobs(searchinputValue));
    }, 1000);
  };

  const { activeTabId } = useArchiveDocumentInfo();

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
    watch,
  } = useForm<FormItemType>({
    defaultValues: {
      categoryId: activeTabId,
      workOrderId: undefined,
    },
    mode: "all",
    // resolver: yupResolver(transferAllDocumentSchema),
  });

  async function onSubmit(values: FormItemType) {
    const { entity, data } = createRequest(values, activeTabId);
    const result = await serverCall(`archive/Manage/${entity}`, {
      method: "POST",
      data: data,
    });

    // refetch table data with swr
    const requestKey = createKeyForSwrRequest(selectStates.jobId, selectStates.workOrderId);
    const response = await mutate(
      requestKey,
      serverCall<ViewDocumentListTableModel[]>(requestKey, {
        method: "GET",
        withCredentials: true,
      }),
      true
    );
    if (response) {
      // update ArchiveJobFilterStore with new Data
      ArchiveJobFilterStore.setState((state) => ({
        ...state,
        ViewDocumentList: response.data.map((item: ViewDocumentListTableModel) => {
          return {
            id: item.id,
            title: item.title,
            name: item.name,
            isFile: item.isFile,
            attacher: item.attacher,
            archiveCategoryId: item.archiveCategoryId,
            createDate: item.createDate,
            type: item.type,
            docHeapId: item.docHeapId,
            workOrderId: item.workOrderId,
            jobId: item.jobId,
            attachmentTypeId: item.attachmentTypeId,
            extraInfo: item.extraInfo,
          };
        }),
      }));
    }
    handleOpen();
    if (result.status === false) {
      Swal.fire({
        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
        allowOutsideClick: false,
        title: "خطا در انجام عملیات",
        text: result.message,
        icon: "error",
        confirmButtonColor: "#ee8888",
        confirmButtonText: "خروج",
      });
    }
  }
  const filterGetWorkOrder = useCallback(async () => {
    let resLoadWorkOrder: ServerResponse<WorkOrderProps[]> = await serverCall(
      `base/manage/GetWorkOrders?jobId=${selectStates.jobId}`,
      {
        method: "GET",
        withCredentials: true,
      }
    );
    if (resLoadWorkOrder && resLoadWorkOrder.status == true) {
      setSelectStates((state) => ({
        ...state,
        workOrders: resLoadWorkOrder.data && resLoadWorkOrder.data.length > 0 ? resLoadWorkOrder.data : [],
      }));
    }
  }, [selectStates.jobId]);

  const filterGetJobs = useCallback(async () => {
    let resLoadJobs: ServerResponse<JobsProps[]> = await serverCall(`base/manage/GetJobs?orgId=${selectStates.orgId}`, {
      method: "GET",
      withCredentials: true,
    });
    if (resLoadJobs.data != null && resLoadJobs.data.length > 0 && resLoadJobs.status == true) {
      setSelectStates((state) => ({
        ...state,
        jobs: resLoadJobs.data.map((item: JobsProps, index: number) => {
          return {
            value: item.id,
            label: item.isActive ? item.faTitle : "غیر فعال - " + item.faTitle,
            organizationId: item.organizationId,
            createDate: item.createDate,
            subJob: item.subJob,
            relatedJob: item.relatedJob,
            faTitle: item.faTitle,
            title: item.title,
            isActive: item.isActive,
          };
        }),
      }));
    }
  }, [selectStates.orgId]);

  useEffect(() => {
    selectStates.orgId && selectStates.orgId != null ? filterGetJobs() : null;
  }, [selectStates.orgId, filterGetJobs]);

  const filterGetOrganizaion = useCallback(async () => {
    let resLoadOrganizaton: ServerResponse<CustomerProps> = await serverCall(
      `identity/manage/searchorganizations?jobId=${selectStates.jobId}`,
      {
        method: "GET",
        withCredentials: true,
      }
    );
    setSelectStates((state) => ({
      ...state,
      orgs: resLoadOrganizaton.data
        ? {
            value: resLoadOrganizaton.data.id,
            label: resLoadOrganizaton.data.faName + "ـ" + resLoadOrganizaton.data.nationalCode,
            nationalCode: resLoadOrganizaton.data.nationalCode,
            name: resLoadOrganizaton.data.name,
            faName: resLoadOrganizaton.data.faName,
            id: resLoadOrganizaton.data.id,
          }
        : undefined,
    }));
  }, [selectStates.jobId]);

  useEffect(() => {
    selectStates.jobId && selectStates.jobId != null
      ? (searchBased == "Customer" ? filterGetWorkOrder() : filterGetOrganizaion(), filterGetWorkOrder())
      : null;
  }, [selectStates.jobId, filterGetOrganizaion, filterGetWorkOrder, searchBased, selectStates.workOrderId]);

  return (
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
      className={`${themeIsNotActive ? "cardDark" : "cardLight"} absolute top-0 overflow-y-auto min-h-[600px] `}
      size="md"
      open={open}
      handler={handleOpen}
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <DialogHeader
        dir="rtl"
        className={`${themeIsNotActive ? "cardDark lightText" : "cardLight darkText"} flex gap-2  sticky top-0 left-0 `}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <IconButton
          variant="text"
          color="blue-gray"
          onClick={() => {
            handleOpen();
          }}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6">انتقال همه</Typography>
      </DialogHeader>
      <DialogBody
        className="w-full"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <form dir="rtl" onSubmit={handleSubmit(onSubmit)} className="relative ">
          <Tabs dir="ltr" value="Customer" className="mb-3">
            <TabsHeader
              className={`${themeIsNotActive ? "contentDark" : "contentLight"} max-w-[100px]`}
              indicatorProps={{
                style: {
                  background: color?.color,
                  color: "white",
                },
                className: `shadow !text-gray-900`,
              }}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Tab
                onClick={() => {
                  setSearchBased("Customer"),
                    setSelectStates({
                      jobId: 0,
                      jobs: [],
                      orgId: 0,
                      orgs: [],
                      workOrderId: 0,
                      workOrders: [],
                    });
                }}
                value="Customer"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <Tooltip
                  className={themeIsNotActive ? "cardDark" : "cardLight"}
                  content="جستجو براساس مشتریان"
                  placement="top"
                >
                  <PeopleIcon
                    className={`${themeIsNotActive ? "lightText" : "darkText"}`}
                    style={{ color: `${searchBased == "Customer" ? "white" : ""}` }}
                  />
                </Tooltip>
              </Tab>
              <Tab
                onClick={() => {
                  setSearchBased("Job"),
                    setSelectStates({
                      jobId: 0,
                      jobs: [],
                      orgId: 0,
                      orgs: [],
                      workOrderId: 0,
                      workOrders: [],
                    });
                }}
                value="Job"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <Tooltip
                  className={themeIsNotActive ? "cardDark" : "cardLight"}
                  content="جستجو براساس کارها"
                  placement="top"
                >
                  <WorkIcon
                    className={`${themeIsNotActive ? "lightText" : "darkText"}`}
                    style={{ color: `${searchBased == "Job" ? "white" : ""}` }}
                  />
                </Tooltip>
              </Tab>
            </TabsHeader>
          </Tabs>
          <section dir="rtl" className="grid grid-cols-1 gap-y-3 gap-x-1">
            {searchBased == "Customer" ? (
              <AsyncSelect
                maxMenuHeight={250}
                isRtl
                className={`${themeIsNotActive ? "lightText" : "darkText"} w-[100%] `}
                cacheOptions
                defaultOptions
                placeholder="مشتریان"
                loadOptions={loadSearchedCustomerOptions}
                onChange={(option: SingleValue<CustomerOptionProps>, actionMeta: ActionMeta<CustomerOptionProps>) => {
                  setSelectStates((state) => ({ ...state, orgId: option!.value }));
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
                    neutral0: `${themeIsNotActive ? "#1b2b39" : "#ded6ce"}`,
                    neutral80: `${themeIsNotActive ? "white" : "#463b2f"}`,
                  },
                })}
              />
            ) : (
              <Select
                isRtl
                isSearchable
                maxMenuHeight={220}
                className={`${themeIsNotActive ? "lightText" : "darkText"} w-[100%] disabled:opacity-5 `}
                placeholder="مشتریان"
                value={selectStates.orgs}
                // ref={SelectCustomerRef}
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
                    neutral0: `${themeIsNotActive ? "#1b2b39" : "#ded6ce"}`,
                    neutral80: `${themeIsNotActive ? "white" : "#463b2f"}`,
                  },
                })}
              />
            )}
            {searchBased == "Customer" ? (
              <Select
                isRtl
                id="JobsInput"
                isSearchable
                // ref={SelectJobsRef}
                maxMenuHeight={220}
                className={`${themeIsNotActive ? "lightText" : "darkText"} w-[100%] `}
                placeholder="کارها"
                options={selectStates.jobs}
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
                    neutral0: `${themeIsNotActive ? "#1b2b39" : "#ded6ce"}`,
                    neutral80: `${themeIsNotActive ? "white" : "#463b2f"}`,
                  },
                })}
                onChange={(option: JobOptionProps | null, actionMeta: ActionMeta<JobOptionProps>) => {
                  {
                    setSelectStates((state) => ({ ...state, jobId: option!.value })), setValue("jobId", option!.value);
                  }
                }}
              />
            ) : (
              <AsyncSelect
                isRtl
                className={`${themeIsNotActive ? "lightText" : "darkText"} w-[100%] `}
                cacheOptions
                defaultOptions
                placeholder="کارها"
                loadOptions={loadSearchedJobsOptions}
                maxMenuHeight={250}
                onChange={(option: SingleValue<JobOptionProps>, actionMeta: ActionMeta<JobOptionProps>) => {
                  setSelectStates((state) => ({ ...state, jobId: option!.value })), setValue("jobId", option!.value);
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
                    neutral0: `${themeIsNotActive ? "#1b2b39" : "#ded6ce"}`,
                    neutral80: `${themeIsNotActive ? "white" : "#463b2f"}`,
                  },
                })}
              />
            )}
            <Select
              key={watch("jobId") ?? "workOrderSelect"}
              isRtl
              isClearable
              maxMenuHeight={220}
              className={`${themeIsNotActive ? "lightText" : "darkText"} w-[100%] `}
              placeholder="خدمات"
              options={selectStates.workOrders}
              isDisabled={!watch("jobId")}
              getOptionLabel={(option) => option.faTitle}
              value={selectStates.workOrders?.find((option) => option.id === watch("workOrderId"))}
              onChange={(option: SingleValue<CategoriesProps>, actionMeta: ActionMeta<CategoriesProps>) => {
                setValue("workOrderId", option?.id);
              }}
              isOptionSelected={(option) => option.id === watch("workOrderId")}
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
                  neutral0: `${themeIsNotActive ? "#1b2b39" : "#ded6ce"}`,
                  neutral80: `${themeIsNotActive ? "white" : "#463b2f"}`,
                },
              })}
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: state.isDisabled ? "none" : base.backgroundColor, // transparent when disabled
                  cursor: state.isDisabled ? "not-allowed" : "default",
                  color: state.isDisabled ? "#fefefe11" : base.color,
                  borderColor: state.isDisabled ? "#000" : base.color,
                }),
                singleValue: (base, state) => ({
                  ...base,
                  color: state.isDisabled ? "#red" : base.color,
                }),
                placeholder: (base, state) => ({
                  ...base,
                  color: state.isDisabled ? "#blue" : base.color,
                }),
              }}
            />
            <Select
              isRtl
              isClearable={false}
              maxMenuHeight={220}
              className={`${themeIsNotActive ? "lightText" : "darkText"} w-[100%] `}
              placeholder="دسته بندی"
              options={data?.data ? [...data.data] : []}
              isLoading={isLoading}
              getOptionLabel={(option) => option.faTitle}
              value={data?.data?.find((option) => option.id === watch("categoryId"))}
              onChange={(option: SingleValue<CategoriesProps>, actionMeta: ActionMeta<CategoriesProps>) => {
                setValue("categoryId", option?.id!);
              }}
              isOptionSelected={(option) => option.id === watch("categoryId")}
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
                  neutral0: `${themeIsNotActive ? "#1b2b39" : "#ded6ce"}`,
                  neutral80: `${themeIsNotActive ? "white" : "#463b2f"}`,
                },
              })}
              required
            />
          </section>
          <div className="w-full flex justify-center mt-4">
            <Button
              type="submit"
              size="sm"
              style={{ background: color?.color }}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              placeholder=""
              className="flex gap-2 items-center justify-center font-normal"
              variant="filled"
              color={color?.color}
              disabled={!watch("categoryId") || isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={18} /> : <SyncAltIcon sx={{ transform: "scale(0.8)" }} />}
              انتقال
            </Button>
          </div>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default TransferAllListDialog;

/**
 * Creates an API request payload based on the form data and currently active category ID.
 *
 * The request entity and structure depend on the presence of `workOrderId` in both the `formData`
 * and the internal filter store (`ArchiveJobFilterStore`). It supports 4 different transfer types:
 *
 * - `TransferBulkWorkOrderToWorkOrder`
 * - `TransferBulkJobToWorkorder`
 * - `TransferBulkWorkOrderToJob`
 * - `TransferBulkJobToJob`
 *
 * The correct entity and data payload are selected based on the logic:
 *
 * - If both form and store have `workOrderId` → transfer work order to work order.
 * - If only store has `workOrderId` → transfer job to work order.
 * - If only form has `workOrderId` → transfer work order to job.
 * - If neither has `workOrderId` → transfer job to job.
 *
 * @param {FormItemType} formData - The form input values, including optional `workOrderId` or `jobId`.
 * @param {number} activeCategoryId - The ID of the currently selected archive category.
 *
 * @returns {{
 *   entity: 'TransferBulkWorkOrderToWorkOrder' |
 *           'TransferBulkJobToWorkorder' |
 *           'TransferBulkWorkOrderToJob' |
 *           'TransferBulkJobToJob',
 *   data: {
 *     archiveIds: any[], // Adjust type if known
 *     categoryId: number,
 *     workOrderId?: number,
 *     jobId?: number,
 *   }
 * }} The request object to be sent to the backend API.
 *
 * @throws {Error} If none of the expected conditions match, indicating an unexpected app state.
 */

function createRequest(formData: FormItemType, activeCategoryId: number) {
  const filterStore = ArchiveJobFilterStore.getState();
  const allFilteredArchiveIds = filterStore.ViewDocumentList.filter(
    (doc) => Number(doc.archiveCategoryId) === activeCategoryId
  ).map((archive) => archive.id);
  const categoryId = formData.categoryId;

  if (formData.workOrderId && filterStore.WorkOrderId) {
    return {
      entity: "TransferBulkWorkOrderToWorkOrder",
      data: {
        archiveIds: allFilteredArchiveIds,
        workOrderId: formData.workOrderId,
        categoryId,
      },
    };
  }

  if (formData.workOrderId && !filterStore.WorkOrderId) {
    return {
      entity: "TransferBulkJobToWorkorder",
      data: {
        archiveIds: allFilteredArchiveIds,
        workOrderId: formData.workOrderId,
        categoryId,
      },
    };
  }

  if (!formData.workOrderId && filterStore.WorkOrderId) {
    return {
      entity: "TransferBulkWorkOrderToJob",
      data: {
        archiveIds: allFilteredArchiveIds,
        jobId: formData.jobId,
        categoryId,
      },
    };
  }

  if (!formData.workOrderId && !filterStore.WorkOrderId) {
    return {
      entity: "TransferBulkJobToJob",
      data: {
        archiveIds: allFilteredArchiveIds,
        jobId: formData.jobId,
        categoryId,
      },
    };
  }

  throw new Error(
    `unexpected state happened! formData workerId: ${formData.workOrderId},  search workerId: ${filterStore.WorkOrderId}`
  );
}
