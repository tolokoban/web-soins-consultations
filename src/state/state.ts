import { createStore } from 'redux'
import DateUtil from '../date-util'

import {
    IAppState, IPatientSummary, IStructure
} from '../types'

const INITIAL_STATE: IAppState = {
    page: "patients",
    patient: {
        id: "",
        lastname: "",
        firstname: "",
        secondname: "",
        gender: "X",
        size: 0,
        country: "",
        birth: DateUtil.createUndefinedDate()
    },
    patients: []
}

type IAction = IActionSetPage | IActionSetPatients | IActionSetPatient

interface IActionSetPage {
    type: "set-page",
    page: string
}

interface IActionSetPatients {
    type: "set-patients",
    patients: IPatientSummary[]
}

interface IActionSetPatient {
    type: "set-patient",
    patient: IPatientSummary
}

const store = createStore<IAppState, IAction, unknown, unknown>(reducer)

function reducer(
    state: IAppState | undefined = INITIAL_STATE,
    action: IAction
): IAppState {
    switch (action.type) {
        case 'set-page':
            return { ...state, page: action.page }
        case 'set-patient':
            return { ...state, patient: action.patient }
        case 'set-patients':
            return { ...state, patients: action.patients }
        default:
            return state
    }
}

export default {
    store,
    clearPatient() {
        const patient: IPatientSummary = {
            id: "", firstname: "", secondname: "", lastname: "",
            birth: new Date(),
            country: "", gender: "", size: 0
        }
        store.dispatch({ type: "set-patient", patient })
    },
    setPage(page: string) {
        store.dispatch({ type: "set-page", page })
    },
    setPatient(patient: IPatientSummary) {
        store.dispatch({ type: "set-patient", patient })
    },
    setPatients(patients: IPatientSummary[]) {
        store.dispatch({ type: "set-patients", patients })
    }
}
