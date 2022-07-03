import { Routes, Route, BrowserRouter } from "react-router-dom"
import Navbar from "../components/Navbar"
import AdminHorseDetail from "../views/Admin/Horses/Detail"
import AdminHorseList from "../views/Admin/Horses/List"
import AdminHorseNew from "../views/Admin/Horses/New"
import AdminJobList from "../views/Admin/Jobs/List"
import AdminJobNew from "../views/Admin/Jobs/New"
import AdminLocationDetail from "../views/Admin/Locations/Detail"
import AdminLocationList from "../views/Admin/Locations/List"
import AdminLocationNew from "../views/Admin/Locations/New"
import AdminProfessional from "../views/Admin/Professionals/Index"
import SupportList from "../views/Admin/Support"
import UserDetail from "../views/Admin/Users/Detail"
import AdminUserEdit from "../views/Admin/Users/Edit"
import UserList from "../views/Admin/Users/List"
import Appointments from "../views/Appointments/Index"
import { Auth } from "../views/Auth"
import Home from "../views/Home"
import HorseDetail from "../views/Horses/Detail"
import HorseList from "../views/Horses/List"
import ProfessionalAppointmentList from "../views/Professional/AppointmentList"
import Support from "../views/Support"
import UserEdit from "../views/UserEdit"
import { AdminRoute, AuthRoute, GuestRoute, ProfessionalRoute } from "./routes"

const Router = () => {
    return (
        <BrowserRouter>
            <Navbar>
                <Routes>
                    <Route
                        path="/"
                        element={<AuthRoute element={<Home />} />}
                    />
                    <Route
                        path="/account"
                        element={<AuthRoute element={<UserEdit />} />}
                    />
                    <Route
                        path="/support"
                        element={<AuthRoute element={<Support />} />}
                    />
                    <Route
                        path="/horses"
                        element={<AuthRoute element={<HorseList />} />}
                    />
                    <Route
                        path="/appointments"
                        element={<AuthRoute element={<Appointments />} />}
                    />
                    <Route
                        path="/horses/:id"
                        element={<AuthRoute element={<HorseDetail />} />}
                    />

                    <Route
                        path="/auth/login"
                        element={<GuestRoute element={<Auth type="login" />} />}
                    />
                    <Route
                        path="/auth/register"
                        element={
                            <GuestRoute element={<Auth type="register" />} />
                        }
                    />
                    <Route
                        path="/auth/forget"
                        element={
                            <GuestRoute element={<Auth type="forget" />} />
                        }
                    />

                    <Route
                        path="/professional/appointments"
                        element={
                            <ProfessionalRoute
                                element={<ProfessionalAppointmentList />}
                            />
                        }
                    />

                    <Route
                        path="/admin/supports"
                        element={<AdminRoute element={<SupportList />} />}
                    />
                    <Route
                        path="/admin/users"
                        element={<AdminRoute element={<UserList />} />}
                    />
                    <Route
                        path="/admin/users/:id/edit"
                        element={<AdminRoute element={<AdminUserEdit />} />}
                    />
                    <Route
                        path="/admin/users/:id"
                        element={<AdminRoute element={<UserDetail />} />}
                    />
                    <Route
                        path="/admin/horses"
                        element={<AdminRoute element={<AdminHorseList />} />}
                    />
                    <Route
                        path="/admin/horses/new"
                        element={<AdminRoute element={<AdminHorseNew />} />}
                    />
                    <Route
                        path="/admin/horses/:id"
                        element={<AdminRoute element={<AdminHorseDetail />} />}
                    />
                    <Route
                        path="/admin/jobs"
                        element={<AdminRoute element={<AdminJobList />} />}
                    />
                    <Route
                        path="/admin/jobs/new"
                        element={<AdminRoute element={<AdminJobNew />} />}
                    />
                    <Route
                        path="/admin/locations"
                        element={<AdminRoute element={<AdminLocationList />} />}
                    />
                    <Route
                        path="/admin/locations/new"
                        element={<AdminRoute element={<AdminLocationNew />} />}
                    />
                    <Route
                        path="/admin/locations/:id"
                        element={
                            <AdminRoute element={<AdminLocationDetail />} />
                        }
                    />
                    <Route
                        path="/admin/professionals"
                        element={<AdminRoute element={<AdminProfessional />} />}
                    />
                </Routes>
            </Navbar>
        </BrowserRouter>
    )
}

export default Router
