import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Contracts() {
	const [contracts, setContracts] = useState([]);
	const [loading, setLoading] = useState(true);
	const { personal_code } = useParams();

	useEffect(() => {
		if (personal_code.length < 11 || !Number(personal_code)) return;

		getContracts();
	}, [personal_code]);

	const getContracts = async () => {
		setLoading(true);
		const response = await fetch(
			`https://directus.aland.ee/items/contracts?filter[personal_code][_eq]=${Number(
				personal_code
			)}`,
			{
				method: "GET",

				headers: {
					"Content-Type": "application/json",
					// 'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);
		const json = await response.json();
		setContracts(json.data);
		setLoading(false);
	};

	return (
		<div className="flex flex-col items-center justify-center h-2/6">
			<div>Töölepingud isikukoodiga {personal_code}</div>
			{loading ? (
				<div className="inline-flex items-center my-5">
					<div className="flex items-center justify-center mr-3">
						<div className="w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin"></div>
					</div>
					Palun oota...
				</div>
			) : (
				<table className="w-1/2 mx-auto">
					<thead>
						<tr className="text-left">
							<th>#</th>
							<th>Isikukood</th>
							<th>Eesnimi</th>
							<th>Perenimi</th>
							<th>Töölepingu algus</th>
							<th>Töölepingu lõpp</th>
							<th>Tööleping aktiivne</th>
							<th>Fail</th>
						</tr>
					</thead>
					<tbody>
						{contracts.map((contract) => (
							<tr>
								<td>{contract.id}</td>
								<td>{contract.personal_code}</td>
								<td>{contract.first_name}</td>
								<td>{contract.last_name}</td>
								<td>{contract.start_date}</td>
								<td>{contract.end_date ? contract.end_date : "Tulevikus"}</td>
								<td>{contract.active ? "Jah" : "Ei"}</td>
								<td>
									{contract.contract_file && (
										<a
											href={`https://directus.aland.ee/assets/${contract.contract_file}?download`}
											target="_blank"
										>
											Laadi alla
										</a>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

export default Contracts;
