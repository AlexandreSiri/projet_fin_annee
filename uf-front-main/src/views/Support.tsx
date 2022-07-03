import { Box, Button, Container, TextField, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { useAlert } from "../contexts/alert"
import { sendSupport } from "../utils/requests/auth"

const Support = () => {
    const [object, setObject] = useState("")
    const [content, setContent] = useState("")

    const addAlert = useAlert()

    const handleSubmit = useCallback(async () => {
        const res = await sendSupport(object, content)
        if (res.type === "error") addAlert(res)
        else {
            setObject("")
            setContent("")
            addAlert({
                type: "success",
                message: res.data,
            })
        }
    }, [addAlert, content, object])

    return (
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
                Support
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
                    label="Objet"
                    variant="filled"
                    fullWidth
                    value={object}
                    onChange={e => setObject(e.target.value)}
                />
                <TextField
                    label="Message"
                    variant="filled"
                    multiline
                    rows={4}
                    fullWidth
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />
                <Button variant="contained" onClick={handleSubmit}>
                    Envoyer
                </Button>
            </Box>
        </Container>
    )
}

export default Support
