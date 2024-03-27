import { toContainText } from "./toContainText";
const stripTerminalColor = (text) =>
    text.replace(/\x1B\[\d+m/g, "");

describe("toContainText matcher", () => {
    it("returns pass is true when text is found in the given DOMelement", () => {
        const domElement = {
            textContent: "text to find"
        };
        const result = toContainText(
            domElement,
            "text to find"
        );
        expect(result.pass).toBe(true);
    });

    // it("returns a message that contains the source line if nomatch", () => {
    //     const domElement = { textContent: "" };
    //     const result = toContainText(
    //     domElement,
    //     "ashley"
    //     );
    //     expect(stripTerminalColor(result.message()))
    //     .toContain(`expect(element).toContainText("ashley")`); 
    // });

    // it("returns a message that contains the source line if negatedmatch", () => {
    //     const domElement = { textContent: "text to find" };
    //     const result = toContainText(
    //         domElement,
    //         "text to find"
    //     ); 
    //     expect(stripTerminalColor(result.message())).toContain(
    //         `expect(container).not.toContainText("text to find")`
    //         );
    // });

    // it("returns a message that contains the actual text", () => {
    //     const domElement = { textContent: "text to find" };
    //     const result = toContainText(
    //         domElement,
    //         "text to find"
    //     );
    //     expect(
    //       stripTerminalColor(result.message())
    //     ).toContain(`Actual text: "text to find"`);
    //   });
   
});