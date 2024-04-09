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
  clickAndWait,
  submitAndWait
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
  
  const fetchResponseOk = (body) =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(body)
  });

  const fetchResponseError = () =>
    Promise.resolve({ ok: false });

  beforeEach(() => {
    initializeReactContainer();

    fetchSpy = spy();
    global.fetch = fetchSpy.fn;
    fetchSpy.stubReturnValue(fetchResponseOk({}));
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("renders a form", () => {
    render(<CustomerForm original={blankCustomer} onSave={() => {}}/>);
    expect(form()).not.toBeNull();
  });

  it("renders a submit button", () => {
    render(<CustomerForm original={blankCustomer} onSave={() => {}}/>);
    expect(submitButton()).not.toBeNull();
  });

  it("sends request to POST /customers when submitting the form",
  async () => {
    render(
      <CustomerForm
      original={blankCustomer}
      //onSubmit={() => {}}
      onSave={() => {}}
      />
    );
    //click(submitButton());
    await clickAndWait(submitButton());
    expect(fetchSpy).toBeCalledWith(
      "/customers",
      expect.objectContaining({
      method: "POST",
      })
    );
  });

  it("calls fetch with the right configuration", async () => {
    render(
      <CustomerForm
      original={blankCustomer}
      //onSubmit={() => {}}
      onSave={() => {}}
      />
    );
    //click(submitButton());
    await clickAndWait(submitButton());
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

  it("notifies onSave when form is submitted", async () => {
    const customer = { id: 123 };
    fetchSpy.stubReturnValue(fetchResponseOk(customer));
    const saveSpy = spy();
    render(
      <CustomerForm
        original={customer}
        // onSave={saveSpy.fn}
        onSave={() => {}}
      />
    );
    await clickAndWait(submitButton());
    //expect(saveSpy).toBeCalledWith(customer);
    expect(fetchSpy).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
      body: JSON.stringify(customer),
      })
    );
  });

  const itRendersAsATextBox = (fieldName) =>
    it("renders as a text box", () => {
      render(
        <CustomerForm original={blankCustomer} onSave={() => {}}/>
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
      render(<CustomerForm original={customer} onSave={() => {}}/>);
      expect(field(fieldName).value).toEqual(
        existing
      );
    });

  const itRendersALabel = (fieldName, text) => {
    it("renders a label for the text box", () => {
      render(
        <CustomerForm original={blankCustomer} onSave={() => {}}/>
      );
      expect(labelFor(fieldName)).not.toBeNull();
    });

    it(`renders '${text}' as the label content`, () => {
      render(
        <CustomerForm original={blankCustomer} onSave={() => {}}/>
      );
      expect(labelFor(fieldName)).toContainText(text);
    });
  };

  const itAssignsAnIdThatMatchesTheLabelId = (
    fieldName
  ) =>
    it("assigns an id that matches the label id", () => {
      render(
        <CustomerForm original={blankCustomer} onSave={() => {}}/>
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

      // expect(fetchSpy).toBeCalledWith(
      //   expect.anything(),
      //   expect.objectContaining({
      //   body: JSON.stringify(customer),
      //   })
      // );
        
  //   });

  const itSubmitsExistingValue = (fieldName, value) =>
  it("saves existing value when submitted", async() => {
    const customer = { [fieldName]: value };
    render(<CustomerForm original={customer} onSave={() => {}}/>);
    // click(submitButton());
    await clickAndWait(submitButton());
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
    it("saves new value when submitted", async () => {
    render(<CustomerForm original={blankCustomer} onSave={() => {}}/>);
    change(field(fieldName), value);
    //click(submitButton());
    await clickAndWait(submitButton());
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

  it("prevents the default action when submitting the form", async () => {
    render(
      <CustomerForm
        original={blankCustomer}
        onSave={() => {}}
        // removed after spies impl
        //onSubmit={() => {}}
      />
    );

   // const event = submit(form());
    const event = await submitAndWait(form());
    expect(event.defaultPrevented).toBe(true);
  });

  // it("does not notify onSave if the POST request returns an error", async () => {
  //     fetchSpy.stubReturnValue(fetchResponseError());
  //     const saveSpy = spy();
  //     render(
  //      <CustomerForm
  //        original={blankCustomer}
  //        onSave={saveSpy.fn}
  //     /> );
  //     await clickAndWait(submitButton());
  //     expect(saveSpy).not.toBeCalledWith();
  //  });

  it("renders an alert space", async () => {
    render(<CustomerForm original={blankCustomer} />);
    expect(element("[role=alert]")).not.toBeNull();
  });

  // it("renders error message when fetch call fails", async () => {
  //   fetchSpy.mockReturnValue(fetchResponseError());
  //   render(<CustomerForm original={blankCustomer} />);
  //   await clickAndWait(submitButton());
  //   expect(element("[role=alert]")).toContainText(
  //     "error occurred"
  //   );
  // });

  it("initially has no text in the alert space", async () => {
    render(<CustomerForm original={blankCustomer} />);
    expect(element("[role=alert]")).not.toContainText(
       "error occurred"
      ); 
  });

  describe("when POST request returns an error", () => {
    beforeEach(() => {
      fetchSpy.stubReturnValue(fetchResponseError());
    });

    it("does not notify onSave", async () => {
      const saveSpy = spy();
      render(
       <CustomerForm
         original={blankCustomer}
         onSave={saveSpy.fn}
      /> );
      await clickAndWait(submitButton());
      expect(saveSpy).not.toBeCalledWith();
    });

    it("renders error message", async () => {
      render(<CustomerForm original={blankCustomer} />);
      await clickAndWait(submitButton());
      expect(element("[role=alert]")).toContainText(
        "error occurred"
      );
    });
  });
});
