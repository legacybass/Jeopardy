import React from 'react';

export default ({ active = false, text, badge, onClick }) => (
	<a className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${active ? 'active' : ''}`} href="#" onClick={onClick}>
		{text}
		{badge != undefined && badge != null
		? <span className="badge badge-primary badge-pill" title={`There are ${badge} questions in this category`}>{badge}</span>
		: ''}
	</a>
);