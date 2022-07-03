import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material"
import { DateTimePicker } from "@mui/x-date-pickers"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import Calendar, { MeetingType } from "../../components/Calendar"
import { Loader } from "../../components/Loader"
import { useAlert } from "../../contexts/alert"
import {
    AppointmentInterface,
    DisponibilityInterface,
    HorseInterface,
    JobInterface,
    LocationInterface,
    ReservationInterface,
    UserInterface,
} from "../../interfaces"
import { COLORS } from "../../utils/color"
import {
    createAppointment,
    deleteAppointment,
    getAppointments,
    getJobDisponibilities,
} from "../../utils/requests/appointment"
import { getHorses } from "../../utils/requests/horse"
import { getJobs } from "../../utils/requests/job"
import {
    createReservation,
    deleteReservation,
    getLocations,
    getReservations,
} from "../../utils/requests/reservation"

const HorseDetail = () => {
    const [loading, setLoading] = useState(false)
    const [tab, setTab] = useState(0)
    const [horse, setHorse] = useState<HorseInterface | null>(null)
    const [job, setJob] = useState<JobInterface | null>(null)
    const [jobs, setJobs] = useState<JobInterface[]>([])
    const [disponibilities, setDisponibilities] = useState<
        { jobId: number; disponibilities: DisponibilityInterface[] }[]
    >([])
    const [appointments, setAppointments] = useState<AppointmentInterface[]>([])
    const [location, setLocation] = useState<LocationInterface | null>(null)
    const [locations, setLocations] = useState<LocationInterface[]>([])
    const [reservations, setReservations] = useState<ReservationInterface[]>([])

    const [dialogOpen, setDialogOpen] = useState(false)
    const [reservationDate, setReservationDate] = useState<Date | null>(null)
    const [professional, setProfessional] = useState<UserInterface | null>(null)

    const addAlert = useAlert()
    const params = useParams()

    const meetings = useMemo(() => {
        if (!tab) {
            const meetings = appointments.map(
                (appointment): MeetingType => ({
                    id: appointment.id.toString(),
                    begin: new Date(appointment.date),
                    end: new Date(
                        new Date(appointment.date).getTime() + 3600 * 1000
                    ),
                    title: appointment.disponibility.job.label,
                    color: COLORS[
                        jobs.findIndex(
                            j => j.id === appointment.disponibility.job.id
                        )
                    ],
                    deletable:
                        new Date(appointment.date).getTime() >
                        new Date().getTime(),
                })
            )
            return meetings
        } else {
            const meetings = reservations.map(
                (reservation): MeetingType => ({
                    id: reservation.id.toString(),
                    begin: new Date(reservation.date),
                    end: new Date(
                        new Date(reservation.date).getTime() + 3600 * 1000
                    ),
                    title: reservation.location.label,
                    color: COLORS[
                        locations.findIndex(
                            l => l.id === reservation.location.id
                        )
                    ],
                    deletable:
                        new Date(reservation.date).getTime() >
                        new Date().getTime(),
                })
            )
            return meetings
        }
    }, [appointments, jobs, locations, reservations, tab])
    const excludes = useMemo(() => {
        const loc = locations.find(l => l.id === location?.id)
        if (tab !== 1 || !loc) return
        return [
            ...loc.used.map(used => new Date(used)),
            ...appointments
                .filter(a => a.horse.id === horse?.id)
                .map(a => new Date(a.date)),
        ]
    }, [appointments, horse?.id, location?.id, locations, tab])
    const includes = useMemo(() => {
        const jobDisponibilities = disponibilities.find(
            d => d.jobId === job?.id
        )?.disponibilities
        if (tab || !jobDisponibilities) return
        return jobDisponibilities
            .map(disponibility => {
                const start = new Date(disponibility.beginAt)
                const end = new Date(disponibility.endAt)
                const hours = end.getHours() - start.getHours()
                disponibility.used = disponibility.used.map(
                    used => new Date(used)
                )

                const dates = Array.from(Array(hours))
                    .map((_, i) => new Date(start.getTime() + i * 3600 * 1000))
                    .filter(
                        date =>
                            !disponibility.used.find(
                                d => d.getTime() === date.getTime()
                            )
                    )
                return dates.map(date => ({
                    date,
                    user: disponibility.user,
                }))
            })
            .flat()
            .filter(
                d =>
                    !reservations
                        .filter(r => r.horse.id === horse?.id)
                        .find(
                            r => new Date(r.date).getTime() === d.date.getTime()
                        )
            )
    }, [disponibilities, horse?.id, job?.id, reservations, tab])
    const getProfessionals = useCallback(
        (date: Date | null = reservationDate) => {
            console.log("test")
            if (!date || !includes) return []

            const disponibilities = includes.filter(
                includes => includes.date.getTime() === date.getTime()
            )
            const users = disponibilities
                .map(d => d.user)
                .filter(
                    (user, index, self) =>
                        self.findIndex(u => u.id === user.id) === index
                )
            return users
        },
        [includes, reservationDate]
    )
    const professionals = useMemo(() => {
        return getProfessionals(reservationDate)
    }, [getProfessionals, reservationDate])
    const selectElement = useMemo(() => {
        if (!tab)
            return (
                <FormControl variant="filled" sx={{ width: 200 }}>
                    <InputLabel>Activité</InputLabel>
                    <Select
                        value={job?.id ?? ""}
                        onChange={e =>
                            setJob(
                                jobs.find(j => j.id === e.target.value) ?? null
                            )
                        }
                    >
                        {jobs.map(job => (
                            <MenuItem value={job.id} key={job.id}>
                                {job.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )
        else
            return (
                <FormControl variant="filled" sx={{ width: 200 }}>
                    <InputLabel>Emplacement</InputLabel>
                    <Select
                        value={location?.id ?? ""}
                        onChange={e =>
                            setLocation(
                                locations.find(l => l.id === e.target.value) ??
                                    null
                            )
                        }
                    >
                        {locations.map(location => (
                            <MenuItem value={location.id} key={location.id}>
                                {location.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )
    }, [job, jobs, location, locations, tab])

    const fetchData = useCallback(async () => {
        if (!params.id) return
        const id = parseInt(params.id)

        await getHorses().then(res => {
            if (res.type === "error") addAlert(res)
            else {
                const horse = res.data.find(h => h.id === id)
                if (!horse)
                    addAlert({ type: "error", message: "Horse not found." })
                else setHorse(horse)
            }
        })
        await getAppointments().then(res => {
            if (res.type === "error") addAlert(res)
            else setAppointments(res.data.filter(a => a.horse.id === id))
        })
        await getReservations().then(res => {
            if (res.type === "error") addAlert(res)
            else setReservations(res.data.filter(r => r.horse.id === id))
        })
        await getLocations().then(res => {
            if (res.type === "error") addAlert(res)
            else {
                setLocations(res.data)
                setLocation(location => location ?? res.data[0] ?? null)
            }
        })
        await getJobs().then(async res => {
            if (res.type === "error") return addAlert(res)
            const disponibilities = await Promise.all(
                res.data.map(async job => {
                    const response = await getJobDisponibilities(job.id)
                    return {
                        jobId: job.id,
                        disponibilities:
                            response.type === "error" ? [] : response.data,
                    }
                })
            )
            setJobs(res.data)
            setJob(job => job ?? res.data[0] ?? null)
            setDisponibilities(disponibilities)
        })

        setLoading(false)
    }, [addAlert, params.id])
    const handleAdd = useCallback(
        (date: Date) => {
            if (!tab) {
                const professionals = getProfessionals(date)
                if (!professionals.length) return
                setProfessional(professionals[0])
            }
            setDialogOpen(true)
            setReservationDate(date)
        },
        [getProfessionals, tab]
    )
    const handleSubmit = useCallback(async () => {
        if (!horse || !reservationDate) return
        if (!tab) {
            if (!job || !professional) return
            const disponibility = disponibilities
                .find(d => d.jobId === job.id)
                ?.disponibilities.find(
                    d =>
                        new Date(d.beginAt).getTime() <=
                            reservationDate.getTime() &&
                        new Date(d.endAt).getTime() >=
                            reservationDate.getTime() &&
                        d.user.id === professional.id
                )
            if (!disponibility) return
            const res = await createAppointment(
                horse.id,
                disponibility.id,
                reservationDate
            )
            if (res.type === "error") addAlert(res)
            else {
                setDialogOpen(false)
                setReservationDate(null)
                await fetchData()
                addAlert({
                    type: "success",
                    message: "Rendez-vous pris avec succès.",
                })
            }
        } else {
            if (!location) return
            const res = await createReservation(
                horse.id,
                location.id,
                reservationDate
            )
            if (res.type === "error") addAlert(res)
            else {
                setDialogOpen(false)
                setReservationDate(null)
                await fetchData()
                addAlert({
                    type: "success",
                    message: "Réservation prise avec succès.",
                })
            }
        }
    }, [
        addAlert,
        disponibilities,
        fetchData,
        horse,
        job,
        location,
        professional,
        reservationDate,
        tab,
    ])
    const handleDelete = useCallback(
        async (id: string) => {
            const res = await (!tab ? deleteAppointment : deleteReservation)(id)
            if (res.type === "error") addAlert(res)
            else {
                await fetchData()
                addAlert({
                    type: "success",
                    message: res.data,
                })
            }
        },
        [addAlert, fetchData, tab]
    )

    useEffect(() => {
        setLoading(true)
        fetchData().then(() => setLoading(false))
    }, [fetchData])

    return loading ? (
        <Loader />
    ) : !horse ? (
        <></>
    ) : (
        <>
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="xl"
            >
                <DialogTitle
                    sx={{
                        width: {
                            xs: "80vw",
                            lg: "40vw",
                        },
                    }}
                >
                    Réservation {!tab ? job?.label : location?.label}
                </DialogTitle>
                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 2,
                    }}
                >
                    {!tab && (
                        <FormControl variant="filled" sx={{ width: "100%" }}>
                            <InputLabel>Professionel</InputLabel>
                            <Select
                                value={professional?.id ?? ""}
                                onChange={e =>
                                    setProfessional(
                                        professionals.find(
                                            p => p.id === e.target.value
                                        ) ?? null
                                    )
                                }
                            >
                                {professionals.map(pro => (
                                    <MenuItem value={pro.id} key={pro.id}>
                                        {pro.firstname} {pro.lastname}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    <DateTimePicker
                        label="Date de début"
                        inputFormat="dd/MM/yyyy HH:mm"
                        value={reservationDate}
                        disabled
                        onChange={() => {}}
                        renderInput={params => (
                            <TextField variant="filled" fullWidth {...params} />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>
                        Annuler
                    </Button>
                    <Button onClick={handleSubmit}>Réserver</Button>
                </DialogActions>
            </Dialog>
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
                    {horse.label}
                </Typography>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
                    <Tab label="Rendez-vous" />
                    <Tab label="Réservations" />
                </Tabs>
                <Calendar
                    meetings={meetings}
                    creationMaxWeeks={4}
                    includes={includes?.map(i => i.date)}
                    excludes={excludes}
                    inputElement={selectElement}
                    onCreate={handleAdd}
                    onDelete={handleDelete}
                />
            </Container>
        </>
    )
}

export default HorseDetail
