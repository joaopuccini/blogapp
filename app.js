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
    require('./models/Postagem')
    const Postagem = mongoose.model("postagens")    
    require('./models/Categorias')
    const Categoria = mongoose.model("categorias")    
    require('./models/Usuario')
    const usuarios = mongoose.model("usuarios")    
    
    

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
        app.get('/', (req, res)=>{
            Postagem.find().lean().populate('categoria').sort({data: "desc"}).then((postagens) =>{
                res.render('index', {postagens: postagens})    
            }).catch((err) => {
                req.flash('error_msg', 'Erro interno!')
                res.redirect('/404')
            })        
            
        })

        app.get('/404', (req, res) => {
            res.render('Erro 404!')
        })

        app.get('/postagem/:slug', (req, res) => {
            Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
                if(postagem){
                    res.render('postagem/index', {postagem: postagem})
                }else{
                    req.flash('error_msg', "Erro ao abir postagem")
                    res.redirect('/')
                }
            }).catch((err) => {
                req.flash('error_msg', "Erro")
                res.redirect('/')
            })
        })

        app.get('/categorias', (req, res) => {
            Categoria.find().lean().then((categorias) =>{
                if(categorias){
                    res.render('categoria/index', {categorias: categorias})
                }else{

                }

            })
        })

        app.get('/categorias/:slug', (req, res) => {
            Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
                if(categoria){

                    Postagem.find({categoria: categoria._id}).lean().then((postagens) => {
                        res.render('categoria/postagens', {postagens: postagens, categoria: categoria})
                    }).catch((err) => {
                        req.flash('error_msg', 'Erro ao listar categoria e postagens!')
                        res.redirect('/')
                    })                    
                }else{
                    req.flash('error_msg', 'Categoria nao encontrada!')
                    res.redirect('/')
                }
            }).catch((err) => {
                req.flash('error_msg', 'Erro listar categoria com slug!')
                res.redirect('/')
            })
        })
        
        app.use('/admin/', admin) // pagina principal /admin... e rotas do admin
        app.use('/usuario/', usuarios)

//OUTROS

const PORT = 3030
app.listen(PORT, () => {
    console.log('Servidor rodando com sucesso na porta: '+ PORT)
})