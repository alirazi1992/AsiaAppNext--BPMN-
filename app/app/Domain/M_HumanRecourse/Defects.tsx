export interface UsersModel {
  selectedUser: CategoryUserModel;
  alluser?: boolean;
}

export interface CategoryUserModel {
  faName: string;
  name: string;
  id: string;
}

export interface ProfileDefectanceOtherModel {
  id: string;
  title: string;
}

export interface FilterDefectsModel {
  setDefectances: any;
  setLoading: any;
}

export interface DefectanceModal {
  id: string;
  title: string;
  description: string;
  expiration: string;
}

export interface UserAsyncSelectModal {
  value?: any;
  onChange: (option: any) => void;
  defaultOptions?: any[];
  loadOptions: (inputValue: string) => Promise<any[]>;
  placeholder?: string;
  className?: string;
  selectRef?: React.Ref<any>;
}

export interface listDefacsUserModal {
  id: string;
  title: string;
  description: string;
  expiration?: string;
  faFirstName?: string;
  faLastName?: string;
}

export interface DefectsTableModal {
  data: listDefacsUserModal[] | undefined;
}

export interface DefectsUserModels {}

export interface ProfileDefectanceAllModel {
  id: string;
  title: string;
  faFirstName: string;
  faLastName: string;
  lastName: string;
  firstName: string;
  defectTypes: Array<{ name: string; faName: string }>;
}
