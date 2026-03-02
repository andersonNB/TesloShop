export interface Product {
	id: string
	description: string;
	images: string[];
	inStock: number;
	price: number;
	sizes: ValidSizes[];
	slug: string;
	tags: string[];
	title: string;
	// type: ValidTypes; llega el categoriId y la interface pide es los ValidTypes
	gender: "men" | "women" | "kid" | "unisex";
}

export interface CartProduct {
	id: string
	title: string
	slug: string
	price: number
	quantity: number
	size: ValidSizes
	image: string
}

export interface SummaryInformation { subTotal: number, tax: number, total: number }

export type ValidSizes = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL";
export type ValidTypes = "shirts" | "pants" | "hoodies" | "hats";
