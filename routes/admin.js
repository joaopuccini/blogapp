// admin por padrao antes de qualquer rota abaixo: 
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categorias')
const Categoria = mongoose.model("categorias")
require('../models/Postagem')
const Postagem = mongoose.model("postagens")

// FAZER UMA FUNCAO OU NOVA ROTA GENERICA COM ENUMERADOR PARA MENSAGENS PADRONIZADAS DO CRUD

 router.get('/', (req, res) => {
     res.render('admin/index')
 })

 router.get('/posts', (req, res) => {
    res.send("Página de posts do ADM")
})

router.get('/categorias', (req, res) => {
    Categoria.find().lean().sort({date: 'ASC'}).then((categorias) => {
        res.render('admin/categorias', {categorias: categorias})
    }).catch((err) => {
        req.flash('error_msg', "Houve um erro ao listar as categorias!")
        res.redirect('/admin')
    })
})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', (req, res) => {
    var erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido."})
    }
    
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido."})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome para categoria muito curto para cadastro."})
    }

    if(erros.length > 0){
        res.render('/admin/addcategorias', {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', "Categoria cadastrada com successo.")
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash('error_msg', "Houve um erro ao cadastrar categoria.")
            res.redirect('/admin')
        })
    }
})

router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
        res.render('admin/editcategorias', {categoria: categoria})
    })
    
})

router.post('/categorias/edit', (req, res) =>{
    var erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido."})
    }
    
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido."})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome para categoria muito curto para edição."})
    }

    if(erros.length > 0){
        res.render('admin/addcategorias', {erros: erros})
    }else{
        Categoria.findOne({_id:req.body.id}).then((categoria)=>{
        
            categoria.nome = req.body.nome
            categoria.slug = req.body.slug
          
            categoria.save().then(() => {
                req.flash('success_msg', "Categoria editada com successo.")
                res.redirect('/admin/categorias')    
            }).catch((err) => {
                req.flash('error_msg', "Houve um erro ao editar categoria.")
                res.redirect('/admin/categorias')
            })
        })
    }
})

router.post('/categorias/deletar', (req, res) => {
    Categoria.findOneAndRemove({_id: req.body.id}).then(() => {
        req.flash('success_msg', "Categoria deletada com successo.")
        res.redirect('/admin/categorias')    
    }).catch((err) => {
        req.flash('error_msg', "Houve um erro ao editar categoria.")
        res.redirect('/admin/categorias')  
    })
})

router.get("/postagens", (req, res) => {
    Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens) => {
        res.render('admin/postagens', {postagens: postagens})
    }).catch((err) => {
        req.flash('error_msg', "Houve um erro ao listar as postagens!")
        res.redirect('/admin')
    })
})

router.get("/postagens/add", (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagens", {categorias: categorias})
    }).catch((err) => {
        req.flash('error_msg', "Houve um erro ao listar as postagens!")
        res.redirect('/admin')
    })
})

router.post('/postagens/nova', (req, res) => {
    var erros = [];

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria, inválida registre uma categoria!"})
    }

    if(erros.length > 0){
        res.render('admin/addpostagens', {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }
    
        new Postagem(novaPostagem).save().then(() => {
            req.flash('success_msg', "Postagem cadastrada com successo.")
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash('error_msg', "Houve um erro ao cadastrar postagem.")
            res.redirect('/admin')
        })
    }
})

router.get('/postagens/edit/:id', (req, res) => {
    Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {
        Categoria.find().lean().then((categorias) =>{
            res.render('admin/editpostagens', {categorias: categorias, postagem: postagem})
        }).catch((err) => {
            req.flash('error_msg', "Houve um erro ao listar categorias.")
            res.redirect('/admin/postagens')
        })
    }).catch((err) => {
        req.flash('error_msg', "Houve um erro ao carregar postagem.")
        res.redirect('/admin/postagens')
    })    
})

router.post('/postagens/edit', (req, res) =>{
    Postagem.findOne({_id: req.body.id}).lean().then((postagem) =>{
        console.log(postagem)

        postagem.titulo    = req.body.titulo
        postagem.slug      = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo  = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(() =>{
            req.flash('success_msg', "Postagem editada com successo.")
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash('error_msg', "Houve um erro ao editar postagem.")
            res.redirect('/admin')
        })   
    })
})

module.exports = router