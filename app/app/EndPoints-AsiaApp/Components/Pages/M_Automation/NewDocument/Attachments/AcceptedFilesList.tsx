"use client";
import { useUploadAttachment } from "@/app/Application-AsiaApp/M_Automation/NewDocument/UploadAttachment";
import { ListAttachments } from "@/app/Application-AsiaApp/M_Automation/NewDocument/UploadListofAttachments";
import { thumbInner } from "@/app/Application-AsiaApp/Utils/shared";
import Loading from "@/app/components/shared/loadingGetData";
import {
  GetAttachmentsList,
  UploadListAttachments,
  UploadListofAttachmentsModel,
} from "@/app/Domain/M_Automation/NewDocument/Attachments";
import { DropzoneFileModel, LoadingModel } from "@/app/Domain/shared";
import { FileImage } from "@/app/EndPoints-AsiaApp/Components/Shared/AttachmentsImage";
import MyCustomComponent from "@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui";
import { CloseIcon } from "@/app/EndPoints-AsiaApp/Components/Shared/IconComponent";
import {
  ActionButton,
  Icon,
  Td,
  Th,
} from "@/app/EndPoints-AsiaApp/Components/Shared/TableComponent";
import useStore from "@/app/hooks/useStore";
import colorStore from "@/app/zustandData/color.zustand";
import themeStore from "@/app/zustandData/theme.zustand";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  CardBody,
  Dialog,
  DialogBody,
  DialogHeader,
  Tooltip,
} from "@material-tailwind/react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { TextField } from "@mui/material";
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { useNewDocumentDataContext } from "../useNewDocumentDataContext";
import { AttachmentContext } from "./MainContainer";

