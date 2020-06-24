interface ICounterResult {
	PREMIUM: number;
	ERROR: number;
	UNKNOWN: number;
}

const CounterResult: ICounterResult = {
	PREMIUM: -1,
	ERROR: -2,
	UNKNOWN: -3,
}


interface IConstants {
	CounterResult: ICounterResult;
}

const Constants: IConstants = {
	CounterResult,
};

export default Constants;