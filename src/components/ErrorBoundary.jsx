import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div
          style={{
            padding: "20px",
            margin: "20px",
            border: "1px solid #ff6b6b",
            borderRadius: "5px",
            backgroundColor: "#ffe0e0",
          }}
        >
          <h2>🚨 Algo deu errado!</h2>
          <p>Ocorreu um erro inesperado. Isso pode ser causado por:</p>
          <ul>
            <li>Extensões do navegador interferindo</li>
            <li>Problemas de conexão de rede</li>
            <li>Cache do navegador corrompido</li>
          </ul>

          <h3>💡 Soluções:</h3>
          <ol>
            <li>Atualize a página (F5)</li>
            <li>Abra em uma janela anônima</li>
            <li>Desative extensões temporariamente</li>
            <li>Limpe o cache do navegador</li>
          </ol>

          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            🔄 Recarregar Página
          </button>

          {process.env.NODE_ENV === "development" && (
            <details style={{ marginTop: "20px" }}>
              <summary>🔍 Detalhes do Erro (Desenvolvimento)</summary>
              <pre
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "10px",
                  overflow: "auto",
                  fontSize: "12px",
                }}
              >
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
