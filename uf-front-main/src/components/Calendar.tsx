import { ChevronLeft, ChevronRight, Delete } from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers"
import {
    Box,
    Button,
    IconButton,
    lighten,
    Tooltip,
    Typography,
} from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { MONTHS, WEEK_DAYS } from "../utils/date"

export type MeetingType = {
    id: string
    begin: Date
    end: Date
    title: string
    hover?: string
    color: string
    deletable?: boolean
}

interface Props {
    meetings: MeetingType[]
    creationMaxWeeks?: number
    onDelete?: (id: MeetingType["id"]) => void
    onCreate?: (date: Date) => void
    includes?: Date[]
    excludes?: Date[]
    inputElement?: JSX.Element
}

const Calendar = (props: Props) => {
    const [today, setToday] = useState(
        new Date(new Date().setHours(0, 0, 0, 0))
    )
    const [dateOpen, setDateOpen] = useState(false)

    const defaultMonday = useMemo(() => {
        const date = new Date(new Date().setHours(0, 0, 0, 0))
        const delta = date.getDay()
        date.setDate(date.getDate() - ((delta || 7) - 1))
        return date
    }, [])
    const monday = useMemo(() => {
        const date = new Date(today)
        const delta = date.getDay()
        date.setDate(date.getDate() - ((delta || 7) - 1))
        return date
    }, [today])
    const sunday = useMemo(() => {
        const date = new Date(monday.getTime() + 6 * 24 * 3600 * 1000)
        return date
    }, [monday])
    const monthString = useMemo(() => {
        const beginMonth = `${MONTHS[monday.getMonth()]}${
            monday.getFullYear() === sunday.getFullYear()
                ? ""
                : ` ${monday.getFullYear()}`
        }`
        const endMonth = `${MONTHS[sunday.getMonth()]} ${sunday.getFullYear()}`

        return monday.getMonth() === sunday.getMonth()
            ? endMonth
            : `${beginMonth} - ${endMonth}`
    }, [monday, sunday])

    const handleToday = useCallback(() => {
        setToday(new Date(new Date().setHours(0, 0, 0, 0)))
    }, [])
    const handleNext = useCallback(() => {
        const date = new Date(today.getTime() + 7 * 24 * 3600 * 1000)
        setToday(date)
    }, [today])
    const handlePrev = useCallback(() => {
        const date = new Date(today.getTime() - 7 * 24 * 3600 * 1000)
        setToday(date)
    }, [today])
    const handleChange = useCallback((value: Date | null) => {
        if (!value) return
        setToday(value)
    }, [])
    const handleDelete = useCallback(
        (appointment: MeetingType) => {
            props.onDelete && props.onDelete(appointment.id)
        },
        [props]
    )

    return (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                rowGap: 4,
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    padding: {
                        sm: "0 15%",
                    },
                    display: "flex",
                    alignItems: "center",
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    justifyContent: {
                        sm: "space-between",
                    },
                    columnGap: 4,
                    rowGap: 2,
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: {
                            xs: "space-between",
                            sm: "flex-start",
                        },
                        alignItems: "center",
                        columnGap: 2,
                    }}
                >
                    <Button variant="outlined" onClick={handleToday}>
                        Aujourd'hui
                    </Button>
                    <IconButton onClick={handlePrev}>
                        <ChevronLeft />
                    </IconButton>
                    <IconButton onClick={handleNext}>
                        <ChevronRight />
                    </IconButton>
                    <DatePicker
                        onChange={handleChange}
                        open={dateOpen}
                        onOpen={() => setDateOpen(true)}
                        onClose={() => setDateOpen(false)}
                        value={today}
                        renderInput={params => (
                            <Button
                                sx={{ color: "text.secondary" }}
                                color="inherit"
                                onClick={() => setDateOpen(true)}
                                ref={params.inputRef}
                            >
                                {monthString}
                            </Button>
                        )}
                    />
                </Box>
                {props.inputElement}
            </Box>
            <Box
                sx={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "0.5fr repeat(7, 1fr)",
                    textAlign: "center",
                    alignItems: "baseline",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        borderBottom: "1px solid transparent",
                        borderTop: "1px solid transparent",
                    }}
                >
                    <Box
                        sx={{
                            pt: 1,
                            pb: 1,
                            "& p": {
                                lineHeight: 1.15,
                                opacity: 0,
                                userSelect: "none",
                            },
                        }}
                    >
                        <Typography>T</Typography>
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 24,
                                    sm: 32,
                                },
                                fontWeight: 700,
                            }}
                        >
                            T
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            color: "text.secondary",
                        }}
                    >
                        {Array.from(Array(13)).map((_, j) => {
                            const startHour = 8 + j
                            return (
                                <Box
                                    key={j}
                                    sx={{
                                        height: 48,
                                        textAlign: "right",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            position: "relative",
                                            transform: "translateY(-50%)",
                                            fontSize: 16,
                                            lineHeight: 1,
                                            pr: 3,
                                            "&::before": {
                                                content: "''",
                                                position: "absolute",
                                                borderTop:
                                                    "1px solid rgba(0, 0, 0, 0.25)",
                                                right: 0,
                                                width: 12,
                                                top: "50%",
                                                transform:
                                                    "translateY(-50%) transateY(.5px)",
                                            },
                                        }}
                                    >
                                        {startHour}:00
                                    </Typography>
                                </Box>
                            )
                        })}
                    </Box>
                </Box>
                {Array.from(Array(7)).map((_, i) => {
                    const beginAt = new Date(
                        monday.getTime() + i * 24 * 3600 * 1000
                    )
                    const endAt = new Date(beginAt.getTime() + 24 * 3600 * 1000)

                    const meetings = props.meetings
                        .filter(
                            a =>
                                a.begin.getTime() >= beginAt.getTime() &&
                                a.end.getTime() < endAt.getTime()
                        )
                        .map((a, _, self) => {
                            const temps = self.filter(
                                temp =>
                                    (temp.begin.getTime() >=
                                        a.begin.getTime() &&
                                        temp.begin.getTime() <
                                            a.end.getTime()) ||
                                    (temp.end.getTime() > a.begin.getTime() &&
                                        temp.end.getTime() <=
                                            a.end.getTime()) ||
                                    (temp.begin.getTime() < a.begin.getTime() &&
                                        temp.end.getTime() > a.end.getTime())
                            )
                            return {
                                size: (1 / temps.length) * 100,
                                offset: (temps.indexOf(a) / temps.length) * 100,
                                appointment: a,
                                top: a.begin.getHours() - 8,
                                height: a.end.getHours() - a.begin.getHours(),
                            }
                        })
                    return (
                        <Box
                            key={i}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                borderTop: "1px solid rgba(0, 0, 0, 0.25)",
                                borderRight:
                                    i === 6
                                        ? "1px solid rgba(0, 0, 0, 0.25)"
                                        : undefined,
                                borderLeft: !i
                                    ? "1px solid rgba(0, 0, 0, 0.25)"
                                    : undefined,
                            }}
                        >
                            <Box
                                sx={{
                                    color: "text.secondary",
                                    pt: 1,
                                    pb: 1,
                                    "& p": {
                                        lineHeight: 1.15,
                                    },
                                }}
                            >
                                <Typography>
                                    {WEEK_DAYS[beginAt.getDay()].slice(0, 3)}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: 24,
                                            sm: 32,
                                        },
                                        fontWeight: 700,
                                    }}
                                >
                                    {beginAt.getDate()}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    position: "relative",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {meetings.map(
                                    ({
                                        size,
                                        offset,
                                        appointment,
                                        top,
                                        height,
                                    }) => (
                                        <Box
                                            key={appointment.id}
                                            sx={{
                                                position: "absolute",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: `${size}%`,
                                                left: `${offset}%`,
                                                top: `${top * 48}px`,
                                                height: `${height * 48}px`,
                                                borderRadius: 1,
                                                background: lighten(
                                                    appointment.color,
                                                    0.15
                                                ),
                                                userSelect: "default",
                                                transition: "all .3s",
                                                color: "#ffffff",
                                                "& .MuiIconButton-root": {
                                                    opacity: 0,
                                                    visibility: "hidden",
                                                    transition: "all .15s",
                                                },
                                                "&:hover": {
                                                    background:
                                                        appointment.color,
                                                    "& .MuiIconButton-root": {
                                                        opacity: 1,
                                                        visibility: "visible",
                                                    },
                                                },
                                            }}
                                        >
                                            {appointment.deletable &&
                                                props.onDelete && (
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            position:
                                                                "absolute",
                                                            top: 0,
                                                            right: 0,
                                                            color: "#ffffff",
                                                            "& svg": {
                                                                width: 16,
                                                                height: 16,
                                                            },
                                                        }}
                                                        onClick={() =>
                                                            handleDelete(
                                                                appointment
                                                            )
                                                        }
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                )}
                                            <Tooltip
                                                title={
                                                    appointment.hover ??
                                                    appointment.title
                                                }
                                            >
                                                <Typography
                                                    sx={{
                                                        whiteSpace: "nowrap",
                                                        textOverflow:
                                                            "ellipsis",
                                                        overflow: "hidden",
                                                        width: "100%",
                                                        pl: 0.5,
                                                        pr: 0.5,
                                                    }}
                                                >
                                                    {appointment.title}
                                                </Typography>
                                            </Tooltip>
                                        </Box>
                                    )
                                )}
                                {Array.from(Array(12)).map((_, j) => {
                                    const date = new Date(
                                        beginAt.getTime() +
                                            (8 + j) * 3600 * 1000
                                    )
                                    const endDate = props.creationMaxWeeks
                                        ? defaultMonday.getTime() +
                                          props.creationMaxWeeks *
                                              7 *
                                              24 *
                                              3600 *
                                              1000
                                        : null
                                    const disabled =
                                        props.onCreate &&
                                        (date.getTime() <
                                            new Date().getTime() ||
                                            (endDate &&
                                                beginAt.getTime() >= endDate) ||
                                            (props.includes &&
                                                !props.includes.find(
                                                    d =>
                                                        d.getTime() ===
                                                        date.getTime()
                                                )) ||
                                            (props.excludes &&
                                                props.excludes.find(
                                                    d =>
                                                        d.getTime() ===
                                                        date.getTime()
                                                )))
                                    return (
                                        <Box
                                            onClick={() =>
                                                !disabled &&
                                                props.onCreate &&
                                                props.onCreate(date)
                                            }
                                            key={j}
                                            sx={{
                                                cursor:
                                                    props.onCreate && !disabled
                                                        ? "pointer"
                                                        : undefined,
                                                height: j === 11 ? 49 : 48,
                                                background: disabled
                                                    ? "#bdc3c7"
                                                    : undefined,
                                                borderTop:
                                                    "1px solid rgba(0, 0, 0, 0.25)",
                                                borderLeft: i
                                                    ? "1px solid rgba(0, 0, 0, 0.25)"
                                                    : undefined,
                                                borderBottom:
                                                    j === 11
                                                        ? "1px solid rgba(0, 0, 0, 0.25)"
                                                        : undefined,
                                            }}
                                        ></Box>
                                    )
                                })}
                            </Box>
                        </Box>
                    )
                })}
            </Box>
        </Box>
    )
}

export default Calendar
