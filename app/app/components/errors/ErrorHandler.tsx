import { Alert, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

type Props = {
  onRefetch: () => void;
  errorText?: string;
};

const ErrorHandler: React.FC<Props> = ({
  onRefetch,
  errorText = "خطا در برقراری ارتباط با سرور",
}) => {
  return (
    <Alert
      severity="error"
      variant="standard"
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {errorText}
      <IconButton onClick={onRefetch}>
        <RefreshIcon />
      </IconButton>
    </Alert>
  );
};

export default ErrorHandler;
