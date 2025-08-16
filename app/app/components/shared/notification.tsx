"use client";
// import { NotifMessageModel } from '@/app/zustandData/notif.zustand'
// import zustandStore from '@/app/zustandData/notif.zustand';
import { NotifMessageModel } from "@/app/zustandData/notif.zustand";
import { Typography } from "@material-tailwind/react";
import Link from "next/link";

type Props = {
  notificationData: NotifMessageModel;
};

const Notification = ({ notificationData }: Props) => {
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
          ارجاع جدید
        </Typography>
      </section>
      <ShowValue title="موضوع: " value={notificationData.subject} />
      <ShowValue
        title="شماره مدرک: "
        value={
          <Link
            href={`/Home/NewDocument?doctypeid=${notificationData.docTypeId}&docheapid=${notificationData.docHeapId}`}
            className="bg-blue-gray-100 p-1 rounded-xl text-blue-700 text-xs hover:bg-blue-gray-200 transition-all"
          >
            {notificationData.indicatorNumber}
          </Link>
        }
      />
      <ShowValue title="فرستنده: " value={notificationData.sender} />
      <ShowValue title="تاریخ: " value={notificationData.receiveDate} />
    </section>
  );
};

export default Notification;

type ShowValueProps = {
  title: string;
  value: React.ReactNode;
};

const ShowValue = ({ title, value }: ShowValueProps) => {
  return (
    <div className="mx-2 text-white flex items-start gap-1 mt-1">
      <span className="font-semibold break-keep ">{title} </span>
      <span>{value}</span>
    </div>
  );
};
