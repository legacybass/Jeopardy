import { connect } from 'react-redux';
import Data from './data';
import { actionCreators } from '../../store/data';
import { AddCategory, LoadCategories } from '../../fetch/data';

const mapStateToProps = ({
		data: {
			categories,
			isLoading
		}
	}, ownProps) => {
	return {
		categories,
		isLoading
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		RetrieveData: () => {
			dispatch(actionCreators.RetrievingData());
			Promise.resolve().then(() => LoadCategories())
			.then(categories => dispatch(actionCreators.RetrieveData({ categories })))
			.then(() => dispatch(actionCreators.RetrievedData))
			.catch(err => dispatch(actionCreators.RetrieveDataFailed({ error: err })));
		},
		AddCategory: ({ name }) => {
			dispatch(actionCreators.AddingCategory());
			Promise.resolve().then(() => AddCategory({ name }))
			.then(category => {
				dispatch(actionCreators.AddCategory({ category }));
			})
			.catch(err => {
				dispatch(actionCreators.AddCategoryFailed({ error: err }));
			})
		},
		RemoveCategory: ({ id }) => {

		},
		EditCategory: ({ id, name }) => {

		},
		AddQuestion: ({ categoryId, question, answer, points }) => {

		},
		RemoveQuestion: ({ categoryId, questionId }) => {

		},
		EditQuestion: ({ categoryId, questionId, question, answer, points }) => {

		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Data);