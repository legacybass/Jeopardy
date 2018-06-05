import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt'

export default ({ active = false, text, badge, onClick, remove }) => {
	const badgeElement = badge !== undefined && badge !== null
		? <span className="badge badge-primary badge-pill" title={`There are ${badge} questions in this category`}>{badge}</span>
		: null;

	const removeElement = typeof remove === 'function'
		? <span className="ml-2" title="Delete Item" onClick={remove}>
			<FontAwesomeIcon icon={faTrashAlt} />
		</span>
		: null;

	return (
		<a href="#" onClick={onClick}
			className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${active ? 'active' : ''}`}>
			{text}
			{ badge || remove ? <div>{badgeElement}{removeElement}</div> : null }
		</a>
	);
};