const RocketSateliteConfig = {
    data:[
        {
            id: 1,
            name: "Bird-9",
            orbit: 600,
            status: "ready", 
            payload: {
                id: 2,
                name: "GPM",
                type: "scientific",
                status: "unprepared",
            }
        },
        {
            id: 3,
            name: "Bird-Heavy",
            orbit: 36000,
            status: "ready",
            payload: {
                id: 4,
                name: "TDRS-11",
                type: "communication",
                status: "unprepared",
            }
        },
        {
            id: 5,
            name: "Hawk-Heavy",
            orbit: 3000,
            status: "ready",
            payload: {
                id: 6,
                name: "RO-245",
                type: "spy",
                status: "unprepared",
            }
        },
    ]
  };

  export default RocketSateliteConfig