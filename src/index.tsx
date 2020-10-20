import Tfw from 'tfw'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './index.css'
import App from './app'
import State from './state'
import Settings from './settings'
import PatientService from './service/patient'
import SynchroService from './service/synchro'
import StructureService from './service/structure'
import * as serviceWorker from './serviceWorker'

Tfw.Theme.register("soin", {
    colorW: "#fda", colorB: "#420", colorE: "#B20",
    color0: "#ffcb97", color1: "#ffdab3", color2: "#ffe6cc", color3: "#fff3e6",
    colorP: "#804924", colorPL: "#b36633", colorPD: "#4d2c16",
    colorS: "#ff9f30", colorSD: "#ff7f00", colorSL: "#ffbf60"
})
console.log(Tfw.Theme.apply("soin"))

async function start() {
    await Tfw.Font.loadJosefin(true)
    window.addEventListener("keyup", (evt) => {
        if (evt.key === "F11") {
            evt.preventDefault()
            //const nw = window['nw'] as any
            const win = nw.Window.get()
            win.toggleFullscreen()
        }
    }, true)
    console.info("process.env=", process.env)
    await Settings.initialize()
    State.addLog(`Serveur distant: __${Settings.remoteServer}__`)
    const patients = await PatientService.getAllPatients()
    console.info("patients=", patients)
    State.setPatients(patients)
    const structure = await StructureService.getFromRemote()
    if (structure) {
        // Update structure from network.
        Settings.structure = structure
    }

    ReactDOM.render(
        <Provider store={State.store}>
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </Provider>,
        document.getElementById('root')
    )

    SynchroService.synchro(
        State.addLog
    )
}

start()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
