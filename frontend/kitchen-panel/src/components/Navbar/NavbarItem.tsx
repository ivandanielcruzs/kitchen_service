import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import HistoryIcon from '@mui/icons-material/History';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [value, setValue] = useState(0);

  return (
    <Box
      sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "10vh",
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          console.log(newValue);
          setValue(newValue);
        }}
        sx={{
          width: "80vw",
          maxWidth: 600,
          boxShadow: 3,
        }}
      >
        <Link to={'/panel'} className="link">
          <BottomNavigationAction label="Historial de Ordenes" icon={<HistoryIcon />} sx={{ fontSize: { xs: "0.8rem", sm: "1rem", md: "1.2rem" } }} />
        </Link>
        <Link to={'/purchase'} className="link">
          <BottomNavigationAction label="Historial de compras" icon={<CreditCardIcon />} sx={{ fontSize: { xs: "0.8rem", sm: "1rem", md: "1.2rem" } }} />
        </Link>
        <Link to={'/stock'} className="link">
        <BottomNavigationAction label="Ingredientes y stock actual" icon={<Inventory2Icon />} sx={{ fontSize: { xs: "0.8rem", sm: "1rem", md: "1.2rem" } }} />
        </Link>
      </BottomNavigation>
    </Box>
  );
}

export default NavBar;