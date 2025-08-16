import { ProfileDefectanceAllModel } from "@/app/Domain/M_HumanRecourse/Defects";
import { Button, IconButton, Tooltip } from "@mui/material";
import React from "react";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import MyCustomComponent from "../../../Shared/CustomTheme_Mui";
type Props = {
  allUsers: ProfileDefectanceAllModel[];
};

const DownloadAllUsersButton = ({ allUsers }: Props) => {
  const convertToCSV = (items: ProfileDefectanceAllModel[]) => {
    const header = ["نام", "نام خانوادگی", "عنوان", "First Name", "Last Name", "Defect Types"];

    const rows: string[][] = [];
    items.forEach((item) => {
      item.defectTypes.forEach((defect) => {
        rows.push([item.faFirstName, item.faLastName, defect.faName, item.firstName, item.lastName, defect.name]);
      });
    });

    const csvContent = [header.join(","), ...rows.map((row) => row.map((value) => `"${value}"`).join(","))].join("\n");

    return csvContent;
  };

  const downloadCSV = () => {
    const csv = convertToCSV(allUsers);
    const BOM = "\uFEFF"; // UTF-8 BOM
    const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MyCustomComponent>
      <Tooltip title="دانلود">
        <IconButton color="secondary" onClick={downloadCSV}>
          <DownloadForOfflineIcon />
        </IconButton>
      </Tooltip>
    </MyCustomComponent>
  );
};

export default DownloadAllUsersButton;
