/**
 * You can enhance this type for all the NWjs SDK.
 * Get the doc here:
 * https://nwjs.readthedocs.io/en/latest/
 */

declare const nw: {
    App: {
        quit(): void
    }
    Shell: {
        openItem(filename: string): void
    }
    Window: {
        get(): INWJSWindow
        getAll(callback: (windows: INWJSWindow[]) => void): void
    }
}


interface INWJSWindow {
    toggleFullscreen(): void
    x: number
    y: number
    width: number
    height: number
    title: string
    isAlwaysOnTop(): boolean
}
