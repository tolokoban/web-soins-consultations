import Parser from "./parser"

describe("structure/parser", () => {
    const cases: Array<[string, {}]> = [
        [
            "* #PATIENT-NAME Nom du patient",
            {
                "#PATIENT-NAME": {
                    id: "#PATIENT-NAME",
                    children: {},
                    caption: "Nom du patient",
                    tags: []
                }
            }
        ],
        [
            "* #PATIENT-GENDER Sexe (#GENDER)",
            {
                "#PATIENT-GENDER": {
                    id: "#PATIENT-GENDER",
                    children: {},
                    caption: "Sexe",
                    type: "#GENDER",
                    tags: []
                }
            }
        ],
        [
            "* #PATIENT-SECONDNAME Pseudo @OPTIONAL",
            {
                "#PATIENT-SECONDNAME": {
                    id: "#PATIENT-SECONDNAME",
                    children: {},
                    caption: "Pseudo",
                    tags: ["OPTIONAL"]
                }
            }
        ]
    ]
    for (const testCase of cases) {
        const [input, expected] = testCase
        it(`should parse this single line "${input}"`, () => {
            const output = Parser.parse(input);
            expect(output).toEqual(expected);
        })
    }
});
