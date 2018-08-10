import * as React from 'react';
import { Input, Col, Button, Card, CardBody, CardText, CardTitle, CardHeader, CardFooter } from 'mdbreact';

export default class Questions extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			question: '',
			answer: '',
			points: '',
			isEditing: false,
			currentQuestion: null
		};
	}

	EditQuestion({ question }) {
		this.setState({
			question: question.question,
			answer: question.answer,
			points: question.value,
			isEditing: true,
			currentQuestion: question
		});
	}

	UpdateQuestion() {
		this.props.EditQuestion({
			categoryId: this.props.id,
			questionId: this.state.currentQuestion.id,
			question: this.state.question,
			answer: this.state.answer,
			points: this.state.points
		});
		this.CancelEdit();
	}

	CancelEdit() {
		this.setState({
			question: '',
			answer: '',
			poinst: '',
			isEditing: false,
			currentQuestion: null
		})
	}

	render() {
		const questions = this.props.questions.map((q, i) => (
			<Card key={q.id} className="text-center mb-2">
				<CardHeader color="primary-color">
					<CardTitle className="text-center">{q.question}</CardTitle>
				</CardHeader>
				<CardBody cascade>
					<CardText>{q.answer}</CardText>
					<CardText>{q.value}</CardText>
				</CardBody>
				<CardFooter cascade="true">
					<Button type="button" color="danger" outline size="sm" onClick={() => this.props.RemoveQuestion({ questionId: q.id, categoryId: this.props.id })}>
						Delete Question
					</Button>
					<Button type="button" color="info" outline size="sm" onClick={() => this.EditQuestion({ question: q })} >
						Edit Question
					</Button>
				</CardFooter>
			</Card>
		));

		let content = null;
		if(questions.length > 0)
			content = questions;
		else if (this.props.id !== null && this.props.id !== undefined) {
			content = (<p className="my-2 text-center">
						There are no questions for {this.props.name}. Please add questions below.
					</p>);
		}

		return (
			<section id="questions" className={this.props.className || ''}>
				<h5 className="text-center mb-2">
					Questions {this.props.name && `for "${this.props.name}"`}
				</h5>
				<div className="mb-5">
					{ content }
				</div>

				{ this.props.id &&
					<Col className="my-2 border">
						<form onSubmit={evt => { evt.preventDefault(); this.state.isEditing ? this.UpdateQuestion() : this.props.AddQuestion({ categoryId: this.props.id, ...this.state }); }} className="form form-horizontal">
							<Input label="Question" value={this.state.question} onChange={evt => this.setState({ question: evt.currentTarget.value })} />
							<select className="form-control" value={this.state.points} onChange={evt => this.setState({ points: +evt.currentTarget.value })}>
								<option>Points</option>
								<option value="200">200</option>
								<option value="400">400</option>
								<option value="600">600</option>
								<option value="800">800</option>
								<option value="1000">1000</option>
							</select>
							<Input label="Answer" value={this.state.answer} onChange={evt => this.setState({ answer: evt.currentTarget.value })} />
							<Button outline color={(this.state.isEditing ? 'success' : 'primary')} type="submit"
									block className="mb-1">
								{`${this.state.isEditing ? 'Update' : 'Add'} Question`}
							</Button>
							{
								this.state.isEditing
								? <Button outline color='warning' type="button" onClick={() => this.CancelEdit()} 			block className="mb-1">
									Cancel
								</Button>
								: null
							}
						</form>
					</Col>
				}
			</section>
		);
	}
}