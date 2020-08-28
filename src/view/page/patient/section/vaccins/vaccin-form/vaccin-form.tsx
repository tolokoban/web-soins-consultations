import React from "react"
import Tfw from 'tfw'

import DateUtil from "../../../../../../date-util"
import Translate from "../../../../../../translate"


import "./vaccin-form.css"

const Input = Tfw.View.Input
const InputDate = Tfw.View.InputDate

interface IVaccinFormProps {
    className?: string
    // Seconds since EPOC.
    date: number
    lot: string
    onChange(date: number, lot: string): void
}

export default class VaccinForm extends React.Component<IVaccinFormProps, {}> {
    private handleLotChange = (lot: string) => {
        this.props.onChange(
            this.props.date,
            lot
        )
    }

    private handleDateChange = (date: number) => {
        this.props.onChange(
            DateUtil.date2seconds(new Date(date)),
            this.props.lot
        )
    }

    render() {
        const classes = [
            'view-page-patient-section-vaccins-VaccinForm',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]

        return (<div className={classes.join(' ')}>
            <InputDate
                label={Translate.vaccinDate}
                value={DateUtil.seconds2date(this.props.date).getTime()}
                onChange={this.handleDateChange}
            />
            <Input
                wide={true}
                label={Translate.vaccinLot}
                value={this.props.lot}
                onChange={this.handleLotChange}
            />
        </div>)
    }
}
