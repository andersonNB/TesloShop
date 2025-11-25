import {Sizes} from "@/seed/seed";
import clsx from "clsx";
import React from "react";

interface Props {
	selectedSize: Sizes;
	availableSizes: Sizes[];
}

export const SizeSelector = ({selectedSize, availableSizes}: Props) => {
	return (
		<div className="my-5">
			<h3 className="font-bold mb-4">Tallas disponibles</h3>
			<div className="flex">
				{(availableSizes ?? ["Sin tallas disponibles"])?.map((item) => (
					<button
						key={item}
						className={clsx("mx-2 hover:underline text-lg cursor-pointer", {
							underline: item === selectedSize,
						})}
					>
						{item}
					</button>
				))}
			</div>
		</div>
	);
};
