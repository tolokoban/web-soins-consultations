import { connect } from 'react-redux'
import State from '../state'
import { IAppState, IPatientSummary } from "../types"
import AppView from "./app"

function mapStateToProps(state: IAppState) {
    return {
        consultationId: state.consultationId,
        page: state.page,
        patient: state.patient,
        patients: state.patients
    }
}

function mapDispatchToProps(dispatch: any) {
    return {
        onPatientChange(patientSummary: IPatientSummary) {
            State.setPatient(patientSummary)
        },
        onPatientClick(patientSummary: IPatientSummary) {
            State.setPatient(patientSummary)
            State.setPage("patient")
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppView);
