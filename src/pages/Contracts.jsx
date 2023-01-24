import React, { useEffect, useState } from "react";
import { AiOutlineFileSearch } from "react-icons/ai";
import { FaFileDownload } from "react-icons/fa";
import { IoChevronBackCircleOutline } from "react-icons/io5";

import { Link, useParams } from "react-router-dom";

function Contracts() {
	const [contracts, setContracts] = useState([]);
	const [loading, setLoading] = useState(true);
	const { personal_code } = useParams();

	useEffect(() => {
		if (personal_code.length !== 11 || !Number(personal_code))
			return setLoading(false);

		getContracts();
	}, [personal_code]);

	const getContracts = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				`http://strapi.aland.ee/api/contracts?populate=*&filters[personal_code][$eq]=${Number(
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
		} catch (error) {
			console.error(error);
			setLoading(false);
			return;
		}
	};

	return (
		<div className="grow bg-gradient-to-t from-blue-800 to-green-500 text-white">
			<div className="my-40"></div>
			<div className="mx-auto my-0 text-xl bg-green-800 w-4/5 py-3 px-3 flex items-center gap-3 ">
				<Link to="/">
					<IoChevronBackCircleOutline
						size={36}
						className="hover:text-black text-white"
					/>
				</Link>
				<span className="uppercase">
					Töölepingud isikukoodiga {personal_code}
				</span>
			</div>
			{loading ? (
				<div className="text-black bg-white w-4/5 mx-auto py-3">
					<div className="flex items-center justify-center">
						<div className="flex items-center justify-center mr-3">
							<div className="w-8 h-8 border-b-2 border-black rounded-full animate-spin"></div>
						</div>
						Palun oota...
					</div>
				</div>
			) : (
				<div className="overflow-auto w-4/5 mx-auto my-0 shadow-lg ">
					<table className="w-full">
						<thead className="bg-white border-b">
							<tr>
								<th
									scope="col"
									className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
								>
									#
								</th>
								<th
									scope="col"
									className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
								>
									Isikukood
								</th>
								<th
									scope="col"
									className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
								>
									Eesnimi
								</th>
								<th
									scope="col"
									className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
								>
									Perenimi
								</th>
								<th
									scope="col"
									className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
								>
									Töölepingu algus
								</th>
								<th
									scope="col"
									className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
								>
									Töölepingu lõpp
								</th>
								<th
									scope="col"
									className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
								>
									Tööleping aktiivne
								</th>
								<th
									scope="col"
									className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
								>
									Fail
								</th>
								<th
									scope="col"
									className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
								>
									Laadi fail üles
								</th>
							</tr>
						</thead>
						<tbody>
							{contracts.length < 1 && (
								<tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
									<td
										className="text-center whitespace-nowrap text-sm font-medium text-gray-600 py-3"
										colSpan={9}
									>
										Isikukoodiga {personal_code} ei leitud ühtegi töölepingut.
									</td>
								</tr>
							)}
							{contracts.map((contract) => (
								<tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
									<td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{contract.id}
									</td>
									<td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">
										{contract.attributes.personal_code}
									</td>
									<td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">
										{contract.attributes.first_name}
									</td>
									<td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">
										{contract.attributes.last_name}
									</td>
									<td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">
										{contract.attributes.start_date}
									</td>
									<td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">
										{contract.attributes.end_date
											? contract.attributes.end_date
											: "Tulevikus"}
									</td>
									<td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">
										{contract.attributes.active ? (
											<span className="rounded-full bg-green-600 text-white px-5 py-1">
												Jah
											</span>
										) : (
											<span className="rounded-full bg-red-600 text-white px-5 py-1">
												Ei
											</span>
										)}
									</td>
									<td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap flex gap-2">
										{contract.attributes.contract_file.data && (
											<a
												href={`http://strapi.aland.ee${contract.attributes.contract_file.data.attributes.url}`}
												target="_blank"
												download
											>
												<button className="flex items-center border border-black rounded-md p-1 bg-gray-800 text-white hover:bg-black">
													<FaFileDownload />
													<span className="ml-1">Laadi alla</span>
												</button>
											</a>
										)}
										<button className="flex items-center border border-black rounded-md p-1 bg-gray-800 text-white hover:bg-black">
											<AiOutlineFileSearch />
											<span className="ml-1">Vaata lepingut</span>
										</button>
									</td>
									<td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">
										<input
											className="form-control block py-1 text-sm font-normal text-gray-700 bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
											type="file"
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

export default Contracts;
