import Tfw from 'tfw'
import Settings from '../../settings'
import Parser from './parser'
import { IStructureService } from './types'
import { IStructure, ITypes } from "../../types"


export default {
    async getFromRemote(): Promise<IStructure | null> {
        const organizationId: number = Settings.organizationId
        const structureId: number = Settings.structureId
        const WebService = Tfw.WebService.create(
            Settings.remoteServer
        )
        try {
            const structures: IStructureService[] =
                await WebService.exec("structure.list", organizationId);
            const structure = structures.find(
                (structure: IStructureService) => structure.id === structureId
            )
            if (!structure) return null
            console.info("Structure (raw)=", structure)
            const parsedStructure: IStructure = {
                id: structure.id,
                organizationId,
                name: structure.name,
                patientFields: Parser.parsePatient(structure.patient),
                formFields: Parser.parseFormFields(structure),
                //exams: parse(structure.exams),
                //vaccins: parse(structure.vaccins),
                forms: Parser.parse(structure.forms),
                types: Parser.parse(structure.types) as ITypes,
                vaccins: Parser.parseVaccins(structure.vaccins),
                exams: Parser.parseExams(structure.exams),
                sources: {
                    exams: structure.exams,
                    vaccins: structure.vaccins,
                    patient: structure.patient,
                    forms: structure.forms,
                    types: structure.types
                }
            }
            console.info("Structure (parsed)=", parsedStructure)
            return parsedStructure
        } catch (ex) {
            console.error(ex)
            return null
        }
    }
}
