import { fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";
import { InputsProvider } from "./state/InputsContext";

const renderApp = () =>
  render(
    <InputsProvider>
      <App />
    </InputsProvider>
  );

/** Thin smoke tests only — the arithmetic is covered in src/domain/__tests__. */

test("renders the headline and the sized build", () => {
  renderApp();
  expect(screen.getByText("Settlers 4 Build Configurator")).toBeInTheDocument();
  expect(screen.getByText("Gold Smelting Works")).toBeInTheDocument();
  expect(screen.getByText("Fisher Huts")).toBeInTheDocument();
  expect(screen.getByText("T3 Soldiers per minute")).toBeInTheDocument();
});

test("does not offer stone mines as an anchor building", () => {
  renderApp();
  fireEvent.mouseDown(screen.getByLabelText("Building"));
  const options = within(screen.getByRole("listbox"));
  expect(options.queryByText("Stone Mines")).not.toBeInTheDocument();
  expect(options.getByText("Grain Farms")).toBeInTheDocument();
});

test("changing civilization changes the result", () => {
  renderApp();
  const before = screen.getByLabelText("Amount");
  expect(before).toBeInTheDocument();

  const readSoldiers = () =>
    screen.getByText("T3 Soldiers per minute").parentElement?.textContent;
  const romans = readSoldiers();

  fireEvent.mouseDown(screen.getByLabelText("Civilization"));
  fireEvent.click(within(screen.getByRole("listbox")).getByText("Vikings"));

  expect(readSoldiers()).not.toEqual(romans);
});

test("flags a count that cannot cover the toolsmith overhead", () => {
  renderApp();
  fireEvent.mouseDown(screen.getByLabelText("Building"));
  fireEvent.click(within(screen.getByRole("listbox")).getByText("Coal Mines"));
  fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "0" } });

  expect(screen.getByText(/supports no soldiers at all/)).toBeInTheDocument();
});

test("switches to a soldiers-per-minute target", () => {
  renderApp();
  fireEvent.click(screen.getByText("I want this many T3/min"));
  expect(screen.getByLabelText("T3 soldiers per minute")).toBeInTheDocument();
});
