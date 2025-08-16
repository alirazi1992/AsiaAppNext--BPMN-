import { ActorsModel } from "@/app/models/Home/model";
import serverCall from "@/app/Utils/serverCall";
import { Button } from "@material-tailwind/react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IconButton, Tooltip } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import Select2, { ActionMeta, SingleValue } from "react-select";
import useStore from "../../../../hooks/useStore";
import colorStore from "../../../../zustandData/color.zustand";
import themeStore from "../../../../zustandData/theme.zustand";
import useLoginUserInfoStore, { LoggedInUserInfo } from "../../../../zustandData/useLoginUserInfo";
import MyCustomComponent from "@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui";
type Props = {
  handleClose?: () => void;
};

const UserRoleSelect = ({ handleClose }: Props) => {
  const themeMode = useStore(themeStore, (state) => state);
  const isThemeActive = !themeMode || themeMode?.stateMode;
  const color = useStore(colorStore, (state) => state);

  const { userInfo } = useLoginUserInfoStore();
  const ChangeActiveRole = async (roleName: string) => {
    const res = await serverCall(`identity/account/changeactiverole?activeRole=${roleName}`, {
      method: "post",
      withCredentials: true,
    });
    // await AxiosRequest({ credentials: true, data: data, method: method, url: url });
    useLoginUserInfoStore.setState((state) => ({
      userInfo: { ...(state.userInfo as LoggedInUserInfo), activeRole: roleName },
    }));
    handleClose?.();
  };
  return (
    <Select2
      options={userInfo?.actors}
      onChange={(option: SingleValue<ActorsModel>, actionMeta: ActionMeta<ActorsModel>) => {
        ChangeActiveRole(option!.roleName);
        // useLoginUserInfoStore.setState((state) => ({ userInfo: { ...state.userInfo, activeRole: option!.roleName } }))
      }}
      maxMenuHeight={220}
      value={userInfo?.actors?.find((p: ActorsModel) => p.roleName == userInfo?.activeRole)}
      className={`${isThemeActive ? "lightText" : "darkText"} w-[100%] text-[11px]`}
      placeholder="Role"
      theme={(theme) => ({
        ...theme,
        height: 10,
        borderRadius: 5,
        colors: {
          ...theme.colors,
          color: "#607d8b",
          neutral10: `${color?.color}`,
          primary25: `${color?.color}`,
          primary: "#607d8b",
          neutral0: `${isThemeActive ? "#1b2b39" : "#ded6ce"}`,
          neutral80: `${isThemeActive ? "white" : "#463b2f"}`,
        },
      })}
    />
  );
};

export default UserRoleSelect;

export const UserRoleSelectButton = () => {
  const color = useStore(colorStore, (state) => state);
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <MyCustomComponent>
        <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="change-role-title" fullWidth maxWidth="sm">
          <DialogTitle id="change-role-title" sx={{ fontWeight: 600 }}>
            {"Change Role"}
          </DialogTitle>
          <DialogContent sx={{ height: "100vh", maxHeight: "200px" }}>
            <UserRoleSelect handleClose={() => setOpen(false)} />
          </DialogContent>
          <DialogActions sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <Button
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              placeholder={undefined}
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Tooltip title="Change Role">
          <IconButton onClick={() => setOpen(true)} sx={{ color: color?.color }}>
            <AccountCircleIcon />
          </IconButton>
        </Tooltip>
      </MyCustomComponent>
    </>
  );
};
