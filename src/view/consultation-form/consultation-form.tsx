import React from "react"
import Tfw from 'tfw'
import DateUtil from '../../date-util'
import Settings from '../../settings'
import TextField from '../field/text'
import PatientManager from '../../manager/patient'
import StructureManager from '../../manager/structure'
import { IPatient, IFormField, IFormFields, IConsultation } from "../../types"


import "./consultation-form.css"

const Expand = Tfw.View.Expand
const Checkbox = Tfw.View.Checkbox
const InputDate = Tfw.View.InputDate

interface IConsultationFormProps {
    className?: string | string[]
    patient: IPatient
    // This object is mutable and will be modified by this component.
    // It must be a copy of the original consultation because
    // the editing can be cancelled.
    consultation: IConsultation
}
interface IConsultationFormState { }

export default class ConsultationForm extends React.Component<IConsultationFormProps, IConsultationFormState> {
    state = {}

    private getFieldValue(field: IFormField, overrideConsultation: IConsultation | null = null): string {
        const consultation = overrideConsultation || this.props.consultation
        if (!consultation) return ""
        const { data } = consultation
        if (!data) return ""
        if (!data[field.id]) return ""
        return StructureManager.getValueCaption(field.type, data[field.id])
    }

    private getFieldValueAsBoolean(field: IFormField): boolean {
        const value = this.getFieldValue(field)
        return Tfw.Converter.Enum<string>(
            value,
            ["#YES", "#TRUE"],
            "#FALSE"
        ) !== "#FALSE"
    }

    /**
     * @return number of milliseconds since Epoc.
     */
    private getFieldValueAsDate(field: IFormField): number {
        const value = this.getFieldValue(field)
        return s2ms(Tfw.Converter.Integer(value))
    }

    private renderFields(fields: IFormFields) {
        return Object.keys(fields).map(
            name => {
                const field = fields[name]
                if (!field) return null
                return this.renderField(field)
            }
        )
    }

    private renderField(field: IFormField) {
        if (hasChildren(field)) {
            return <Expand
                key={field.id}
                label={field.caption}
                value={false}
                className="thm-ele-button"
            >
                {this.renderFields(field.children)}
            </Expand>
        }

        const { consultation } = this.props
        const prevConsultations = PatientManager.getAllConsultationsBefore(
            this.props.patient,
            consultation.enter
        )

        if (isBool(field)) {
            return <div className="field">
                <Checkbox
                    key={field.id}
                    wide={false}
                    label={field.caption}
                    value={this.getFieldValueAsBoolean(field)}
                    onChange={(value: boolean) => this.updateBooleanField(field, value)}
                />
                {prevConsultations.map(this.renderPrevConsultation.bind(this, field))}
            </div>
        }

        if (field.tags.indexOf("DATE") > -1) {
            return <div className="field">
                <InputDate
                    key={field.id}
                    label={field.caption}
                    value={this.getFieldValueAsDate(field)}
                    wide={false}
                    onChange={
                        (value: number) => this.updateField(field, `${ms2s(value)}`)
                    }
                />
                {prevConsultations.map(this.renderPrevConsultation.bind(this, field))}
            </div>
        }

        return <div className="field">
            <TextField
                key={field.id}
                label={field.caption}
                value={this.getFieldValue(field)}
                type={field.type || ""}
                width="15rem"
                wide={false}
                onChange={(value: string) => this.updateField(field, value)}
            />
            {prevConsultations.map(this.renderPrevConsultation.bind(this, field))}
        </div>
    }

    /**
     * We want to show the values of previous consultations as well.
     */
    private renderPrevConsultation = (field: IFormField, consultation: IConsultation) => {
        if (typeof consultation.data[field.id] === 'undefined') {
            // This field does not exist.
            return null
        }
        const value = this.getFieldValue(field, consultation)
        return <div className="prev-field" key={`pc-${consultation.enter}`}>
            <div className="date">{
                DateUtil.formatDate(
                    DateUtil.seconds2date(consultation.enter)
                )
            }</div>
            <div className="value">{value}</div>
        </div>
    }

    private updateField = (field: IFormField, value: string) => {
        const sanitizedValue = (value || "").trim()
        const { consultation } = this.props
        delete consultation.data[field.id]
        if (sanitizedValue.length > 0) {
            consultation.data[field.id] = sanitizedValue
            console.info("consultation=", consultation)
        }
    }

    private updateBooleanField = (field: IFormField, value: boolean) => {
        const { consultation } = this.props
        delete consultation.data[field.id]
        if (value) {
            consultation.data[field.id] = "#YES"
        }

    }

    render() {
        const classes = [
            'view-ConsultationForm',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]
        const structure = Settings.structure
        if (!structure) return null
        const form = structure.forms

        return (<div className={classes.join(' ')}>
            {this.renderFields(form)}
        </div>)
    }
}


/**
 * If a field has children, it will be represented by an expander.
 */
function hasChildren(field: IFormField): boolean {
    if (!field.children) return false
    const names = Object.keys(field.children)
    return names.length > 0
}


function isBool(field: IFormField): boolean {
    const { tags } = field
    if (!Array.isArray(tags)) return false
    for (const tag of tags) {
        if (tag.trim().toUpperCase() === "BOOL") return true
    }
    return false
}

function ms2s(milliseconds: number): number {
    const COEFF = 0.001
    return milliseconds * COEFF
}

function s2ms(seconds: number): number {
    const COEFF = 1000
    return seconds * COEFF
}
