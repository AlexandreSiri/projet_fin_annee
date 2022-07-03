import {
    AppBar,
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { useAuth } from "../contexts/auth"
import {
    AccountCircle,
    CalendarMonth,
    ContactSupport,
    House,
    LocationOn,
    ManageAccounts,
    Person,
    Pets,
    SupportAgent,
    Work,
} from "@mui/icons-material"
import React, { useCallback, useState } from "react"
import { Link } from "react-router-dom"
import { logout } from "../utils/requests/auth"
import { useAlert } from "../contexts/alert"

const drawerElements: {
    path: string
    label: string
    icon: JSX.Element
}[][] = [
    [
        {
            path: "/",
            label: "Accueil",
            icon: <House />,
        },
        {
            path: "/horses",
            label: "Mes chevaux",
            icon: <Pets />,
        },
        {
            path: "/support",
            label: "Support",
            icon: <ContactSupport />,
        },
    ],
    [
        {
            path: "/professional/appointments",
            label: "Emploie du temps",
            icon: <CalendarMonth />,
        },
    ],
    [
        {
            path: "/admin/users",
            label: "Utilisateurs",
            icon: <Person />,
        },
        {
            path: "/admin/supports",
            label: "Support",
            icon: <SupportAgent />,
        },
        {
            path: "/admin/professionals",
            label: "Professionels",
            icon: <ManageAccounts />,
        },
        {
            path: "/admin/horses",
            label: "Chevaux",
            icon: <Pets />,
        },
        {
            path: "/admin/jobs",
            label: "Jobs",
            icon: <Work />,
        },
        {
            path: "/admin/locations",
            label: "Emplacements",
            icon: <LocationOn />,
        },
    ],
]

const Navbar = (props: { children: JSX.Element }) => {
    const { user, refreshUser } = useAuth()
    const addAlert = useAlert()
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const [drawerOpen, setDrawerOpen] = useState(false)

    const openMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }, [])
    const closeMenu = useCallback(() => {
        setAnchorEl(null)
    }, [])
    const openDrawer = useCallback(() => setDrawerOpen(true), [])
    const closeDrawer = useCallback(() => setDrawerOpen(false), [])
    const linkClick = useCallback(() => {
        setDrawerOpen(false)
        setAnchorEl(null)
    }, [])
    const signOut = useCallback(() => {
        addAlert({
            type: "success",
            message: "Vous êtes déconnecté.",
        })
        logout()
        refreshUser()
        setDrawerOpen(false)
        setAnchorEl(null)
    }, [refreshUser, addAlert])

    if (!user) return props.children
    return (
        <>
            <Drawer anchor="left" open={drawerOpen} onClose={closeDrawer}>
                <Box sx={{ width: 250 }}>
                    {drawerElements
                        .filter((_, index) =>
                            user.role.label === "USER"
                                ? !index
                                : user.role.label === "PROFESSIONAL"
                                ? index <= 1
                                : true
                        )
                        .map((elements, index, self) => (
                            <React.Fragment key={index}>
                                <List>
                                    {elements.map((element, index) => (
                                        <Link to={element.path} key={index}>
                                            <ListItem
                                                disablePadding
                                                onClick={linkClick}
                                            >
                                                <ListItemButton>
                                                    <ListItemIcon>
                                                        {element.icon}
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={element.label}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        </Link>
                                    ))}
                                </List>
                                {index !== self.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                </Box>
            </Drawer>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={openDrawer}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            fontSize: {
                                sm: 20,
                                xs: 14,
                            },
                        }}
                    >
                        <Link to="/">Écuries de Persévère</Link>
                    </Typography>
                    <Button
                        onClick={openMenu}
                        color="inherit"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: 1,
                            textTransform: "initial",
                        }}
                    >
                        <Typography
                            sx={{
                                display: {
                                    xs: "none",
                                    sm: "block",
                                },
                            }}
                        >
                            {user.firstname}
                        </Typography>
                        <AccountCircle />
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        open={!!anchorEl}
                        onClose={closeMenu}
                    >
                        <Link to="/account">
                            <MenuItem onClick={linkClick}>Mon compte</MenuItem>
                        </Link>
                        <MenuItem onClick={signOut}>Déconnexion</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    position: "relative",
                    minHeight: "calc(100vh - 64px)",
                }}
            >
                {props.children}
            </Box>
        </>
    )
}

export default Navbar
