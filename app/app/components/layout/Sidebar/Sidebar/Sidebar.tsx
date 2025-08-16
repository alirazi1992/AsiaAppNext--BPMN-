"use client";
import logo from "@/app/assets/images/Logo.png";
import styles from "@/app/assets/styles/Sidebar.module.css";
import ClearAllNotifications from "@/app/components/shared/ClearAllNotifs";
import Notification from "@/app/components/shared/notification";
import useAxios from "@/app/hooks/useAxios";
import useStore from "@/app/hooks/useStore";
import colorStore from "@/app/zustandData/color.zustand";
import NotifStore, { NotifMessageModel } from "@/app/zustandData/notif.zustand";
import themeStore from "@/app/zustandData/theme.zustand";
import useLoginUserInfoStore from "@/app/zustandData/useLoginUserInfo";
import { Card, Typography } from "@material-tailwind/react";
import "bootstrap-icons/font/bootstrap-icons.css";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// ***icon
import ProfileNotification from "@/app/components/shared/ProfileNotification";
import { ProfileDefectanceModel } from "@/app/models/HR/ProfileDefectanceModel";
import { Response } from "@/app/models/HR/sharedModels";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { AxiosResponse } from "axios";

type Props = {
  isOpen: boolean;
};

const DesktopSidebar: React.FC<Props> = ({ isOpen }) => {
  const { AxiosRequest } = useAxios();
  const userInformation = useLoginUserInfoStore();
  const { userInfo } = userInformation;
  const router = useRouter();
  const ProfilePic = useMemo(() => {
    return dynamic(() => import("./ProfilePic"), { ssr: false });
  }, []);
  const RoleClaimsDesktop = useMemo(() => {
    return dynamic(() => import("./RoleClaimsLg"), { ssr: false });
  }, []);
  const RoleClaimsMobile = useMemo(() => {
    return dynamic(() => import("./RoleClaimsSm"), { ssr: false });
  }, []);
  const BackLoginPage = () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/identity/account`;
    let data = {};
    let method = "delete";
    var res = AxiosRequest({ url, method, data, credentials: true }).then((res) => {
      useLoginUserInfoStore.persist.clearStorage();
      router.push("/");
    });
    return res;
  };
  const color = useStore(colorStore, (state) => state);
  const themeMode = useStore(themeStore, (state) => state);

  const Notif = NotifStore();

  useEffect(() => {
    (async () => {
      if (userInfo) {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetProfileDefectances?userId=${userInfo.actors?.[0].userId}`;
        let data = {};
        let method = "get";
        var res: AxiosResponse<Response<ProfileDefectanceModel[]>> = await AxiosRequest({
          url,
          method,
          data,
          credentials: true,
        });
        if (res.data.status) {
          if (res.data.data.length > 0) {
            // toast.warning(<ClearAllNotifications handleCloseAll={() => toast.dismiss()} />);
            toast.error((t) => (
              <ProfileNotification
                defects={res.data.data}
                handleClose={() => {
                  t.closeToast();
                }}
              />
            ));
          }
        }
      }
    })();
  }, [userInfo]);

  useEffect(() => {
    if (typeof Notif.connection?.state === "undefined") {
      Notif.connect();
    }
    toast.dismiss();
    if (Notif.notifs.length > 0) {
      toast.warning(<ClearAllNotifications />);
      Notif.notifs?.map((notif: NotifMessageModel) => {
        toast.info(<Notification notificationData={notif} />);
      });
    }
  }, [Notif]);

  return (
    <>
      <ToastContainer closeButton={false} autoClose={false} theme="colored" position="top-right" rtl={true} />

      <Card
        className={`${!themeMode || themeMode?.stateMode ? "themeDark" : "themeLight"}
            ${isOpen ? "w-72" : "w-20"}
             flex relative scroll max-h-screen overflow-scroll ease-out duration-[0.35s] rounded-none`}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <section className="min-h-screen w-[100%] flex flex-col overflow-auto">
          <section className="flex flex-wrap w-[100%] h-[70px] justify-around ">
            <figure className="my-auto w-[40px]">
              <Image className="w-[100%] h-[100%]" alt="AsiaApp-logo" src={logo} priority />
            </figure>
            {isOpen && (
              <Typography
                variant="h1"
                className={
                  "textLogo tracking-tighter text-3xl w-[150px]  my-auto justify-center font-bold " + styles.textLogo
                }
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                AsiaApp
              </Typography>
            )}
          </section>
          <section className="flex flex-col gap-4 flex-wrap w-[100%]  items-center justify-around">
            <span className={"w-full flex items-center justify-end cursor-pointer text-white "}>
              <PowerSettingsNewIcon
                style={{ background: color?.color }}
                onClick={BackLoginPage}
                className={`rounded-md mx-auto p-1 ${isOpen ? "mr-3" : "m-0"}`}
              />
            </span>
            <ProfilePic isMenuOpen={isOpen} />
          </section>
          <section
            className={`side-nav w-[100%] flex flex-wrap   overflow-y-auto flex-1 ${
              isOpen ? "justify-end" : "justify-center"
            }`}
          >
            {isOpen ? <RoleClaimsDesktop props={userInformation} /> : <RoleClaimsMobile props={userInformation} />}
          </section>
        </section>
      </Card>
    </>
  );
};

export default React.memo(DesktopSidebar);
