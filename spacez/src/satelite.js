import React, { useRef, useEffect, useState } from 'react';

function Satelite(props) {

    const [terminalText, setTerminalText] = useState("Welcome to Deep Space Network");

    const [telemetry, setTelemetry] = useState("Start Telemetry");

    const [sateliteData, setSateliteData] = useState("Start Data");

    const [images, setImages] = useState([]);

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

    function getseteliteId(){
        for(let i = 0; i < props.rocketSateliteData.length; i++){
            if (props.rocketSateliteData[i].payload.id === props.rocketSateliteId){
                return i;
            }
        }
    }

    const index = getseteliteId();
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

        if (command === 'establish_init_reply'){
            setTerminalText(terminalText + "\n\n" + msg.message)
        }
        else if (command === 'start_telemetry_reply'){
            var latitude = JSON.parse(msg.message).latitude;
            var longitude = JSON.parse(msg.message).longitude;
            setTerminalText(terminalText + "\n\n" + "latitude : " + latitude + "\n" + "longitude : " + longitude)
        } else if (command === 'start_scientific_data_reply'){
            var rain = JSON.parse(msg.message).rain + "%";
            var humidity = JSON.parse(msg.message).humidity+ "%";
            var snow = JSON.parse(msg.message).snow+ "%";
            setTerminalText(terminalText + "\n\n" + "rain : " + rain + "\n" + "humidity : " + humidity+ "\n" + "snow : " + snow)
        } else if (command === 'start_communication_data_reply'){
            var uplink = JSON.parse(msg.message).uplink + " mbps";
            var downlink = JSON.parse(msg.message).downlink+ " mbps";
            setTerminalText(terminalText + "\n\n" + "uplink : " + uplink + "\n" + "downlink : " + downlink)
        } else if (command === 'start_spy_data_reply'){
            var message = msg.message;
            setImages(oldArray => [...oldArray, message])
            console.log(images)
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

    function establish(){

        chatSocket.send(JSON.stringify({
            'type': 'chat_message',
            'command': 'establish_init',
            'message': data
        }))

        props.rocketSateliteData[index].payload.status = "established";
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

    function handleData(){
        if (sateliteData === "Start Data"){
            setSateliteData("Stop Data")

            if (data.type === "scientific"){
                chatSocket.send(JSON.stringify({
                    'type': 'chat_message',
                    'command': 'start_scientific_data',
                    'message': data
                }))
            }
            else if (data.type === "communication"){
                chatSocket.send(JSON.stringify({
                    'type': 'chat_message',
                    'command': 'start_communication_data',
                    'message': data
                }))
            }
            else if (data.type === "spy"){
                chatSocket.send(JSON.stringify({
                    'type': 'chat_message',
                    'command': 'start_spy_data',
                    'message': data
                }))
            }

        }
        else{
            setSateliteData("Start Data")
            chatSocket.send(JSON.stringify({
                'type': 'chat_message',
                'command': 'stop_data',
                'message': data
            }))
        }
        
        
    }

    function decommission(){

        props.rocketSateliteData[index].payload.status = "decommissioned";
        var temp = props.rocketSateliteData;

        props.setState({data : {
            data: temp
        }})

        chatSocket.send(JSON.stringify({
            'type': 'chat_message',
            'command': 'decommission',
            'message': data
        }))

    }

    return (
        <>

            <h1 className="secondary-banner">{data.name + " ( " + data.type + " ) "}</h1>

            <div className='button-container'>
                <div>
                    {data.status === "unprepared" ? <></> : <></>} 
                </div>
                <div>
                    {/* {data.status === "launched" ? <button type='button'  className='item-button button-padding-right' onClick={() => addText()}>Start Tele</button> : <></>}  */}
                    {data.status === "prepared" ? <button type='button'  className='item-button button-padding-right' onClick={() => establish()}>Establish</button> : <></>} 
                </div>
                <div>
                    {data.status === "established" ? <button type='button'  className='item-button button-padding-right' onClick={() => handleTelemetry()}>{telemetry}</button> : <></>} 
                </div>
                <div>
                    {data.status === "established" ? <button type='button'  className='item-button button-padding-right' onClick={() => handleData()}>{sateliteData}</button> : <></>} 
                </div>
                <div>
                    {data.status === "established" ? <button type='button'  className='item-button button-padding-right' onClick={() => decommission()}>Decommission</button> : <></>} 
                </div>
                <div>
                    {data.status === "decommissioned" ? <></> : <></>} 
                </div>
                {/* <button type='button'  className='item-button button-padding-right' onClick={() => addText()}>Add</button>  */}
                {/* <button type='button'  className='item-button button-padding-right' onClick={() => sendText()}>Send</button> */}
            </div>

            <div className="terminal" > 
                {/* <p ref={divRef}>{terminalText}<img src='./logo512.png'></img></p> */}
                <p className='text' ref={divRef}>{terminalText}
                    {data.type === "spy" ? images.map((image) => {
							return (
                                <>
								<br/><img key={Date.now() + Math.random()} src={image} alt="spy"></img><br/>
                                </>
                            )
						}):<></>}
                </p >
            </div>

        </>
					
    );
}

export default Satelite;