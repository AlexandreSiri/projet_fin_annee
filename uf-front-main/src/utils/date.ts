export const WEEK_DAYS = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
]
export const MONTHS = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
]

export const formatDate = (d: Date, withoutHours = false) => {
    const date = new Date(d)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    const hour = date.getHours().toString().padStart(2, "0")
    const minute = date.getMinutes().toString().padStart(2, "0")

    return `${day}/${month}/${year}${withoutHours ? "" : ` ${hour}:${minute}`}`
}

export const formatDateLiteral = (d: Date) => {
    const date = new Date(d)
    const day = date.getDate().toString().padStart(2, "0")
    const weekDay = WEEK_DAYS[date.getDay()]
    const month = MONTHS[date.getMonth()]
    const hour = date.getHours().toString().padStart(2, "0")
    const minute = date.getMinutes().toString().padStart(2, "0")

    return `${weekDay} ${day} ${month} à ${hour}:${minute}`
}
