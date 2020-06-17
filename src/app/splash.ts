import "./splash.css"

export default {
    hide() {
        const splash = document.getElementById("splash-screen")
        if (!splash) return
        splash.classList.add("vanish")
        const VANISHING_DELAY = 1000
        window.setTimeout(
            () => document.body.removeChild(splash),
            VANISHING_DELAY
        )
    }
}
