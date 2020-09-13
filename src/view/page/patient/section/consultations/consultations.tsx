import React from "react"
import Tfw from 'tfw'
import Translate from '../../../../../translate'
import DateUtil from '../../../../../date-util'
import { IPatient, IAdmission, IConsultation } from "../../../../../types"

import "./consultations.css"

const Button = Tfw.View.Button

interface IConsultationsProps {
    className?: string | string[]
    patient?: IPatient
    onConsultationClick(consultationId: string): void
    onNewConsultationClick(): void
}

export default class Consultations extends React.Component<IConsultationsProps, {}> {
    private renderAdmission = (admission: IAdmission) => {
        return <div className="admission" key={admission.enter}>
            {admission.visits.map(this.renderConsultation)}
        </div>
    }

    private renderConsultation = (consultation: IConsultation) => {
        const dat = DateUtil.seconds2date(consultation.enter)
        return <Button
            label={DateUtil.formatDate(dat)}
            icon="edit" small={true}
            color="PD"
            className="consultation"
            key={consultation.enter}
            onClick={() => this.props.onConsultationClick(consultation.uuid)}
        />
    }

    render() {
        const { patient } = this.props
        if (!patient) return null

        const classes = [
            'view-page-patient-section-Consultations',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]

        return (<div className={classes.join(' ')}>
            <Button
                icon="add"
                label={Translate.newConsultation}
                onClick={() => this.props.onNewConsultationClick()}
            />
            <hr/>
            {
                patient.admissions.length === 0 &&
                <p>Ce-tte patient-e n'a pas encore consulté ici.</p>
            }
            {
                patient.admissions.map(this.renderAdmission)
            }
        </div>)
    }
}
