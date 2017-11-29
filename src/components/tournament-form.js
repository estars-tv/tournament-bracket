import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/actions';

// import {createStore} from 'redux';

// import {changeTitle} from '../actions/actions';

class CreateTournament extends Component {
    render() {
        const actions = this.props.actions;

        // console.log('actions');
        // console.log(actions);
        // console.log(this.props);

        // function saveTournament(state = {}, action) {
        //     if (action.type === 'saveTournament') {
        //         return {
        //             ...state,
        //             action
        //         }
        //     }
        //
        //     return state;
        // }
        //
        // const store = createStore(saveTournament);
        // //     tournamentName = document.querySelector('.tournament-name').value,
        // //     tournamentType = document.querySelector('.tournament-type').value,
        // //     teamsList = document.querySelector('.teams-list').value;
        //
        // store.subscribe(() => {
        //     console.log('subscribe', store.getState());
        // });

        let tournamentName = '',
            tournamentType = null,
            teams = [];

        function handleSubmit(e) {
            e.preventDefault();

            console.log('tournamentName', tournamentName.value);
            console.log('tournamentType', tournamentType.value);
            console.log('teams', teams.value);

            //todo проверку на заполненость полей
            //todo проверку на количество команд

            actions.changeTitle(tournamentName.value);
            actions.createTournament(tournamentName.value, tournamentType.value, teams.value);

            // dispatch(actions.changeTitle(tournamentName.value));
            // changeTitle(tournamentName.value);
            // store.dispatch({type: 'saveTournament', tournament: {
            //     name: tournamentName,
            //     type: tournamentType,
            //     teams: teamsList
            // }});
        }

        return (
            <form onSubmit={handleSubmit}>
                <input
                    className='tournament-name'
                    name="name"
                    type="text"
                    placeholder="Название турнира"
                    ref={(input) => {
                        tournamentName = input
                    }}
                />
                <select className='tournament-type' name="type" ref={(input) => {
                    tournamentType = input
                }}>
                    <option value={0}>Single Elimination</option>
                    <option value={1}>Double Elimination</option>
                </select>
                <textarea
                    className='teams-list'
                    name="teams"
                    placeholder="Введите участников турнира (каждый участник с новой строки)"
                    ref={(input) => {
                        teams = input
                    }}
                />
                <button>Генерировать</button>
            </form>
        );
    }
}

const mapStateToProps = state => ({
    page: state.page,
    tournament: state.tournament
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateTournament)

// export default CreateTournament;
