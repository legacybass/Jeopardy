import React from 'react';
import ListItem from './listItem';

export default ({ items, className = '' }) => (
	<div className={`list-group ${className}`}>
		{items.map((item, i) => <ListItem key={item.key || i} text={item.text} active={item.active} onClick={item.onClick} badge={item.count} />)}
	</div>
);