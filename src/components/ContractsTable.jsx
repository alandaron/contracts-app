import { format } from "date-fns";
import React from "react";
import { AiOutlineFileSearch, AiOutlineLoading } from "react-icons/ai";
import {
	FaFileDownload,
	FaFileUpload,
	FaRegCheckCircle,
	FaRegTimesCircle,
} from "react-icons/fa";

function ContractsTable({
	contracts,
	getContracts,
	personal_code,
	isUploading,
	setIsUploading,
	selectedFile,
	setSelectedFile,
}) {
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
							{format(new Date(contract.attributes.start_date), "dd.MM.yyyy")}
						</td>
						<td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">
							{contract.attributes.end_date
								? format(new Date(contract.attributes.end_date), "dd.MM.yyyy")
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
										!fileSelected(contract.id) || fileUploading(contract.id)
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
	);
}

export default ContractsTable;
