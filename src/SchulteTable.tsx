// src/SchulteTable.tsx
import React, { useState, useEffect } from "react";
import "./SchulteTable.css";

// Функция для генерации случайного массива чисел от 1 до 25
const generateRandomArray = (): number[] => {
  const array = Array.from({ length: 25 }, (_, i) => i + 1);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Получение лучших результатов из локального хранилища
const getBestScores = (): number[] => {
  const scores = localStorage.getItem("bestScores");
  return scores ? JSON.parse(scores) : [];
};

// Сохранение лучших результатов в локальное хранилище
const saveBestScores = (scores: number[]): void => {
  localStorage.setItem("bestScores", JSON.stringify(scores));
};

// Основной компонент таблицы Шульте
const SchulteTable: React.FC = () => {
  const [numbers, setNumbers] = useState<number[]>(generateRandomArray());
  const [currentNumber, setCurrentNumber] = useState<number>(1);
  const [time, setTime] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [bestScores, setBestScores] = useState<number[]>(getBestScores());
  const [clickedCells, setClickedCells] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerRunning) {
      // Запускаем таймер, который обновляет время каждую секунду
      timer = setInterval(() => setTime((prevTime) => prevTime + 1), 1000);
    }
    // Очищаем таймер при размонтировании компонента или остановке таймера
    return () => clearInterval(timer);
  }, [timerRunning]);

  const handleClick = (number: number): void => {
    if (number === currentNumber) {
      // Если пользователь нажал на правильное число
      setClickedCells({ ...clickedCells, [number]: "correct" });
      setTimeout(() => {
        setClickedCells((prev) => {
          const { [number]: removed, ...rest } = prev;
          return rest;
        });
      }, 500);
      if (number === 1) setTimerRunning(true); // Запускаем таймер при нажатии на 1
      if (number === 25) {
        setTimerRunning(false); // Останавливаем таймер при нажатии на 25
        // Обновляем лучшие результаты
        const newScores = [...bestScores, time + 1].sort((a, b) => a - b).slice(0, 5);
        setBestScores(newScores);
        saveBestScores(newScores);
      }
      setCurrentNumber((prevNumber) => prevNumber + 1); // Увеличиваем текущее число
    } else {
      // Если пользователь нажал на неправильное число
      setClickedCells({ ...clickedCells, [number]: "incorrect" });
      setTimeout(() => {
        setClickedCells((prev) => {
          const { [number]: removed, ...rest } = prev;
          return rest;
        });
      }, 500);
    }
  };

  const handleRestart = (): void => {
    setNumbers(generateRandomArray()); // Генерируем новую таблицу
    setCurrentNumber(1); // Сбрасываем текущее число
    setTime(0); // Сбрасываем время
    setTimerRunning(false); // Останавливаем таймер
    setClickedCells({}); // Сбрасываем клики
  };

  return (
    <div>
      <h1>Таблица Шульте</h1>
      <div className="timer">Время: {time} сек</div>
      <div className="current-number">Искомое число: {currentNumber}</div>
      <button onClick={handleRestart} className="restart-button">
        Рестарт
      </button>
      <div className="table">
        {numbers.map((number) => (
          // Отображаем каждое число в таблице
          <div
            key={number}
            className={`cell ${clickedCells[number]}`}
            onClick={() => handleClick(number)}
          >
            {number}
          </div>
        ))}
      </div>
      <div className="best-scores">
        <h2>Лучшие результаты</h2>
        <ul>
          {bestScores.map((score, index) => (
            <li key={index}>{score} сек</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SchulteTable;
