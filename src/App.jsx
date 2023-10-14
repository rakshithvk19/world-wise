import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

//IMPORTING CONTEXT PROVIDERS.
import { CitiesProvider } from "./contexts/CitiesContext";
import { AuthProvider } from "./contexts/AuthenticationContext";

//IMPORTING CUSTOM HOOKS
import ProtectedRoute from "./customHooks/ProtectedRoute";

//IMPORTING COMPONENTS.
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import SpinnerFullPage from "./components/SpinnerFullPage";

//IMPORTING PAGES.
const Homepage = lazy(() => {
  return import("./pages/Homepage");
});
const Product = lazy(() => {
  return import("./pages/Product");
});
const Pricing = lazy(() => {
  return import("./pages/Pricing");
});
const PageNotFound = lazy(() => {
  return import("./pages/PageNotFound");
});
const Login = lazy(() => {
  return import("./pages/Login");
});
const AppLayout = lazy(() => {
  return import("./pages/AppLayout");
});

export default function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route index element={<Homepage />} />
              <Route path="*" element={<PageNotFound />} />
              <Route path="product" element={<Product />} />
              <Route path="pricing" element={<Pricing />} />
              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="cities" />} />
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="login" element={<Login />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}
