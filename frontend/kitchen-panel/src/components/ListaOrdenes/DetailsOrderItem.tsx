import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  CircularProgress,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axiosInstance from "../../config/axios";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

interface IRecipe {
  id: string;
  name: string;
  ingredients: { id: string; name: string; quantity: number }[];
  instructions: string;
}

interface OrderDetails {
  id: string;
  userId: string;
  status: string;
  recipeId: string | null | IRecipe;
  createdAt: Date;
}

interface OrderDetailsModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string | null;
}

const OrderDetailsModal = ({
  open,
  onClose,
  orderId,
}: OrderDetailsModalProps) => {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get<OrderDetails>(`/orders/${orderId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
        setOrder(response.data);
      } catch (err) {
        setError("Error al cargar los detalles de la orden.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const formatedTimestamp = (d: Date)=> {
    const de = new Date(d)
    const date = de.toISOString().split('T')[0];
    const time = de.toTimeString().split(' ')[0].replace(/:/g, ':');
    return `${date} ${time}`
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        {loading ? (
          <Typography align="center">
            <CircularProgress />
          </Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : order ? (
          <>
            <Typography variant="h6" gutterBottom>
              Detalles de la Orden #{order.id.slice(0, 8)}
            </Typography>
            <Typography variant="body1">
              <strong>Estado:</strong> {order.status}
            </Typography>
            <Typography variant="body1">
              <strong>Fecha:</strong> {formatedTimestamp(order.createdAt)}
            </Typography>
            {
              (order.recipeId as IRecipe)?.name &&
              <div>
                <Typography variant="body1">
                  <strong>Nombre de la receta:</strong> {(order.recipeId as IRecipe)?.name}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <strong>Ingredientes:</strong>
                </Typography>
                <List>
                  {(order.recipeId as IRecipe)?.ingredients.map((item) => (
                    <ListItem key={item.id}>
                      <ListItemText primary={`${item.name} - ${item.quantity}`} />
                    </ListItem>
                  ))}
                </List>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <strong>Preparación:</strong> {(order.recipeId as IRecipe)?.instructions.replace('<br />', '\n')}
                </Typography>
              </div>
            }
            {
              ((order.recipeId as IRecipe)?.name === null || (order.recipeId as IRecipe)?.name === undefined) &&
              <p>No tiene receta asignada aún.</p>
            }
          </>
        ) : (
          <Typography>No hay datos disponibles.</Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={onClose}
        >
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
};

export default OrderDetailsModal;
