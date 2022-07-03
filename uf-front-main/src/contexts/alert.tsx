import { Alert, Portal, Snackbar } from "@mui/material"
import { createContext, useCallback, useContext, useState } from "react"

type AlertType = {
    type: "success" | "error"
    message: string
}

const AlertContext = createContext<(data: AlertType) => void>(() => {})
export const useAlert = () => useContext(AlertContext)

export const AlertProvider = (props: any) => {
    const [alert, setAlert] = useState<AlertType | undefined>(undefined)
    const [alertOpen, sertAlertOpen] = useState<boolean>(false)

    const addAlert = useCallback((alert: AlertType) => {
        sertAlertOpen(false)
        setTimeout(() => {
            setAlert(alert)
            sertAlertOpen(true)
        }, 0)
    }, [])
    const alertClose = useCallback((_?: any, reason?: string) => {
        if (reason === "clickaway") return
        sertAlertOpen(false)
    }, [])

    return (
        <AlertContext.Provider value={addAlert}>
            <Portal>
                <Snackbar
                    open={alertOpen}
                    autoHideDuration={6000}
                    onClose={alertClose}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                    <Alert
                        onClose={alertClose}
                        severity={alert?.type}
                        variant="filled"
                        sx={{
                            maxWidth: 440,
                        }}
                    >
                        {alert?.message}
                    </Alert>
                </Snackbar>
            </Portal>
            {props.children}
        </AlertContext.Provider>
    )
}
