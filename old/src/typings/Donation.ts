interface Donation {
	note: string;
	anonymous: boolean;
	date: Date;
	user: string;
	amount: number;
	currency: string;
	avatar: string;
}

export default Donation;
