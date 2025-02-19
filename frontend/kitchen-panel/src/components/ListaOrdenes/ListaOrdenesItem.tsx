import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import axiosInstance from '../../config/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Typography, CircularProgress, Button } from '@mui/material';
import OrderDetailsModal from './DetailsOrderItem';
import { RolesEnum } from '../../enums/roles.enum';
import { StatusEnum } from '../../enums/status.enum';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SeleccionarPlatilloModal from './SeleccionarPlatillo';


interface Order {
  id: string;
  userId: string;
  status: string;
  recipeId: string | null;
  createdAt: Date;
}


const ListaOrdenes = ({ reloadOrders, role, refreshOrders }: { reloadOrders: boolean, role: string, refreshOrders: () => void }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenPlatillo, setIsModalOpenPlatillo] = useState(false);
  

  const getOrders = async () => {
    try {
      const response = await axiosInstance.get<Order[]>
        ("/orders", { headers: { Authorization: `Bearer ${accessToken}` } });
      setOrders(response.data);
    } catch (err) {
      setError("Error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
    const interval = setInterval(() => {
      console.log('Se vuelve a pedir las ordenes');
      getOrders();
    }, 10000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadOrders]);

  const handleRowClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
    setIsModalOpenPlatillo(false);
  };

  const handleSetPlatillo =  (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(false);
    setIsModalOpenPlatillo(true);
  };

  const formatedTimestamp = (d: Date)=> {
    const de = new Date(d)
    const date = de.toISOString().split('T')[0];
    const time = de.toTimeString().split(' ')[0].replace(/:/g, ':');
    return `${date} ${time}`
  }

  if (loading) {
    return (
      <Typography align="center" sx={{ mt: 3 }}>
        <CircularProgress />
      </Typography>
    );
  }
  if (error) {
    return <Typography align="center" color="error">{error}</Typography>;
  }

  const setApproved = async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.patch(`/orders/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      alert('Se ha completado la orden');
    } catch (err) {
      alert('Error al terminar platillo');
      setError("Error al seleccionar receta.");
    } finally {
      setLoading(false);
      setError(null);
      refreshOrders();
    }
  }

  return (
    <div>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>id-short</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Creado en</TableCell>
            <TableCell>Con receta?</TableCell>
            {
              role === RolesEnum.CHEF &&
              <TableCell>Acciones</TableCell>
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((row) => (
            <TableRow
              key={row.id}              
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" onClick={() => handleRowClick(row.id)}>
                {row.id.slice(0, 8)}
              </TableCell>
              <TableCell component="th" scope="row" onClick={() => handleRowClick(row.id)}>
                {row.status}
              </TableCell>
              <TableCell onClick={() => handleRowClick(row.id)}>{ formatedTimestamp(row.createdAt) }</TableCell>
              <TableCell onClick={() => handleRowClick(row.id)}>{ row.recipeId ? 'Sí':'No' }</TableCell>
              {
                (role === RolesEnum.CHEF && row.status === StatusEnum.SOLICITADA) &&
                <TableCell>
                  <Button variant="contained" endIcon={<FastfoodIcon />} onClick={ () => handleSetPlatillo(row.id) }>Agregar receta</Button>
                </TableCell>
              }
              {
                (role === RolesEnum.CHEF && row.status === StatusEnum.PROCESO) &&
                <TableCell>
                  <Button 
                  variant="contained"
                  color='success'
                  endIcon={<CheckCircleOutlineIcon />}
                  onClick={() => setApproved(row.id)  }>Marcar Finalizada</Button>
                </TableCell>
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    {/* Modal de detalles de la orden */}
    <OrderDetailsModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderId={selectedOrderId}
      />
      {
        role === RolesEnum.CHEF &&
        <SeleccionarPlatilloModal 
          openPlatillo={isModalOpenPlatillo}
          onClosePlatillo={() => setIsModalOpenPlatillo(false)}
          orderId={selectedOrderId}
          refreshOrders={() => refreshOrders()}
        />
      }
    </div>
  );
};

export default ListaOrdenes;