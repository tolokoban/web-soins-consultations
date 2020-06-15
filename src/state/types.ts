import { IPatientSummary } from '../types'

export interface IAppState {
    page: string
    patients: IPatientSummary[]
}
