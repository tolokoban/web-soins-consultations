import React from "react"
import Tfw from 'tfw'
import PatientShortDesc from '../patient-short-desc'
import { IPatientSummary } from "../../types"

import "./patient-summary-button.css"

const Touchable = Tfw.View.Touchable
const _ = Tfw.Intl.make(require("./patient-summary-button.json"))

interface IPatientSummaryButtonProps {
    className?: string | string[]
    patientSummary: IPatientSummary
    onClick(patientSummary: IPatientSummary): void
}

export default class PatientSummaryButton extends React.Component<IPatientSummaryButtonProps, {}> {
    private handleClick = () => {
        this.props.onClick({ ...this.props.patientSummary })
    }

    render() {
        const classes = [
            'view-PatientSummaryButton',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]

        return (<div className={classes.join(' ')}>
            <Touchable
                className="thm-bg1 item"
                onClick={this.handleClick}
            >
                <PatientShortDesc patient={this.props.patientSummary} />
            </Touchable>
        </div>)
    }
}
