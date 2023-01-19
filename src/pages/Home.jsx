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
		<div className="flex flex-col items-center justify-center h-5/6">
			<div className="my-2 w-1/2">
				<label>
					Sisesta isikukood:
					<input
						className="border rounded-md p-2 appearance-none outline-none w-full tracking-widest"
						ref={personalCodeRef}
						type="text"
						maxLength={11}
					/>
					{error && <div className="text-red-600">{error}</div>}
				</label>
				<div className="my-2"></div>
				<button
					className="border rounded-md p-2 bg-blue-600 text-white hover:bg-blue-700"
					onClick={showContracts}
				>
					Näita töölepinguid
				</button>
			</div>
		</div>
	);
}

export default Home;
