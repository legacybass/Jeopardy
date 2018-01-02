export const CheckStatus = response => {
	if (response.ok)
		return Promise.resolve(response);

	return Promise.resolve()
	.then(() => {
		if (!response.bodyUsed) {
			return response.clone().json();
		}
		return response.statusText;
	})
	.catch(() => {
		if (!response.bodyUsed)
			return response.clone().text();
		return response.statusText;
	})
	.catch(() => response.statusText)
	.then(text => {
		if (typeof text === 'object')
			throw new Error(text.error || text.message || text.Message);
		throw new Error(text);

	});
};
