import React, { useRef, useEffect, useState } from 'react';

function Rocket(props) {

    var launchId = null;

    var telemetryID = null;

    const [terminalText, setTerminalText] = useState("Welcome Rocket-Satelite Software");

    const divRef = useRef(null);

    useEffect(() => {
        divRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });

    useEffect(() => {
        // Anything in here is fired on component mount.
        console.log("mount");
        return () => {
            // Anything in here 
            console.log("unmount");
            chatSocket.close();
        }
    }, [])

    function getrocketId(){
        for(let i = 0; i < props.rocketSateliteData.length; i++){
            if (props.rocketSateliteData[i].id === props.rocketSateliteId){
                return i;
            }
        }
    }
    
    const index = getrocketId();
    const data = props.rocketSateliteData[index];

    const [chatSocket, setChatSocket] = useState(
        new WebSocket ('ws://127.0.0.1:8000/ws/chat/' + data.id + '/')
    );

    chatSocket.onopen = function(e){
        console.log("connected")
    }

    chatSocket.onmessage = function(e) {

        const msg = JSON.parse(e.data);
        var command = msg.command;

        if (command === 'rocket_init'){

            props.rocketSateliteData[index].status = "launched";
            var temp = props.rocketSateliteData;

            props.setState({data : {
                data: temp
            }})

            setTerminalText(terminalText + "\n\n" + "Launch Rocket")

            chatSocket.send(JSON.stringify({
                'type': 'chat_message',
                'command': 'rocket_init_reply',
                'message': "Launching..."
            }))

            var time = parseInt((data.orbit / 3600)) + 10; 

            launchId = window.setInterval(function(){

            time = time - 1;

            chatSocket.send(JSON.stringify({
                'type': 'chat_message',
                'command': 'rocket_init_reply',
                'message': "Rocket will reach orbit in " + time + " seconds"
            }))
            

            if (time === 0){
                window.clearInterval(launchId);
                launchId = null;

                chatSocket.send(JSON.stringify({
                    'type': 'chat_message',
                    'command': 'rocket_init_reply_end',
                    'message': "Rocket has reached the orbit" 
                }))

                props.rocketSateliteData[index].status = "orbitted";
                props.rocketSateliteData[index].payload.status = "prepared";
                var temp = props.rocketSateliteData;

                props.setState({data : {
                    data: temp
                }})

            }
          }, 1000);

        }

        else if (command === 'start_telemetry'){
            setTerminalText(terminalText + "\n\n" + "Start Telemetry")

            this.telemetryID = window.setInterval(function(){

                chatSocket.send(JSON.stringify({
                    'type': 'chat_message',
                    'command': 'start_telemetry_reply',
                    'message': JSON.stringify({
                        "latitude": generateRandomLat(),
                        "longitude": generateRandomLong(),
                    })
                }))
                
              }, 1000);

        } else if(command === 'stop_telemetry'){
            setTerminalText(terminalText + "\n\n" + "Stop Telemetry")

            window.clearInterval(this.telemetryID);
            this.telemetryID = null;

        }
        else if(command === 'deorbit'){
            
            try {
                window.clearInterval(this.telemetryID);
                this.telemetryID = null;
              }
              catch(err) {
              }
            
            setTerminalText(terminalText + "\n\n" + "Deorbit")

            chatSocket.send(JSON.stringify({
                'type': 'chat_message',
                'command': 'deorbit_reply',
                'message': "Rocket has been deorbitted\nGoodbye" 
            }))


            props.rocketSateliteData[index].status = "deorbitted";
            var temp = props.rocketSateliteData;

            props.setState({data : {
                data: temp
            }})

        }  

    };

    chatSocket.onerror = function(e) {
        console.log("error")
    };

    chatSocket.onclose = function(e) {
        console.log("disconnected")
    };

    function generateRandomLong() {
        var num = (Math.random()*180).toFixed(3);
        var posorneg = Math.floor(Math.random());
        if (posorneg == 0) {
            num = num * -1;
        }
        return num;
    }
    // LATITUDE -90 to +90
    function generateRandomLat() {
        var num = (Math.random()*90).toFixed(3);
        var posorneg = Math.floor(Math.random());
        if (posorneg == 0) {
            num = num * -1;
        }
        return num;
    }

    return (
        <>
            <h1 className="secondary-banner">{data.name + " Terminal"}</h1>

            <div className="terminal" > 
                <p className='text' ref={divRef}>{terminalText}</p>
            </div>

        </>
					
    );
}

export default Rocket;