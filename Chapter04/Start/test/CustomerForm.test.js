import React from "react";
import {
    initializeReactContainer,
    render,
    element,
    form,
    field,
    click,
    submit,
} from "./reactTestExtensions";
import { CustomerForm } from "../src/CustomerForm";

describe("CustomerForm", () => {
    const blankCustomer = {
        firstName: "",
   };

    beforeEach(() => {
    initializeReactContainer();
    });

    it("renders a form", () => {
        render(<CustomerForm original={blankCustomer}/>);
        // expect(element("form")).not.toBeNull();
        expect(form()).not.toBeNull();
   });

   it("renders the first name field as a text box", () => {
        render(<CustomerForm original={blankCustomer}/>);
        // const field = form().elements.firstName;
        expect(field("firstName")).not.toBeNull();
        expect(field("firstName").tagName).toEqual("INPUT");
        expect(field("firstName").type).toEqual("text");
    });

    it("includes the existing value for the first name", () => {
        const customer = { firstName: "Ashley" };
        render(<CustomerForm original={customer} />);
        // const field = form().elements.firstName;
        expect(field("firstName").value).toEqual("Ashley");
    });

    it("renders a label for the first name field", () => {
        render(<CustomerForm original={blankCustomer} />);
        const label = element("label[for=firstName]");
        expect(label).not.toBeNull();
   });

   it("renders 'First name' as the first name label content", () =>
    {
        render(<CustomerForm original={blankCustomer} />);
        const label = element("label[for=firstName]");
        expect(label).toContainText("First name");
    });

    it("assigns an id that matches the label id to the first name field", () => {
     render(<CustomerForm original={blankCustomer} />);
     expect(field("firstName").id).toEqual("firstName");
   });

    it("renders a submit button", () => {
        render(<CustomerForm original={blankCustomer} />);
        const button = element("input[type=submit]");
        expect(button).not.toBeNull();
    });

    it("saves existing first name when submitted", () => {
        expect.hasAssertions();  // hasAssertions expectation tells Jest that it 
        //should expect at least one assertion to occur. 
        //It tells Jest that at least one assertion must run within 
        //the scope of the test; otherwise, the test has failed.

        const customer = { firstName: "Ashley" };
        render(
            <CustomerForm
            original={customer}
            onSubmit={({ firstName }) =>
                expect(firstName).toEqual("Ashley")
            }
        /> );
        // This function call is a mix of the Arrange and Assert phases in one. 
        // The Arrange phase is the render call itself, and the Assert phase is the onSubmit handler. 

        const button = element("input[type=submit]");
        click(button); // This is the Act phase of our test, which in this test is the last phase of the test:
   });

   it("prevents the default action when submitting the form", () =>
   {
    render(
        <CustomerForm
            original={blankCustomer}
            onSubmit={() => {}}
        />
        );
        const event = submit(form());
        expect(event.defaultPrevented).toBe(true);
    });
});