const AcceptedFilesList = forwardRef((props: any, ref) => {
  const { file, setFile, setAttachments, Attachments } =
    useContext(AttachmentContext);
  const { docheapId, docTypeId, setLoadings, loadings } =
    useNewDocumentDataContext();
  const themeMode = useStore(themeStore, (state) => state);
  const color = useStore(colorStore, (state) => state);

  const { UploadListAttachments } = ListAttachments();
  const { UploadFileAttachment } = useUploadAttachment();

  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(!open);

  const schema = yup
    .object()
    .shape({
      files: yup
        .array(
          yup.object().shape({
            file: yup.string().required(),
            type: yup.string().required(),
            title: yup.string().required(),
            desc: yup.string().optional(),
          })
        )
        .required(),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    trigger,
    setValue,
    control,
    formState,
  } = useForm<UploadListAttachments>({
    defaultValues: {
      files: [
        {
          file: "",
          title: "",
          type: "",
          desc: "",
        },
      ],
    },
    mode: "all",
    resolver: yupResolver(schema),
  });

  const errors = formState.errors;
  const FilesState = useFieldArray({
    name: "files",
    control,
  });

  const UploadFile = async (
    op: DropzoneFileModel,
    desc: string,
    index: number
  ) => {
    setLoadings((prev: LoadingModel) => ({ ...prev, response: true }));
    const res = await UploadFileAttachment(docheapId!, docTypeId!, {
      file: await ReadFileAsync(op.file),
      title: op.file.name || "",
      type: op.file.type || "",
      desc: desc,
    }).then((result) => {
      if (result) {
        setLoadings((prev: LoadingModel) => ({ ...prev, response: false }));
        if (typeof result === "object" && "id" in result) {
          setAttachments((prev: GetAttachmentsList[]) => [
            ...prev,
            {
              id: result.id,
              attachmentType: {
                id: result.id,
                title: result.title,
                description: result.desc,
              },
              attachmentTypeId: result.id,
              name: result.title,
              fileTitle: result.fileName ?? result.title,
              description: result.desc,
              createDate: result.createDate,
              creator: result.creator,
              fileType: result.fileType,
              lockDate: "",
              isActive: false,
            },
          ]);
          file.splice(index, 1);
          FilesState.remove(index);
          if (file.length == 0) handleOpen();
        } else {
          setAttachments([...Attachments]);
        }
      }
    });
  };

  useEffect(() => {
    const updateFiles = async () => {
      const updatedFiles = await Promise.all(
        file.map(async (f: DropzoneFileModel) => ({
          file: await ReadFileAsync(f.file),
          title: f.file.name || "",
          type: f.file.type || "",
          desc: "",
        }))
      );
      setValue("files", updatedFiles);
    };
    updateFiles();
  }, [file]);

  async function ReadFileAsync(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      var fr = new FileReader();
      fr.onload = async () => {
        resolve(fr.result as string);
      };
      fr.onerror = async (error) => {};
      fr.readAsDataURL(file);
    });
  }

  useImperativeHandle(ref, () => ({
    handleOpen: () => {
      handleOpen();
    },
  }));

  const DeleteFile = (index: number) => {
    file.splice(index, 1);
    FilesState.remove(index);
  };

  const OnSubmit = async (data: UploadListAttachments) => {
    setLoadings((prev: LoadingModel) => ({ ...prev, response: true }));
    const res = await UploadListAttachments(
      docheapId!,
      docTypeId!,
      data.files
    ).then((result) => {
      if (result) {
        setLoadings((prev: LoadingModel) => ({ ...prev, response: false }));
        if (Array.isArray(result)) {
          setAttachments((prev: GetAttachmentsList[]) => [
            ...prev,
            ...result.map((item: UploadListofAttachmentsModel) => {
              return {
                id: item.id,
                attachmentType: {
                  id: item.id,
                  title: item.title,
                  description: item.desc,
                },
                attachmentTypeId: item.id,
                name: item.title,
                fileTitle: item.fileName,
                description: item.desc,
                createDate: item.createDate,
                creator: item.creator,
                fileType: item.fileType,
                lockDate: "",
                isActive: false,
              };
            }),
          ]);
        } else {
          setAttachments([...Attachments]);
        }
        setFile([]);
        handleOpen();
      }
    });
  };

  return (
    <MyCustomComponent>
      <>
        <Dialog
          dismiss={{
            escapeKey: true,
            referencePress: true,
            referencePressEvent: "click",
            outsidePress: false,
            outsidePressEvent: "click",
            ancestorScroll: false,
            bubbles: true,
          }}
          size="xl"
          className={`absolute overflow-hidden top-0 min-h-[50vh] ${
            !themeMode || themeMode?.stateMode ? "cardDark" : "cardLight"
          }`}
          open={open}
          handler={handleOpen}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          {loadings.response == true && <Loading />}
          <DialogHeader
            dir="ltr"
            className={`${
              !themeMode || themeMode?.stateMode
                ? "lightText cardDark"
                : "darkText cardLight"
            } flex justify-between sticky top-0 left-0`}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <CloseIcon
              onClick={() => {
                handleOpen(), setFile([]);
              }}
            />
            انتخاب مدرک
          </DialogHeader>
          <DialogBody
            className="w-full"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <form
              dir="rtl"
              onSubmit={handleSubmit(OnSubmit)}
              className="h-full w-full"
            >
              <Tooltip
                content="آپلود گروهی"
                className={`${
                  !themeMode || themeMode?.stateMode
                    ? "lightText cardDark"
                    : "darkText cardLight"
                } z-[8888888888888888888]`}
              >
                <Button
                  type="submit"
                  size="sm"
                  className="p-1 mx-1 my-4"
                  style={{ background: color?.color }}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <Icon Name={CloudUploadIcon} />
                </Button>
              </Tooltip>
              <CardBody
                className={
                  "h-[50vh] mx-auto relative rounded-lg p-0 overflow-y-auto "
                }
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <table
                  dir="rtl"
                  className={`w-full max-h-[48vh] relative text-center ${
                    !themeMode || themeMode?.stateMode
                      ? "tableDark"
                      : "tableLight"
                  }`}
                >
                  <thead>
                    <tr
                      className={
                        !themeMode || themeMode?.stateMode
                          ? "themeDark"
                          : "themeLight"
                      }
                    >
                      <Th value={"#"} />
                      <Th value={"تصویر مدرک"} />
                      <Th value={"اطلاعات مدرک"} />
                      <Th value={"توضیحات"} />
                      <Th value={"عملیات"} />
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y divide-${
                      !themeMode || themeMode?.stateMode
                        ? "themeDark"
                        : "themeLight"
                    }`}
                  >
                    {file.map((op: DropzoneFileModel, index: number) => {
                      return (
                        <tr
                          key={"docTable" + index}
                          className={`${
                            index % 2
                              ? !themeMode || themeMode?.stateMode
                                ? "breadDark"
                                : "breadLight"
                              : !themeMode || themeMode?.stateMode
                              ? "tableDark"
                              : "tableLight"
                          } border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}
                        >
                          <Td
                            style={{ width: "3%" }}
                            value={Number(index) + Number(1)}
                          />
                          <Td
                            style={{ minWidth: "100px", width: "20%" }}
                            value={
                              <>
                                <div
                                  className="w-full h-full flex justify-center"
                                  style={thumbInner}
                                >
                                  <figure className="h-[50px] w-[50px]">
                                    <FileImage file={op} />
                                  </figure>
                                </div>
                              </>
                            }
                          />
                          <Td
                            style={{ width: "25%" }}
                            value={op.file.name.split(".").slice(0, -1)}
                          />
                          <Td
                            style={{ width: "45%" }}
                            value={
                              <>
                                {" "}
                                <TextField
                                  {...register(`files.${index}.desc`)}
                                  size="small"
                                  className="w-full lg:my-0 font-[FaLight]"
                                  InputProps={{
                                    style: {
                                      color:
                                        !themeMode || themeMode?.stateMode
                                          ? "white"
                                          : "#463b2f",
                                    },
                                  }}
                                />{" "}
                              </>
                            }
                          />
                          <Td
                            style={{ width: "7%" }}
                            value={
                              <>
                                <div className="container-fluid mx-auto p-0.5">
                                  <div className="flex flex-row justify-evenly">
                                    <ActionButton
                                      onClick={() => DeleteFile(index)}
                                    >
                                      <Icon Name={DeleteIcon} />
                                    </ActionButton>
                                    <ActionButton
                                      onClick={() =>
                                        UploadFile(
                                          op,
                                          watch(`files.${index}.desc`) ?? "",
                                          index
                                        )
                                      }
                                    >
                                      <Icon Name={CloudUploadIcon} />
                                    </ActionButton>
                                  </div>
                                </div>
                              </>
                            }
                          />
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardBody>
            </form>
          </DialogBody>
        </Dialog>
      </>
    </MyCustomComponent>
  );
});
AcceptedFilesList.displayName = "AcceptedFilesList";
export default AcceptedFilesList;
