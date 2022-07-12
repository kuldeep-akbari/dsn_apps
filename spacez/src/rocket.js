import React, { useRef, useEffect, useState } from 'react';

function Rocket(props) {

    const [terminalText, setTerminalText] = useState("Welcome to Deep Space Network");
    
    const [telemetry, setTelemetry] = useState("Start Telemetry");

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

        if (command === 'rocket_init_reply'){
            setTerminalText(terminalText + "\n\n" + msg.message)
        }
        else  if (command === 'rocket_init_reply_end'){
            setTerminalText(terminalText + "\n\n" + msg.message)

            props.rocketSateliteData[index].status = "orbitted";
            props.rocketSateliteData[index].payload.status = "prepared";
            var temp = props.rocketSateliteData;

            props.setState({data : {
                data: temp
            }})
        }
        else if (command === 'start_telemetry_reply'){
            var latitude = JSON.parse(msg.message).latitude;
            var longitude = JSON.parse(msg.message).longitude;
            setTerminalText(terminalText + "\n\n" + "latitude : " + latitude + "\n" + "longitude : " + longitude)
        } else if(command === 'deorbit_reply'){
            setTerminalText(terminalText + "\n\n" + msg.message)
        }

    };

    chatSocket.onerror = function(e) {
        console.log("error")
    };

    chatSocket.onclose = function(e) {
        console.log("disconnected")
    };

    function launch(){

        chatSocket.send(JSON.stringify({
            'type': 'chat_message',
            'command': 'rocket_init',
            'message': data
        }))

        props.rocketSateliteData[index].status = "launched";
        var temp = props.rocketSateliteData;

        props.setState({data : {
            data: temp
        }})

    }

    function handleTelemetry(){
        if (telemetry === "Start Telemetry"){
            setTelemetry("Stop Telemetry")

            chatSocket.send(JSON.stringify({
                'type': 'chat_message',
                'command': 'start_telemetry',
                'message': data
            }))

        }
        else{
            setTelemetry("Start Telemetry")

            chatSocket.send(JSON.stringify({
                'type': 'chat_message',
                'command': 'stop_telemetry',
                'message': data
            }))

        }
    }

    function deorbit(){

        props.rocketSateliteData[index].status = "deorbitted";
        var temp = props.rocketSateliteData;

        props.setState({data : {
            data: temp
        }})

        chatSocket.send(JSON.stringify({
            'type': 'chat_message',
            'command': 'deorbit',
            'message': data
        }))

    }

    return (
        <>

            <h1 className="secondary-banner">{data.name}</h1>

            <div className='button-container'>
                <div>
                    {data.status === "ready" ? <button type='button'  className='item-button button-padding-right' onClick={() => launch()}>Launch</button> : <></>} 
                </div>
                <div>
                    {/* {data.status === "launched" ? <button type='button'  className='item-button button-padding-right' onClick={() => addText()}>Start Tele</button> : <></>}  */}
                    {data.status === "launched" ? <></> : <></>} 
                </div>
                <div>
                    {data.status === "orbitted" ? <button type='button'  className='item-button button-padding-right' onClick={() => handleTelemetry()}>{telemetry}</button> : <></>} 
                </div>
                <div>
                    {data.status === "orbitted" ? <button type='button'  className='item-button button-padding-right' onClick={() => deorbit()}>Deorbit</button> : <></>} 
                </div>
                <div>
                    {data.status === "deorbitted" ? <></> : <></>} 
                </div>
                {/* <button type='button'  className='item-button button-padding-right' onClick={() => addText()}>Add</button>  */}
                {/* <button type='button'  className='item-button button-padding-right' onClick={() => sendText()}>Send</button> */}
            </div>

            <div className="terminal" > 
                {/* <p ref={divRef}>{terminalText}<img src='./logo512.png'></img></p> */}
                <p className='text' ref={divRef}>{terminalText}</p >
            </div>

        </>
					
    );
}

export default Rocket;