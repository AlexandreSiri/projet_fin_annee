import { Box, Container, Typography } from "@mui/material"
import { red } from "@mui/material/colors"
import { useCallback, useEffect, useMemo, useState } from "react"
import Calendar, { MeetingType } from "../../components/Calendar"
import { Loader } from "../../components/Loader"
import { useAlert } from "../../contexts/alert"
import { AppointmentInterface } from "../../interfaces"
import { getProfessionalAppointments } from "../../utils/requests/appointment"

const ProfessionalAppointmentList = () => {
    const [loading, setLoading] = useState(false)
    const [appointments, setAppointments] = useState<AppointmentInterface[]>([])

    const addAlert = useAlert()

    const meetings = useMemo(() => {
        const meetings: MeetingType[] = appointments.map(
            (appointment): MeetingType => ({
                id: appointment.id.toString(),
                begin: new Date(appointment.date),
                end: new Date(
                    new Date(appointment.date).getTime() + 3600 * 1000
                ),
                title: `${appointment.horse.label} - ${appointment.horse.user.lastname}`,
                hover: appointment.disponibility.job.label,
                color: red[800],
            })
        )
        return meetings
    }, [appointments])

    const fetchData = useCallback(async () => {
        await getProfessionalAppointments().then(res => {
            if (res.type === "error") addAlert(res)
            else setAppointments(res.data)
        })
    }, [addAlert])

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
                    Emploie du temps
                </Typography>
            </Box>
            <Calendar meetings={meetings} />
        </Container>
    )
}

export default ProfessionalAppointmentList
