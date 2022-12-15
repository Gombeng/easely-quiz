import React, { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.scss'
import axios from 'axios';

function App() {
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)

  const [categorys, setCategorys] = useState<any[]>([])
  const [selectCategory, setSelectCategory] = useState<any>('')
  const [score, setScore] = useState<number>(0)

  const [results, setResults] = useState(false)
  const [counter, setCounter] = useState<any>(120);

  const apiUrl = `https://opentdb.com/api.php?amount=10&category=${selectCategory}&difficulty=easy&type=multiple`;
  const apiUrlCategory = `https://opentdb.com/api_category.php`;
  const renderHTML = (rawHTML: any) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

  const minutes = Math.floor(counter / 60)
  const seconds = counter % 60;
  function padTo2Digits(num: any) {
    return num.toString().padStart(2, '0');
  }

  const timer = `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
  
  useEffect(() => {
    const timer: any = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  useEffect(() => {
    setLoading(true)

    const fetchQuestions = async () => {
      const { data } = await axios.get(`${apiUrl}`)
      setQuestions(data.results)
      setLoading(false)
    }
    fetchQuestions()

    const fetchCategorys = async () => {
      const { data } = await axios.get(`${apiUrlCategory}`)
      setCategorys(data.trivia_categories)
      setLoading(false)
    }
    fetchCategorys()
  }, [selectCategory])



  const handleCorrect = () => {

    setScore(score + 1);
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setResults(true);
    }
  }

  const handleInCorrect = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setResults(true);
    }
  }

  const restartGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setResults(false);
    setCounter(120)
  };

  return (
    <>
      <div className='d-grid'>
        <select className='select-category' onChange={(e) => {
          setSelectCategory(e.target.value)
          setCounter(120)
        }}>
          {
            categorys.map(({ id, name }) => (
              <option key={id} value={id}>{name}</option>
            )
            )}
        </select>
        <h3 className="questions-left">
          Q: {currentQuestion + 1} - {questions.length}
        </h3>
        <h3 className="time-left">
          T: {timer}
        </h3>

      </div>
      {
        loading ? <h3>Loading...</h3> :
          results || !counter ?
            <div className="final-results">
              <h3>Final Results</h3>
              <p>Iron Man 10/10 (100%)</p>
              <p>Spiderman 10/10 (100%)</p>
              <p>I'm Batman 10/10 (100%)</p>
              <p>You {score}/{questions.length} ({(score / questions.length) * 100}%)</p>
              <button onClick={() => restartGame()}>Restart game</button>
            </div>
            :
            <>
              <div className="quiz-container">
                <div className='quiz'>
                  <h3 className="question">
                    {renderHTML(questions[currentQuestion]?.question)}
                  </h3>

                  <ul className="options-container">
                    <li onClick={() => handleInCorrect()} className='option'>{renderHTML(questions[currentQuestion]?.incorrect_answers[0])}</li>
                    <li onClick={() => handleCorrect()} className='option'>{renderHTML(questions[currentQuestion]?.correct_answer)}</li>
                    <li onClick={() => handleInCorrect()} className='option'>{renderHTML(questions[currentQuestion]?.incorrect_answers[1])}</li>
                    <li onClick={() => handleInCorrect()} className='option'>{renderHTML(questions[currentQuestion]?.incorrect_answers[2])}</li>
                  </ul>
                </div>
              </div>
            </>
      }

    </>
  )
}

export default App
