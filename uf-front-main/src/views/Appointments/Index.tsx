import {
    Box,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { Loader } from "../../components/Loader"
import { useAlert } from "../../contexts/alert"
import { JobInterface, UserInterface } from "../../interfaces"
import { getUsers } from "../../utils/requests/user"

const Appointments = () => {
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState<UserInterface[]>([])
    const [user, setUser] = useState<UserInterface | null>(null)
    const [job, setJob] = useState<JobInterface | null>(null)
    const addAlert = useAlert()

    const fetchData = useCallback(async () => {
        const res = await getUsers()

        if (res.type === "error") addAlert(res)
        else setUsers(res.data.filter(u => u.role.label !== "USER"))
    }, [addAlert])
    const userChange = useCallback((user: UserInterface | null) => {
        setUser(user)
        setJob(user?.jobs[0] ?? null)
    }, [])

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
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Typography sx={{ fontSize: 32 }}>Jobs</Typography>
                <Box
                    sx={{
                        display: "flex",
                        columnGap: 2,
                    }}
                >
                    <FormControl variant="filled" sx={{ width: 160 }}>
                        <InputLabel>Utilisateur</InputLabel>
                        <Select
                            value={user?.id}
                            onChange={e =>
                                userChange(
                                    users.find(u => u.id === e.target.value) ??
                                        null
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
                    <FormControl variant="filled" sx={{ width: 160 }}>
                        <InputLabel>Job</InputLabel>
                        <Select
                            value={job?.id}
                            onChange={e =>
                                setJob(
                                    user?.jobs.find(
                                        j => j.id === e.target.value
                                    ) ?? null
                                )
                            }
                        >
                            {user &&
                                user.jobs.map(job => (
                                    <MenuItem value={job.id} key={job.id}>
                                        {job.label}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>
        </Container>
    )
}

export default Appointments
