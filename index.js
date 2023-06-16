const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');

// Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados!");
    })
    .catch(() => {
        console.log("Erro com a conexão ao banco de dados");
    })

// Ejs como view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Pegar dados de formulário
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Rotas
app.get("/",(req,res) => {
    Pergunta.findAll({ raw: true, order: [
        ['id', 'DESC']
    ] }).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        });
    });
    // SELECT * ALL FROM PERGUNTAS
});

app.get("/perguntar",(req,res) => {
    res.render("perguntar");
})

app.post("/save",(req,res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    }); // INSERT INTO
})


app.get("/pergunta/:id",(req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id},
    }).then(pergunta => {
        if(pergunta != undefined){ // Pergunta achada

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [['id', 'DESC']]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            })
        }else { // Não encontrada
            res.redirect("/");
        }
    });
})

app.post("/responder",(req,res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId);
    })
})

// Starter
app.listen(8080,()=>{console.log("Servidor iniciado com sucesso!");});