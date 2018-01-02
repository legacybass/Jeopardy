import { CheckStatus } from './helpers';
import config from '../config';
import { escape } from 'querystring';

export const LoadCategories = () => {
	return Promise.resolve()
	.then(() => fetch(`${config.api}/api/categories`))
	.then(CheckStatus)
	.then(response => response.json());
}

export const AddCategory = ({ name }) => {
	const data = new URLSearchParams();
	data.append('name', name);

	return Promise.resolve()
	.then(() => fetch(`${config.api}/api/category`, {
		method: 'POST',
		body: data
	}))
	.then(CheckStatus)
	.then(response => response.json());
}