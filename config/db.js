if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://joaopuccini:0409@cluster0-jefvh.mongodb.net/blogapp?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}