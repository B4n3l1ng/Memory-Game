import { useEffect } from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import SingleCard from "./components/SingleCard";
const cardImages = [
  { src: "/images/axe-1.png", matched: false },
  { src: "/images/bow-1.png", matched: false },
  { src: "/images/helm-1.png", matched: false },
  { src: "/images/potion-1.png", matched: false },
  { src: "/images/ring-1.png", matched: false },
  { src: "/images/scroll-1.png", matched: false },
  { src: "/images/shield-1.png", matched: false },
  { src: "/images/sword-1.png", matched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [matches, setMatches] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [scores, setScores] = useState(
    JSON.parse(localStorage.getItem("scores"))
  );

  //shuffle cards
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: uuidv4() }));
    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setMatches(0);
    setScores(JSON.parse(localStorage.getItem("scores")));
  };

  //Handle a choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  //Reset choices
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  //compare 2 selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        setMatches((prevMatches) => prevMatches + 1);
        resetTurn();
      } else {
        setTimeout(() => {
          resetTurn();
        }, 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  useEffect(() => {
    if (matches === 8) {
      const scores = JSON.parse(localStorage.getItem("scores"));
      if (scores) {
        scores.push(turns);
        scores.sort((a, b) => a - b);
        localStorage.setItem("scores", JSON.stringify(scores));
        setScores(JSON.parse(localStorage.getItem("scores")));
      } else {
        const scores = [];
        scores.push(turns);
        localStorage.setItem("scores", JSON.stringify(scores));
        setScores(JSON.parse(localStorage.getItem("scores")));
      }
    }
  }, [matches]);

  //start game automatically
  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <div className="App">
      <div className="game">
        <h1>Memory Game</h1>
        <button onClick={shuffleCards}>New Game</button>
        <p>Turns: {turns}</p>
        <p>Matched: {matches}</p>
        <div className="card-grid">
          {cards.map((card) => (
            <SingleCard
              key={card.id}
              card={card}
              handleChoice={handleChoice}
              flipped={card === choiceOne || card === choiceTwo || card.matched}
              disabled={disabled}
            />
          ))}
        </div>
      </div>
      <div className="score">
        <h2>Best scores:</h2>
        <div>
          <ol>
            {scores ? (
              scores.map((score) => {
                return <li>{score}</li>;
              })
            ) : (
              <p>Nothing here yet!</p>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default App;
