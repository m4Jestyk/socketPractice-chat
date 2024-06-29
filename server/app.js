import express from "express";
import {Server} from "socket.io";
import {createServer} from "http";
import cors from "cors";


const PORT = 3000;
const app = express();

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    })
  );


io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("message", ({sendTo, message, user}) => {
        console.log({sendTo, message, user});
        io.to(sendTo).emit("recieve-message", {message, user});
    })
})


server.listen(3000, () => {
    console.log(`Server is running on PORT = ${PORT}`);
})