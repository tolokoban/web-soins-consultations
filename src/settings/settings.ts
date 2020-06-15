import Tfw from 'tfw'
import FileSystem from '../service/file-system'
import { IStructure } from '../types'

const SAVE_DEBOUNCING_DELAY = 300

interface ISettings {
    remoteServer: string
    secretCode: string
    organizationId: number
    structureId: number
    structure?: IStructure
}

const DATA: ISettings = {
    remoteServer: "https://web-soins.com",
    secretCode: "kAcGObgfMr",
    organizationId: 1,
    structureId: 1
}

class Settings {
    private readonly data: ISettings
    constructor() {
        this.data = DATA
    }

    async initialize(): Promise<boolean> {
        try {
            const content = await FileSystem.readText("settings.json")
            const data = JSON.parse(content)

            if (typeof data.remoteServer !== 'string')
                throw Error("Attribute remoteServer must be a string!")
            if (typeof data.secretCode !== 'string')
                throw Error("Attribute secretCode must be a string!")
            if (typeof data.organizationId !== 'number')
                throw Error("Attribute organizationId must be a number!")
            if (typeof data.structureId !== 'number')
                throw Error("Attribute structureId must be a number!")

            DATA.remoteServer = data.remoteServer
            DATA.secretCode = data.secretCode
            DATA.organizationId = data.organizationId
            DATA.structureId = data.structureId
            DATA.structure = data.structure

            return true
        } catch (ex) {
            console.error("Unable to load settings.json!")
            console.error(ex)
            return false
        }
    }

    get remoteServer(): string { return this.data.remoteServer }
    set remoteServer(v: string) {
        this.data.remoteServer = v
        this.save()
    }
    get secretCode(): string { return this.data.secretCode }
    set secretCode(v: string) {
        this.data.secretCode = v
        this.save()
    }
    get organizationId(): number { return this.data.organizationId }
    set organizationId(v: number) {
        this.data.organizationId = v
        this.save()
    }
    get structureId(): number { return this.data.structureId }
    set structureId(v: number) {
        this.data.structureId = v
        this.save()
    }
    get structure(): IStructure | undefined { return this.data.structure }
    set structure(v: IStructure | undefined) {
        this.data.structure = v
        this.save()
    }

    save = Tfw.Async.Debouncer(() => {
        FileSystem.writeText("settings.json", JSON.stringify(this.data))
    }, SAVE_DEBOUNCING_DELAY)
}

export default new Settings()
