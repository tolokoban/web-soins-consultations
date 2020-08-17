import { createStore } from 'redux'
import DateUtil from '../date-util'

import {
    IAppState, IPatientSummary, IStructure
} from '../types'

const INITIAL_STATE: IAppState = {
    consultationId: "",
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

type IAction = IActionSetPage | IActionSetPatients | IActionSetPatient | IActionSetConsultationId

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

interface IActionSetConsultationId {
    type: "set-consultation-id",
    consultationId: string
}

const store = createStore<IAppState, IAction, unknown, unknown>(reducer)

function reducer(
    state: IAppState | undefined = INITIAL_STATE,
    action: IAction
): IAppState {
    switch (action.type) {
        case 'set-consultation-id':
            return { ...state, consultationId: action.consultationId }
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
        dispatch({ type: "set-patient", patient })
    },
    setConsultationId(uuid: string) {
        dispatch({ type: "set-consultation-id", consultationId: uuid })
    },
    setPage(page: string) {
        dispatch({ type: "set-page", page })
    },
    setPatient(patient: IPatientSummary) {
        dispatch({ type: "set-patient", patient })
    },
    setPatients(patients: IPatientSummary[]) {
        dispatch({ type: "set-patients", patients })
    }
}

function dispatch(param: IAction) {
    console.trace("DISPATCH", param)
    store.dispatch(param)
}
