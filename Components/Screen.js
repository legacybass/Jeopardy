import ko from 'knockout'

export default class Screen {
	constructor ({ Value: value = 200, IsShown: isShown = false }) {
		this.Value = value;
		this.IsShown = isShown;
	}
}