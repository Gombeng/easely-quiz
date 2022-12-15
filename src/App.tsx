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

  const apiUrl = `https://opentdb.com/api.php?amount=5&category=${selectCategory}&difficulty=easy&type=multiple`;
  const apiUrlCategory = `https://opentdb.com/api_category.php`;
  const renderHTML = (rawHTML: any) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

  useEffect(() => {
    setLoading(true)

    const fetchQuestions = async () => {
      const { data } = await axios.get(`${apiUrl}`)
      setQuestions(data.results)
      console.log('questions => ', data.results)
      setLoading(false)
    }

    fetchQuestions()

    const fetchCategorys = async () => {
      const { data } = await axios.get(`${apiUrlCategory}`)
      setCategorys(data.trivia_categories)
      console.log('categorys => ', data)
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


  /* Resets the game back to default */
  const restartGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setResults(false);
    // setLoading(true)
  };

  return (
    <>
      <div className='flex'>
        <select onChange={(e) => setSelectCategory(e.target.value)}>
          {
            categorys.map(({ id, name }) => (
              <option key={id} value={id}>{name}</option>
            )
            )}
        </select>
        <div className="questions-left">
          <h3>
            Questions: {currentQuestion + 1} - {questions.length}
          </h3>
        </div>
      </div>
      {
        loading ? <h3>Loading...</h3> :
          results ?
            <div className="final-results">
              <h3>Final Results</h3>
              <p>Iron Man 5/5</p>
              <p>Spiderman 5/5</p>
              <p>I'm Batman 5/5</p>
              <p>You {score}/{questions.length}</p>
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
                    <li onClick={() => handleCorrect()} className='option'>{renderHTML(questions[currentQuestion]?.correct_answer)}</li>
                    <li onClick={() => handleInCorrect()} className='option'>{renderHTML(questions[currentQuestion]?.incorrect_answers[0])}</li>
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
