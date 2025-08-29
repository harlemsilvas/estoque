import React from "react";
import BrandForm from "../components/BrandForm";
import BrandList from "../components/BrandList";

const BrandsPage = () => {
  return (
    <div className="page-container">
      <h1>Gestão de Marcas</h1>
      <BrandForm />
      <hr />
      <BrandList />
    </div>
  );
};

export default BrandsPage;
