import React from "react"
import Tfw from 'tfw'
import Settings from '../../../../../settings'
import Translate from '../../../../../translate'
import { IPatient, IVaccins, IVaccin } from "../../../../../types"

import "./vaccins.css"

const Touchable = Tfw.View.Touchable

interface IVaccinsProps {
    className?: string | string[]
    patient?: IPatient
}
interface IVaccinsState { }

export default class Vaccins extends React.Component<IVaccinsProps, IVaccinsState> {
    state = {}

    private renderVaccin = (id: string) => {
        const vaccins: IVaccins = Settings.structure ?.vaccins || {}
        const vaccin: IVaccin = vaccins[id] || { caption: "???" }
        const classes = ["thm-ele-button", "vaccin"]
        return <Touchable
            key={id}
            className={classes.join(" ")}
        >
            <div>{vaccin.caption}</div>
        </Touchable>
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
                    gridTemplate: `repeat(${Math.ceil(vaccinIds.length / 3)}, 1fr) / repeat(3, 1fr)`
                }}
            >{vaccinIds.map(this.renderVaccin)}</div>
            <p>Cliquez sur un vaccin pour changer sa date.</p>
        </div>)
    }
}
