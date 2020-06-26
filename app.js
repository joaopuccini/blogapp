// CARREGANDO MODULOS
    const express = require('express');
    const handlebars = require('express-handlebars')    
    const bodyParser = require('body-parser');
    const app = express()
    const admin = require('./routes/admin')
    const path = require('path')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')

// CONFIGURAÇÕES
    // SESSION
        app.use(session({
            secret: "joao",
            resave: true,
            saveUninitialized: true        
        }))
        app.use(flash())

    // MIDDLEWARE - as variaveis globais
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg   = req.flash("error_msg")            
            next()
        })

    // BODY PARSER
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    
    // HANDLEBARS
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars');
    // MONGOOSE online ATLAS
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb+srv://joaopuccini:0409@cluster0-jefvh.mongodb.net/blogapp?retryWrites=true&w=majority', {
            useNewUrlParser: true
            }).then(() => {
                console.log("Conectado ao Mongo com sucesso!")
            }).catch((err) => {
                console.log("Erro ao tentar se conectar ao mongo: " + err)
            })
        
    // PUBLIC
        app.use(express.static(path.join(__dirname, 'public')))

    
// ROTAS
    app.use('/admin/', admin) // pagina principal /admin... e rotas do admin

//OUTROS

const PORT = 3030
app.listen(PORT, () => {
    console.log('Servidor rodando com sucesso na porta: '+ PORT)
})