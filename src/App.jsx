import { useState } from 'react'
import './App.css'
import { Analytics } from "@vercel/analytics/react"
import TransactionCalculator from './TransactionCalculator'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Analytics/>
        <TransactionCalculator />  
    </>
  )
}

export default App
