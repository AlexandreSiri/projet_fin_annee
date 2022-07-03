import { Box, Container, Typography } from "@mui/material"
import { red } from "@mui/material/colors"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import Calendar, { MeetingType } from "../../../components/Calendar"
import { Loader } from "../../../components/Loader"
import { useAlert } from "../../../contexts/alert"
import { LocationInterface, ReservationInterface } from "../../../interfaces"
import { deleteAdminAppointment } from "../../../utils/requests/appointment"
import {
    deleteAdminReservation,
    getLocation,
    getReservations,
} from "../../../utils/requests/reservation"

const AdminLocationDetail = () => {
    const [loading, setLoading] = useState(false)
    const [location, setLocation] = useState<LocationInterface | null>(null)
    const [reservations, setReservations] = useState<ReservationInterface[]>([])

    const addAlert = useAlert()
    const params = useParams()

    const meetings = useMemo(() => {
        const meetings: MeetingType[] = reservations.map(
            (reservation): MeetingType => ({
                id: reservation.id.toString(),
                begin: new Date(reservation.date),
                end: new Date(
                    new Date(reservation.date).getTime() + 3600 * 1000
                ),
                title: `${reservation.horse.label} ${reservation.horse.user.lastname}`,
                color: red[800],
                deletable: true,
            })
        )
        return meetings
    }, [reservations])

    const fetchData = useCallback(async () => {
        const id = params.id ? parseInt(params.id) : null
        if (!id) return

        await getLocation(id).then(res => {
            if (res.type === "error") addAlert(res)
            else setLocation(res.data)
        })
        await getReservations().then(res => {
            if (res.type === "error") addAlert(res)
            else
                setReservations(
                    res.data.filter(
                        reservation => reservation.location.id === id
                    )
                )
        })
    }, [addAlert, params.id])
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
    ) : !location ? (
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
                    {location.label}
                </Typography>
            </Box>
            <Calendar meetings={meetings} onDelete={handleDelete} />
        </Container>
    )
}

export default AdminLocationDetail
