import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { Sidebar } from "./components/Sidebar";
import Spinner from "./components/Spinner";

// carregamento dinâmico das páginas
const Login = lazy(() => import("./pages/Login"));
const RegisterOrder = lazy(() => import("./pages/RegisterOrder"));
const Register = lazy(() => import("./pages/Register"));
const Conferente = lazy(() => import("./pages/Conferente"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const Settings = lazy(() => import("./pages/Settings"));
const Logout = lazy(() => import("./pages/Logout"));

export default function App() {
  const { user, role, loading, logout } = useAuth();

  if (loading) {
    // spinner enquanto carrega a sessão inicial
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-container flex h-screen">
        <Sidebar role={role} onSignOut={logout} />

        {/* conteúdo principal rolável */}
        <main className="content flex-1 overflow-y-auto">
          {/* Suspense exibe o spinner sempre que uma rota está sendo carregada */}
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-full">
                <Spinner />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />

              <Route
                path="/login"
                element={
                  !user ? (
                    <Login />
                  ) : (
                    <Navigate
                      to={
                        role === "admin"
                          ? "/admin"
                          : role === "conferente"
                          ? "/conferente"
                          : "/order"
                      }
                      replace
                    />
                  )
                }
              />

              <Route
                path="/signup"
                element={!user ? <Register /> : <Navigate to="/login" replace />}
              />

              <Route path="/logout" element={<Logout />} />

              <Route
                path="/settings"
                element={user ? <Settings /> : <Navigate to="/login" replace />}
              />

              <Route
                path="/order"
                element={
                  user && (role === "atendente" || role === "admin") ? (
                    <RegisterOrder />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route path="/register" element={<Navigate to="/order" replace />} />

              <Route
                path="/conferente"
                element={
                  user && (role === "conferente" || role === "admin") ? (
                    <Conferente />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/admin"
                element={
                  user && role === "admin" ? (
                    <AdminPanel />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}
