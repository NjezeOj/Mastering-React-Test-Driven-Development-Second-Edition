import { toContainText } from "./matchers/toContainText";
import { toHaveClass } from "./matchers/toHaveClass";
import { toBeElementWithTag } from "./matchers/toBeElementWithTag";
import { toBeInputFieldOfType } from "./matchers/toBeInputFieldOfType";

expect.extend({
  toBeElementWithTag,
  toBeInputFieldOfType,
  toContainText,
  toHaveClass,
});

// expect.extend({
//   toBeCalled(received) {
//     if (received.receivedArguments() === undefined) {
//       return {
//         pass: false,
//         message: () => "Spy was not called.",
//       };
//     }
//     return {
//       pass: true,
//       message: () => "Spy was called.",
//     };
//   },
// });

// Now we can work on the second expectation—the one that checks the
// function arguments. Add the following code to your new matcher and
// rename it from toBeCalled to toBeCalledWith:

expect.extend({
  toBeCalledWith(received, ...expectedArguments) {
    const notMatch = !this.equals(
      received.receivedArguments(),
      expectedArguments
    );
      
    if (notMatch) {
      return {
        pass: false,
        message: () =>
          "Spy called with the wrong arguments: " +
          received.receivedArguments() +
          ".",
      };
    }
    return {
      pass: true,
      message: () => "Spy was called.",
    };
  },
});
  