import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import axiosInstance from "../../config/axios";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

interface IRecipe {
  id: string;
  name: string;
  ingredients: { id: string; name: string; quantity: number }[];
  instructions: string;
}

interface OrderDetailsModalProps {
  openPlatillo: boolean;
  onClosePlatillo: () => void;
  orderId: string | null;
  refreshOrders: () => void;
}

const SeleccionarPlatilloModal = ({
  openPlatillo,
  onClosePlatillo,
  orderId,
  refreshOrders,
}: OrderDetailsModalProps) => {
  const [recipes, setRecipes] = useState<IRecipe[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!orderId) return;

    const fetchRecipes = async () => {
      setSelectedRecipe(null);
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get<IRecipe[]>("/recipes", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setRecipes(response.data);
      } catch (err) {
        setError("Error al obtener las recetas.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [orderId]);

  // 🔹 Función para seleccionar receta aleatoria
  const selectRandomRecipe = () => {
    if (!recipes || recipes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * recipes.length);
    setSelectedRecipe(recipes[randomIndex].id);
  };

  const setRecipeInOrder = async (recipeId: string) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.patch<IRecipe[]>(`/orders/${recipeId}/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (err) {
      alert('Error al seleccionar receta');
      setError("Error al seleccionar receta.");
    } finally {
      setLoading(false);
      setError(null);
      refreshOrders();
      setSelectedRecipe(null);
      onClosePlatillo();
    }
  }

  return (
    <Modal open={openPlatillo} onClose={onClosePlatillo}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
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
        ) : recipes ? (
          <div>
            {/* 🔹 Contenedor horizontal para las cards */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                overflowX: "auto", // Scroll horizontal si hay muchas recetas
                padding: "10px",
              }}
            >
              {recipes.map((recipe) => (
                <Card
                  key={recipe.id}
                  sx={{
                    minWidth: 200,
                    border: selectedRecipe === recipe.id ? "3px solid green" : "1px solid #ccc",
                    transition: "0.3s",
                  }}
                >
                  <CardContent>
                    <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
                      {recipe.name}
                    </Typography>
                    <Typography variant="body2">
                      {recipe.ingredients.map(({ name, quantity }) => (
                        <p key={name}>{name + ": " + quantity}</p>
                      ))}
                    </Typography>
                    <Typography variant="body2">
                      {recipe.instructions.replace("<br />", "\n")}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 🔹 Botón para seleccionar una receta aleatoria */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={selectRandomRecipe}
            >
              Seleccionar Receta Aleatoria
            </Button>

            {/* 🔹 Mostrar el botón para confirmar la receta si ya se seleccionó una */}
            {selectedRecipe && (
              <Button
                variant="contained"
                color="success"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => setRecipeInOrder(selectedRecipe)}
              >
                Confirmar Receta
              </Button>
            )}
          </div>
        ) : (
          <Typography>No hay datos disponibles.</Typography>
        )}

        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={onClosePlatillo}>
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
};

export default SeleccionarPlatilloModal;
