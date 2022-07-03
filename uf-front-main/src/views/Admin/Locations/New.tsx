import { Box, Button, Container, TextField, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAlert } from "../../../contexts/alert"
import { addLocation } from "../../../utils/requests/reservation"

const AdminLocationNew = () => {
    const [label, setLabel] = useState("")

    const addAlert = useAlert()
    const navigate = useNavigate()

    const handleSubmit = useCallback(async () => {
        const res = await addLocation(label)
        if (res.type === "error") addAlert(res)
        else {
            addAlert({
                type: "success",
                message: "Job créé avec succès.",
            })
            navigate("/admin/locations")
        }
    }, [addAlert, label, navigate])

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: 4,
                pt: 4,
            }}
        >
            <Typography
                sx={{
                    fontSize: {
                        xs: 24,
                        sm: 32,
                    },
                }}
            >
                Nouvel emplacement
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    rowGap: 2,
                }}
            >
                <TextField
                    label="Nom"
                    variant="filled"
                    fullWidth
                    value={label}
                    onChange={e => setLabel(e.target.value)}
                />
                <Button variant="contained" onClick={handleSubmit}>
                    Ajouter
                </Button>
            </Box>
        </Container>
    )
}

export default AdminLocationNew
