import React, { useRef, useEffect, useState } from 'react';

function Satelite(props) {

    var launchId = null;

    var telemetryID = null;

    var sateliteDataID = null;

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

    function getsetaliteId(){
        for(let i = 0; i < props.rocketSateliteData.length; i++){
            if (props.rocketSateliteData[i].payload.id === props.rocketSateliteId){
                return i;
            }
        }
    }
    
    const index = getsetaliteId();
    const data = props.rocketSateliteData[index].payload;

    const [chatSocket, setChatSocket] = useState(
        new WebSocket ('ws://127.0.0.1:8000/ws/chat/' + data.id + '/')
    );

    chatSocket.onopen = function(e){
        console.log("connected")
    }

    chatSocket.onmessage = function(e) {

        const msg = JSON.parse(e.data);
        var command = msg.command;

        if (command === 'establish_init'){

            setTerminalText(terminalText + "\n\n" + "Established satelite")

            chatSocket.send(JSON.stringify({
                'type': 'chat_message',
                'command': 'establish_init_reply',
                'message': "Satelite established"
            }))

            props.rocketSateliteData[index].status = "established";
            var temp = props.rocketSateliteData;

            props.setState({data : {
                data: temp
            }})


        } else if (command === 'start_telemetry'){
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

        } else if (command === "start_scientific_data"){
            
            setTerminalText(terminalText + "\n\n" + "Start Data")

            this.sateliteDataID = window.setInterval(function(){

                chatSocket.send(JSON.stringify({
                    'type': 'chat_message',
                    'command': 'start_scientific_data_reply',
                    'message': JSON.stringify({
                        "rain": randomIntFromInterval(0,99),
                        "humidity": randomIntFromInterval(0,99),
                        "snow": randomIntFromInterval(0,99),
                    })
                }))
                
              }, 6000);

        }
        else if (command === "start_communication_data"){
            
            setTerminalText(terminalText + "\n\n" + "Start Data")

            this.sateliteDataID = window.setInterval(function(){

                chatSocket.send(JSON.stringify({
                    'type': 'chat_message',
                    'command': 'start_communication_data_reply',
                    'message': JSON.stringify({
                        "uplink": randomIntFromInterval(0,99),
                        "downlink": randomIntFromInterval(0,999)
                    })
                }))
                
              }, 5000);

        }
        else if (command === "start_spy_data"){
            setTerminalText(terminalText + "\n\n" + "Start Data")

            this.sateliteDataID = window.setInterval(function(){
                chatSocket.send(JSON.stringify({
                    'type': 'chat_message',
                    'command': 'start_spy_data_reply',
                    'message': "https://loremflickr.com/320/240?lock="+randomIntFromInterval(1, 1000)
                }))
            
          }, 1000);
        }
        else if (command === "stop_data"){
            setTerminalText(terminalText + "\n\n" + "Stop Data")

            window.clearInterval(this.sateliteDataID);
            this.sateliteDataID = null;
            
        }
        else if(command === 'decommission'){
            
            try {
                window.clearInterval(this.telemetryID);
                this.telemetryID = null;
              }
              catch(err) {
              }

              try {
                window.clearInterval(this.sateliteDataID);
                this.sateliteDataID = null;
              }
              catch(err) {
              }
            
            setTerminalText(terminalText + "\n\n" + "Decommission")

            chatSocket.send(JSON.stringify({
                'type': 'chat_message',
                'command': 'deorbit_reply',
                'message': "Satelite has been decommissioned\nGoodbye" 
            }))

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

    function randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    return (
        <>
            <h1 className="secondary-banner">{data.name + " ( " + data.type + " ) Terminal"}</h1>

            <div className="terminal" > 
                <p className='text' ref={divRef}>{terminalText}</p>
            </div>

        </>
					
    );
}

export default Satelite;