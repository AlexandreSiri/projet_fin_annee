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
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Loader } from "../../../components/Loader"
import { useAlert } from "../../../contexts/alert"
import { JobInterface, RoleInterface, UserInterface } from "../../../interfaces"
import { getJobs } from "../../../utils/requests/job"
import { editUser, getRoles, getUser } from "../../../utils/requests/user"

const AdminUserEdit = () => {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<UserInterface | null>()
    const [roles, setRoles] = useState<RoleInterface[]>([])
    const [jobs, setJobs] = useState<JobInterface[]>([])

    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState(0)
    const [userJobs, setUserJobs] = useState<number[]>([])

    const addAlert = useAlert()
    const params = useParams()

    const fetchData = useCallback(async () => {
        const id = params.id ? parseInt(params.id) : null
        if (!id) return

        await getUser(id).then(res => {
            if (res.type === "error") addAlert(res)
            else {
                setUser(res.data)
                setFirstname(res.data.firstname)
                setLastname(res.data.lastname)
                setEmail(res.data.email)
                setRole(res.data.role.id)
                setUserJobs(res.data.jobs.map(j => j.id))
            }
        })
        await getRoles().then(res => {
            if (res.type === "error") addAlert(res)
            else setRoles(res.data)
        })
        await getJobs().then(res => {
            if (res.type === "error") addAlert(res)
            else setJobs(res.data)
        })
    }, [params, addAlert])

    const handleSubmit = useCallback(async () => {
        if (!user) return
        const res = await editUser(
            user.id,
            firstname,
            lastname,
            email,
            role,
            userJobs
        )
        if (res.type === "error") addAlert(res)
        else
            addAlert({
                type: "success",
                message: "Utilisateur modifié avec succès.",
            })
    }, [addAlert, email, firstname, lastname, role, user, userJobs])

    useEffect(() => {
        setLoading(true)
        fetchData().then(() => setLoading(false))
    }, [fetchData])

    return loading ? (
        <Loader />
    ) : !user ? (
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
                Modifier utilisateur
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
                    label="Prénom"
                    variant="filled"
                    fullWidth
                    value={firstname}
                    onChange={e => setFirstname(e.target.value)}
                />
                <TextField
                    label="Nom"
                    variant="filled"
                    fullWidth
                    value={lastname}
                    onChange={e => setLastname(e.target.value)}
                />
                <TextField
                    label="Email"
                    variant="filled"
                    fullWidth
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <FormControl variant="filled" sx={{ width: "100%" }}>
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={role}
                        onChange={e => setRole(e.target.value as number)}
                    >
                        {roles.map(role => (
                            <MenuItem value={role.id} key={role.id}>
                                {role.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="filled" sx={{ width: "100%" }}>
                    <InputLabel>Jobs</InputLabel>
                    <Select
                        value={userJobs}
                        multiple
                        onChange={e => setUserJobs(e.target.value as number[])}
                    >
                        {jobs.map(job => (
                            <MenuItem value={job.id} key={job.id}>
                                {job.label}
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

export default AdminUserEdit
