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
import { DesktopDatePicker } from "@mui/x-date-pickers"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Loader } from "../../../components/Loader"
import { useAlert } from "../../../contexts/alert"
import { HorseInterface, UserInterface } from "../../../interfaces"
import { editHorse, getAdminHorse } from "../../../utils/requests/horse"
import { getUsers } from "../../../utils/requests/user"

const AdminHorseDetail = () => {
    const [loading, setLoading] = useState(false)
    const [horse, setHorse] = useState<HorseInterface | null>(null)
    const [users, setUsers] = useState<UserInterface[]>([])

    const [label, setLabel] = useState("")
    const [owner, setOwner] = useState<number | null>(null)
    const [birthAt, setBirthAt] = useState<Date | null>(null)

    const addAlert = useAlert()
    const params = useParams()

    const fetchData = useCallback(async () => {
        const id = params.id ? parseInt(params.id) : null
        if (!id) return

        await getAdminHorse(id).then(res => {
            if (res.type === "error") addAlert(res)
            else {
                setHorse(res.data)
                setLabel(res.data.label)
                setOwner(res.data.user.id)
                setBirthAt(new Date(res.data.birthAt))
            }
        })
        await getUsers().then(res => {
            if (res.type === "error") addAlert(res)
            else setUsers(res.data)
        })
    }, [addAlert, params.id])

    const handleSubmit = useCallback(async () => {
        if (!horse || !owner || !birthAt) return
        const res = await editHorse(horse.id, label, birthAt, owner)
        if (res.type === "error") addAlert(res)
        else
            addAlert({
                type: "success",
                message: "Utilisateur modifié avec succès.",
            })
    }, [addAlert, birthAt, horse, label, owner])

    useEffect(() => {
        setLoading(true)
        fetchData().then(() => setLoading(false))
    }, [fetchData])

    return loading ? (
        <Loader />
    ) : !horse ? (
        <></>
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
                Modifier cheval
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
                    Modifier
                </Button>
            </Box>
        </Container>
    )
}

export default AdminHorseDetail
