import React from "react";
import { Route, Routes } from "react-router";
import PublicLayout from "./layout/PublicLayout";
import SignIn from "./components/Login/LoginItem";
import SignInLayout from "./layout/SignInLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Panel from "./components/Panel/PanelItem";
import IngredientList from "./components/ListaIngredientes/ListaIngredientesItem";
import PurchaseList from "./components/ListaCompras/ListaComprasItem";

function App() {

  return (
    <div>
      <Routes>
        <Route
            path="/"
            element={
              <PublicLayout>
                <SignIn />
              </PublicLayout>
            }
        />
        <Route element={<ProtectedRoute />}>          
            <Route path="/panel" element={
              <SignInLayout>
                <Panel />
              </SignInLayout>
            } />
            <Route path="/stock" element={
              <SignInLayout>
                <IngredientList />
              </SignInLayout>
            } />
            <Route path="/purchase" element={
              <SignInLayout>
                <PurchaseList />
              </SignInLayout>
            } />
        </Route>
        <Route path="*" element={<h1>404 Not Found</h1>}/>
      </Routes>
    </div>
  );
}

export default App;
