import * as React from "react"
import Tfw from 'tfw'
import Markdown from "markdown-to-jsx"

import './console-view.css'

// const _ = Tfw.Intl.make(require('./console-view.json'))

export interface IConsoleViewProps {
    className?: string
    logs: string[]
}

export default class ConsoleView extends React.Component<IConsoleViewProps> {
    render() {
        const classNames = ['custom', 'view-ConsoleView']
        if (typeof this.props.className === 'string') {
            classNames.push(this.props.className)
        }

        return <ul className={classNames.join(" ")}>
            {
                this.props.logs.map(
                    (log: string, index: number) =>
                    <li key={`li-${index}`}><Markdown>{
                        log
                    }</Markdown></li>
                )
            }
        </ul>
    }
}
