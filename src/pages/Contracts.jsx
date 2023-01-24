import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { AiOutlineFileSearch, AiOutlineLoading } from "react-icons/ai";
import {
	FaFileDownload,
	FaFileUpload,
	FaRegCheckCircle,
	FaRegTimesCircle,
} from "react-icons/fa";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";

function Contracts() {
	const [contracts, setContracts] = useState([]);
	const [selectedFile, setSelectedFile] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isUploading, setIsUploading] = useState([]);
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
				`https://strapi.aland.ee/api/contracts?populate=*&filters[personal_code][$eq]=${Number(
					personal_code
				)}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const json = await response.json();
			const sortedById = json.data.sort((a, b) => a.id - b.id);
			setContracts(sortedById);
			setSelectedFile(
				sortedById.map((contract) => {
					return { id: contract.id, file: undefined };
				})
			);
			setIsUploading(
				sortedById.map((contract) => {
					return { id: contract.id, uploading: false };
				})
			);
			setLoading(false);
		} catch (error) {
			console.error(error);
			setLoading(false);
			return;
		}
	};

	const fileSelected = (contract_id) => {
		const index = selectedFile.findIndex((e) => e.id === contract_id);
		if (selectedFile[index].file === undefined) return false;
		return true;
	};

	const fileUploading = (contract_id) => {
		const index = isUploading.findIndex((e) => e.id === contract_id);
		return isUploading[index].uploading;
	};

	const changeSelectedFile = (contract_id, file) => {
		const index = selectedFile.findIndex((e) => e.id === contract_id);
		selectedFile[index].file = file;
		setSelectedFile([...selectedFile]);
	};

	const uploadFile = async (contract_id) => {
		const { file } = selectedFile.find((e) => e.id === contract_id);
		const index = isUploading.findIndex((e) => e.id === contract_id);
		isUploading[index].uploading = true;
		setIsUploading([...isUploading]);

		try {
			const form = new FormData();
			form.append(`files`, file, file.name);
			form.append(`ref`, "api::contract.contract");
			form.append(`refId`, contract_id);
			form.append(`field`, "contract_file");

			await fetch(`https://strapi.aland.ee/api/upload`, {
				method: "POST",
				body: form,
			});

			getContracts();
		} catch (error) {
			console.error(error);
		} finally {
			isUploading[index].uploading = false;
			setIsUploading([...isUploading]);
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
						<AiOutlineLoading className="animate-spin" size={26} />
						<span className="ml-1">Palun oota...</span>
					</div>
				</div>
			) : (
				<div className="overflow-auto w-4/5 mx-auto my-0 shadow-lg ">
					<table className="w-full">
						<thead className="bg-white border-b">
							<tr>
								<th className="text-sm font-medium text-gray-900 px-4 py-4 text-left">
									#
								</th>
								<th className="text-sm font-medium text-gray-900 px-4 py-4 text-left">
									Isikukood
								</th>
								<th className="text-sm font-medium text-gray-900 px-4 py-4 text-left">
									Eesnimi
								</th>
								<th className="text-sm font-medium text-gray-900 px-4 py-4 text-left">
									Perenimi
								</th>
								<th className="text-sm font-medium text-gray-900 px-4 py-4 text-left">
									Töölepingu algus
								</th>
								<th className="text-sm font-medium text-gray-900 px-4 py-4 text-left">
									Töölepingu lõpp
								</th>
								<th className="text-sm font-medium text-gray-900 px-4 py-4 text-left">
									Tööleping aktiivne
								</th>
								<th className="text-sm font-medium text-gray-900 px-4 py-4 text-left">
									Fail
								</th>
								<th className="text-sm font-medium text-gray-900 px-4 py-4 text-left">
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
								<tr
									key={contract.id}
									className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
								>
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
										{format(
											new Date(contract.attributes.start_date),
											"dd.MM.yyyy"
										)}
									</td>
									<td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">
										{contract.attributes.end_date
											? format(
													new Date(contract.attributes.end_date),
													"dd.MM.yyyy"
											  )
											: "Tulevikus"}
									</td>
									<td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">
										{contract.attributes.active ? (
											<span className="flex w-20 items-center gap-2 rounded-full bg-green-600 text-white px-5 py-1">
												<FaRegCheckCircle />
												<span>Jah</span>
											</span>
										) : (
											<span className="flex w-20 items-center gap-2 rounded-full bg-red-600 text-white px-5 py-1">
												<FaRegTimesCircle />
												<span>Ei</span>
											</span>
										)}
									</td>
									<td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap flex gap-2">
										{contract.attributes.contract_file.data && (
											<>
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
												<button className="flex items-center border border-black rounded-md p-1 bg-gray-800 text-white hover:bg-black">
													<AiOutlineFileSearch />
													<span className="ml-1">Vaata lepingut</span>
												</button>
											</>
										)}
									</td>
									<td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">
										<div className="flex justify-between w-3/4">
											<input
												className="form-control w-full block py-1 text-sm font-normal text-gray-700 bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700  focus:border-blue-600 focus:outline-none select-none"
												type="file"
												onChange={(e) =>
													changeSelectedFile(contract.id, e.target.files[0])
												}
												disabled={fileUploading(contract.id)}
											/>

											<button
												onClick={() => uploadFile(contract.id)}
												className="flex items-center mx-6 border border-black rounded-md p-1 bg-gray-800 text-white hover:bg-black disabled:bg-gray-500 disabled:hover:none disabled:border-none disabled:text-gray-400"
												disabled={
													!fileSelected(contract.id) ||
													fileUploading(contract.id)
												}
											>
												{fileUploading(contract.id) ? (
													<>
														<AiOutlineLoading className="animate-spin" />
														<span className="ml-1">Üles laadimine...</span>
													</>
												) : (
													<>
														<FaFileUpload />
														<span className="ml-1">Laadi üles</span>
													</>
												)}
											</button>
										</div>
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
