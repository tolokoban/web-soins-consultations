import { IPatientSummary } from '../types'

export interface IAppState {
    page: string
    patient: IPatientSummary
    patients: IPatientSummary[]
}
