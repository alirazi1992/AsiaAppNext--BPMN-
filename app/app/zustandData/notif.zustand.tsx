import { create } from "zustand";
import { persist } from "zustand/middleware";
import uuid from "./../../node_modules/react-uuid";

import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import moment from "jalali-moment";

export interface NotifModel {
  notifs: NotifMessageModel[];
  connection: HubConnection | null;
  connect(): void;
  disconnect(): void;
  setData: (newData: NotifMessageModel) => void;
  removeMessage: (index: string) => void;
  removeAll: () => void;
}

export interface NotifMessageModel {
  index: string;
  indicatorNumber: string;
  subject: string;
  sender: string;
  open: boolean;
  receiveDate: string;
  docHeapId?: string;
  docTypeId?: string;
}

const initialState: NotifModel = {
  notifs: [],
  connection: null,
  connect: () => {},
  disconnect: () => {},
  setData: (newData) => {},
  removeMessage: (index) => {},
  removeAll: () => {},
};

const useStore = create<NotifModel>()(
  persist(
    (set) => ({
      ...initialState,
      connect: () => {
        set((state) => {
          let con: HubConnection = new HubConnectionBuilder()
            .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/notificationhub`)
            .withAutomaticReconnect()
            .build();
          con.start();
          con.on("GetNotification", (sender, indicatorNumber, subject, docHeapId, docTypeId) => {
            let newNotif: NotifMessageModel = {
              sender,
              indicatorNumber,
              subject,
              docHeapId,
              docTypeId,
              open: true,
              index: uuid(),
              receiveDate: moment(new Date(), "YYYY/MM/DD HH:mm:ss").locale("fa").format("jYYYY/jMM/jDD HH:mm:ss"),
            };
            useStore.setState((state) => ({
              ...state,
              notifs: [...state.notifs, newNotif],
            }));
          });
          con.on("GetDefectances", (sender, subject, defectences) => {
            // let newNotif: NotifMessageModel = {
            //   sender,
            //   indicatorNumber,
            //   subject,
            //   open: true,
            //   index: uuid(),
            //   receiveDate: moment(new Date(), 'YYYY/MM/DD HH:mm:ss').locale('fa').format("jYYYY/jMM/jDD HH:mm:ss")
            // }
            // useStore.setState((state) => ({
            //   ...state,
            //   notifs: [...state.notifs, newNotif]
            // }))
          });
          return {
            ...state,
            connection: con,
          };
        });
      },
      disconnect: () => {
        set((state) => {
          state.connection!.stop();
          return {
            ...state,
          };
        });
      },
      setData: (newData) => {
        set((state) => ({
          ...state,
          notifs: [...state.notifs, newData],
        }));
      },
      removeMessage: (index) => {
        set((state) => {
          let x = state.notifs;
          let position = x.indexOf(x.find((p) => p.index == index)!);
          x.splice(position, 1);
          return {
            ...state,
            notifs: x,
          };
        });
      },
      removeAll: () => {
        set((state) => {
          return {
            ...state,
            notifs: [],
          };
        });
      },
    }),
    {
      name: "Notif-storage",
    }
  )
);

export default useStore;
