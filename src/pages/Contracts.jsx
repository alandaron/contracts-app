import React, { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import ContractsTable from "../components/ContractsTable";

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
					<ContractsTable
						contracts={contracts}
						getContracts={getContracts}
						personal_code={personal_code}
						isUploading={isUploading}
						setIsUploading={setIsUploading}
						selectedFile={selectedFile}
						setSelectedFile={setSelectedFile}
					/>
				</div>
			)}
		</div>
	);
}

export default Contracts;
