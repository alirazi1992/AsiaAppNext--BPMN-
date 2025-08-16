import activeStore from "@/app/zustandData/activate.zustand";
import { Typography } from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useStore from "../../../../hooks/useStore";
import colorStore from "../../../../zustandData/color.zustand";
import themeStore from "../../../../zustandData/theme.zustand";
import useLoginUserInfoStore from "../../../../zustandData/useLoginUserInfo";
import profile from "./../../../../assets/images/userPhoto.svg";
import UpdateUserStore, { UpdateUserData } from "./../../../../zustandData/updateUsers";
import UserRoleSelect, { UserRoleSelectButton } from "./UserRoleSelect";

type Props = {
  isMenuOpen: boolean;
};

export default function ProfilePic({ isMenuOpen }: Props) {
  const { userInfo } = useLoginUserInfoStore();

  const color = useStore(colorStore, (state) => state);
  const User = useStore(UpdateUserStore, (state) => state);
  const themeMode = useStore(themeStore, (state) => state);
  let base64String = userInfo?.profilePicture == null ? "" : `data:image/png;base64,${userInfo?.profilePicture}`;
  const router = useRouter();

  return (
    <div className={`flex flex-col gap-2 ${isMenuOpen ? "w-full px-4" : "items-center justify-center"} transition-all`}>
      <div className={`flex items-center  ${isMenuOpen ? "gap-4" : "gap-0 justify-center"}`}>
        <figure className="w-[55px] h-[55px]  overflow-hidden rounded-full">
          <Image
            onClick={() => {
              User?.setState((state: UpdateUserData) => ({ ...state, userName: null, userId: null })),
                router.push(`/Home/EditInformation`),
                activeStore.setState((state) => ({ ...state, activate: "HR", activeSubLink: "Edit Information" }));
            }}
            className="cursor-pointer"
            width={100}
            height={100}
            alt="asiaApp-user"
            src={userInfo?.profilePicture != null ? base64String : profile}
          />
        </figure>
        {isMenuOpen && (
          <section
            className={`${
              isMenuOpen ? "w-3/5 flex flex-wrap items-center gap-0 opacity-100" : "w-0 opacity-0 flex-col flex"
            } transition-all delay-200`}
          >
            {userInfo?.actors?.map((val: any, index: number) => {
              if (val.roleName == userInfo?.activeRole) {
                return (
                  <Typography
                    key={"user" + index}
                    className={`text-left my-auto font-[700] text-[13px] ${
                      !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                    }`}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {val.firstName + " " + val.lastName}
                  </Typography>
                );
              }
            })}
          </section>
        )}
      </div>
      {isMenuOpen ? (
        <section className="w-[100%] mt-3 opacity-100">
          <div className="relative flex  mx-auto">
            <UserRoleSelect />
          </div>
        </section>
      ) : (
        <UserRoleSelectButton />
      )}
    </div>
  );
}
