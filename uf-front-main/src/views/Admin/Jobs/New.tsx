import { Box, Button, Container, TextField, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAlert } from "../../../contexts/alert"
import { addJob } from "../../../utils/requests/job"

const AdminJobNew = () => {
    const [label, setLabel] = useState("")
    const [price, setPrice] = useState<number>(0)

    const addAlert = useAlert()
    const navigate = useNavigate()

    const handleSubmit = useCallback(async () => {
        const res = await addJob(label, price)
        if (res.type === "error") addAlert(res)
        else {
            addAlert({
                type: "success",
                message: "Job créé avec succès.",
            })
            navigate("/admin/jobs")
        }
    }, [addAlert, label, navigate, price])

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
                Nouveau job
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
                <TextField
                    label="Prix"
                    variant="filled"
                    fullWidth
                    value={price}
                    type="number"
                    onChange={e => setPrice(parseInt(e.target.value))}
                />
                <Button variant="contained" onClick={handleSubmit}>
                    Ajouter
                </Button>
            </Box>
        </Container>
    )
}

export default AdminJobNew
