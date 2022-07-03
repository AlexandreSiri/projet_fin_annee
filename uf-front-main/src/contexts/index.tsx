import { AlertProvider } from "./alert"
import { AuthProvider } from "./auth"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import locale from "date-fns/locale/fr"

const Provider = (props: any) => {
    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={locale}
        >
            <AuthProvider>
                <AlertProvider>{props.children}</AlertProvider>
            </AuthProvider>
        </LocalizationProvider>
    )
}

export default Provider
