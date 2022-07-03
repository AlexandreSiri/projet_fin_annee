import {
    Check,
    Delete,
    Description,
    Edit,
    MoreVert,
    Visibility,
} from "@mui/icons-material"
import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
    TextField,
    Typography,
} from "@mui/material"
import { lightBlue, red } from "@mui/material/colors"
import { DatePicker } from "@mui/x-date-pickers"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import Item from "../../../components/Item"
import { Loader } from "../../../components/Loader"
import { useAlert } from "../../../contexts/alert"
import { UserInterface } from "../../../interfaces"
import {
    deleteUser,
    getUsers,
    verifyUser,
    generateInvoice,
} from "../../../utils/requests/user"

const UserList = () => {
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState<UserInterface[]>([])
    const [userEdit, setUserEdit] = useState<UserInterface | null>(null)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [invoiceDate, setInvoiceDate] = useState<Date | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const addAlert = useAlert()

    const openMenu = useCallback((user: UserInterface) => {
        setUserEdit(user)
    }, [])
    const closeMenu = useCallback(() => {
        setConfirmDelete(false)
        setUserEdit(null)
    }, [])
    const anchorMenu = useMemo(() => {
        return (document.querySelector(`#menu-${userEdit?.id}`) ??
            null) as HTMLElement | null
    }, [userEdit])

    const openDialog = useCallback(() => {
        setInvoiceDate(new Date())
        setDialogOpen(true)
    }, [])
    const handleSubmit = useCallback(async () => {
        if (!userEdit || !invoiceDate) return
        const res = await generateInvoice(userEdit.id, invoiceDate)
        if (res.type === "error") addAlert(res)
        else {
            closeMenu()
            window.open(res.data, "_blank")?.focus()
        }
    }, [addAlert, closeMenu, invoiceDate, userEdit])

    const fetchUsers = useCallback(async () => {
        const res = await getUsers()

        if (res.type === "error") addAlert(res)
        else setUsers(res.data)
    }, [addAlert])
    const handleVerify = useCallback(async () => {
        if (!userEdit) return
        const res = await verifyUser(userEdit.id)
        if (res.type === "error") addAlert(res)
        else {
            await fetchUsers()
            addAlert({ type: "success", message: res.data })
        }
        setUserEdit(null)
    }, [userEdit, addAlert, fetchUsers])
    const handleDelete = useCallback(async () => {
        if (!userEdit) return
        if (!confirmDelete) return setConfirmDelete(true)

        const res = await deleteUser(userEdit.id)
        if (res.type === "error") addAlert(res)
        else {
            await fetchUsers()
            addAlert({ type: "success", message: res.data })
        }
        setUserEdit(null)
    }, [userEdit, confirmDelete, addAlert, fetchUsers])

    useEffect(() => {
        setLoading(true)
        fetchUsers().then(() => setLoading(false))
    }, [fetchUsers])

    return loading ? (
        <Loader />
    ) : (
        <>
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
                    Générer facture
                </DialogTitle>
                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 2,
                    }}
                >
                    <DatePicker
                        label="Mois de la facture"
                        views={["year", "month"]}
                        inputFormat="MM/yyyy"
                        value={invoiceDate}
                        onChange={setInvoiceDate}
                        renderInput={params => (
                            <TextField variant="filled" fullWidth {...params} />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>
                        Annuler
                    </Button>
                    <Button onClick={handleSubmit}>Générer et envoyer</Button>
                </DialogActions>
            </Dialog>
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
                    {userEdit?.validated === false && (
                        <MenuItem onClick={handleVerify}>
                            <Check />
                            Valider
                        </MenuItem>
                    )}
                    <Link to={`/admin/users/${userEdit?.id}`}>
                        <MenuItem>
                            <Visibility />
                            Planning
                        </MenuItem>
                    </Link>
                    <MenuItem onClick={openDialog}>
                        <Description />
                        Générer facture
                    </MenuItem>
                    <Link to={`/admin/users/${userEdit?.id}/edit`}>
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
                <Typography
                    sx={{
                        fontSize: {
                            xs: 24,
                            sm: 32,
                        },
                    }}
                >
                    Utilisateurs
                </Typography>
                <TableContainer component={Item}>
                    <Table
                        sx={{ minWidth: 650 }}
                        size="small"
                        aria-label="a dense table"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nom</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map(user => (
                                <TableRow
                                    key={user.id}
                                    sx={{
                                        "&:last-child td, &:last-child th": {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>
                                        {user.firstname} {user.lastname}
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell
                                        sx={{
                                            color:
                                                user.role.label ===
                                                "ADMINISTRATOR"
                                                    ? red.A700
                                                    : user.role.label ===
                                                      "PROFESSIONAL"
                                                    ? lightBlue[900]
                                                    : "text.primary",
                                        }}
                                    >
                                        {user.role.label}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            position: "relative",
                                        }}
                                    >
                                        {user.validated
                                            ? "Validé"
                                            : "Non validé"}
                                        <IconButton
                                            id={`menu-${user.id}`}
                                            size="small"
                                            onClick={() => openMenu(user)}
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
        </>
    )
}

export default UserList
