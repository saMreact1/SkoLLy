import React from 'react'
import { useParams } from 'react-router-dom'

const TakeTestPage = () => {
    const {id} = useParams();

  return (
    <div>take test {id}</div>
  )
}

export default TakeTestPage