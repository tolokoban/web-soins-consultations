import React from "react"
import Tfw from 'tfw'
import DateUtil from '../../../../../date-util'
import Settings from '../../../../../settings'
import Translate from '../../../../../translate'
import VaccinForm from './vaccin-form'
import { IPatient, IVaccins, IVaccin } from "../../../../../types"

import "./vaccins.css"

const Touchable = Tfw.View.Touchable

interface IVaccinsProps {
    className?: string
    patient?: IPatient
    onUpdateVaccin(id: string, vaccin: IVaccin): void
}
interface IVaccinsState { }

export default class Vaccins extends React.Component<IVaccinsProps, IVaccinsState> {
    state = {}

    private renderVaccin = (id: string) => {
        const { patient } = this.props
        if (!patient) return null
        const vaccins: IVaccins = Settings.structure ?.vaccins || {}
        const vaccin: IVaccin = vaccins[id] || { caption: "???" }
        const currentVaccin = patient.vaccins[id]
        const classes = ["thm-ele-button", "vaccin"]
        const date = currentVaccin ? DateUtil.seconds2date(currentVaccin.date || 0) : null
        if (date) {
            const today = new Date()
            const yy = today.getFullYear()
            const mm = today.getMonth()
            const dd = today.getDate()
            // Attention, vaccin de plus de 5 ans.
            const warning = DateUtil.date2seconds(
                new Date(yy - 5, mm, dd)
            )
            // Dangeureux après 10 ans.
            const bad = DateUtil.date2seconds(
                new Date(yy - 10, mm, dd)
            )
            const seconds = currentVaccin.date || 0
            if (seconds < bad) {
                classes.push("bad")
            }
            else if (seconds < warning) {
                classes.push("warning")
            }
            else {
                classes.push("good")
            }
        }
        return <Touchable
            key={id}
            onClick={() => this.handleVaccinClick(id)}
        >
            <div className={classes.join(" ")}>
                <div>{vaccin.caption}</div>
                {
                    date &&
                    <div className="date">{
                        DateUtil.formatDate(date)
                    }</div>
                }
            </div>
        </Touchable>
    }

    private getVaccinCaption(id: string) {
        const vaccins: IVaccins = Settings.structure ?.vaccins || {}
        const vaccin: IVaccin = vaccins[id] || { caption: "???" }
        return vaccin.caption
    }

    private async handleVaccinClick(id: string) {
        const { patient } = this.props
        if (!patient) return null
        const vaccin: IVaccin = patient.vaccins[id] || {
            caption: this.getVaccinCaption(id),
            date: DateUtil.date2seconds(new Date()),
            lot: ""
        }
        if (!vaccin) return

        const currentVaccin: IVaccin = {
            ...vaccin
        }
        const confirmed = await Tfw.Factory.Dialog.confirm(
            currentVaccin.caption,
            <VaccinForm
                date={currentVaccin.date || DateUtil.date2seconds(DateUtil.createUndefinedDate())}
                lot={currentVaccin.lot || ""}
                onChange={(date: number, lot: string) => {
                    currentVaccin.date = date
                    currentVaccin.lot = lot
                }}
            />
        )
        if (!confirmed) return
        this.props.onUpdateVaccin(id, currentVaccin)
    }

    render() {
        const { patient } = this.props
        if (!patient) return null

        const classes = [
            'view-page-patient-section-Vaccins',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]
        const vaccinIds = Object.keys(Settings.structure ?.vaccins || {})

        return (<div className={classes.join(' ')}>
            <div
                className="vaccins"
                style={{
                    gridTemplate: `repeat(${
                        Math.ceil(vaccinIds.length / 3)
                        }, 1fr) / repeat(3, 1fr)`
                }}
            >{vaccinIds.map(this.renderVaccin)}</div>
            <p>Cliquez sur un vaccin pour changer sa date.</p>
        </div>)
    }
}
