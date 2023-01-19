import { Routes, Route } from "react-router-dom";
import Contracts from "./pages/Contracts";
import Home from "./pages/Home";

function App() {
	return (
		<div className="h-screen">
			<div className="text-3xl font-semibold text-center pt-3">
				Töölepingute rakendus
			</div>
			<Routes>
				<Route path="" element={<Home />} />
				<Route path="/:personal_code" element={<Contracts />} />
			</Routes>
		</div>
	);
}

export default App;
