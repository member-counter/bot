export function toggleArrayItem<T>(array: T[], item: T): [T[], boolean] {
	const arrayToToggle = Array.from(array);
	const index = arrayToToggle.indexOf(item);
	const found = index >= 0;
	if (found) {
		arrayToToggle.splice(index, 1);
	} else {
		arrayToToggle.push(item);
	}
	return [arrayToToggle, found];
}
