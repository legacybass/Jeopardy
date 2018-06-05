import * as React from 'react';
import { Input, Col, Button, Card, CardBody, CardText } from 'mdbreact';

export default class Questions extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			question: '',
			answer: '',
			points: ''
		};
	}

	render() {
		const questions = this.props.questions.map((q, i) => (
			<Card key={q.id}>
				<CardBody cascade>
					<CardText>{q.question}</CardText>
					<CardText>{q.answer}</CardText>
					<CardText>{q.value}</CardText>
				</CardBody>
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
						<form onSubmit={evt => { evt.preventDefault(); this.props.AddQuestion({ categoryId: this.props.id, ...this.state }); }} className="form form-horizontal">
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
							<Button outline color="primary" type="submit">Add Question</Button>
							<Button outline color="danger" type="reset">Reset</Button>
						</form>
					</Col>
				}
			</section>
		);
	}
}