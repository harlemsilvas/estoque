// ProductsPage.jsx
import React, { useState } from "react";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";

const ProductsPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProductCreated = (newProduct) => {
    console.log("New product created:", newProduct);
    // Trigger a refresh of the product list
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestão de Produtos</h1>

      <div style={{ marginBottom: "30px" }}>
        <ProductForm onProductCreated={handleProductCreated} />
      </div>

      <hr style={{ margin: "30px 0" }} />

      <div>
        <ProductList key={refreshKey} />
      </div>
    </div>
  );
};

export default ProductsPage;
