// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { UserData } from "./pages/UserData";
import { PrivarteRoute } from "./components/PrivateRoute";
import ListFoodCat from "./components/ListFoodCat";
import { Form } from "./pages/Form";
import { Sponsorship } from "./pages/Sponsorship"
import { Adoption } from "./pages/Adoption"
import { DetailCat } from "./pages/DetailCat"
import { Admin } from "./pages/Admin";
import { AdminListSponsor } from "./pages/AdminListSponsor";
import { Acogida } from "./pages/Acogida";
import { EditUserForm } from "./pages/EditUserForm";

export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      <Route path="/" element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/products-kiwoko' element={<ListFoodCat />} />
      <Route path='/sponsorship' element={<Sponsorship />} />
      <Route path="/adoption" element={<Adoption />} />
      <Route path="/form" element={<Form />} />
      <Route path="/detail-cat-page/:cat_id" element={<DetailCat />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin-list-sponsor" element={<AdminListSponsor />} />
      <Route path= "/acogida" element ={<Acogida />} />
      <Route path= "/edit-user" element ={<EditUserForm />} />

      {/* Private Routes: These routes are protected and require authentication. */}
      <Route path="/detail-cat-page/:id" element={<DetailCat />} />
      <Route path="/user-data" element={
        <PrivarteRoute>
          <UserData />
        </PrivarteRoute>
      } />

    </Route>
  )
)
