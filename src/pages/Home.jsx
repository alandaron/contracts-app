import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
	const [error, setError] = useState("");

	const personalCodeRef = useRef();
	const navigate = useNavigate();
	const showContracts = () => {
		const personal_code = personalCodeRef.current.value;
		if (!Number(personal_code)) {
			setError("Isikukood peab sisaldama ainult numbreid!");
			return;
		}

		if (personal_code.length !== 11) {
			setError("Isikukood peab olema 11 numbrit pikk!");
			return;
		}

		navigate(`/${personal_code}`);
	};
	return (
		<div className="flex flex-col grow items-center justify-center bg-gradient-to-t from-blue-800 to-green-500 ">
			<div className="w-1/2">
				<label className="text-white">
					Sisesta isikukood:
					<input
						className="border rounded-md p-3 text-lg appearance-none outline-none w-full backdrop-blur-lg opacity-40 tracking-widest text-black"
						ref={personalCodeRef}
						type="text"
						maxLength={11}
					/>
					{error && (
						<div className="text-red-100 bg-red-700 rounded-md my-2 px-2 py-1">
							{error}
						</div>
					)}
				</label>
				<div className="my-2"></div>
				<div className="text-center">
					<button
						className="border border-black rounded-md p-2 bg-gray-800 text-white hover:bg-black"
						onClick={showContracts}
					>
						Näita töölepinguid
					</button>
				</div>
			</div>
		</div>
	);
}

export default Home;
