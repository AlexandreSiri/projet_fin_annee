import {
    Box,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import Calendar, { MeetingType } from "../../../components/Calendar"
import { Loader } from "../../../components/Loader"
import { useAlert } from "../../../contexts/alert"
import {
    AppointmentInterface,
    HorseInterface,
    ReservationInterface,
    UserInterface,
} from "../../../interfaces"
import { COLORS } from "../../../utils/color"
import {
    deleteAdminAppointment,
    getAdminUserAppointments,
} from "../../../utils/requests/appointment"
import { getAdminUserHorses } from "../../../utils/requests/horse"
import {
    deleteAdminReservation,
    getAdminUserReservations,
} from "../../../utils/requests/reservation"
import { getUser } from "../../../utils/requests/user"

const UserDetail = () => {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<UserInterface | null>(null)
    const [horse, setHorse] = useState<HorseInterface | null>(null)
    const [horses, setHorses] = useState<HorseInterface[]>([])
    const [appointments, setAppointments] = useState<AppointmentInterface[]>([])
    const [reservations, setReservations] = useState<ReservationInterface[]>([])

    const addAlert = useAlert()
    const params = useParams()

    const meetings = useMemo(() => {
        const meetings: MeetingType[] = [
            ...appointments
                .filter(f => f.horse.id === horse?.id)
                .map(appointment => ({
                    id: `a-${appointment.id}`,
                    begin: new Date(appointment.date),
                    end: new Date(
                        new Date(appointment.date).getTime() + 3600 * 1000
                    ),
                    title: `${appointment.disponibility.job.label} - ${appointment.disponibility.user.lastname}`,
                    color: COLORS[0],
                    deletable: true,
                })),
            ...reservations
                .filter(f => f.horse.id === horse?.id)
                .map(reservation => ({
                    id: `r-${reservation.id}`,
                    begin: new Date(reservation.date),
                    end: new Date(
                        new Date(reservation.date).getTime() + 3600 * 1000
                    ),
                    title: reservation.location.label,
                    color: COLORS[1],
                    deletable: true,
                })),
        ]
        return meetings
    }, [horse, appointments, reservations])

    const fetchData = useCallback(async () => {
        const id = params.id ? parseInt(params.id) : null
        if (!id) return

        await getUser(id).then(res => {
            if (res.type === "error") addAlert(res)
            else setUser(res.data)
        })
        await getAdminUserHorses(id).then(res => {
            if (res.type === "error") return addAlert(res)
            else {
                setHorses(res.data)
                setHorse(res.data[0] ?? null)
            }
        })
        await getAdminUserAppointments(id).then(res => {
            if (res.type === "error") return addAlert(res)
            else setAppointments(res.data)
        })
        await getAdminUserReservations(id).then(res => {
            if (res.type === "error") return addAlert(res)
            else setReservations(res.data)
        })
    }, [addAlert, params])
    const handleDelete = useCallback(
        async (idStr: string) => {
            const id = parseInt(idStr.split("-").pop()!)
            if (idStr.startsWith("a-")) {
                const res = await deleteAdminAppointment(id)
                if (res.type === "error") addAlert(res)
                else addAlert({ type: "success", message: res.data })
            } else if (idStr.startsWith("r-")) {
                const res = await deleteAdminReservation(id)
                if (res.type === "error") addAlert(res)
                else addAlert({ type: "success", message: res.data })
            }
            fetchData()
        },
        [addAlert, fetchData]
    )

    useEffect(() => {
        setLoading(true)
        fetchData().then(() => setLoading(false))
    }, [fetchData])

    return loading ? (
        <Loader />
    ) : !user ? (
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
                    {user.firstname} {user.lastname}
                </Typography>
                <FormControl variant="filled" sx={{ width: 160 }}>
                    <InputLabel>Cheval</InputLabel>
                    <Select
                        value={horse?.id ?? ""}
                        onChange={e =>
                            setHorse(
                                horses.find(h => h.id === e.target.value) ??
                                    null
                            )
                        }
                    >
                        {horses.map(horse => (
                            <MenuItem value={horse.id} key={horse.id}>
                                {horse.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Calendar meetings={meetings} onDelete={handleDelete} />
        </Container>
    )
}

export default UserDetail
