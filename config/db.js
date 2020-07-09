if(process.env.NODE_ENV == "production"){
    //module.exports = {mongoURI: "mongodb+srv://joaopuccini:0409@cluster0-jefvh.mongodb.net/blogapp?retryWrites=true&w=majority"}
    module.exports = {mongoURI: "mongodb://admin:admin@172.30.68.212:27017/projects"}
    
}else{
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}