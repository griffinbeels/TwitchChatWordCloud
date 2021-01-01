import React from "react"
import ReactDOM from "react-dom"
import App from "./components/App/App"
import { startListeningToChat } from './Chat.js'
import { generateNewWordcloud } from './Chat.js'

var client = startListeningToChat();

// Render the current wordcloud!
ReactDOM.render(
  generateNewWordcloud(client),
  document.getElementById("root")
)