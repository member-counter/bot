function daysInThisMonth(): number {
	var now: Date = new Date();
	return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}
const daysInCurrentMonth = daysInThisMonth();
export default daysInCurrentMonth;
