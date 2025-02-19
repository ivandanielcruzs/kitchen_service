import React, { useEffect, useState } from "react";
import { CircularProgress, Typography, List, ListItem, ListItemText, Box } from "@mui/material";
import axiosInstance from "../../config/axios";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

interface IPurchase {
  ingredientId: {
    name: string;
  };
  quantity: number;
  orderedAt: string;
}

const PurchaseList = () => {
  const [purchases, setPurchases] = useState<IPurchase[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axiosInstance.get<IPurchase[]>("/purchases", { headers: { Authorization: `Bearer ${accessToken}` }});
        setPurchases(response.data);
      } catch (err) {
        setError("Error al obtener las compras.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [accessToken]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        🛒 Historial de Compras
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <List>
          {purchases?.map(({ ingredientId, quantity, orderedAt }, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={ingredientId.name}
                secondary={`Cantidad: ${quantity} - Fecha: ${new Date(orderedAt).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default PurchaseList;
