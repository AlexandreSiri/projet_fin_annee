const MONTHS = [
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

export const formatDateInvoice = (date: Date) => {
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const hour = date.getHours().toString().padStart(2, "0")
    const minute = date.getMinutes().toString().padStart(2, "0")

    return `${day}/${month}/${year} à ${hour}:${minute}`
}

export const formatDateMonthInvoice = (date: Date) => {
    const month = MONTHS[date.getMonth()]
    return `${month}, ${date.getFullYear()}`
}
