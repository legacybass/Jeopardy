import * as React from'react';
import ListItemGroup from '../listItemGroup';
import './data.css';

export default class Data extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			newCategoryName: '',
			selectedCategory: null
		};
	}

	componentWillMount() {
		this.props.RetrieveData && this.props.RetrieveData();
	}

	componentDidMount() {
		
	}

	AddCategory() {
		if(this.state.newCategoryName) {
			this.props.AddCategory({ name: this.state.newCategoryName });
			this.setState({ newCategoryName: "" });
		}
	}

	SelectCategory({ category }) {
		if(!this.props.isLoading)
			this.setState({ selectedCategory: category });
	}

	RemoveCategory({ category }) {
		this.props.RemoveCategory({ id: category.id });
	}

	render() {
		const categories = (this.props.categories || []).map(c => ({
			text: c.name,
			key: c.categoryId,
			active: this.state.selectedCategory && this.state.selectedCategory === c,
			count: c.questions.length,
			onClick: () => this.SelectCategory({ category: c }),
			remove: () => this.RemoveCategory({ category: c })
		}));

		const questions = this.state.selectedCategory 
			? this.state.selectedCategory.questions.map((q, i) => (
				<div className="card" key={i}>
					<div className="card-body">
						<p className="card-text">{q.question}</p>
						<p className="card-text">{q.answer}</p>
						<p className="card-text">{q.value}</p>
					</div>
				</div>
			))
			: [];

		return (
			<main>
				<h3 className="text-center mb-3">Data Management</h3>
				<div className="row border border-dark">
					<section id="categories" className="col col-md-5 border-top-0 border-bottom-0 border-left-0 border border-dark">
						<h5 className="text-center my-2">Categories</h5>
						<div className="mt-2 mb-5">
							{categories.length > 0
							? <ListItemGroup items={categories} />
							: <p className="mt-2">You have no categories created. Please create a new category.</p>}
						</div>
						<div className="input-group mb-2 pr-4" style={{ position: 'absolute', bottom: 0 }}>
							<input type="text" className="form-control" placeholder="Your New Category Name"
								aria-label="New category name" value={this.state.newCategoryName}
								onChange={evt => this.setState({ newCategoryName: evt.currentTarget.value })}
								disabled={this.props.loading}
								 />
							<div className="input-group-append">
								<button className="btn btn-outline-primary" type="button"
									onClick={() => this.AddCategory()}
									disabled={!this.state.newCategoryName || this.props.isLoading}>
									Add Category
								</button>
							</div>
						</div>
					</section>
					<section id="questions" className="col">
						<h5 className="text-center my-2">
							Questions {this.state.selectedCategory && `for "${this.state.selectedCategory.name}"`}
						</h5>
						{questions}
						<div>
							<form onSubmit={evt => { evt.preventDefault(); this.AddQuestion(); }} className="form form-horizontal">
								<div className="input-group">
									<label className="control-label" htmlFor="question-name">Name</label>
									<input type="text" id="question-name" />
								</div>
								<div className="input-group">
									<label className="control-label" htmlFor="question-answer">Answer</label>
									<input type="text" id="question-answer" />
								</div>
								<div className="input-group">
									<label className="control-label" htmlFor="question-points">Points</label>
									<input type="text" id="question-points" />
								</div>
								<div className="ml-auto">
									<button className="col btn btn-outline-primary" type="submit">Add Question</button>
									<button className="col btn btn-outline-warning" type="reset">Reset</button>
								</div>
							</form>
						</div>
					</section>
				</div>
			</main>
		);
	}
}