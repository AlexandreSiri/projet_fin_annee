import { Delete, Edit, MoreVert } from "@mui/icons-material"
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
import { HorseInterface } from "../../../interfaces"
import { formatDate } from "../../../utils/date"
import { deleteHorse, getAdminHorses } from "../../../utils/requests/horse"

const AdminHorseList = () => {
    const [loading, setLoading] = useState(false)
    const [horses, setHorses] = useState<HorseInterface[]>([])
    const [horseEdit, setHorseEdit] = useState<HorseInterface | null>(null)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const addAlert = useAlert()

    const openMenu = useCallback((horse: HorseInterface) => {
        setHorseEdit(horse)
    }, [])
    const closeMenu = useCallback(() => {
        setConfirmDelete(false)
        setHorseEdit(null)
    }, [])
    const anchorMenu = useMemo(() => {
        return (document.querySelector(`#menu-${horseEdit?.id}`) ??
            null) as HTMLElement | null
    }, [horseEdit])

    const fetchHorses = useCallback(async () => {
        const res = await getAdminHorses()

        if (res.type === "error") addAlert(res)
        else setHorses(res.data)
    }, [addAlert])
    const handleDelete = useCallback(async () => {
        if (!horseEdit) return
        if (!confirmDelete) return setConfirmDelete(true)

        const res = await deleteHorse(horseEdit.id)
        if (res.type === "error") addAlert(res)
        else {
            await fetchHorses()
            addAlert({ type: "success", message: res.data })
        }
        setHorseEdit(null)
    }, [horseEdit, confirmDelete, addAlert, fetchHorses])

    useEffect(() => {
        setLoading(true)
        fetchHorses().then(() => setLoading(false))
    }, [fetchHorses])

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
                <Link to={`/admin/horses/${horseEdit?.id}`}>
                    <MenuItem>
                        <Edit />
                        Modifier
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
                    Chevaux
                </Typography>
                <Link to="/admin/horses/new">
                    <Button variant="contained">Nouveau</Button>
                </Link>
            </Box>
            <TableContainer component={Item}>
                <Table sx={{ minWidth: 650 }} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nom</TableCell>
                            <TableCell>Propriétaire</TableCell>
                            <TableCell>Date de naissance</TableCell>
                            <TableCell>Date ajout</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {horses.map(horse => (
                            <TableRow
                                key={horse.id}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell>{horse.id}</TableCell>
                                <TableCell>{horse.label}</TableCell>
                                <TableCell>
                                    {horse.user.firstname} {horse.user.lastname}
                                </TableCell>
                                <TableCell>
                                    {formatDate(horse.birthAt, true)}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        position: "relative",
                                    }}
                                >
                                    {formatDate(horse.createdAt)}
                                    <IconButton
                                        id={`menu-${horse.id}`}
                                        size="small"
                                        onClick={() => openMenu(horse)}
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

export default AdminHorseList
