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
import ConsoleView from '../../console'

import "./patients.css"

const Button = Tfw.View.Button
const List = Tfw.View.List

const FILTER_DEBOUNCING = 350

interface IPatientsProps {
    className?: string
    patient: IPatientSummary
    patients: IPatientSummary[]
    onPatientChange(patient: IPatientSummary): void
    onPatientClick(patient: IPatientSummary): void
}
interface IPatientsState {
    filteredPatients: IPatientSummary[]
}

export default class Patients extends React.Component<IPatientsProps, IPatientsState> {
    private oldPatient = ""
    private oldPatients = ""
    private patientsFilter?: PatientsFilter

    state = {
        filteredPatients: this.props.patients
    }

    private refreshPatientsFilter() {
        const { patient, patients } = this.props
        const newPatient = JSON.stringify(patient)
        const newPatients = JSON.stringify(patients)
        if (this.oldPatient !== newPatient || this.oldPatients !== newPatients) {
            this.oldPatient = newPatient
            this.oldPatients = newPatients
            this.patientsFilter = new PatientsFilter(patients)
            this.filter()
        }
    }

    componentDidMount = this.refreshPatientsFilter
    componentDidUpdate = this.refreshPatientsFilter

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
        this.props.onPatientChange(patientSummary)
        this.props.onPatientClick(patientSummary)
    }

    private handleAddNewPatient = async () => {
        const patient = PatientManager.createPatientFromSummary(
            this.props.patient
        )
        await Tfw.Factory.Dialog.wait(
            Translate.addPatient,
            new Promise<void>(async (resolve) => {
                await PatientService.setPatient(patient)
                const patientSummaries = await PatientService.getAllPatients()
                State.setPatients(patientSummaries)
                resolve()
            })
        )
        this.props.onPatientClick(PatientManager.getSummary(patient))
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
                    label="Quitter"
                    onClick={() => nw.App.quit()}
                />
                <div>WebSoins Consultations v{Package.version}</div>
                <Button
                    width="auto"
                    label={Translate.importPatients}
                    icon="import"
                    onClick={() => State.setPage("import-patients")}
                />
            </header>
            <section>
                <div className="flex-col">
                    <div className="patients-form thm-bg2 thm-ele-button">
                        <h1>Données démographiques du patient</h1>
                        <PatientForm
                            patientSummary={patient}
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
                            label={Translate.addPatient}
                            enabled={canAddNewPatient(patient)}
                            color="S"
                            onClick={this.handleAddNewPatient}
                        />
                    </div>
                    <ConsoleView />
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
