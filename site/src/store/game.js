import { NEWGAME } from './actions/game';

export const actionCreators = {
	NewGame: ({ categories, timer }) => ({
		type: NEWGAME,
		categories, timer
	})
};

export const reducer = (state, action = {}) => {
	switch(action.type) {
		case NEWGAME:
			return {
				...state,
				categories: action.categories,
				timer: action.timer
			};
		default:
			return state || {}
	}

};
