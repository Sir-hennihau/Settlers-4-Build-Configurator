import { fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";
import { InputsProvider } from "./state/InputsContext";
import { ColorModeProvider } from "./theme/ColorModeProvider";

const renderApp = () =>
  render(
    <ColorModeProvider>
      <InputsProvider>
        <App />
      </InputsProvider>
    </ColorModeProvider>
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

test("anchors on buildings only, with no soldier-target mode", () => {
  renderApp();
  expect(screen.queryByText("I want this many T3/min")).not.toBeInTheDocument();
  expect(screen.getByLabelText("Building")).toBeInTheDocument();
});

test("shows the double iron mine counter without a toggle", () => {
  renderApp();
  expect(screen.getByLabelText("Double iron mines")).toBeVisible();
});

test("a gold mine cap splits soldiers into T3 and level 1", () => {
  renderApp();
  fireEvent.click(screen.getByLabelText("The map limits gold mines"));
  fireEvent.change(screen.getByLabelText("Max gold mines"), { target: { value: "0" } });

  const valueOf = (label: string) =>
    screen.getByText(label).parentElement?.lastElementChild?.textContent;
  expect(valueOf("Level 3 soldiers")).toBe("0");
  expect(valueOf("Level 1 soldiers")).toBe(valueOf("Soldiers per minute"));
  expect(screen.getByText("Gold Mines").nextElementSibling?.textContent).toBe("0");
});

test("an amount field can be cleared and accepts a decimal comma", () => {
  renderApp();
  const amount = screen.getByLabelText("Amount") as HTMLInputElement;

  fireEvent.change(amount, { target: { value: "" } });
  expect(amount.value).toBe("");

  fireEvent.change(amount, { target: { value: "2,5" } });
  expect(amount.value).toBe("2,5");

  fireEvent.change(amount, { target: { value: "2,5x" } });
  expect(amount.value).toBe("2,5");
});

test("colour mode defaults to system and can be switched", () => {
  renderApp();
  const system = screen.getByRole("button", { name: "System" });
  expect(system).toHaveAttribute("aria-pressed", "true");

  fireEvent.click(screen.getByRole("button", { name: "Dark" }));
  expect(screen.getByRole("button", { name: "Dark" })).toHaveAttribute("aria-pressed", "true");
  expect(system).toHaveAttribute("aria-pressed", "false");
});

test("colours food, mine and metal-works rows differently", () => {
  renderApp();
  const colorOf = (label: string) => getComputedStyle(screen.getByText(label)).color;
  expect(colorOf("Waterworks")).toBe(colorOf("Fisher Huts"));
  expect(colorOf("Coal Mines")).toBe(colorOf("Gold Mines"));
  expect(colorOf("Iron Smelting Works")).toBe(colorOf("Gold Smelting Works"));
  expect(colorOf("Weaponsmith's Works")).toBe(colorOf("Iron Smelting Works"));
  expect(colorOf("Toolsmith's Works")).toBe(colorOf("Iron Smelting Works"));
  expect(new Set([colorOf("Waterworks"), colorOf("Coal Mines"), colorOf("Iron Smelting Works")]).size).toBe(3);
});
