import { connect } from 'react-redux'
import State from '../state'
import { IAppState, IPatientSummary, IPatient, IConsultation } from "../types"
import AppView from "./app"
import PatientManager from '../manager/patient'
import PatientService from '../service/patient'

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
        },
        async onEndOfConsultationEdition(consultation: IConsultation | null, patient?: IPatient) {
            if (consultation && patient) {
                // Save the consultation.
                PatientManager.updateConsultation(patient, consultation)
                await PatientService.setPatient(patient)
            }
            State.setPage("patient")
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppView);
