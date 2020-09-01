import Tfw from 'tfw'
import Parser from "../../manager/structure/parser"

import { IPatientField, IFormField, IVaccins } from "../../types"
import { IStructureService } from './types'

export default {
    parse,
    parseExams,
    parseFormFields,
    parsePatient,
    parseVaccins
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

function parseExams(examsDef: string): { [key: string]: { [key: string]: string[] } } {
    const exams: { [key: string]: { [key: string]: string[] } } = {}

    try {
        const raw: { [key: string]: IFormField } = Parser.parseLazy(examsDef)
        for (const sectionKey of Object.keys(raw)) {
            const section: IFormField = raw[sectionKey]
            const sectionName = section.caption
            const examsSection: { [key: string]: string[] } = {}
            exams[sectionName] = examsSection
            for (const subSectionKey of Object.keys(section.children)) {
                const subSection = section.children[subSectionKey]
                const subSectionName = subSection.caption
                const examsSubSection: string[] = []
                examsSection[subSectionName] = examsSubSection
                for (const key of Object.keys(subSection.children)) {
                    const field = subSection.children[key]
                    examsSubSection.push(field.caption)
                }
                if (examsSubSection.length === 0) {
                    examsSubSection.push(subSectionName)
                }
            }
        }
    }
    catch (ex) {
        console.error("[parseExams] ", ex);
        console.log("examsDef=", examsDef)
    }

    return exams
}

function parseVaccins(stringifiedVaccins: string): IVaccins {
    const vaccins: IVaccins = {}
    try {
        const raw: { [key: string]: IFormField } =
            Parser.parse(stringifiedVaccins)
        for (const id of Object.keys(raw)) {
            vaccins[id] = { caption: raw[id].caption }
        }
    }
    catch (ex) {
        console.error("[parseVaccins] ", ex);
    }
    return vaccins
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
                    caption: Tfw.Intl.toIntl(patient.caption) || ""
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

function parseFormFields(structure: IStructureService): { [key: string]: IFlatField } {
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
                caption: Tfw.Intl.toText(Tfw.Intl.toIntl(value.caption))
            }
            if (value.type) result[name].type = value.type
            if (value.children) {
                fringe.push(value.children)
            }
        }
    }
    return result
}
