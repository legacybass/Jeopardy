import {
	SELECTCATEGORY,
	ADDCATEGORY, ADDINGCATEGORY, ADDCATEGORYFAILED,
	REMOVECATEGORY, REMOVINGCATEGORY, REMOVECATEGORYFAILED,
	EDITCATEGORY, EDITINGCATEGORY, EDITCATEGORYFAILED,
	ADDQUESTION, ADDINGQUESTION, ADDEDQUESTION, ADDQUESTIONFAILED,
	REMOVEQUESTION, REMOVINGQUESTION, REMOVEDQUESTION, REMOVEQUESTIONFAILED,
	EDITQUESTION, EDITINGQUESTION, EDITEDQUESTION, EDITQUESTIONFAILED,
	RETRIEVEDATA, RETRIEVINGDATA, RETRIEVEDDATA, RETRIEVEDATAFAILED } from './actions/data';

export const actionCreators = {
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
		id
	}),
	RemoveCategoryFailed: ({ error }) => ({
		type: REMOVECATEGORYFAILED,
		error
	}),
	EditingCategory: () => ({
		type: EDITINGCATEGORY
	}),
	EditCategory: ({ category }) => ({
		type: EDITCATEGORY,
		category
	}),
	EditCategoryFailed: ({ error }) => ({
		type: EDITCATEGORYFAILED,
		error
	}),
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
	SelectCategory: ({ category }) => ({
		type: SELECTCATEGORY,
		category
	}),
	AddingQuestion: () => ({
		type: ADDINGQUESTION
	}),
	AddQuestion: ({ category }) => ({
		type: ADDQUESTION,
		category
	}),
	AddQuestionFailed: ({ error }) => ({
		type: ADDQUESTIONFAILED,
		error
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
		case SELECTCATEGORY:
			return {
				...state,
				selectedCategory: action.category
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
				categories: state.categories.filter(cat => cat.id !== action.id),
				selectedCategory: state.selectedCategory.id === action.id ? null : state.selectedCategory
			};
		case ADDQUESTION:
			return {
				...state,
				isLoading: false,
				categories: state.categories.map(category => {
					if(category.id === action.category.id) {
						return action.category;
					}

					return category;
				}),
				selectedCategory: state.selectedCategory.id === action.category.id ? action.category : state.selectedCategory
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
				isLoading: false,
				selectedCategory: null
			}
	}
};
