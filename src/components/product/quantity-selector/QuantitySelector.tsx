"use client";
import {useState} from "react";
import {IoAddCircleOutline, IoRemoveCircleOutline} from "react-icons/io5";

interface Props {
	quantity: number;
}

export const QuantitySelector = ({quantity}: Props) => {
	const [count, setCount] = useState(quantity);

	const onQuantityChanged = (value: number) => {
		if (count + value < 1) return;

		setCount(count + value);
	};

	const onInputChanged = (value: number) => {
		if (value < 1) return;
		setCount(value);
	};

	return (
		<div className="flex">
			<button onClick={() => onQuantityChanged(-1)}>
				<IoRemoveCircleOutline size={30} />
			</button>
			<input
				value={count}
				className="w-30 mx-3 px-5 bg-gray-100 text-center rounded"
				onChange={(e) => {
					const value = e.target.value.replace(/\D/g, "");
					onInputChanged(Number(value));
				}}
				maxLength={5}
				minLength={1}
			/>
			<button onClick={() => onQuantityChanged(+1)}>
				<IoAddCircleOutline size={30} />
			</button>
		</div>
	);
};
