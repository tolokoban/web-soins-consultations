export default {
    createUndefinedDate,
    date2seconds,
    formatDate,
    isDefinedDate,
    seconds2date
}

const UNDEFINED_DATE_TIME = -2206310961000

function isDefinedDate(date: any): date is Date {
    if (date instanceof Date) {
        return date.getTime() > UNDEFINED_DATE_TIME
    }
    return false
}


function createUndefinedDate(): Date {
    return new Date(UNDEFINED_DATE_TIME)
}


function seconds2date(seconds: number): Date {
    return new Date(seconds * 1000)
}


function date2seconds(date: Date): number {
    const CONVERSION = 0.001
    return Math.floor(date.getTime() * CONVERSION)
}

const dateFormatter = new Intl.DateTimeFormat(["fr-CM"], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
})

function formatDate(date: Date): string {
    return dateFormatter.format(date)
}
