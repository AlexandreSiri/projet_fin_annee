import { Container, Grid, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Item from "../../components/Item"
import { Loader } from "../../components/Loader"
import { useAlert } from "../../contexts/alert"
import { HorseInterface } from "../../interfaces"
import { getHorses } from "../../utils/requests/horse"

const HorseList = () => {
    const [loading, setLoading] = useState(false)
    const [horses, setHorses] = useState<HorseInterface[]>([])
    const addAlert = useAlert()

    const fetchHorses = useCallback(async () => {
        const res = await getHorses()

        if (res.type === "error") addAlert(res)
        else setHorses(res.data)
    }, [addAlert])

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
            <Typography
                sx={{
                    fontSize: {
                        xs: 24,
                        sm: 32,
                    },
                }}
            >
                Mes chevaux
            </Typography>
            <Grid container spacing={2}>
                {horses.map(horse => (
                    <Grid item xs={6} sm={4} md={3} key={horse.id}>
                        <Link to={`/horses/${horse.id}`}>
                            <Item>
                                <Typography variant="h6">
                                    {horse.label}
                                </Typography>
                            </Item>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}

export default HorseList
