import { ADDCATEGORY, ADDINGCATEGORY, ADDEDCATEGORY, ADDCATEGORYFAILED,
	REMOVECATEGORY, REMOVINGCATEGORY, REMOVEDCATEGORY, REMOVECATEGORYFAILED,
	EDITCATEGORY, EDITINGCATEGORY, EDITEDCATEGORY,
	EDITCATEGORYFAILED,
	ADDQUESTION, ADDINGQUESTION, ADDEDQUESTION, ADDQUESTIONFAILED,
	REMOVEQUESTION, REMOVINGQUESTION, REMOVEDQUESTION, REMOVEQUESTIONFAILED,
	EDITQUESTION, EDITINGQUESTION, EDITEDQUESTION, EDITQUESTIONFAILED,
	RETRIEVEDATA, RETRIEVINGDATA, RETRIEVEDDATA, RETRIEVEDATAFAILED } from './actions/data';

export const actionCreators = {
	RetrievingData: () => ({
		type: RETRIEVINGDATA
	}),
	RetrieveData: ({ categories }) => ({
		type: RETRIEVEDATA,
		categories
	}),
	RetrievedData: () => ({
		type: RETRIEVEDDATA
	}),
	RetrieveDataFailed: ({ error }) => ({
		type: RETRIEVEDATAFAILED,
		error
	}),
	AddingCategory: () => ({
		type: ADDINGCATEGORY
	}),
	AddCategory: ({ category }) => ({
		type: ADDCATEGORY,
		category
	}),
	AddCategoryFailed: ({ error }) => ({
		type: ADDCATEGORYFAILED,
		error
	}),
	RemovingCategory: () => ({
		type: REMOVINGCATEGORY
	}),
	RemoveCategory: ({ id }) => ({
		type: REMOVECATEGORY,
		categoryId: id
	}),
	RemoveCategoryFailed: ({ error }) => ({
		type: REMOVECATEGORYFAILED,
		error
	}),
	EditCategory: ({ id }) => ({
		type: EDITCATEGORY,
		categoryId: id
	}),
	AddQuestion: ({ categoryId, question, answer, points }) => ({
		type: ADDQUESTION,
		categoryId,
		question,
		answer,
		points
	}),
	RemoveQuestion: ({ categoryId, questionId }) => ({
		type: REMOVEQUESTION,
		categoryId,
		questionId
	}),
	EditQuestion: ({ categoryId, questionId, question, answer, points }) => ({
		type: EDITQUESTION,
		categoryId,
		questionId,
		question,
		answer,
		points
	})
};

export const reducer = (state, action = {}) => {
	if(state && state.error)
		delete state.error;
	
	switch (action.type) {
		case RETRIEVEDATA:
			return {
				...state,
				isLoading: false,
				categories: action.categories
			};
		case ADDINGCATEGORY:
		case ADDINGQUESTION:
		case REMOVINGCATEGORY:
		case REMOVINGQUESTION:
		case EDITINGCATEGORY:
		case EDITINGQUESTION:
		case RETRIEVINGDATA:
			return {
				...state,
				isLoading: true
			};
		case ADDCATEGORY:
			return {
				...state,
				isLoading: false,
				categories: [...state.categories, action.category]
			};
		case REMOVECATEGORY:
			return {
				...state,
				isLoading: false,
				categories: state.categories.filter(cat => cat.id !== action.categoryId)
			};
		case ADDEDQUESTION:
		case REMOVEDQUESTION:
		case EDITEDCATEGORY:
		case EDITEDQUESTION:
			return {
				...state,
				categories: action.categories,
				isLoading: false
			};
		case ADDCATEGORYFAILED:
		case ADDQUESTIONFAILED:
		case REMOVECATEGORYFAILED:
		case REMOVEQUESTIONFAILED:
		case EDITCATEGORYFAILED:
		case EDITQUESTIONFAILED:
		case RETRIEVEDATAFAILED:
			return {
				...state,
				error: action.error 
					? (action.error.message || action.error.Message)
					: `An unknown error has ocurred. ${action.error}`
			};
		case RETRIEVEDDATA:
			return {
				...state,
				isLoading: false
			};
		default:
			return state || {
				categories: [],
				isLoading: false
			}
	}
};
