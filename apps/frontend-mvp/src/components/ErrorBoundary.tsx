import React from "react";

interface Props {
  children: React.ReactNode;
}
interface State {
  hasError: boolean;
  error?: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch() {
    // Could send to a logging endpoint here
    // console.error("Uncaught error in subtree:", error, info);
  }

  reset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background-dark text-white">
          <div className="max-w-xl p-8 bg-card-dark border rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2">Algo deu errado</h2>
            <p className="text-sm text-gray-300 mb-4">
              Um erro impediu o carregamento da interface. Você pode recarregar a página ou abrir o console do
              navegador para mais detalhes.
            </p>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
                onClick={() => window.location.reload()}
              >
                Recarregar
              </button>
              <button
                className="px-4 py-2 border rounded text-white"
                onClick={this.reset}
              >
                Tentar novamente
              </button>
            </div>
            <details className="mt-4 text-xs text-gray-400">
              <summary>Mostrar erro</summary>
              <pre className="whitespace-pre-wrap">{String(this.state.error)}</pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
