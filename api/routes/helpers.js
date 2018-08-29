exports.TransformCategory = ({ _id, name, questions }) => {
	return {
		id: _id,
		name,
		questions: questions.map(({ question, answer, value }, i) => ({ id: i, question, answer, value }))
	};
};