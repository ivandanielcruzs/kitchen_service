import React, { useState } from "react";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import axiosInstance from "../../config/axios";
import { AxiosError, AxiosResponse, isAxiosError } from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SolicitarPlatillo = ({ refreshOrders }: { refreshOrders: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const handleRequestOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post<
        null,
        AxiosResponse<String> | AxiosError
      >("/orders", {}, { headers: { Authorization: `Bearer ${accessToken}` } });

      if (isAxiosError(response)) {
        setError("Error al solicitar la orden.");
        throw response;
      }

      if (response.status === 200 || response.status === 201) {
        refreshOrders();
        setOpenSnackbar(true);
      } else {
        setError("Error al solicitar la orden.");
      }      
    } catch (err) {
      setError("Error en la conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="center"
      alignItems="center"
      sx={{ height: "60vh" }}
    >
      <Button
        variant="contained"
        endIcon={<SendIcon />}
        onClick={handleRequestOrder}
        disabled={loading}
        sx={{
          width: "30vw",
          maxWidth: 400,
          height: "10vh",
          fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
          padding: "12px",
        }}
      >
        {loading ? "Solicitando..." : "Solicitar Platillo"}
      </Button>

      {/* Notificación */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          Orden enviada con éxito 🎉
        </Alert>
      </Snackbar>

      {/* Notificación de error */}
      {error && (
        <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
    </Stack>
  );
};

export default SolicitarPlatillo;
