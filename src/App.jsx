import { Route, Routes } from "react-router-dom";
import Uptime from "./assets/uptime-logo.svg";
import Contracts from "./pages/Contracts";
import Home from "./pages/Home";

function App() {
	return (
		<div className="flex flex-col h-screen">
			<div className="text-3xl font-semibold absolute w-full shadow-md bg-gray-300 bg-opacity-40 backdrop-blur-lg h-20 flex items-center justify-center text-green-600">
				<img src={Uptime} width={135} />
			</div>
			<Routes>
				<Route path="" element={<Home />} />
				<Route path="/:personal_code" element={<Contracts />} />
			</Routes>
		</div>
	);
}

export default App;
