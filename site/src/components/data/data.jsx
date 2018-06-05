import * as React from'react';
import Categories from './categories';
import Questions from './questions';
import './data.css';


export default class Data extends React.Component {
	static getDerivedStateFromProps(props, state) {
		if(state.selectedCategory) {
			const category = props.categories.find(cat => cat.id === state.selectedCategory.id);

			return {
				...state,
				selectedCategory: category
			};
		}

		return null;
	}

	constructor(props) {
		super(props);
	}

	componentWillMount() {
		this.props.RetrieveData && this.props.RetrieveData();
	}

	componentDidMount() {
		
	}


	render() {
		return (
			<main>
				<h3 className="text-center mb-3">Data Management</h3>
				{this.props.error && 
					<div className="alert alert-danger">{this.props.error}</div>
				}
				<div className="row border border-dark">
					<Categories className="col col-md-5 border-top-0 border-bottom-0 border-left-0 border border-dark" />
					<Questions className="col" />
				</div>
			</main>
		);
	}
}