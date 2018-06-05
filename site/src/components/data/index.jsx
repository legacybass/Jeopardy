import { connect } from 'react-redux';
import Data from './data';
import { actionCreators } from '../../store/data';
import { AddCategory, LoadCategories, RemoveCategory, AddQuestion } from '../../fetch/data';

const mapStateToProps = ({
		data: {
			isLoading,
			error
		}
	}, ownProps) => {
	return {
		isLoading,
		error
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		RetrieveData: () => {
			Promise.resolve()
			.then(() => dispatch(actionCreators.RetrievingData()))
			.then(() => LoadCategories())
			.then(categories => dispatch(actionCreators.RetrieveData({ categories })))
			.catch(err => dispatch(actionCreators.RetrieveDataFailed({ error: err })));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Data);