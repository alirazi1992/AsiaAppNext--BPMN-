export interface Process {
  id: string;
  name: string;
  description: string;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  owner: string;
}

export interface Process {
  id: string;
  name: string;
  description: string;
  modules: Module[];
  status?: "active" | "inactive" | "archived";
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Process {
  id: string;
  name: string;
  description: string;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  type: string;
  isActive: boolean;
}
