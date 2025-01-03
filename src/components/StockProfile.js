import React, { useState, useEffect } from "react";
import { getResources } from "../services/authService";

const StockManagement = () => {
  const [stocks, setStocks] = useState([]);
  const [newStock, setNewStock] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStock({ ...newStock, [name]: value });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getResources("api/create-stock", "GET");
      if (data && Array.isArray(data)) {
        const persistedStatuses = JSON.parse(localStorage.getItem("stockStatuses")) || {};
        const updatedStocks = data.map((stock) => ({
          ...stock,
          status: persistedStatuses[stock.id] || stock.status,
        }));
        setStocks(updatedStocks);
      } else {
        console.error("Dados inválidos recebidos da API:", data);
        alert("Erro ao carregar os estoques.");
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      alert("Não foi possível carregar os estoques.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addStock = async () => {
    if (!newStock.name || !newStock.description) {
      alert("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      await getResources("api/create-stock", "POST", newStock);
      fetchData();
      setNewStock({ name: "", description: "" });
    } catch (error) {
      console.error("Erro ao adicionar estoque:", error);
      alert("Erro ao conectar com a API.");
    } finally {
      setLoading(false);
    }
  };

  const toggleStockStatus = async (stockId, currentStatus) => {
    setLoading(true);
    try {
      let newStatus = currentStatus === "active" ? "inactive" : "active";

      // Se o novo estoque for ativado, desative os outros antes
      if (newStatus === "active") {
        // Desativa todos os outros estoques
        const updatedStocks = stocks.map((stock) =>
          stock.id !== stockId && stock.status === "active"
            ? { ...stock, status: "inactive" }
            : stock
        );
        setStocks(updatedStocks);

        // Atualiza os status persistidos no localStorage
        const persistedStatuses = JSON.parse(localStorage.getItem("stockStatuses")) || {};
        Object.keys(persistedStatuses).forEach((key) => {
          if (persistedStatuses[key] === "active" && key !== stockId.toString()) {
            persistedStatuses[key] = "inactive";
          }
        });
        persistedStatuses[stockId] = newStatus;
        localStorage.setItem("stockStatuses", JSON.stringify(persistedStatuses));
      }

      // Ativa ou desativa o estoque atual
      const endpoint =
        currentStatus === "active"
          ? `api/stock-reference/${stockId}/deactivate`
          : `api/stock-reference/${stockId}/activate`;

      await getResources(endpoint, "POST", { stockId, status: newStatus });

      // Atualiza o estado do estoque
      const updatedStocks = stocks.map((stock) =>
        stock.id === stockId ? { ...stock, status: newStatus } : stock
      );
      setStocks(updatedStocks);
    } catch (error) {
      console.error("Erro ao atualizar status do estoque:", error);
      alert("Erro ao conectar com a API.");
    } finally {
      setLoading(false);
    }
  };

  const deleteStock = async (stockId) => {
    if (!stockId) return;

    if (window.confirm("Tem certeza de que deseja excluir este estoque?")) {
      setLoading(true);
      try {
        await getResources(`api/stock-reference/${stockId}/delete`, "DELETE");
        fetchData();
        const persistedStatuses = JSON.parse(localStorage.getItem("stockStatuses")) || {};
        delete persistedStatuses[stockId];
        localStorage.setItem("stockStatuses", JSON.stringify(persistedStatuses));
      } catch (error) {
        console.error("Erro ao excluir estoque:", error);
        alert("Erro ao conectar com a API.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Gestão de Estoques</h1>

      <div style={{ marginBottom: "20px", border: "1px solid #ddd", padding: "20px", borderRadius: "5px" }}>
        <h2 style={{ marginBottom: "10px", color: "#007BFF" }}>Adicionar Estoque</h2>
        <input
          type="text"
          name="name"
          placeholder="Nome do Estoque"
          value={newStock.name}
          onChange={handleInputChange}
          style={{ margin: "5px", padding: "8px", width: "100%" }}
        />
        <input
          type="text"
          name="description"
          placeholder="Descrição"
          value={newStock.description}
          onChange={handleInputChange}
          style={{ margin: "5px", padding: "8px", width: "100%" }}
        />
        <button
          onClick={addStock}
          style={{
            padding: "10px 15px",
            marginTop: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
          disabled={loading}
        >
          {loading ? "Adicionando..." : "Adicionar Estoque"}
        </button>
      </div>

      <div>
        <h2 style={{ marginBottom: "10px", color: "#333" }}>Estoques Cadastrados</h2>
        {stocks.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>Nenhum estoque cadastrado ainda.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {stocks.map((stock) => (
              <li
                key={stock.id}
                style={{
                  marginBottom: "10px",
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  backgroundColor: stock.status === "active" ? "#e9f7ef" : "#f8d7da",
                }}
              >
                <strong style={{ color: stock.status === "active" ? "#28a745" : "#d0021b" }}>
                  {stock.name} ({stock.status === "active" ? "Ativo" : "Inativo"})
                </strong>
                <p style={{ margin: "5px 0", color: "#555" }}>Descrição: {stock.description}</p>
                <button
                  onClick={() => toggleStockStatus(stock.id, stock.status)}
                  style={{
                    backgroundColor: stock.status === "active" ? "#d0021b" : "#28a745",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "5px",
                    marginRight: "10px",
                  }}
                >
                  {stock.status === "active" ? "Desativar" : "Ativar"}
                </button>
                <button
                  onClick={() => deleteStock(stock.id)}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StockManagement;
