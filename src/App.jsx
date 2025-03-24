import { useState } from 'react'
import './App.css'
import TransactionCalculator from './TransactionCalculator'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <TransactionCalculator />  
    </>
  )
}

export default App
