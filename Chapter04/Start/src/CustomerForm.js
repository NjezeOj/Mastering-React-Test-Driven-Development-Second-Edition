import React, { useState } from "react";

export const CustomerForm = ({original, onSubmit}) => {
    const [ customer, setCustomer ] = useState(original);

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(original);
    };

    const handleChange = ({ target }) =>
    setCustomer((customer) => ({
      ...customer,
      [target.name]: target.value,
    }));

    return(
        /*<form onSubmit={() => onSubmit(original)}>*/
        <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First name </label>
        {/* <input type="text" name="firstName" id="firstName" value={original.firstName} readOnly/> */}
        <input type="text" name="firstName" id="firstName" value={customer.firstName} 
        onChange={handleChange}/>

        <label htmlFor="lastName">Last name</label>
        <input
            type="text"
            name="lastName"
            id="lastName"
            value={customer.lastName}
            onChange={handleChange}
        />
        <label htmlFor="phoneNumber">
            Phone number
        </label>
        <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            value={customer.phoneNumber}
            onChange={handleChange}
        />
        <input type="submit" value="Add" />
        </form>
    )
};