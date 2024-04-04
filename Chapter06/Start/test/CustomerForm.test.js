import React from "react";
import {
  initializeReactContainer,
  render,
  element,
  form,
  field,
  click,
  change,
  submit,
  submitButton,
  labelFor,
} from "./reactTestExtensions";
import { CustomerForm } from "../src/CustomerForm";

describe("CustomerForm", () => {
  const blankCustomer = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
  };

  // const singleArgumentSpy = () => {
  //   let receivedArgument;
  //   return {
  //     fn: arg => (receivedArgument = arg),
  //     receivedArgument: () => receivedArgument
  //   };
  // };

  // Make your spy function work for functions with any number of arguments
  // by replacing singleArgumentSpy with the following function: 
  const spy = () => {
    let receivedArguments;
    let returnValue
    return {
      // fn: (...args) => (receivedArguments = args),
      fn: (...args) => {
        receivedArguments = args;
        return returnValue // adding makes this spy a stub
      },
      receivedArguments: () => receivedArguments,
      receivedArgument: n => receivedArguments[n],
      stubReturnValue: value => returnValue = value // adding makes this spy a stub
    };
  };
  
  const originalFetch = global.fetch;
  let fetchSpy;

  const bodyOfLastFetchRequest = () =>
    JSON.parse(fetchSpy.receivedArgument(1).body);

  beforeEach(() => {
    initializeReactContainer();

    fetchSpy = spy();
    global.fetch = fetchSpy.fn;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("renders a form", () => {
    render(<CustomerForm original={blankCustomer} />);
    expect(form()).not.toBeNull();
  });

  it("renders a submit button", () => {
    render(<CustomerForm original={blankCustomer} />);
    expect(submitButton()).not.toBeNull();
  });

  it("sends request to POST /customers when submitting the form",
  () => {
    render(
      <CustomerForm
      original={blankCustomer}
      onSubmit={() => {}}
      />
    );
    click(submitButton());
    expect(fetchSpy).toBeCalledWith(
      "/customers",
      expect.objectContaining({
      method: "POST",
      })
    );
  });

  it("calls fetch with the right configuration", () => {
    render(
      <CustomerForm
      original={blankCustomer}
      onSubmit={() => {}}
      />
    );
    click(submitButton());
    expect(fetchSpy).toBeCalledWith(
    expect.anything(),
    expect.objectContaining({
      credentials: "same-origin",
      headers: {
      "Content-Type": "application/json",
      },
    })
    );
  });

  const itRendersAsATextBox = (fieldName) =>
    it("renders as a text box", () => {
      render(
        <CustomerForm original={blankCustomer} />
      );
      expect(field(fieldName)).toBeInputFieldOfType(
        "text"
      );
    });

  // the function below is a test-generator fucntion
  const itIncludesTheExistingValue = (
    fieldName,
    existing
  ) =>
    it("includes the existing value", () => {
      const customer = { [fieldName]: existing };
      render(<CustomerForm original={customer} />);
      expect(field(fieldName).value).toEqual(
        existing
      );
    });

  const itRendersALabel = (fieldName, text) => {
    it("renders a label for the text box", () => {
      render(
        <CustomerForm original={blankCustomer} />
      );
      expect(labelFor(fieldName)).not.toBeNull();
    });

    it(`renders '${text}' as the label content`, () => {
      render(
        <CustomerForm original={blankCustomer} />
      );
      expect(labelFor(fieldName)).toContainText(text);
    });
  };

  const itAssignsAnIdThatMatchesTheLabelId = (
    fieldName
  ) =>
    it("assigns an id that matches the label id", () => {
      render(
        <CustomerForm original={blankCustomer} />
      );
      expect(field(fieldName).id).toEqual(fieldName);
    });

  // const itSubmitsExistingValue = (fieldName, value) =>
  //   it("saves existing value when submitted", () => {
  //     expect.hasAssertions();
  //     const customer = { [fieldName]: value };
  //     render(
  //       <CustomerForm
  //         original={customer}
  //         onSubmit={(props) =>
  //           expect(props[fieldName]).toEqual(value)
  //         }
  //       />
  //     );
  //     click(submitButton());
  //   });
  
//   Your call to fetch is now complete, so you can remove the original
// implementation. Start by removing the onSubmit prop and the submitSpy
// variable from the itSubmitsExistingValue test generator

  // const itSubmitsExistingValue = (fieldName, value) =>
  //   it("saves existing value when submitted", () => {
  //     // let submitArg;
  //     const submitSpy = spy();
  //     const customer = { [fieldName]: value };
  //     render(
  //       <CustomerForm
  //         original={customer}
  //         // onSubmit={submittedCustomer =>
  //         //   (submitArg = submittedCustomer)
  //         // }
  //         onSubmit={submitSpy.fn}
  //       />
  //     );
  //     click(submitButton());
  //     // expect(
  //     //   submitSpy.receivedArguments()
  //     //   ).toBeDefined();
  //     //expect(submitSpy).toBeCalled(customer);
  //     expect(submitSpy).toBeCalledWith(customer);
  //     // expect(submitSpy.receivedArgument()).toEqual(customer);
  //     expect(submitSpy.receivedArgument(0)).toEqual(customer);

  //     expect(fetchSpy).toBeCalledWith(
  //       expect.anything(),
  //       expect.objectContaining({
  //       body: JSON.stringify(customer),
  //       })
  //     );
        
  //   });

  const itSubmitsExistingValue = (fieldName, value) =>
  it("saves existing value when submitted", () => {
    const customer = { [fieldName]: value };
    render(<CustomerForm original={customer} />);
    click(submitButton());
    // expect(fetchSpy).toBeCalledWith(
    //   expect.anything(),
    //   expect.objectContaining({
    //     body: JSON.stringify(customer),
    //   })
    // );
    expect(bodyOfLastFetchRequest()).toMatchObject(
      customer
     );
  });


  // const itSubmitsNewValue = (fieldName, value) =>
  //   it("saves new value when submitted", () => {
  //     expect.hasAssertions();
  //     render(
  //       <CustomerForm
  //         original={blankCustomer}
  //         onSubmit={(props) =>
  //           expect(props[fieldName]).toEqual(value)
  //         }
  //       />
  //     );
  //     change(field(fieldName), value);
  //     click(submitButton());

  //     expect(fetchSpy).toBeCalledWith(
  //       expect.anything(),
  //       expect.objectContaining({
  //         body: JSON.stringify({
  //           ...blankCustomer,
  //           [fieldName]: value,
  //         }),
  //       })
  //     );
  //   });
  const itSubmitsNewValue = (fieldName, value) =>
    it("saves new value when submitted", () => {
    render(<CustomerForm original={blankCustomer} />);
    change(field(fieldName), value);
    click(submitButton());
    // expect(fetchSpy).toBeCalledWith(
    //   expect.anything(),
    //   expect.objectContaining({
    //       body: JSON.stringify({
    //       ...blankCustomer,
    //       [fieldName]: value,
    //     }),
    //   })
    // );
    expect(bodyOfLastFetchRequest()).toMatchObject({
      [fieldName]: value,
      });
      
  });

  describe("first name field", () => {
    itRendersAsATextBox("firstName");
    itIncludesTheExistingValue(
      "firstName",
      "existingValue"
    );
    itRendersALabel("firstName", "First name");
    itAssignsAnIdThatMatchesTheLabelId("firstName");
    itSubmitsExistingValue(
      "firstName",
      "existingValue"
    );
    itSubmitsNewValue("firstName", "newValue");
  });

  describe("last name field", () => {
    itRendersAsATextBox("lastName");
    itIncludesTheExistingValue(
      "lastName",
      "existingValue"
    );
    itRendersALabel("lastName", "Last name");
    itAssignsAnIdThatMatchesTheLabelId("lastName");
    itSubmitsExistingValue(
      "lastName",
      "existingValue"
    );
    itSubmitsNewValue("lastName", "newValue");
  });

  describe("phone number field", () => {
    itRendersAsATextBox("phoneNumber");
    itIncludesTheExistingValue(
      "phoneNumber",
      "12345"
    );
    itRendersALabel("phoneNumber", "Phone number");
    itAssignsAnIdThatMatchesTheLabelId("phoneNumber");
    itSubmitsExistingValue("phoneNumber", "12345");
    itSubmitsNewValue("phoneNumber", "67890");
  });

  it("prevents the default action when submitting the form", () => {
    render(
      <CustomerForm
        original={blankCustomer}

        // removed after spies impl
        //onSubmit={() => {}}
      />
    );

    const event = submit(form());

    expect(event.defaultPrevented).toBe(true);
  });
});
