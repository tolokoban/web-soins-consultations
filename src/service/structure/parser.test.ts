import Parser from './parser'

describe(`service/structure/parser`, () => {
    describe(`parseExams()`, () => {
        it(`should accept empty strings`, () => {
            expect(Parser.parseExams("")).toEqual({})
        })

        it(`should accept undefined`, () => {
            const undef: string = (undefined as unknown) as string
            expect(Parser.parseExams(undef as string)).toEqual({})
        })

        it("should work with a simple entry", () => {
            const input = "* Biologie\n** Chimie\n*** Na/Cl"
            expect(Parser.parseExams(input)).toEqual({
                "Biologie": {
                    "Chimie": ["Na/Cl"]
                }
            })
        })
    })
})
