import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import './global.css';
import "pathseg"; 
import ParticlesConfig from "./config/particle-config";
import Dashboard from "./dashboard"

function App() {
	
		const particlesInit = async (main) => {
				await loadFull(main);
		};

		const particlesLoaded = (container) => {
		};

		return (
				<>
					<Particles
						id="particles"
						init={particlesInit}
						loaded={particlesLoaded}
						options={ParticlesConfig}/>
					<Dashboard/>
				</>
		);
}

export default App;
