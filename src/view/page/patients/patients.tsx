import React from "react"
import Tfw from 'tfw'
import PatientForm from '../../patient-form'
import State from '../../../state'
import Translate from '../../../translate'
import { IPatientSummary } from "../../../types"

import "./patients.css"

const Button = Tfw.View.Button

interface IPatientsProps {
    className?: string[]
    patient: IPatientSummary
    patients: IPatientSummary[]
}
interface IPatientsState { }

export default class Patients extends React.Component<IPatientsProps, IPatientsState> {
    state = {}

    private handlePatientChange = (patient: IPatientSummary) => {

    }

    render() {
        const classes = [
            'view-page-Patients',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]
        const { patient, patients } = this.props

        return (<div className={classes.join(' ')}>
            <header className="thm-bgPD">
                <Button
                    icon="close"
                    small={true}
                    warning={true}
                    label="Quitter"
                    onClick={() => process.exit(0)}
                />
                <div>WebSoins Consultations</div>
                <Button
                    label={Translate.importPatients}
                    icon="import"
                    onClick={() => State.setPage("import-patients")}
                />
            </header>
            <section>
                <div className="patients-form thm-bg2 thm-ele-button">
                    <h1>Données démographiques du patient</h1>
                    <PatientForm
                        patient={patient}
                        onChange={this.handlePatientChange}
                    />
                    <p>Si le <b>patients existe déjà</b> dans la colonne de droite,
                    <b>cliquez dessus</b> pour voir ses anciennes consultations
                    et éventuellement en ajouter une nouvelle.</p>
                    <Button
                        icon="add"
                        wide={true}
                        label="Ajouter un nouveau patient"
                        warning={true}
                    />
                </div>
                <div className="patients-list">
                    <h1>Patients ayant consulté: {patients.length}</h1>
                </div>
            </section>
        </div>)
    }
}
