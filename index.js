const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors');

let persons = [
    {
      id: 1,
      name: "Bunio Papunio",
      number: "515-233"
    },
    {
      id: 2,
      name: "Ciamciak Zielony",
      number: "509-243"
    },
    {
      id: 3,
      name: "Jazda Essa",
      number: "433-111"
    }
  ]

  morgan.token('body', (req) =>{
    return JSON.stringify(req.body);
  })

app.use(cors());
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info',(request,response) =>{
  response.send(`<h2>Phonebook has info for ${persons.length} people</h2>
  <h3>${new Date()}</h3>`)
})

app.get('/api/persons/:id',(request, response) =>{
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);
  if(person == undefined){
    return response.status(400).json({error: 'content missing'});
  }
  response.json(person);
})

app.delete('/api/persons/:id',(request,response) =>{
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id != id);
  response.status(204).end();
})

app.post('/api/persons/',(request,response) =>{
  const person = request.body;
  console.log(person);
  if(!person.hasOwnProperty("number") || !person.hasOwnProperty("name")){
    return response.status(422).json({error:'missing property'});
  }
  if(persons.find(p => p.name === person.name)){
    return response.status(422).json({error:'person with that name already exists'});
  }
  const newId = persons.length !== 0 ?
                Math.max(persons.map(p => p.id)) + 1 :
                1
  persons = persons.concat({...person, id: newId});
  response.json(person);
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})