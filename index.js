const express = require('express');
const app = express();

const cafes = require("./cafes.json")


app.use(express.json())

// Ruta para obtener todos los cafés
app.get("/cafes", (req, res) => {
    res.status(200).send(cafes)
})

// Ruta para obtener un café por su ID
app.get("/cafes/:id", (req, res) => {
    const { id } = req.params
    const cafe = cafes.find(c => c.id == id)
    if (cafe) res.status(200).send(cafe)
    else res.status(404).send({ message: "No se encontró ningún cafe con ese id" })
})

// Ruta para agregar un nuevo café
app.post("/cafes", (req, res) => {
    const cafe = req.body
    const { id } = cafe
    const exsiste = cafes.some(c => c.id == id)
    if (exsiste) res.status(400).send({ message: "Ya existe un cafe con ese id" })
    else {
        cafes.push(cafe)
        res.status(201).send(cafes)
    }
})

// Ruta para actualizar un café por su ID
app.put("/cafes/:id", (req, res) => {
    const cafe = req.body;
    const { id } = req.params;
    if (id != cafe.id)
        return res
            .status(400)
            .send({
                message: "EL ID NO CORRESPONDE AL ID DEL CAFE QUE SE DESEA MODIFICAR",
            });

    const cafeIndexFound = cafes.findIndex((p) => p.id == id);
    if (cafeIndexFound >= 0) {
        cafes[cafeIndexFound] = cafe;
        res.send(cafes);
    } else {
        res
            .status(404)
            .send({ message: "No se encontró ningún café con ese id" });
    }
});

// Ruta para eliminar un café por su ID
app.delete("/cafes/:id", (req, res) => {
    const jwt = req.header("Authorization")
    if (jwt) {
        const { id } = req.params
        const cafeIndexFound = cafes.findIndex(c => c.id == id)

        if (cafeIndexFound >= 0) {
            cafes.splice(cafeIndexFound, 1)
            console.log(cafeIndexFound, cafes)
            res.send(cafes)
        } else {
            res.status(404).send({ message: "no existe elemento con ese ID" })
        }

    } else res.status(400).send({ message: "no hay token" })
})

// Ruta para manejar cualquier otra solicitud
app.use("*", (req, res) => {
    res.status(404).send({ message: "La ruta no existe" })
})

module.exports = app

app.listen(3000, console.log("SERVIDOR CORRIENDO EN EL PUERTO 3000"))
