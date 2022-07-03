import { Delete, MoreVert, Visibility } from "@mui/icons-material"
import {
    Box,
    Button,
    Container,
    Divider,
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
import { LocationInterface } from "../../../interfaces"
import { formatDate } from "../../../utils/date"
import {
    deleteAdminLocation,
    getLocations,
} from "../../../utils/requests/reservation"

const AdminLocationList = () => {
    const [loading, setLoading] = useState(false)
    const [locations, seLocations] = useState<LocationInterface[]>([])
    const [locationEdit, setLocationEdit] = useState<LocationInterface | null>(
        null
    )
    const [confirmDelete, setConfirmDelete] = useState(false)
    const addAlert = useAlert()

    const openMenu = useCallback((horse: LocationInterface) => {
        setLocationEdit(horse)
    }, [])
    const closeMenu = useCallback(() => {
        setConfirmDelete(false)
        setLocationEdit(null)
    }, [])
    const anchorMenu = useMemo(() => {
        return (document.querySelector(`#menu-${locationEdit?.id}`) ??
            null) as HTMLElement | null
    }, [locationEdit])

    const fetchLocations = useCallback(async () => {
        const res = await getLocations()

        if (res.type === "error") addAlert(res)
        else seLocations(res.data)
    }, [addAlert])
    const handleDelete = useCallback(async () => {
        if (!locationEdit) return
        if (!confirmDelete) return setConfirmDelete(true)

        const res = await deleteAdminLocation(locationEdit.id)
        if (res.type === "error") addAlert(res)
        else {
            await fetchLocations()
            addAlert({ type: "success", message: res.data })
        }
        setLocationEdit(null)
    }, [locationEdit, confirmDelete, addAlert, fetchLocations])

    useEffect(() => {
        setLoading(true)
        fetchLocations().then(() => setLoading(false))
    }, [fetchLocations])

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
                <Link to={`/admin/locations/${locationEdit?.id}`}>
                    <MenuItem>
                        <Visibility />
                        Planning
                    </MenuItem>
                </Link>
                <Divider />
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
                    Emplacements
                </Typography>
                <Link to="/admin/locations/new">
                    <Button variant="contained">Nouveau</Button>
                </Link>
            </Box>
            <TableContainer component={Item}>
                <Table sx={{ minWidth: 650 }} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Label</TableCell>
                            <TableCell>Date ajout</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {locations.map(job => (
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

export default AdminLocationList
