import React, { useState, useEffect } from "react";
import "./ProductManagement.css"; 

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState({});
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const savedProducts = localStorage.getItem("products");
    const savedStock = localStorage.getItem("stock");
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    
    if (savedStock) {
      setStock(JSON.parse(savedStock));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("stock", JSON.stringify(stock));
  }, [products, stock]);

  useEffect(() => {
    const newStock = { ...stock };
    let updated = false;
    
    products.forEach(product => {
      if (newStock[product.id] === undefined) {
        newStock[product.id] = 0; 
        updated = true;
      }
    });
    
    if (updated) {
      setStock(newStock);
    }
  }, [products, stock]);

  const handleAddProduct = () => {
    if (!name || !price) {
      alert("Please enter product name and price");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name,
      price: parseFloat(price),
      image: image || "https://via.placeholder.com/150"
    };

    setProducts([...products, newProduct]);
    
    setStock({
      ...stock,
      [newProduct.id]: 0
    });
    
    setName("");
    setPrice("");
    setImage("");
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(product => product.id !== id));
      
      const newStock = { ...stock };
      delete newStock[id];
      setStock(newStock);
    }
  };

  const updateStock = (productId, amount) => {
    const newStock = { ...stock };
    newStock[productId] = (newStock[productId] || 0) + amount;
    
    if (newStock[productId] < 0) {
      newStock[productId] = 0;
    }
    
    setStock(newStock);
  };

  return (
    <div className="pm-container">
      <h1>Product & Stock Management</h1>

      {/* Product List */}
      <div className="pm-products-section">
        <h2>Available Products ({products.length})</h2>
        {products.length === 0 ? (
          <p>No products found. Add your first product!</p>
        ) : (
          <div className="pm-products-grid">
            {products.map(product => (
              <div key={product.id} className="pm-product-card">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>Price: M{product.price}</p>
                <p>Stock: {stock[product.id] || 0}</p>
                <button onClick={() => handleDeleteProduct(product.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stock Management Table */}
      <div className="pm-stock-section">
        <h2>Stock Management</h2>
        {products.length === 0 ? (
          <p>No products to manage. Add products first.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Image</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>
                    <img src={product.image} alt={product.name} />
                  </td>
                  <td>M{product.price}</td>
                  <td>{stock[product.id] || 0}</td>
                  <td>
                    <button onClick={() => updateStock(product.id, 1)}>+1</button>
                    <button onClick={() => updateStock(product.id, 5)}>+5</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="pm-add-section">
        <h2>Add New Product</h2>
        <div>
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
        <button onClick={handleAddProduct}>Add Product</button>
      </div>
    </div>
  );
}

export default ProductManagement;
