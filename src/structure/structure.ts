import Tfw from 'tfw'
import { IStructure, IPatientField } from "../types"

const Intl = Tfw.Intl

export default {
    createPatientsFieldsFromStructure,
    createPatientsFieldsCaptionsFromStructure,
    getFieldCaption,
    // getCurrentStructure
}

function createPatientsFieldsFromStructure(structure: IStructure): { [key: string]: boolean } {
    const patientsFields: { [key: string]: boolean } = {};
    structure.patientFields.forEach((patientField: IPatientField) => {
        patientsFields[patientField.id] = true;
    });
    return patientsFields;
}

function createPatientsFieldsCaptionsFromStructure(structure: IStructure): { [key: string]: string } {
    const patientsFieldsCaptions: { [key: string]: string } = {};
    structure.patientFields.forEach((patientField: IPatientField) => {
        patientsFieldsCaptions[patientField.id] = Intl.toText(patientField.caption);
    });
    return patientsFieldsCaptions;
}

function getFieldCaption(key: string, structure: IStructure) {
    if (key.charAt(0) !== '#') return key;
    const item: { caption: string, type: string } | undefined =
        structure.formFields[key];
    if (!item) return key;
    return Intl.toText(item.caption);
}

// function getCurrentStructure(): IStructure | null {
//     const state = State.store.getState()
//     const carecenter = state.current.carecenter
//     if (!carecenter) return null
//     const structureId = carecenter.structureId
//     const structure = state.structures.find(
//         struc => struc.id === structureId
//     )
//     if (!structure) return null
//     return structure
// }


class Structure {
    public readonly data: IStructure

    constructor(data: IStructure) {
        this.data = data
    }


}
