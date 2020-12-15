import React from "react"
import Tfw from 'tfw'
import Translate from '../../../../../translate'
import DateUtil from '../../../../../date-util'
import { IPatient, IAdmission, IConsultation } from "../../../../../types"
import ConsultationImage from './consultation.svg'

import "./consultations.css"

const Button = Tfw.View.Button
const Touchable = Tfw.View.Touchable

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
        return <Touchable
            onClick={() => this.props.onConsultationClick(consultation.uuid)}
            key={consultation.enter}
            className="consultation thm-bgPD thm-ele-button"
        >
            <img src={ConsultationImage} />
            <div>
                <div className="title">{
                    Translate.consultations
                }</div>
                <div className="date">
                    {DateUtil.formatDate(dat)}
                </div>
                <div className="hint">{
                    Translate.clickToEdit
                }</div>
            </div>
        </Touchable>
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
                width="auto"
                label={Translate.newConsultation}
                onClick={() => this.props.onNewConsultationClick()}
            />
            <hr />
            {
                patient.admissions.length === 0 &&
                <p>Ce-tte patient-e n'a pas encore consulté ici.</p>
            }
            {
                patient.admissions
                    .sort(sortByDateDesc)
                    .map(this.renderAdmission)
            }
        </div>)
    }
}


function sortByDateDesc(a: IAdmission, b: IAdmission) {
    return b.enter - a.enter
}