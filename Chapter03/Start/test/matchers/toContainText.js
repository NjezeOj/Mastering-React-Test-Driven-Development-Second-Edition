import {
  matcherHint,
  printExpected,
  printReceived,
} from "jest-matcher-utils";


export const toContainText = (
  received,
  expectedText
) => {
  // pass: received.textContent.includes(expectedText)

  // const pass = received.textContent.includes(expectedText)
  // return{pass}

  // const pass = received.textContent.includes(expectedText);
  // const message = () =>
  // matcherHint("toContainText", "element", printExpected(expectedText), { isNot: pass });
  // return { pass, message };
  
  const pass = received.textContent.includes(expectedText);
  const sourceHint = () => matcherHint("toContainText","element",printExpected(expectedText),{ isNot: pass });
  const actualTextHint = () =>
    "Actual text: " + printReceived(received.textContent);
  const message = () =>
    [sourceHint(), actualTextHint()].join("\n\n");
  return { pass, message };
};