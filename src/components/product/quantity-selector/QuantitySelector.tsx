"use client";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
	quantity: number;
	onQuantityChanged: (value: number) => void
}

export const QuantitySelector = ({ quantity, onQuantityChanged }: Props) => {


	const onQuantityClicked = (value: number) => {

		if (quantity + value < 1) return;
		return onQuantityChanged(quantity + value);
	};

	const onInputChanged = (value: number) => {
		if (value < 1) return;
		return onQuantityChanged(value);
	};

	return (
		<div className="flex">
			<button onClick={() => onQuantityClicked(-1)}>
				<IoRemoveCircleOutline size={30} />
			</button>
			<input
				value={quantity}
				className="w-30 mx-3 px-5 bg-gray-100 text-center rounded"
				onChange={(e) => {
					const value = e.target.value.replace(/\D/g, "");
					onInputChanged(Number(value));
				}}
				maxLength={5}
				minLength={1}
			/>
			<button onClick={() => onQuantityClicked(+1)}>
				<IoAddCircleOutline size={30} />
			</button>
		</div>
	);
};
