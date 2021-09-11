import React, { useState, useEffect, useRef } from 'react'
import Header from './Header' 
import Button from './Button' 
import Deck from './Deck' 
import Card from './Card'
import axios from 'axios' 
import './App.css'

const URL = 'http://deckofcardsapi.com/api/deck'

function App() {
  // initialize state 
  const [card, setCard] = useState([])
  const [deck, setDeck] = useState(null)
  const [autoShuffle, setAutoShuffle] = useState(false) 
  const timeId = useRef(null)

  // useEffect 
  useEffect(() => {
    // async function 
    async function getDeck() {
      try {
        const res = await axios.get(`${URL}/new/shuffle`) 
        // console.log(res.data) // response is received with deck_id, remaining, etc. 
        setDeck(res.data)         
      } catch(err) {
        alert(err) 
      }
    }
    getDeck() 
  }, [setDeck])

  // useEffect
  useEffect(() => {
    // async function
    async function getCard() {
      try {
        const { deck_id } = deck 
        const res = await axios.get(`${URL}/${deck_id}/draw`) 
        // console.log(res.data.cards[0])
        let card = res.data.cards[0]
        
        setCard(d => [
          ...d, 
          {
            id: card.code, 
            name: `${card.value} of ${card.suit}`,
            image: card.image 
          }
        ])

        // if there are no more cards left in deck
        if(res.data.remaining === 0) {
          // stop drawing cards
          setAutoShuffle(false) 
          // throw error 
          throw new Error('no more cards left!') 
        }

      } catch(err) {
        alert(err) 
      }
    }
    if(autoShuffle && !timeId.current) {
      timeId.current = setInterval(async () => {
          await getCard()
      }, 1000)
    }

    return() => {
        clearInterval(timeId.current) 
        timeId.current = null 
    }
  }, [autoShuffle, setAutoShuffle, deck])
  

  // button click 
  // const onClick = () => {
  //   // console.log("I'll give you a card")
  //   getCard()  
  // }

  const toggleAutoDraw = () => {
    setAutoShuffle(auto => !auto); 
  }

  // loop over the cards  
  const cards = card.map(c => (
    <Card key={c.id} name={c.name} image={c.image} /> 
  ))
  
  return (
    <div className="App">
      <Header title='Deck of Cards' /> 
      <Button onClick={toggleAutoDraw}/> 
      <Deck cards={cards} /> 
    </div>
  );
}

export default App;