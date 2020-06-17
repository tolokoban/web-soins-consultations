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
            'view-page-Patients', 'thm-bg1',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]

        return (<div className={classes.join(' ')}>
            <section>
                <PatientForm
                    patient={this.props.patient}
                    onChange={this.handlePatientChange}
                />
            </section>
            <footer className="thm-bgPD">
                <Button
                    label={Translate.importPatients}
                    icon="import"
                    onClick={() => State.setPage("import-patients")}
                />
            </footer>
        </div>)
    }
}
