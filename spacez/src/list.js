import './global.css';

function List(props) {

    return (
        <div className='item-border'>
            <div className='item-div'>
                <div className='item-name-div'>
                    <p className='item-name'>{"Rocket : " + props.rocketSatelite.name}</p>
                </div>
                <button type='button'  className='item-button' onClick={() => props.setState({
						view: "rocket",
						id: props.rocketSatelite.id
					})}>Operate</button>
            </div>
            <div className='item-div'>
                <div className='item-name-div'>
                    <p className='item-name'>{"Satelite : " + props.rocketSatelite.payload.name + " ( " + props.rocketSatelite.payload.type +" ) "}</p>
                </div>
                <button type='button'  className='item-button' onClick={() => props.setState({
						view: "satelite",
						id: props.rocketSatelite.payload.id
					})}>Operate</button>
            </div>
        </div>
    );
}

export default List;