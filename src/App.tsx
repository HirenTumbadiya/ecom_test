import MainLayout from "app/layouts/MainLayout";
import AppProvider from "app/providers/AppProvider";
import AppRoutes from "./app/routes/AppRoutes";

function App() {
  return (
    <AppProvider>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </AppProvider>
  );
}

export default App;
