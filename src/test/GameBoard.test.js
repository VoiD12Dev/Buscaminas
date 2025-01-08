import React from "react";
import { render, fireEvent } from "@testing-library/react";
import GameBoard from "../../src/componentes/GameBoard";

describe("GameBoard Component", () => {
  // verificar si el componente `GameBoard`, se renderiza correctamente y no ocurran errores
  test("renders without crashing", () => {
    render(<GameBoard />);
  });

  // // Verificar si el botón sonido está presente en el componente `GameBoard`
  test("renders sound button", () => {
    const { queryByText } = render(<GameBoard />);
    const soundButton = queryByText("Sonido");
    expect(soundButton).toBeTruthy();
  });

  // verificar si el juego comienza en el nivel "Facil"
  test("starts the game on easy difficulty level", () => {
    const { queryAllByText } = render(<GameBoard />);
    const easyButtons = queryAllByText("Facil");
    // Suponiendo que solo hay un botón "Facil", seleccionamos el primero
    const easyButton = easyButtons[0];
    fireEvent.click(easyButton);
  });

  
  test('renders MyComponent component', () => {
    render(<Scores />);
    expect(screen.getByText("Player:")).toBeInTheDocument();
    expect(screen.getByText("Score:")).toBeInTheDocument();
  });

  });

// comando para test "npm run test -- --clearCache"
// comando para test "npm run test --no-cache"
