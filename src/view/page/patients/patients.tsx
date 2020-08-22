import React from "react"
import Tfw from 'tfw'
import PatientForm from '../../patient-form'
import State from '../../../state'
import Translate from '../../../translate'
import { IPatientSummary } from "../../../types"
import PatientSummaryButton from '../../patient-summary-button'
import PatientsFilter from './patients-filter'
import PatientManager from '../../../manager/patient'
import PatientService from '../../../service/patient'
import Package from '../../../../package.json'
import DateUtil from '../../../date-util'
import Settings from '../../../settings'

import "./patients.css"

const Button = Tfw.View.Button
const List = Tfw.View.List

const FILTER_DEBOUNCING = 350

interface IPatientsProps {
    className?: string[]
    patient: IPatientSummary
    patients: IPatientSummary[]
    onPatientChange(patient: IPatientSummary): void
    onPatientClick(patient: IPatientSummary): void
}
interface IPatientsState {
    filteredPatients: IPatientSummary[]
}

export default class Patients extends React.Component<IPatientsProps, IPatientsState> {
    private oldPatients?: IPatientSummary[]
    private patientsFilter?: PatientsFilter

    state = {
        filteredPatients: this.props.patients
    }

    componentDidMount() {
        this.refreshPatientsFilter()
    }

    componentDidUpdate() {
        this.refreshPatientsFilter()
    }

    private refreshPatientsFilter() {
        const { patients } = this.props
        if (patients !== this.oldPatients) {
            this.oldPatients = patients
            this.patientsFilter = new PatientsFilter(patients)
        }
        this.filter()
    }

    private filter = Tfw.Async.Debouncer(() => {
        const { patientsFilter } = this
        if (patientsFilter) {
            const { patient } = this.props
            patientsFilter.filter(patient.lastname, patient.firstname)
            this.setState({
                filteredPatients: patientsFilter.filteredList
            })
        }
    }, FILTER_DEBOUNCING)

    private handlePatientChange = (patientSummary: IPatientSummary) => {
        this.props.onPatientChange(patientSummary)
    }

    private renderPatientSummaryButton = (patientSummary: IPatientSummary) => {
        return <PatientSummaryButton
            patientSummary={patientSummary}
            onClick={this.handlePatientSummaryClick}
        />
    }

    private handlePatientSummaryClick = (patientSummary: IPatientSummary) => {
        console.info("patientSummary=", patientSummary)
        this.props.onPatientChange(patientSummary)
        this.props.onPatientClick(patientSummary)
    }

    private handleAddNewPatient = async () => {
        const patient = PatientManager.createPatientFromSummary(
            this.props.patient
        )
        await PatientService.setPatient(patient)
        this.props.onPatientClick(this.props.patient)
    }

    render() {
        const { patientsFilter } = this
        if (!patientsFilter) return null

        const classes = [
            'view-page-Patients',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]
        const { patient } = this.props
        const { filteredPatients } = this.state

        return (<div className={classes.join(' ')}>
            <header className="thm-bgPD thm-ele-nav">
                <Button
                    icon="close"
                    small={true}
                    warning={true}
                    label="Quitter"
                    onClick={() => process.exit(0)}
                />
                <div>WebSoins Consultations v{Package.version}</div>
                <Button
                    label={Translate.importPatients}
                    small={true}
                    icon="import"
                    onClick={() => State.setPage("import-patients")}
                />
            </header>
            <section>
                <div>
                    <div className="patients-form thm-bg2 thm-ele-button">
                        <h1>Données démographiques du patient</h1>
                        <PatientForm
                            patient={patient}
                            onChange={this.handlePatientChange}
                        />
                        <p className={filteredPatients.length === 0 ? 'hide' : ''}>
                            Si le <b>patient existe déjà</b> dans la colonne de droite,
                            <b>cliquez dessus</b> pour voir ses anciennes consultations
                            et éventuellement en ajouter une nouvelle.
                        </p>
                        <Button
                            icon="add"
                            wide={true}
                            label="Ajouter un nouveau patient"
                            enabled={canAddNewPatient(patient)}
                            warning={true}
                            onClick={this.handleAddNewPatient}
                        />
                    </div>
                    <div className="remote-server">{
                        Settings.remoteServer
                    }</div>
                </div>
                <div className="patients-list">
                    <h1>Patients correspondant au filtre: &nbsp;
                        <big>{filteredPatients.length}</big>
                        <small> / {this.props.patients.length}</small></h1>
                    <List
                        className="list"
                        itemHeight={32}
                        items={this.state.filteredPatients}
                        mapper={this.renderPatientSummaryButton}
                    />
                </div>
            </section>
        </div>)
    }
}

function canAddNewPatient(patient: IPatientSummary): boolean {
    if (patient.lastname.trim().length === 0) return false
    if (patient.firstname.trim().length === 0) return false
    if (patient.country.trim().length === 0) return false
    // We cannot add the patient if he/she is born in 1000 or before.
    if (!DateUtil.isDefinedDate(patient.birth)) return false

    return true
}
