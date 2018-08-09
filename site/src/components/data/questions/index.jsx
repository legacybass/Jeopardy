import { connect } from 'react-redux';
import Questions from './question';
import { actionCreators } from '../../../store/data';
import { AddQuestion, RemoveQuestion } from '../../../fetch/data';

const mapStateToProps = ({
	data: {
		selectedCategory,
		isLoading
	}
}) => {
	if(selectedCategory) {
		return {
			questions: selectedCategory.questions,
			id: selectedCategory.id,
			name: selectedCategory.name,
			isLoading
		};
	}

	return {
		questions: [],
		id: null,
		isLoading
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		AddQuestion({ categoryId, question, answer, points }) {
			const errors = [];
			if(categoryId === undefined || categoryId === null)
				errors.push('No category selected. Please select a category before adding a question.');
			if(typeof question !== 'string' || !question.trim())
				errors.push('Please add question text.');
			if(typeof answer !== 'string' || !answer.trim())
				errors.push('Please add answer text.');
			if(points !== 200 && points !== 400 && points !== 600 && points !== 800 && points !== 1000)
				errors.push('Please select a valid points value.');

			if(errors.length > 0)
				return dispatch(actionCreators.AddQuestionFailed({ error: new Error(errors.join('\n')) }));
			
			return Promise.resolve()
			.then(() => dispatch(actionCreators.AddingQuestion()))
			.then(() => AddQuestion({ categoryId, question, answer, points }))
			.then(categoryResponse => dispatch(actionCreators.AddQuestion({ category: categoryResponse })))
			.catch(err => dispatch(actionCreators.AddQuestionFailed({ error: err })));
		},
		RemoveQuestion({ categoryId, questionId }) {
			const errors = [];
			if(categoryId === undefined || categoryId === null)
				errors.push('No category selected. Please select a category.');
			if(questionId === undefined || questionId === null)
				errors.push('No question selected. Please select a question to remove.');

			if(errors.length > 0)
				return dispatch(actionCreators.RemoveQuestionFailed({ error: new Error(errors.join('\n'))}));

			return Promise.resolve()
			.then(() => dispatch(actionCreators.RemovingQuestion()))
			.then(() => RemoveQuestion({ categoryId, questionId }))
			.then(response => dispatch(actionCreators.RemoveQuestion({ categoryId, questionId })))
		},
		EditQuestion({ categoryId, questionId, question, answer, points }) {

		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Questions);