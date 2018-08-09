import { connect } from 'react-redux';
import Categories from './categories';
import { actionCreators } from '../../../store/data';
import { AddCategory, RemoveCategory, UpdateCategory } from '../../../fetch/data';

const mapStateToProps = ({
	data: {
		categories,
		isLoading,
		selectedCategory
	}
}, ownProps) => {
	return {
		categories,
		isLoading,
		selectedCategory
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		SelectCategory({ category }) {
			dispatch(actionCreators.SelectCategory({ category }));
		},
		AddCategory: ({ name }) => {
			if(typeof name !== 'string' || !name.trim())
				return dispatch(actionCreators.AddCategoryFailed({ error: new Error('Please add a name for the category')}));

			Promise.resolve()
			.then(() => dispatch(actionCreators.AddingCategory()))
			.then(() => AddCategory({ name }))
			.then(category => {
				dispatch(actionCreators.AddCategory({ category }));
			})
			.catch(err => {
				dispatch(actionCreators.AddCategoryFailed({ error: err }));
			});
		},
		RemoveCategory: ({ category }) => {
			const { id } = category;
			Promise.resolve()
			.then(() => dispatch(actionCreators.RemovingCategory()))
			.then(() => RemoveCategory({ id }))
			.then(() => dispatch(actionCreators.RemoveCategory({ id })))
			.catch(err => dispatch(actionCreators.RemoveCategoryFailed({ error: err })));
		},
		EditCategory: ({ id, name }) => {
			Promise.resolve()
			.then(() => dispatch(actionCreators.EditingCategory()))
			.then(() => UpdateCategory({ id, name }))
			.then(category => dispatch(actionCreators.EditCategory({ category })))
			.catch(err => dispatch(actionCreators.EditCategoryFailed({ error: err })));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Categories);