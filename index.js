const http= require("http")
const myServer = http.createServer((req,res)=>{
    console.log("New Req Rec.");
    res.end("Hello from Server");
});
server.listen(80, "127.0.1",()=>{
  console.log("listening to the port no 80");
});
