"use client";

import zustandStore from "@/app/zustandData/notif.zustand";
import { Typography } from "@material-tailwind/react";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  handleCloseAll?: () => void;
};

const Notification = ({ handleCloseAll }: Props) => {
  const Notif = zustandStore();

  return (
    <section className="p-0 m-0 text-[13px] text-white font-thin">
      <section className="flex justify-center items-center">
        <Typography
          variant="paragraph"
          className=" text-[15px] w-[90%] text-white"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          حذف تمام اعلانات
        </Typography>
        <DeleteIcon
          className="cursor-pointer"
          fontSize="small"
          onClick={() => {
            handleCloseAll?.();
            Notif.removeAll();
          }}
        />
      </section>
      {/* <section style={{ background: color?.color }} className='h-[5px] w-full'></section> */}
    </section>
  );
};

export default Notification;
