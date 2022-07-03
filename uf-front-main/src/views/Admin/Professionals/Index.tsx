import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material"
import { DateTimePicker } from "@mui/x-date-pickers"
import { useCallback, useEffect, useMemo, useState } from "react"
import Calendar, { MeetingType } from "../../../components/Calendar"
import { Loader } from "../../../components/Loader"
import { useAlert } from "../../../contexts/alert"
import {
    DisponibilityInterface,
    JobInterface,
    UserInterface,
} from "../../../interfaces"
import { COLORS } from "../../../utils/color"
import {
    createDisponibility,
    deleteDisponibility,
    getAdminDisponibilities,
} from "../../../utils/requests/appointment"
import { getUsers } from "../../../utils/requests/user"

const AdminProfessional = () => {
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState<UserInterface[]>([])
    const [disponibilities, setDisponibilities] = useState<
        DisponibilityInterface[]
    >([])
    const [user, setUser] = useState<UserInterface | null>(null)
    const [job, setJob] = useState<JobInterface | null>(null)
    const [beginAt, setBeginAt] = useState<Date | null>(null)
    const [endAt, setEndAt] = useState<Date | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const addAlert = useAlert()

    const meetings = useMemo(() => {
        const meetings: MeetingType[] = disponibilities
            .filter(d => d.user.id === user?.id)
            .map(
                (disponibility): MeetingType => ({
                    id: disponibility.id.toString(),
                    begin: new Date(disponibility.beginAt),
                    end: new Date(disponibility.endAt),
                    title: disponibility.job.label,
                    color: COLORS[
                        user?.jobs.findIndex(
                            j => j.id === disponibility.job.id
                        ) ?? 0
                    ],
                    deletable: true,
                })
            )
        return meetings
    }, [disponibilities, user])

    const fetchData = useCallback(async () => {
        await getUsers().then(res => {
            if (res.type === "error") addAlert(res)
            else {
                const users = res.data.filter(u => u.role.label !== "USER")
                setUsers(users)
                setUser(user => user ?? users[0] ?? null)
                setJob(job => job ?? users[0]?.jobs[0] ?? null)
            }
        })
        await getAdminDisponibilities().then(res => {
            if (res.type === "error") addAlert(res)
            else setDisponibilities(res.data)
        })
    }, [addAlert])
    const handleDelete = useCallback(
        async (id: string) => {
            await deleteDisponibility(id).then(res => {
                if (res.type === "error") addAlert(res)
                else addAlert({ type: "success", message: res.data })
            })
            fetchData()
        },
        [fetchData, addAlert]
    )
    const userChange = useCallback((user: UserInterface | null) => {
        setUser(user)
    }, [])
    const handleAdd = useCallback(
        (date: Date) => {
            if (!user?.jobs.length)
                return addAlert({
                    type: "error",
                    message: "L'utilisateur ne possède pas de job.",
                })
            setBeginAt(date)
            setEndAt(new Date(date.getTime() + 3600 * 1000))
            setDialogOpen(true)
        },
        [addAlert, user]
    )
    const handleSubmit = useCallback(() => {
        if (!beginAt || !endAt || !user || !job) return
        createDisponibility(beginAt, endAt, user.id, job.id).then(res => {
            if (res.type === "error") addAlert(res)
            else {
                addAlert({ type: "success", message: "Disponibilité ajoutée." })
                fetchData()
                setDialogOpen(false)
            }
        })
    }, [addAlert, beginAt, endAt, job, user, fetchData])

    useEffect(() => {
        setLoading(true)
        fetchData().then(() => setLoading(false))
    }, [fetchData])

    return loading ? (
        <Loader />
    ) : (
        <>
            {user && (
                <Dialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    maxWidth="xl"
                >
                    <DialogTitle
                        sx={{
                            width: {
                                xs: "80vw",
                                lg: "40vw",
                            },
                        }}
                    >
                        Nouvelle disponibilité
                    </DialogTitle>
                    <DialogContent
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 2,
                        }}
                    >
                        <FormControl variant="filled" sx={{ width: "100%" }}>
                            <InputLabel>Job</InputLabel>
                            <Select
                                value={job?.id ?? ""}
                                onChange={e =>
                                    setJob(
                                        user.jobs.find(
                                            j => j.id === e.target.value
                                        ) ?? null
                                    )
                                }
                            >
                                {user.jobs.map(job => (
                                    <MenuItem value={job.id} key={job.id}>
                                        {job.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <DateTimePicker
                            label="Date de début"
                            inputFormat="dd/MM/yyyy HH:mm"
                            value={beginAt}
                            onChange={setBeginAt}
                            renderInput={params => (
                                <TextField
                                    variant="filled"
                                    fullWidth
                                    {...params}
                                />
                            )}
                        />
                        <DateTimePicker
                            label="Date de fin"
                            inputFormat="dd/MM/yyyy HH:mm"
                            value={endAt}
                            onChange={setEndAt}
                            renderInput={params => (
                                <TextField
                                    variant="filled"
                                    fullWidth
                                    {...params}
                                />
                            )}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)}>
                            Annuler
                        </Button>
                        <Button onClick={handleSubmit}>Ajouter</Button>
                    </DialogActions>
                </Dialog>
            )}
            <Container
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 4,
                    pt: 4,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
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
                        Professionels
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            columnGap: 2,
                        }}
                    >
                        <FormControl variant="filled" sx={{ width: 160 }}>
                            <InputLabel>Utilisateur</InputLabel>
                            <Select
                                value={user?.id ?? ""}
                                onChange={e =>
                                    userChange(
                                        users.find(
                                            u => u.id === e.target.value
                                        ) ?? null
                                    )
                                }
                            >
                                {users.map(user => (
                                    <MenuItem value={user.id} key={user.id}>
                                        {user.firstname} {user.lastname}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Calendar
                    meetings={meetings}
                    onDelete={handleDelete}
                    onCreate={handleAdd}
                />
            </Container>
        </>
    )
}

export default AdminProfessional
