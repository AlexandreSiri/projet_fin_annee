import { Box, Button, Container, TextField, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { useAlert } from "../contexts/alert"
import { useAuth } from "../contexts/auth"
import { editMe } from "../utils/requests/auth"

const UserEdit = () => {
    const { user, refreshUser } = useAuth()

    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const addAlert = useAlert()

    useEffect(() => {
        if (!user) return
        setFirstname(user.firstname)
        setLastname(user.lastname)
        setEmail(user.email)
    }, [user])

    const handleSubmit = useCallback(async () => {
        if (!user) return
        const res = await editMe(firstname, lastname, email, password)
        if (res.type === "error") addAlert(res)
        else {
            await refreshUser()
            addAlert({
                type: "success",
                message: "Compte modifié avec succès.",
            })
        }
    }, [addAlert, email, firstname, lastname, password, refreshUser, user])

    return !user ? (
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
                Modifier mon compte
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
                <TextField
                    label="Nouveau mot de passe"
                    variant="filled"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <Button variant="contained" onClick={handleSubmit}>
                    Modifier
                </Button>
            </Box>
        </Container>
    )
}

export default UserEdit
