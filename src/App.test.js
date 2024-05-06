import { render, fireEvent, screen } from "@testing-library/react";
import App from './App'
import React from "react";

//test block
test("increments counter", () => {
// render the component on virtual dom
render(<App />);

//select the elements you want to interact with
const counter = screen.getByTestId("header");

//assert the expected result
expect(counter).toHaveTextContent("Personal Budget App");
});