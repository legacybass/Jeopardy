import { connect } from 'react-redux';
import Game from './game';
import { actionCreators } from '../../store/game';

const mapStateToProps = (state, ownProps) => {
	return {};
}

const mapDispatchToProps = (dispatch) => {
	return {

	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);