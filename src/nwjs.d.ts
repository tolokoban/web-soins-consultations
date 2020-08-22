
declare const nw: {
    App: {},
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
