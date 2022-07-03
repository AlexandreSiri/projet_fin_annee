import { Delete, MoreVert } from "@mui/icons-material"
import {
    Box,
    Button,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material"
import { red } from "@mui/material/colors"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import Item from "../../../components/Item"
import { Loader } from "../../../components/Loader"
import { useAlert } from "../../../contexts/alert"
import { JobInterface } from "../../../interfaces"
import { formatDate } from "../../../utils/date"
import { deleteJob, getJobs } from "../../../utils/requests/job"

const AdminJobList = () => {
    const [loading, setLoading] = useState(false)
    const [jobs, setJobs] = useState<JobInterface[]>([])
    const [jobEdit, setJobEdit] = useState<JobInterface | null>(null)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const addAlert = useAlert()

    const openMenu = useCallback((horse: JobInterface) => {
        setJobEdit(horse)
    }, [])
    const closeMenu = useCallback(() => {
        setConfirmDelete(false)
        setJobEdit(null)
    }, [])
    const anchorMenu = useMemo(() => {
        return (document.querySelector(`#menu-${jobEdit?.id}`) ??
            null) as HTMLElement | null
    }, [jobEdit])

    const fetchJobs = useCallback(async () => {
        const res = await getJobs()

        if (res.type === "error") addAlert(res)
        else setJobs(res.data)
    }, [addAlert])
    const handleDelete = useCallback(async () => {
        if (!jobEdit) return
        if (!confirmDelete) return setConfirmDelete(true)

        const res = await deleteJob(jobEdit.id)
        if (res.type === "error") addAlert(res)
        else {
            await fetchJobs()
            addAlert({ type: "success", message: res.data })
        }
        setJobEdit(null)
    }, [jobEdit, confirmDelete, addAlert, fetchJobs])

    useEffect(() => {
        setLoading(true)
        fetchJobs().then(() => setLoading(false))
    }, [fetchJobs])

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
            <Menu
                anchorEl={anchorMenu}
                keepMounted
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={!!anchorMenu}
                onClose={closeMenu}
                sx={{
                    "& ul": {
                        paddingTop: 0.5,
                        paddingBottom: 0.5,
                    },
                    "& .MuiSvgIcon-root": {
                        fontSize: 18,
                        color: theme => theme.palette.text.secondary,
                        marginRight: 1.5,
                    },
                }}
            >
                <MenuItem
                    sx={
                        confirmDelete
                            ? {
                                  "&, & > .MuiSvgIcon-root": {
                                      color: red.A700,
                                  },
                              }
                            : {}
                    }
                    onClick={handleDelete}
                >
                    <Delete />
                    {confirmDelete ? "Confirmer" : "Supprimer"}
                </MenuItem>
            </Menu>
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
                    Jobs
                </Typography>
                <Link to="/admin/jobs/new">
                    <Button variant="contained">Nouveau</Button>
                </Link>
            </Box>
            <TableContainer component={Item}>
                <Table sx={{ minWidth: 650 }} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Label</TableCell>
                            <TableCell>Tarif</TableCell>
                            <TableCell>Date ajout</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {jobs.map(job => (
                            <TableRow
                                key={job.id}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell>{job.id}</TableCell>
                                <TableCell>{job.label}</TableCell>
                                <TableCell>{job.price}</TableCell>
                                <TableCell
                                    sx={{
                                        position: "relative",
                                    }}
                                >
                                    {formatDate(job.createdAt)}
                                    <IconButton
                                        id={`menu-${job.id}`}
                                        size="small"
                                        onClick={() => openMenu(job)}
                                        sx={{
                                            position: "absolute",
                                            top: "50%",
                                            right: 0,
                                            transform: "translateY(-50%)",
                                            "& svg": {
                                                height: 20,
                                                width: 20,
                                            },
                                        }}
                                    >
                                        <MoreVert />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
}

export default AdminJobList
