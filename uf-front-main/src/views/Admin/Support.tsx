import { Comment, Delete, MoreVert } from "@mui/icons-material"
import {
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
import Item from "../../components/Item"
import { Loader } from "../../components/Loader"
import { useAlert } from "../../contexts/alert"
import { SupportInterface } from "../../interfaces"
import { formatDate } from "../../utils/date"
import { deleteSupport, getSupports } from "../../utils/requests/user"

const SupportList = () => {
    const [loading, setLoading] = useState(false)
    const [supports, setSupports] = useState<SupportInterface[]>([])
    const [supportEdit, setSupportEdit] = useState<SupportInterface | null>(
        null
    )
    const [confirmDelete, setConfirmDelete] = useState(false)

    const addAlert = useAlert()

    const openMenu = useCallback((support: SupportInterface) => {
        setSupportEdit(support)
    }, [])
    const closeMenu = useCallback(() => {
        setConfirmDelete(false)
        setSupportEdit(null)
    }, [])
    const anchorMenu = useMemo(() => {
        return (document.querySelector(`#menu-${supportEdit?.id}`) ??
            null) as HTMLElement | null
    }, [supportEdit])

    const fetchData = useCallback(async () => {
        const res = await getSupports()

        if (res.type === "error") addAlert(res)
        else setSupports(res.data)
    }, [addAlert])
    const handleDelete = useCallback(async () => {
        if (!supportEdit) return
        if (!confirmDelete) return setConfirmDelete(true)
        const res = await deleteSupport(supportEdit.id)
        if (res.type === "error") addAlert(res)
        else {
            await fetchData()
            addAlert({ type: "success", message: res.data })
        }
        setSupportEdit(null)
    }, [supportEdit, confirmDelete, addAlert, fetchData])

    useEffect(() => {
        setLoading(true)
        fetchData().then(() => setLoading(false))
    }, [fetchData])

    return loading ? (
        <Loader />
    ) : (
        <>
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
                    <a href={`mailto:${supportEdit?.user.email}`}>
                        <MenuItem>
                            <Comment />
                            Répondre
                        </MenuItem>
                    </a>
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
                    Support
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
                                <TableCell>Objet</TableCell>
                                <TableCell>Message</TableCell>
                                <TableCell>Auteur</TableCell>
                                <TableCell>Date de création</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {supports.map(support => (
                                <TableRow
                                    key={support.id}
                                    sx={{
                                        "&:last-child td, &:last-child th": {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell>{support.id}</TableCell>
                                    <TableCell>{support.object}</TableCell>
                                    <TableCell>{support.message}</TableCell>
                                    <TableCell>
                                        {support.user.firstname}{" "}
                                        {support.user.lastname}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            position: "relative",
                                        }}
                                    >
                                        {formatDate(support.createdAt)}
                                        <IconButton
                                            id={`menu-${support.id}`}
                                            size="small"
                                            onClick={() => openMenu(support)}
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

export default SupportList
