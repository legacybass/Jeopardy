import { CheckStatus } from './helpers';
import config from '../config';
import { escape } from 'querystring';
import { promises } from 'fs';

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

export const RemoveCategory = ({ id }) => {
	return Promise.resolve()
	.then(() => fetch(`${config.api}/api/category/${id}`, {
		method: 'DELETE'
	}))
	.then(CheckStatus)
	.then(response => response.json());
}

export const UpdateCategory = ({ id, name }) => {
	const data = new URLSearchParams();
	data.append('name', name);

	return Promise.resolve()
	.then(() => fetch(`${config.api}/api/category/${id}`, {
		method: 'PUT',
		body: data
	}))
	.then(CheckStatus)
	.then(response => response.json());
}

export const AddQuestion = ({ categoryId, question, points, answer }) => {
	const data = new URLSearchParams();
	data.append('question', question);
	data.append('value', points);
	data.append('answer', answer);

	return Promise.resolve()
	.then(() => fetch(`${config.api}/api/question/${categoryId}`, {
		method: 'POST',
		body: data
	}))
	.then(CheckStatus)
	.then(response => response.json());
}

export const RemoveQuestion = ({ categoryId, questionId }) => {
	return Promise.resolve()
	.then(() => fetch(`${config.api}/api/question/${categoryId}/${questionId}`, {
		method: 'DELETE',
	}))
	.then(CheckStatus)
	.then(response => response.json());
}