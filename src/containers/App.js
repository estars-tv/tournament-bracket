import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import MainContent from '../containers/main-content';
import Header from '../components/header';
import * as actions from '../actions/actions'

// import {changeTitle} from '../actions/actions';

import '../styles/main.css';

// function changeStore(state = initialState, action) {
//     return state;
// }


// const App = ({store, title}) => {
//     // store.subscribe(() => {
//     //     console.log('subscribe', store.getState());
//     // });
//     //
//     // store.dispatch(changeTitle('Создайте турнирную сетку'));
//     //
//     // console.log(title);
//     return (
//         <div>
//             <Header name={title}/>
//             <section className={'tournament-form-wrapper'}>
//                 <CreateTournament/>
//             </section>
//         </div>
//     );
// };
//
// export default connect(
//     state => ({
//         title: state.page.title
//     }),
//     dispatch => ({})
// )(App);

class App extends Component {
    render() {
        const title = this.props.page.title,
            actions = this.props.actions;

        return (
            <div>
                <Header title={title}/>
                <MainContent actions={actions}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        page: state.page,
        tournament: state.tournament
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
