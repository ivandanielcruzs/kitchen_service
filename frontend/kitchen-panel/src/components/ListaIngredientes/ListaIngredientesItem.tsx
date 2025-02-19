import React, { useEffect, useState } from "react";
import { CircularProgress, Typography, List, ListItem, ListItemText, Box } from "@mui/material";
import axiosInstance from "../../config/axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";


interface IIngredient {
  name: string;
  stock: number;
}

const IngredientList = () => {
  const [ingredients, setIngredients] = useState<IIngredient[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axiosInstance.get<IIngredient[]>("/ingredients", 
          { headers: { Authorization: `Bearer ${accessToken}` }});
        setIngredients(response.data);
      } catch (err) {
        setError("Error al obtener los ingredientes.");
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, [accessToken]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Lista de Ingredientes
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <List>
          {ingredients?.map(({ name, stock }) => (
            <ListItem key={name} divider>
              <ListItemText primary={name} secondary={`Stock: ${stock}`} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default IngredientList;
