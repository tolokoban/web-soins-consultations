import React from "react"
import Tfw from 'tfw'

import Splash from './splash'

import "./App.css"

const Button = Tfw.View.Button
const Stack = Tfw.Layout.Stack

interface IAppProps {
    className?: string[]
    page: string
}
interface IAppState { }

export default class App extends React.Component<IAppProps, IAppState> {
    state = {}

    async componentDidMount() {
        Splash.hide()
    }

    render() {
        const classes = [
            'App',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]

        return (<div className={classes.join(' ')}>
            <Stack
                fullscreen={true}
                scrollable={true}
                value={this.props.page}
            >
                <Button key="patients" label="Hello world!" />
                <Button key="other" label="How are you?" />
            </Stack>
        </div>)
    }
}
