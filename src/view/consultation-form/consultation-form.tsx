import React from "react"
import Tfw from 'tfw'
import Settings from '../../settings'
import TextField from '../field/text'
import { IPatient, IFormField, IFormFields, IConsultation } from "../../types"


import "./consultation-form.css"

const Expand = Tfw.View.Expand
const Checkbox = Tfw.View.Checkbox

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

    private getFieldValue(field: IFormField): string {
        const { consultation } = this.props
        if (!consultation) return ""
        const { data } = consultation
        if (!data) return ""
        return data[field.id] || ""
    }

    private getFieldValueAsBoolean(field: IFormField): boolean {
        const value = this.getFieldValue(field)
        return Tfw.Converter.Enum<string>(
            value,
            ["#YES", "#TRUE"],
            "#FALSE"
        ) !== "#FALSE"
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
                className="thm-ele-button field"
            >
                {this.renderFields(field.children)}
            </Expand>
        }

        const { consultation } = this.props
        if (isBool(field)) {
            return <Checkbox
                key={field.id}
                wide={true}
                label={field.caption}
                value={this.getFieldValueAsBoolean(field)}
                onChange={(value: boolean) => this.updateBooleanField(field, value)}
            />
        }

        return <div className="field"><TextField
            key={field.id}
            label={field.caption}
            value={this.getFieldValue(field)}
            type={field.type || ""}
            width="12rem"
            onChange={(value: string) => this.updateField(field, value)}
        >
        </TextField></div>
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
