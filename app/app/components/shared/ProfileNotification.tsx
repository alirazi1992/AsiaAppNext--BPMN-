"use client";
import { ProfileDefectanceModel } from "@/app/models/HR/ProfileDefectanceModel";
import { Typography } from "@material-tailwind/react";
import CloseIcon from "@mui/icons-material/Close";
import moment from "jalali-moment";

type Props = {
  defects: ProfileDefectanceModel[];
  handleClose: () => void;
};

const ProfileNotification = ({ defects, handleClose }: Props) => {
  return (
    <section className="text-[13px] text-white font-thin">
      <section className="flex justify-around items-center mb-4">
        <Typography
          variant="paragraph"
          className=" text-[15px] w-[90%] text-white"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          نواقص پروفایل
        </Typography>
        <button
          onClick={() => {
            // Notif.removeMessage(defects.index);
            handleClose();
          }}
          type="button"
          className=" text-gray-400 hover:text-gray-100 rounded-md focus:ring-2 focus:ring-gray-200 p-1.5 inline-flex items-center justify-center w-5 h-5 dark:text-gray-300 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <CloseIcon />
        </button>
      </section>
      <p>
        <span className="mx-2 text-white">فرستنده: مدیر سیستم</span>
        {/* {defects.sender} */}
      </p>
      {defects?.map((def: any, index: number) => {
        return (
          <p key={index}>
            <span className="mx-2 text-white">
              نام: {def.faName}
              {def.expireDate != null
                ? " - تاریخ انقضا: " + moment.from(def.expireDate, "en", "YYYY-MM-DD").format("jYYYY/jMM/jDD")
                : ""}
            </span>
          </p>
        );
      })}
    </section>
  );
};

export default ProfileNotification;
