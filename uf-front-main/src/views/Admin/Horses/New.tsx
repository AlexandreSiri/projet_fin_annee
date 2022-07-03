import {
    Box,
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material"
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker"
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader } from "../../../components/Loader"
import { useAlert } from "../../../contexts/alert"
import { UserInterface } from "../../../interfaces"
import { addHorse } from "../../../utils/requests/horse"
import { getUsers } from "../../../utils/requests/user"

const AdminHorseNew = () => {
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState<UserInterface[]>([])

    const [label, setLabel] = useState("")
    const [owner, setOwner] = useState<number | null>(null)
    const [birthAt, setBirthAt] = useState<Date | null>(null)

    const addAlert = useAlert()
    const navigate = useNavigate()

    const fetchData = useCallback(async () => {
        await getUsers().then(res => {
            if (res.type === "error") addAlert(res)
            else setUsers(res.data)
        })
    }, [addAlert])

    const handleSubmit = useCallback(async () => {
        if (!owner || !birthAt) return
        const res = await addHorse(label, birthAt, owner)
        if (res.type === "error") addAlert(res)
        else {
            addAlert({
                type: "success",
                message: "Cheval créé avec succès.",
            })
            navigate("/admin/horses")
        }
    }, [addAlert, birthAt, label, navigate, owner])

    useEffect(() => {
        setLoading(true)
        fetchData().then(() => setLoading(false))
    }, [fetchData])

    return loading ? (
        <Loader />
    ) : (
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
                Nouveau cheval
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
                <DesktopDatePicker
                    label="Date de naissance"
                    inputFormat="dd/MM/yyyy"
                    value={birthAt}
                    onChange={setBirthAt}
                    renderInput={params => (
                        <TextField variant="filled" fullWidth {...params} />
                    )}
                />
                <FormControl variant="filled" sx={{ width: "100%" }}>
                    <InputLabel>Propriétaire</InputLabel>
                    <Select
                        value={owner}
                        onChange={e => setOwner(e.target.value as number)}
                    >
                        {users.map(user => (
                            <MenuItem value={user.id} key={user.id}>
                                {user.firstname} {user.lastname}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={handleSubmit}>
                    Ajouter
                </Button>
            </Box>
        </Container>
    )
}

export default AdminHorseNew
