import * as React from 'react';
import { ListGroup, ListGroupItem, Badge, Input, Button, Col } from 'mdbreact';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt';

export default class Categories extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			categoryname: null
		};
	}

	render() {
		const categories = (this.props.categories || []).map(c => 
			(<ListGroupItem key={c.id}
					active={this.props.selectedCategory && this.props.selectedCategory === c}
					onClick={() => this.props.SelectCategory({ category: c })}>
				<div className="d-flex">
					<span className="mr-auto">{c.name}</span>
					<div>
						<Badge pill title={`There are ${c.questions.length} questions in this category`}
								className="ml-auto">
							{c.questions.length}
						</Badge>
					</div>
					<div>
						<Badge onClick={() => this.props.RemoveCategory({ category: c })} color="danger"
							title={`Remove ${c.name}`}>
							<FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
						</Badge>
					</div>
				</div>
			</ListGroupItem>));

		return (
			<section id="categories" className={this.props.className || ''}>
				<h5 className="text-center mb-2">Categories</h5>
				<div className="mt-2">
					{ categories.length > 0
					? (<ListGroup>{categories}</ListGroup>)
					: <p className="mt-2">You have no categories created. Please create a new category.</p>}
				</div>

				<Col className="my-2 border">
					<form onSubmit={evt => { evt.preventDefault(); this.props.AddCategory({ name: this.state.categoryname }); }}>
						<Input label="Your New Category Name" value={this.state.categoryName}
							onChange={evt => this.setState({ categoryname: evt.currentTarget.value })} />
						<Button outline color="primary" block type="submit" className="mb-1"
							disabled={this.props.isLoading} >Add Category</Button>
					</form>
				</Col>
			</section>
		);
	}
}