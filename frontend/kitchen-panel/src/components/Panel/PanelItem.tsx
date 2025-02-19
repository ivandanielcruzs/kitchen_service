import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import SolicitarPlatillo from "../SolicitarPlatillo/SolicitarPlatilloItem";
import ListaOrdenes from "../ListaOrdenes/ListaOrdenesItem";
import { useState } from "react";

const Panel = () => {
  const { role } = useSelector((state: RootState) => state.auth);

  const [reloadOrders, setReloadOrders] = useState(false);

  const refreshOrders = () => {
    setReloadOrders((prev) => !prev);
  };

  return (
    <div>
      {
        role === 'GERENTE' &&
        <div>
          <ListaOrdenes reloadOrders={reloadOrders} role={role} refreshOrders={refreshOrders}/>
          <SolicitarPlatillo refreshOrders={refreshOrders} />
        </div>
      }
      {
        role === 'CHEF' &&
        <div>
          Chef panel n_n
          <ListaOrdenes reloadOrders={reloadOrders} role={role} refreshOrders={refreshOrders}/>
        </div>
      }
    </div>
  );
};

export default Panel;