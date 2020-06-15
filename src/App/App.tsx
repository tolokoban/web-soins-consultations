import React from "react"
import Tfw from 'tfw'



import "./App.css"

const Button = Tfw.View.Button
const _ = Tfw.Intl.make(require("./App.yaml"))

interface IAppProps {
    className?: string[]
}
interface IAppState {}

export default class App extends React.Component<IAppProps, IAppState> {
    state = {}

    render() {
        const classes = [
            'App',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]

        return (<div className={classes.join(' ')}>
            <Button label={_('ok')} />
        </div>)
    }
}
