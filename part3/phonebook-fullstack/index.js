const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("body", (req) =>
  JSON.stringify(req.body) === "{}" ? "" : JSON.stringify(req.body)
);

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// GET all
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// GET /:id
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.statusMessage = "Person not found";
    response.status(404).end();
  }
});

// DELETE /:id
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  if (!persons.map((person) => person.id).includes(id)) {
    return response.status(404).end();
  }

  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

// POST
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name)
    return response.status(400).json({ error: "name is missing" });

  if (!body.number)
    return response.status(400).json({ error: "number is missing" });

  if (
    persons
      .map((person) => person.name.toLowerCase())
      .includes(body.name.toLowerCase())
  )
    return response.status(400).json({ error: "name must be unique" });

  const person = {
    id: Math.floor(Math.random() * 100000),
    name: body.name,
    number: body.number,
  };

  persons.push(person);

  response.json(person);
});

// GET /info
app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${
      persons.length
    } people</p> <p>${new Date().toLocaleString()}</p>`
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
