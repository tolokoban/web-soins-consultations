export default {
    dateToNumberOfSeconds(date: Date): number {
        return Math.floor(date.getTime() * 0.001)
    },

    numberOfSecondsToDate(nbSecondsSinceEpoc: number): Date {
        return new Date(1000 * nbSecondsSinceEpoc)
    }
}
