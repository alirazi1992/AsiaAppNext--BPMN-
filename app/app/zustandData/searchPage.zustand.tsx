

import { create } from 'zustand';
import {SearchInputs} from './../models/Automation/SearchModel'

const InitialInputs: SearchInputs = {
  Indicator: "",
  SubmitIndicator: "",
  ImportSubmitNo: "",
  CreateDateAfter: null,
  CreateDateBefore: null,
  SignDateAfter: null,
  SignDateBefore: null,
  SubmitDateAfter: null,
  SubmitDateBefore: null,
  ImportSubmitDateAfter: null,
  ImportSubmitDateBefore: null,
  Subject: "",
  DocTypeId: {
    label: '',
    value: 0
  },
  Passage: "",
  Keyword: "",
  MainReceiver: "",
  CopyReceiver: "",
  Sender: "",
  IsRevoked: false
}

type Store = {
  Inputs: SearchInputs;
  SetInputs: (searchInputs: SearchInputs) => void;
};

const useStore = create<Store>((set) => ({
  Inputs: InitialInputs,
  SetInputs: (newInputs) => set((state) => ({ ...state, Inputs: newInputs })),
}));

export default useStore;

