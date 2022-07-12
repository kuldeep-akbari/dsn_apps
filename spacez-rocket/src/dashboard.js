import React from "react"
import List from "./list";
import Rocket from "./rocket";
import Satelite from "./satelite";
import RocketSateliteConfig from './config/data';

class Dashboard extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			view: "list",
			id: 0,
			data: RocketSateliteConfig
		}
	}

	render(){
		return (
			
			<>

				<div className="main-container">
					<h1 className="main-banner" onClick={() => this.setState({
						view: "list",
						id: 0
					})}>Rocket-Satelite Software</h1>
				</div>

				<div className="main-container padding">{
					this.state.view === "list" ? 
						this.state.data.data.map((rocketSatelite) => {
							return (
								<List key={rocketSatelite.id} rocketSatelite={rocketSatelite} setState={this.setState.bind(this)}/>
							)
						}): 
					this.state.view === "rocket" ? <Rocket key={this.state.id} rocketSateliteId={this.state.id} rocketSateliteData={this.state.data.data}  setState={this.setState.bind(this)}/> : 
					this.state.view === "satelite" ? <Satelite key={this.state.id} rocketSateliteId={this.state.id} rocketSateliteData={this.state.data.data} setState={this.setState.bind(this)}/> : 
					<></>
				}</div>

			</>
		);	
	}
}

export default Dashboard;