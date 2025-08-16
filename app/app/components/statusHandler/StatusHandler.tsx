import { QueryStatus } from "@tanstack/react-query";
import React from "react";
import ErrorHandler from "../errors/ErrorHandler";

type Props = {
  children: React.ReactNode;
  status?: QueryStatus;
  refetch?: () => void;
};

const StatusHandler = ({ status, refetch, children }: Props) => {
  return (
    <>
      {status === "pending" ? (
        <div className="space-y-4 animate-pulse">
          <div className="w-full h-8 bg-gray-300 rounded"></div>
        </div>
      ) : status === "error" ? (
        <ErrorHandler onRefetch={refetch!} />
      ) : (
        children
      )}
    </>
  );
};

export default StatusHandler;
