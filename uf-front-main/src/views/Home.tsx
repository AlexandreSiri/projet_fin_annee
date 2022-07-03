import { Box, Container, Grid, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Item from "../components/Item"
import { Loader } from "../components/Loader"
import { useAlert } from "../contexts/alert"
import {
    AppointmentInterface,
    HorseInterface,
    ReservationInterface,
} from "../interfaces"
import { COLORS } from "../utils/color"
import { formatDateLiteral } from "../utils/date"
import { getAppointments } from "../utils/requests/appointment"
import { getHorses } from "../utils/requests/horse"
import { getReservations } from "../utils/requests/reservation"

const Home = () => {
    const [loading, setLoading] = useState(false)
    const [horses, setHorses] = useState<HorseInterface[]>([])
    const [appointments, setAppointments] = useState<AppointmentInterface[]>([])
    const [reservations, setReservations] = useState<ReservationInterface[]>([])
    const addAlert = useAlert()

    const fetchData = useCallback(async () => {
        await getHorses().then(res => {
            if (res.type === "error") addAlert(res)
            else setHorses(res.data)
        })
        await getAppointments().then(res => {
            if (res.type === "error") addAlert(res)
            else
                setAppointments(
                    res.data.filter(
                        f => new Date(f.date).getTime() > new Date().getTime()
                    )
                )
        })
        await getReservations().then(res => {
            if (res.type === "error") addAlert(res)
            else
                setReservations(
                    res.data.filter(
                        f => new Date(f.date).getTime() > new Date().getTime()
                    )
                )
        })
    }, [addAlert])

    useEffect(() => {
        setLoading(true)
        fetchData().then(() => setLoading(false))
    }, [fetchData])

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
                Accueil
            </Typography>
            <Grid
                container
                spacing={2}
                sx={{
                    rowGap: 3,
                }}
            >
                <Grid item xs={12} sm={6}>
                    <Item
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 2,
                            height: {
                                sm: "50vh",
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                color: "text.primary",
                                fontSize: {
                                    xs: 16,
                                    sm: 20,
                                },
                            }}
                        >
                            Rendez-vous
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                rowGap: 2,
                                padding: theme => theme.spacing(0, 4),
                            }}
                        >
                            {appointments.map(appointment => {
                                const color =
                                    COLORS[
                                        horses.findIndex(
                                            h => h.id === appointment.horse.id
                                        )
                                    ]

                                return (
                                    <Typography
                                        key={appointment.id}
                                        sx={{
                                            textAlign: "left",
                                            lineHeight: 1,
                                            fontSize: {
                                                xs: 14,
                                                sm: 16,
                                            },
                                            "& a": {
                                                color,
                                                marginRight: {
                                                    xs: 2,
                                                    sm: 4,
                                                },
                                            },
                                        }}
                                    >
                                        <Link
                                            to={`/horses/${appointment.horse.id}`}
                                        >
                                            {appointment.horse.label}
                                        </Link>
                                        rendez vous{" "}
                                        <strong>
                                            {
                                                appointment.disponibility.job
                                                    .label
                                            }
                                        </strong>{" "}
                                        le {formatDateLiteral(appointment.date)}
                                    </Typography>
                                )
                            })}
                        </Box>
                    </Item>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Item
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 2,
                            height: {
                                sm: "50vh",
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                color: "text.primary",
                                fontSize: {
                                    xs: 16,
                                    sm: 20,
                                },
                            }}
                        >
                            Réservations
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                rowGap: 2,
                                padding: theme => theme.spacing(0, 4),
                            }}
                        >
                            {reservations.map(reservation => {
                                const color =
                                    COLORS[
                                        horses.findIndex(
                                            h => h.id === reservation.horse.id
                                        )
                                    ]

                                return (
                                    <Typography
                                        key={reservation.id}
                                        sx={{
                                            textAlign: "left",
                                            lineHeight: 1,
                                            fontSize: {
                                                xs: 14,
                                                sm: 16,
                                            },
                                            "& a": {
                                                color,
                                                marginRight: {
                                                    xs: 2,
                                                    sm: 4,
                                                },
                                            },
                                        }}
                                    >
                                        <Link
                                            to={`/horses/${reservation.horse.id}`}
                                        >
                                            {reservation.horse.label}
                                        </Link>
                                        réservation de{" "}
                                        <strong>
                                            {reservation.location.label}
                                        </strong>{" "}
                                        le {formatDateLiteral(reservation.date)}
                                    </Typography>
                                )
                            })}
                        </Box>
                    </Item>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Home
