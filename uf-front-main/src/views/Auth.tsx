import {
    Avatar,
    Box,
    Button,
    Container,
    TextField,
    Typography,
} from "@mui/material"
import { LockOutlined } from "@mui/icons-material"
import { useCallback, useState } from "react"
import { forget, login, register } from "../utils/requests/auth"
import { useAlert } from "../contexts/alert"
import { useAuth } from "../contexts/auth"

interface Props {
    type: "login" | "register" | "forget"
}

export const Auth = (props: Props) => {
    const { refreshUser } = useAuth()
    const [type, setType] = useState(props.type)
    const [firstname, setFirstname] = useState("Maximilien")
    const [lastname, setLastname] = useState("Bey")
    const [email, setEmail] = useState("bey.maximilien@gmail.com")
    const [password, setPassword] = useState("luna1307")
    const [confirmPassword, setConfirmPassword] = useState("luna1307")
    const addAlert = useAlert()

    const handleLogin = useCallback(async () => {
        const response = await login(email, password)
        if (response.type === "error") return addAlert(response)

        localStorage.setItem("ACCESS_TOKEN", response.data.session)
        localStorage.setItem("REFRESH_TOKEN", response.data.refresh)
        await refreshUser()
        addAlert({
            type: "success",
            message: "Vous êtes connecté.",
        })
    }, [addAlert, email, password, refreshUser])
    const handleRegister = useCallback(async () => {
        if (password !== confirmPassword)
            return addAlert({
                type: "error",
                message: "Les mot de passe ne correspondent pas.",
            })

        const response = await register(firstname, lastname, email, password)
        if (response.type === "error") addAlert(response)
        else addAlert({ type: "success", message: response.data })
    }, [password, confirmPassword, addAlert, firstname, lastname, email])
    const handleForget = useCallback(async () => {
        const response = await forget(email)
        if (response.type === "error") addAlert(response)
        else addAlert({ type: "success", message: response.data })
    }, [addAlert, email])
    const handleSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            if (type === "login") handleLogin()
            if (type === "register") handleRegister()
            if (type === "forget") handleForget()
        },
        [type, handleLogin, handleRegister, handleForget]
    )

    const changeType = useCallback((type: Props["type"]) => {
        window.history.replaceState(null, "", `/auth/${type}`)
        setType(type)
    }, [])

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    mt: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ margin: 1 }}>
                    <LockOutlined />
                </Avatar>
                <Box
                    sx={{
                        textAlign: "center",
                        mb: 2,
                    }}
                >
                    <Typography component="h1" variant="h5">
                        {type === "login"
                            ? "Connexion"
                            : type === "register"
                            ? "Inscription"
                            : "Mot de passe oublié"}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: 14,
                        }}
                    >
                        {type === "login" ? (
                            <>
                                Vous n'avez pas de compte ?{" "}
                                <Typography
                                    variant="inherit"
                                    component="span"
                                    sx={{
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                        color: theme =>
                                            theme.palette.primary.main,
                                    }}
                                    onClick={() => changeType("register")}
                                >
                                    Cliquez ici
                                </Typography>
                            </>
                        ) : type === "register" ? (
                            <>
                                Vous avez déjà un compte ?{" "}
                                <Typography
                                    variant="inherit"
                                    component="span"
                                    sx={{
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                        color: theme =>
                                            theme.palette.primary.main,
                                    }}
                                    onClick={() => changeType("login")}
                                >
                                    Cliquez ici
                                </Typography>
                            </>
                        ) : (
                            <>
                                Vous vous souvenez de votre mot de passe ?{" "}
                                <Typography
                                    variant="inherit"
                                    component="span"
                                    sx={{
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                        color: theme =>
                                            theme.palette.primary.main,
                                    }}
                                    onClick={() => changeType("login")}
                                >
                                    Cliquez ici
                                </Typography>
                            </>
                        )}
                    </Typography>
                </Box>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{
                        mt: 1,
                        display: "flex",
                        flexDirection: "column",
                        width: 360,
                        maxWidth: "80vw",
                        rowGap: 1.5,
                    }}
                >
                    {type === "register" && (
                        <>
                            <TextField
                                fullWidth
                                type="text"
                                label="Prénom"
                                value={firstname}
                                onChange={e => setFirstname(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                type="text"
                                label="Nom de famille"
                                value={lastname}
                                onChange={e => setLastname(e.target.value)}
                            />
                        </>
                    )}
                    <TextField
                        fullWidth
                        type="text"
                        label="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />

                    {type === "login" && (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                rowGap: 0.5,
                                alignItems: "flex-end",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                    color: theme => theme.palette.primary.main,
                                }}
                                onClick={() => changeType("forget")}
                            >
                                Mot de passe oublié ?
                            </Typography>
                            <TextField
                                label="Mot de passe"
                                type="password"
                                fullWidth
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </Box>
                    )}
                    {type === "register" && (
                        <>
                            <TextField
                                fullWidth
                                type="password"
                                label="Mot de passe"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                type="password"
                                label="Confirmer le mot de passe"
                                value={confirmPassword}
                                onChange={e =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                        </>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Envoyer
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}
