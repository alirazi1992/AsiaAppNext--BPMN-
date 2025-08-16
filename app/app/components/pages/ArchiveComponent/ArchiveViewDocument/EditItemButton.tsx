import MyCustomComponent from "@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui";
import useStore from "@/app/hooks/useStore";
import { EditArchiveDocumentForm, ViewDocumentListTableModel } from "@/app/models/Archive/ViewDocumentListTable";
import serverCall from "@/app/Utils/serverCall";
import ArchiveJobFilterStore from "@/app/zustandData/ArchiveJobFilter.zustand";
import colorStore from "@/app/zustandData/color.zustand";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "@material-tailwind/react";
import { Alert, Box, Button as MaterialButton, TextField, Tooltip } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { mutate } from "swr";
import { createKeyForSwrRequest } from "./utilityFunctions";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

type FormItems = {
  name: keyof EditArchiveDocumentForm;
  title: string;
};

type Props = {
  item: ViewDocumentListTableModel;
};

const EditItemButton = ({ item }: Props) => {
  const color = useStore(colorStore, (state) => state);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<string | undefined>(undefined);
  const { handleSubmit, control } = useForm<EditArchiveDocumentForm>({ defaultValues: item });

  async function onSubmit({ extraInfo, title, name }: EditArchiveDocumentForm) {
    setErrors(undefined);
    const isJobArchive = item.jobId > 0;
    const entity = `archive/Manage/UpdateArchive${item.isFile ? "File" : "Document"}`;

    const data = {
      isJobArchive,
      archiveId: item.id,
      extraInfo,
      ...(item.isFile && {
        title,
        name,
      }),
    };

    try {
      const serverResponse = await serverCall<ViewDocumentListTableModel[]>(entity, {
        method: "PATCH",
        data,
        withCredentials: true,
      });
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }

    // refetch table data with swr
    const requestKey = createKeyForSwrRequest(item.jobId, item.workOrderId);
    const response = await mutate(
      requestKey,
      serverCall<ViewDocumentListTableModel[]>(requestKey, {
        method: "GET",
        withCredentials: true,
      }),
      true
    );
    if (response) {
      // update ArchiveJobFilterStore with new Data
      ArchiveJobFilterStore.setState((state) => ({
        ...state,
        ViewDocumentList: response.data.map((itemArchive: ViewDocumentListTableModel) => {
          return {
            id: itemArchive.id,
            title: itemArchive.title,
            name: itemArchive.name,
            isFile: itemArchive.isFile,
            attacher: itemArchive.attacher,
            archiveCategoryId: itemArchive.archiveCategoryId,
            createDate: itemArchive.createDate,
            type: itemArchive.type,
            docHeapId: itemArchive.docHeapId,
            workOrderId: itemArchive.workOrderId,
            jobId: itemArchive.jobId,
            attachmentTypeId: itemArchive.attachmentTypeId,
            extraInfo: itemArchive.extraInfo,
          };
        }),
      }));
    }
  }

  const formItems = useMemo(
    (): FormItems[] => [
      {
        name: "extraInfo",
        title: "اطلاعات تکمیلی",
      },
      ...(item.isFile
        ? [
            {
              name: "name" as keyof EditArchiveDocumentForm,
              title: "نام",
            },
            {
              name: "title" as keyof EditArchiveDocumentForm,
              title: "عنوان",
            },
          ]
        : []),
    ],
    [item.isFile, item.id]
  );

  return (
    <>
      <MyCustomComponent>
        <Dialog
          key={item.id}
          open={showModal}
          onClose={() => setShowModal(false)}
          aria-labelledby="edit-item"
          fullWidth
          maxWidth="sm"
          dir="rtl"
        >
          <DialogTitle id="change-role-title">ویرایش اطلاعات</DialogTitle>
          <DialogContent
            sx={{
              p: 2,
              minHeight: "200px",
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              className="border rounded-md p-4 border-gray-300 flex flex-col gap-4"
            >
              {formItems.map((item) => (
                <Controller
                  key={item.name}
                  control={control}
                  name={item.name}
                  render={({ field }) => <TextField size="small" fullWidth label={item.title} {...field} />}
                />
              ))}

              {errors && (
                <Alert variant="filled" severity="error" sx={{ my: 1 }}>
                  {errors}
                </Alert>
              )}
              <Box sx={{ width: "100%", display: "flex", justifyContent: "center", gap: 2 }}>
                <MaterialButton
                  color="warning"
                  variant="outlined"
                  endIcon={<CloseIcon />}
                  onClick={() => setShowModal(false)}
                >
                  خروج
                </MaterialButton>
                <MaterialButton type="submit" color="success" variant="outlined" endIcon={<SaveIcon />}>
                  ذخیره
                </MaterialButton>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </MyCustomComponent>
      <Tooltip title="ویرایش">
        <Button
          onClick={(e) => setShowModal(true)}
          size="sm"
          className="p-1 mx-1"
          style={{ background: color?.color }}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <EditIcon
            fontSize="small"
            className="p-1"
            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
          />
        </Button>
      </Tooltip>
    </>
  );
};

export default EditItemButton;
