import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/auth"

interface RouteProps {
    element: JSX.Element
}
export const GuestRoute = (props: RouteProps) => {
    const { user } = useAuth()
    if (user) return <Navigate to="/" />
    return props.element
}
export const AuthRoute = (props: RouteProps) => {
    const { user } = useAuth()
    if (!user) return <Navigate to="/auth/login" />
    return props.element
}
export const ProfessionalRoute = (props: RouteProps) => {
    const { user } = useAuth()
    if (
        user?.role.label !== "ADMINISTRATOR" &&
        user?.role.label !== "PROFESSIONAL"
    )
        return <Navigate to="/" />
    return props.element
}

export const AdminRoute = (props: RouteProps) => {
    const { user } = useAuth()
    if (user?.role.label !== "ADMINISTRATOR") return <Navigate to="/" />
    return props.element
}
