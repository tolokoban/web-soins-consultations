import Tfw from 'tfw'
import Parser from "../structure/parser"
import Settings from '../settings'

import {
    IStructure, IPatientField, IFormField, ITypes
} from "../types"

const Intl = Tfw.Intl

export interface IStructureService {
    id: number;
    name: string;
    exams: string;
    vaccins: string;
    patient: string;
    forms: string;
    types: string;
}


export default {
    async getFromRemote(): Promise<IStructure | null> {
        const organizationId: number = Settings.organizationId
        const structureId: number = Settings.structureId
        const WebService = Tfw.WebService.create(
            Settings.remoteServer
        )
        console.info("Settings.remoteServer=", Settings.remoteServer)
        const structures: IStructureService[] =
            await WebService.exec("structure.list", organizationId);
        const structure = structures.find(
            (structure: IStructureService) => structure.id === structureId
        )
        if (!structure) return null
        console.info("structure=", structure)
        return {
            id: structure.id,
            organizationId,
            name: structure.name,
            patientFields: parsePatient(structure.patient),
            formFields: parseFormFields(structure),
            //exams: parse(structure.exams),
            //vaccins: parse(structure.vaccins),
            forms: parse(structure.forms),
            types: parse(structure.types) as ITypes,
            sources: {
                exams: structure.exams,
                vaccins: structure.vaccins,
                patient: structure.patient,
                forms: structure.forms,
                types: structure.types
            }
        }
    }
}


function parse(def: string): { [key: string]: IFormField } {
    try {
        return Parser.parse(def)
    }
    catch (ex) {
        console.error("[service/structure/parse] ", ex)
        console.log(def)
        throw Error(ex)
    }
}

function parsePatient(stringifiedPatientDef: string): IPatientField[] {
    try {
        const raw: { [key: string]: IFormField } =
            Parser.parse(stringifiedPatientDef)
        const patients: IPatientField[] = Object.keys(raw)
            .map((id: string) => {
                const patient = raw[id];
                return {
                    id,
                    type: patient.type || "",
                    caption: Intl.toIntl(patient.caption) || ""
                }
            });
        return patients;
    }
    catch (ex) {
        console.error("[parsePatient] ", ex);
    }
    return [];
}

interface IFlatField {
    type: string
    caption: string
}

function parseFormFields(
    structure: IStructureService
): { [key: string]: IFlatField } {
    const result: { [key: string]: IFlatField } = {}
    const fringe: Array<{ [key: string]: IFormField }> =
        [parse(structure.forms)]

    while (fringe.length > 0) {
        const item = fringe.shift()
        if (!item) continue
        for (const name of Object.keys(item)) {
            const value = item[name]
            result[name] = {
                type: "",
                caption: Intl.toText(Intl.toIntl(value.caption))
            }
            if (value.type) result[name].type = value.type
            if (value.children) {
                fringe.push(value.children)
            }
        }
    }
    return result
}
