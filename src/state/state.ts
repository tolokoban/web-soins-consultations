import { createStore } from 'redux'
import {
    IAppState, IPatientSummary, IStructure
} from '../types'

const INITIAL_STATE: IAppState = {
    page: "patients",
    patients: []
}

type IAction = IActionSetPage | IActionSetPatients

interface IActionSetPage {
    type: "set-page",
    page: string
}

interface IActionSetPatients {
    type: "set-patients",
    patients: IPatientSummary[]
}

const store = createStore<IAppState, IAction, unknown, unknown>(reducer)

function reducer(state: IAppState | undefined = INITIAL_STATE, action: IAction): IAppState {
    switch (action.type) {
        case 'set-page':
            return { ...state, page: action.page }
        case 'set-patients':
            return { ...state, patients: action.patients }
        default:
            throw Error(`Unkown action type: "action.type"!`)
    }
}

export default {
    store,
    setPage: (page: string) => ({ type: "set-page", page }),
    setPatients(patients: IPatientSummary[]) {
        store.dispatch({ type: "set-patients", patients })
    }
}
