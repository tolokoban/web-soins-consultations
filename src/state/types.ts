import { IPatientSummary } from '../types'

export interface IAppState {
    consultationId: string
    page: string
    patient: IPatientSummary
    patients: IPatientSummary[]
}
