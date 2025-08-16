export interface Response<T> { status: boolean; message: string; data: T }

export interface OptionProps<T> {
  value: T;
  label: string;
}

export interface CustomerOptionProps extends OptionProps<number> {
  readonly faName: string;
  readonly name: string;
  readonly nationalCode: string;
  readonly id: number
}

export interface CustomerProps {
  id: number,
  name: string,
  faName: string,
  nationalCode: string
}

export interface InitialProjectModel {
  selectedCustomer: CustomerOptionProps | null
}


export interface JobOptionProps {
  readonly title: string;
  readonly faTitle: string;
  readonly createDate: string;
  readonly subJob: RelatingJob | null;
  readonly relatedJob: RelatingJob | null;
  readonly organizationId: number;
  readonly id: number
  readonly isActive: boolean
}

export interface WorkOrderOptionProps {
  readonly title: string;
  readonly faTitle: string;
  readonly createDate: string;
  readonly jobId: number;
  readonly id: number
}

export interface JobsProps {
  id: number,
  title: string,
  faTitle: string,
  subJob: SearchJobsRelatingJob | null,
  relatedJob: SearchJobsRelatingJob | null
}

export interface RelatingJob extends OptionProps<number> {
  id: number;
  faTitle: string
}

export interface SelectJobProps extends OptionProps<number> {
  readonly Title: string;
  readonly FaTitle: string;
  readonly SubJob: RelatingJob | null;
  readonly RelatedJob: RelatingJob | null;
  readonly Id: number;
}

export interface AddJobParamsModel {
  Title: string,
  FaTitle: string,
  RelatedJobId: number | null,
  IsActive: boolean
}

export interface UpdateJobParamsModel {
  Title: string,
  FaTitle: string,
  RelatedJobId: number | null,
  IsActive: boolean
}

export interface AddJobModel {
  orgId: number,
  faTitle: string,
  title: string,
  relatedJobId: number | null,
  isActive: boolean
}

export interface UpdateJobModel {
  orgId: number,
  faTitle: string,
  title: string,
  relatedJobId: number | null,
  isActive: boolean,
  id: number
}

export interface SearchJobsRelatingJob {
  id: number
  title: string
  faTitle: string
  organizationFaName: string | null
  organizationName: string | null
  organizationId: number
}

export interface AddingWorkOrder {
  Title: string | null
  FaTitle: string | null
}

export interface AddWorkOrderModel {
  JobId: number | null,
  FaTitle: string | null,
  Title: string | null
}

export interface AddWorkOrderResultModel {
  id: number,
  jobId: number,
  title: string,
  faTitle: string,
  createDate: string
}

export interface EditWorkOrderResponse {
  id: number,
  title: string,
  faTitle: string
}

export interface LoadingModel {
  jobTable: boolean,
  workOrderTable: boolean,
  editJob: boolean,
  editWororder: boolean
}

export interface LoadingModel {
  jobTable: boolean,
  workOrderTable: boolean,
  editJob: boolean,
  editWororder: boolean
}

export interface PartnersItemsList {

  id: number | null,
  title: string,
  sharePercent: number,
  isOrginalOwner: boolean,
  organizationId: number

}

export interface ResponseAddPartner {
  id: number,
  orgId: number
}

