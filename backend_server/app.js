const Express=require("express")();
const Http=require("http").Server(Express);
const Socketio=require("socket.io")(Http);

var position={
    x:200, y:200, dragging: false
};

function makeMessage(u, t){
    return {
        user:u,text:t
    };
}

var podatak={
    room:'room',
    username:'username',
    socketid: 'id'
};

var podaci=[];

Socketio.on("connection", socket => {

    console.log('user connected');

    socket.on("push", data => {
        position.x=data.x;
        //console.log("accepted: "+data.x+", "+data.y);
        position.y=data.y;
        position.dragging= data.dragging;
        var p=podaci.find(pod => pod.socketid===socket.id);
        socket.broadcast.to(p.room).emit("position", position);
        //console.log("emitted");
    });

    socket.on("join_room", data => {

        var temp={
            room:data.room,
            username:data.username,
            socketid: socket.id
        };

        podaci.push(temp);

        socket.join(data.room);
        console.log("user "+data.username+" joined room "+data.room);

        //socket.to(temp.room).emit("user_activity", makeMessage(data.username, 'user connected '))

        /**/
        console.log("poruka primljena na server");
        var p=podaci.find(pod => pod.socketid===socket.id);
        socket.to(p.room).emit("user_activity", makeMessage(data.username, 'Zdravo! :)'));
        /**/

        console.log("connected message sent to room "+data.room);
        //socket.broadcast.to(temp.room).emit("user_activity", makeMessage(data.username,'Hello '));
    });

    socket.on("color", data => {
        var p=podaci.find(pod => pod.socketid===socket.id);
        socket.broadcast.to(p.room).emit("color_change", data);
        //console.log("color emitted");
    });

    socket.on("eraser", data => {
        var p=podaci.find(pod => pod.socketid===socket.id);
        socket.broadcast.to(p.room).emit("eraser_change", data);
        //console.log("eraser emitted");
    });

    socket.on("clear", data => {
        var p=podaci.find(pod => pod.socketid===socket.id);
        socket.broadcast.to(p.room).emit("clear_change", data);
        //console.log("clear emitted");
    });

    socket.on("paint", data => {
        var p=podaci.find(pod => pod.socketid===socket.id);
        socket.broadcast.to(p.room).emit("paint_change", data);
        //console.log("paint emitted");
    });

    socket.on("message", data => {
        console.log("poruka primljena na server");
        var p=podaci.find(pod => pod.socketid===socket.id);
        socket.to(p.room).emit("add_message", data);
    });

    socket.on("disconnect", () => {
        var p=podaci.find(pod => pod.socketid===socket.id);
        console.log("disconnected message sent to room "+p.room);
        console.log("room "+p.room+" -> user disconnected");
        socket.broadcast.to(p.room).emit("user_activity", makeMessage(p.username,'user disconnected'));
        removeUser(p.username);
    });

    socket.on("updateCurrentPlayer", data => {
        console.log("updateCurrentPlayer emitted");
        var p=podaci.find(pod => pod.socketid===socket.id);
        socket.to(p.room).emit("update", data);
    });
});

function removeUser(u){
    var temp=[];
    podaci.forEach(podatak => {
        if(podatak.username===u){

        }
        else{
            temp.push(podatak);
        }
    });
    podaci=[];
    podaci=temp;
}

Http.listen(3000, '0.0.0.0', ()=>{
    console.log("Listening at port 3000 ...");
})