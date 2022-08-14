import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";

test("renders elements", () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(getByText("Settlers 4 Build Configurator")).toBeInTheDocument();

  expect(getByText("Gold Smelting Works")).toBeInTheDocument();

  expect(getByText("Soldiers per minute")).toBeInTheDocument();
});
