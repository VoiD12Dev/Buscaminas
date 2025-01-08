import React, { useState, useEffect } from "react";
import ApiClient from "/src/Services/ApiClient.js";
import Board from "/src/Domain/Board.js";
import Mine from "/src/Domain/Mine.js";
import Tarjeta1 from "./Tarjeta1.jsx";
import Tarjeta2 from "./Tarjeta2.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "/src/css/componente.css";
import BotonNivel from "./Boton.jsx";
import explicacion1 from "../assets/explicacion4.gif";
import explicacion2 from "../assets/explicacion5.gif";
import explicacion3 from "../assets/explicacion6.gif";
import explicacion4 from "../assets/explicacion7.gif";
import minaExplota from "../assets/minaExplota.mp3";
import casilla1 from "../assets/Casilla1.png";
import casilla2 from "../assets/Casilla2.png";
import casilla3 from "../assets/Casilla3.png";
import Score from "./Score.jsx";

class Cell {
  constructor(row, column, flag = true) {
    this.row = row;
    this.col = column;
    this.flag = flag;
  }
}

const GameBoard = () => {
  const [board, setBoard] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [level, setLevel] = useState(0);
  const [markedCells, setMarkedCells] = useState([]);
  const [sonido, setSonido] = useState(0);
  const [counterMines, setCounterMines] = useState(0);

  const [ranking, setRanking] = useState([]);

  // ////////////////////////////////////////////////
  // LOAD GAME Y RESET GAME
  // ////////////////////////////////////////////////
  useEffect(() => {
    resetGame();
  }, [level]);

  const resetGame = () => {
    const apiClient = new ApiClient(
      "https://minesweeper-scores-diw.netlify.app/"
    );

    apiClient.getLevel(level).then((data) => {
      // console.log(data);
      const mines = data.mines.map((mine) => new Mine(mine.row, mine.column));
      // console.log(mines);
      const board = new Board(data.rows, data.columns, mines, level);
      setBoard(board);
      setGameOver(false);
      setGameWon(false);
      setMarkedCells([]);
      setCounterMines(mines.length);
    });
    ////////////////
    //EXAMEN
    ////////////////
    apiClient.getScores().then((data2) => {
      // setRanking({ player: data2.player, score: data2.score });
      const lala = data2;
      setRanking(lala);
      // console.log(lala);
    });
  };

  useEffect(() => {
    console.log(ranking);
  }, [ranking]);

  // ////////////////////////////////////////////////
  // FUNCIONALIDAD JUEGO
  // ////////////////////////////////////////////////
  useEffect(() => {
    if (board) {
      let newDefusedCells = [];

      for (let row of board.columns) {
        for (let cell of row) {
          if (cell.defused) {
            newDefusedCells.push(cell);
          }
        }
      }

      const totalCells = board.columns.length * board.columns[0].length;
      // celdas marcadas con bandera
      const totalMarkedCells = markedCells.filter(
        (markedCell) => markedCell.flag
      ).length;

      // juego finalizado y ganado (numero de minas marcadas mas celdas desactivadas igual al total de celdas en el tablero)
      if (totalCells === newDefusedCells.length + totalMarkedCells) {
        setGameWon(true);
      }
    }
  }, [board, markedCells]);

  const handleClick = (row, column) => {
    // verificamos si el juego ha terminado
    if (gameOver || gameWon || !board) return;

    try {
      const cell = markedCells.find(
        (markedCell) => markedCell.row === row && markedCell.col === column
      );

      // verificamos si la celda no está marcada con bandera siempre y cuando exista
      if (cell?.flag) return;

      // desactivación de celda
      board.defuse(row, column);
      setBoard({ ...board });
    } catch (error) {
      // en caso de encontrar una mina
      board.exploded(row, column);
      setGameOver(true);
    }
  };

  const handleRightClick = (event, row, column) => {
    event.preventDefault();
    // verificamos si el juego ha terminado
    if (gameOver || gameWon || !board) return;

    // verificamos si la celda está cargada dentro del array markedCells
    let cell = markedCells.find(
      (markedCell) => markedCell.row === row && markedCell.col === column
    );

    // verificamos si no se ha llegado al límite de minas del tablero para marcar
    if (typeof cell === "undefined" && counterMines - 1 < 0) return;

    // modificando celda ya existen
    if (typeof cell !== "undefined" && cell.flag === false) {
      cell.flag = !cell.flag;

      setCounterMines(counterMines - 1);
    } else if (typeof cell !== "undefined" && cell.flag === true) {
      cell.flag = !cell.flag;

      setCounterMines(counterMines + 1);
    }

    // se genera el registro de la celda en caso de no existir
    if (typeof cell === "undefined") {
      cell = new Cell(row, column);
      markedCells.push(cell);

      setCounterMines(counterMines - 1);
    }

    setMarkedCells((prev) => [...prev]);
  };

  // ////////////////////////////////////////////////
  // SONIDO
  // ////////////////////////////////////////////////
  const handleSound = () => {
    if (sonido === 0) {
      setSonido(1);
    }
    if (sonido === 1) {
      setSonido(0);
    }
  };

  return (
    <div>
      <div className="game-board container">
        <div className="btn-group mt-5 botonDificultad" role="group">
          <BotonNivel
            level={0}
            className="btn-success"
            texto="Facil"
            setLevel={setLevel}
          />
          <BotonNivel
            level={1}
            className="btn-warning"
            texto="Normal"
            setLevel={setLevel}
          />
          <BotonNivel
            level={2}
            className="btn-danger"
            texto="Dificil"
            setLevel={setLevel}
          />
        </div>

        <div className="d-flex justify-content-center align-items-center botonsonido">
          <button
            type="button"
            className="btn btn-dark mt-3"
            onClick={handleSound}
          >
            {sonido === 0 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-volume-mute-fill"
                viewBox="0 0 16 16"
              >
                <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06m7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-volume-up-fill"
                viewBox="0 0 16 16"
              >
                <path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z" />
                <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z" />
                <path d="M8.707 11.182A4.5 4.5 0 0 0 10.025 8a4.5 4.5 0 0 0-1.318-3.182L8 5.525A3.5 3.5 0 0 1 9.025 8 3.5 3.5 0 0 1 8 10.475zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06" />
              </svg>
            )}{" "}
            <p>Sonido</p>
          </button>
        </div>

        {gameWon && (
          <div className="alert alert-success mt-3">¡Has ganado!</div>
        )}
        {board && (
          <div className="mine-counter m-2 text-center">
            Minas en el tablero: {counterMines}
          </div>
        )}
        <div className={`board-container board-level-${level}`}>
          {board &&
            board.columns.map((column, columnIndex) => {
              return (
                <div key={columnIndex} className="row">
                  {column.map((cell, rowIndex) => {
                    let cellObj = markedCells.find(
                      (markedCell) =>
                        markedCell.row === rowIndex &&
                        markedCell.col === columnIndex
                    );

                    const defusedCell = cell.defused ? " defused" : "";
                    const showMineCell =
                      gameOver && cell.hasMine ? " show-mine" : "";
                    const statusMarkedCell =
                      cellObj?.flag && !defusedCell ? " marked" : "";
                    return (
                      <div
                        key={rowIndex}
                        className={`cell col${defusedCell}${statusMarkedCell}${showMineCell}`}
                        onClick={() => handleClick(rowIndex, columnIndex)}
                        onContextMenu={(event) =>
                          handleRightClick(event, rowIndex, columnIndex)
                        }
                      >
                        {cell.defused && cell.getSurroundingMinesCount()}
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>

        {(gameOver || gameWon) && (
          <button className="btn btn-info mt-3" onClick={resetGame}>
            Reiniciar
          </button>
        )}
        {gameOver && (
          <div className="alert alert-danger m-2">
            ¡Has perdido!
            <audio src={minaExplota} autoPlay={sonido === 1 ? true : false} />
          </div>
        )}

        <div>
          <Score ranking={ranking} />
        </div>
      </div>
      <div className="espacio d-flex justify-content-center align-items-center mt-5 mb-5">
        <div className="back1"></div>
        <div className="back1 back2"></div>
        <div className="back1 back3"></div>

        <div
          className="d-flex justify-content-center align-items-center expJuego"
          id="comoJugar"
        >
          <div className="spinner-grow text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="spinner-grow text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="spinner-grow text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h3>¿Como Jugar?</h3>
          <div className="spinner-grow text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="spinner-grow text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="spinner-grow text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center mb-5">
        <ul className="list-group">
          <li className="list-group-item text-center leyenda">LEYENDA</li>
          <li className="list-group-item tarjeta1">
            <img className="me-4" src={casilla2} alt="casilla" />
            Casilla por descubrir
          </li>
          <li className="list-group-item tarjeta2">
            <img className="me-4" src={casilla1} alt="casilla" />
            Casilla adyacente a mina
          </li>
          <li className="list-group-item tarjeta1">
            <img className="me-4" src={casilla3} alt="casilla" />
            Casilla marcada como mina
          </li>
        </ul>
      </div>

      <div className="d-flex justify-content-center align-items-center">
        <Tarjeta1
          texto="El primer paso para empezar a jugar al Buscaminas es pulsar un cuadrado cualquiera del tablero. Una vez hecho esto, algunas fichas aparecerán vacías y otras con números. Cada número indica la cantidad de minas que hay en los cuadrados adyacentes (teniendo en cuenta que cada ficha tiene cuatro lados y cuatro esquinas, cada una de ellas tiene ocho cuadrados adyacentes)."
          imagen={explicacion1}
          alternativo="imagenExplicacion1"
        />
      </div>

      <div className="d-flex justify-content-center align-items-center">
        <Tarjeta2
          texto="Así, si el número es un uno, significa que una pieza adyacente esconde una bomba. Si es un dos, informa de que dos piezas adyacentes son peligrosas. Y así sucesivamente. De este modo, es posible ir despejando aquellas casillas en las que sabemos que no hay minas."
          imagen={explicacion2}
          alternativo="imagenExplicacion2"
        />
      </div>

      <div className="d-flex justify-content-center align-items-center">
        <Tarjeta1
          texto="Si sospechamos que una casilla tiene una mina, podemos señalarla con una bandera (recurso clave para jugar al Buscaminas). Para hacer esto, basta con hacer clic con el botón derecho del ratón. La ficha se bloqueará para evitar que la marques por error. Con dispositivos tctiles, manten pulsado la casilla para marcarla y descmarcarla como mina."
          imagen={explicacion3}
          alternativo="imagenExplicacion3"
        />
      </div>

      <div className="d-flex justify-content-center align-items-center">
        <Tarjeta2
          texto="Si marcas por error una ficha que esconde una mina, esta explota y el juego termina. En este caso, tienes la opción de comenzar un juego nuevo o volver a empezar el mismo. Si por el contrario logras ubicar todas las bombas y despejar todas las casillas inofensivas, serás el ganador de la partida."
          imagen={explicacion4}
          alternativo="mina Explotando"
        />
      </div>
    </div>
  );
};

export default GameBoard;
