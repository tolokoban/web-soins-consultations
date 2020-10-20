// To test a React component, you need to install few modules:
// npm install @types/jest @testing-library/react @testing-library/jest-dom jest ts-jest
// @see https://github.com/testing-library/react-testing-library
import '@testing-library/jest-dom'
import { render, fireEvent, waitFor, screen } from "@testing-library/react"
import ConsoleView, { IConsoleViewProps } from './console-view'

function view(partialProps: Partial<IConsoleViewProps>) {
    const props: IConsoleViewProps = {
        // @TODO Set default props.
        ...partialProps
    }
    render(<ConsoleView {...props} />)
}

describe('<ConsoleView/> in view', () => {
    it('should render without crashing', () => {
        view({})
    })
})
