import * as React from 'react';
import { ListGroup, ListGroupItem, Badge, Input, Button, Col } from 'mdbreact';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt';
import faEdit from '@fortawesome/fontawesome-free-solid/faEdit';

export default class Categories extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			categoryName: "",
			category: null,
			isEditing: false
		};
	}

	CreateCategory() {
		this.props.AddCategory({ name: this.state.categoryName });
		this.setState({ categoryName: '' });
	}

	EditCategory({ category }) {
		this.setState({
			categoryName: category.name,
			category,
			isEditing: true
		});
	}

	UpdateCategory() {
		if(!this.state.category) {
			return;
		}

		this.props.EditCategory({
			id: this.state.category.id,
			name: this.state.categoryName
		});

		this.setState({
			categoryName: '',
			category: null,
			isEditing: false
		})
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
						<Badge pill title={`Edit "${c.name}"`} onClick={() => this.EditCategory({ category: c })}
								className="mx-2" color="info">
							<FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
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
					<form onSubmit={evt => { evt.preventDefault(); this.state.isEditing ? this.UpdateCategory() : this.CreateCategory(); }}>
						<Input label="Your New Category Name" value={this.state.categoryName}
							onChange={evt => this.setState({ categoryName: evt.currentTarget.value })} />
						<Button outline color={this.state.isEditing ? 'success' : 'primary'} block
								type="submit" className="mb-1"
								disabled={this.props.isLoading} >
							{
								`${this.state.isEditing ? 'Update' : 'Add'} Category`
							}
						</Button>
					</form>
				</Col>
			</section>
		);
	}
}