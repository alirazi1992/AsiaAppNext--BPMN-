export interface Response<T> { status: Boolean; message: String; data: T }

export interface CustomerProps {
  id: number,
  name: string,
  faName: string,
  nationalCode: string
}

export interface CustomerOptionProps extends OptionProps<number> {
  readonly faName: string;
  readonly name: string;
  readonly nationalCode: string;
  readonly id: number
}

export interface JobsProps {
  id: number,
  organizationId: number,
  title: string,
  faTitle: string,
  createDate: string,
  subJob?: any,
  relatedJob?: any,
  isActive: boolean
}

export interface JobOptionProps extends OptionProps<number> {
  readonly title: string;
  readonly faTitle: string;
  readonly createDate: string;
  readonly subJob?: any;
  readonly relatedJob?: any;
  readonly organizationId: number;
  readonly isActive: boolean
}

export interface WorkOrderProps {
  id: number,
  jobId: number,
  title: string,
  faTitle: string,
  createDate: string,
}

export interface WorkOrderOptionProps extends OptionProps<number> {
  readonly title: string;
  readonly faTitle: string;
  readonly createDate: string;
  readonly jobId: number;
}


export interface OptionProps<T> {
  readonly value: T;
  readonly label: string;
}
export interface CategoriesProps {
  id: number,
  title: string,
  faTitle: string
}

export interface ICategoriesOptionProps extends OptionProps<number> {
  readonly title: string
}

export class CategoriesOptionProps implements ICategoriesOptionProps {
  readonly value;
  readonly label;
  readonly title;

  constructor(value: number, label: string, title: string) {
    this.value = value;
    this.label = label;
    this.title = title;
  }
}

export interface viewDocumentFormDataModel {
  searchBased: string,
  orgs?: CustomerOptionProps;
  jobs: JobOptionProps[];
  orgId?: number;
  workOrder: WorkOrderOptionProps[];
  jobId?: number;
  workOrderId?: number;
  subJob?: any;
  relatedJob?: any;
  docType: boolean
}
