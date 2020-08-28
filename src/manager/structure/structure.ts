import Tfw from 'tfw'
import Settings from '../../settings'
import { IStructure, IPatientField } from "../../types"

const Intl = Tfw.Intl

export default {
    createPatientsFieldsFromStructure,
    createPatientsFieldsCaptionsFromStructure,
    getCurrentStructure,
    getFieldCaption,
    getValueCaption
}

function getCurrentStructure(): IStructure {
    const structure = Settings.structure
    if (!structure) throw Error("Structure has not been initialized yet!")
    return structure
}

function createPatientsFieldsFromStructure(): { [key: string]: boolean } {
    const structure = getCurrentStructure()
    const patientsFields: { [key: string]: boolean } = {};
    structure.patientFields.forEach((patientField: IPatientField) => {
        patientsFields[patientField.id] = true;
    });
    return patientsFields;
}

function createPatientsFieldsCaptionsFromStructure(): { [key: string]: string } {
    const structure = getCurrentStructure()
    const patientsFieldsCaptions: { [key: string]: string } = {};
    structure.patientFields.forEach((patientField: IPatientField) => {
        patientsFieldsCaptions[patientField.id] = Intl.toText(patientField.caption);
    });
    return patientsFieldsCaptions;
}

/**
 * Return the caption of a field, given its key or caption.
 */
function getFieldCaption(fieldKey: string): string {
    const structure = getCurrentStructure()
    if (fieldKey.charAt(0) !== '#') return fieldKey;
    const item: { caption: string, type: string } | undefined =
        structure.formFields[fieldKey];
    if (!item) return fieldKey;
    return Intl.toText(item.caption);
}

function getValueCaption(typeKey: string | undefined, valueKey: string): string {
    if (!typeKey) {
        // If no type, return the value as is.
        return valueKey
    }
    const structure = getCurrentStructure()
    const types = structure.types
    const type = types[typeKey]
    if (!type) return valueKey

    for (const subType of Object.values(type.children)) {
        const caption = subType.caption
        if (!caption) continue
        if (subType.id === valueKey) {
            return subType.caption || valueKey
        }
    }
    return valueKey
}
