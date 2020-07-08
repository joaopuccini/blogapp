if(process.env.NODE_ENV == "production"){
    //module.exports = {mongoURI: "mongodb+srv://joaopuccini:0409@cluster0-jefvh.mongodb.net/blogapp?retryWrites=true&w=majority"}
    module.exports = {mongoURI: "image-registry.openshift-image-registry.svc:5000/openshift/mongodb@sha256:c260fda42b5113d0183f85d7c9e873101268d91f1e74dcb38cfe76269b4ed47a"}
    
}else{
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}