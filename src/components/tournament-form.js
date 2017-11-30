import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Redirect} from 'react-router-dom';

import * as actions from '../actions/actions';
import removeEmptyElements from '../utils';
import {teams as teamsConts, bracket as bracketConsts} from '../constants/bracket';

let redirect = false;

class CreateTournament extends Component {
    render() {
        const actions = this.props.actions,
            error = this.props.page.errorLabel;

        console.log('props', this.props);

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
            teams = '',
            errorLabel = '';

        /**
         * @name checkTeams - проверка минимального / максимального количества команд
         * @param {String} teams - список команд
         * @returns {boolean}
         */
        function checkTeams(teams) {
            const teamsArr = removeEmptyElements(teams.split('\n'));

            bracketLimit(teams);

            return teamsConts.MIN_TEAMS_COUNTER <= teamsArr.length && teamsConts.MAX_TEAMS_COUNTER >= teamsArr.length;
        }

        /**
         * @name bracketLimit - получение размера турнирной сетки по количеству команд
         * @param {String} teams - список команд
         * @returns {number}
         */
        function bracketLimit(teams) {
            const teamsArr = removeEmptyElements(teams.split('\n')),
                count = teamsArr.length,
                limit = bracketConsts.BRACKET_LIMITS.find((element) => element >= count);

            // console.log('teamsArr', teamsArr);
            // console.log('count', count);
            console.log('limit', limit);

            drawTeams(teams, limit);
            return limit;
        }

        function drawTeams(teams, limit) {
            const teamsArr = removeEmptyElements(teams.split('\n')),
                count = teamsArr.length,
                emptyTeams = limit - count;

            console.log('emptyTeams', emptyTeams);

            if (emptyTeams > 0) {
                const firstEmptyPosition = limit / 2 - emptyTeams + 2;

                console.log('firstEmptyPosition', firstEmptyPosition);

                return addEmptyTeams(teamsArr, emptyTeams, firstEmptyPosition);
            } else {
                return teamsArr;
            }
        }

        function addEmptyTeams(teamsArr, emptyTeams, firstEmptyPosition) {
            for (let i = 0; i < emptyTeams; i++) {
                teamsArr.splice(firstEmptyPosition, 0, teamsConts.EMPTY_TEAM_NAME);

                firstEmptyPosition = firstEmptyPosition + 2;
            }

            console.log('addEmptyTeams', teamsArr);

            return teamsArr;
        }

        //todo generate matches

        function handleSubmit(e) {
            e.preventDefault();

            console.log('tournamentName', tournamentName.value);
            console.log('tournamentType', tournamentType.value);
            console.log('teams', teams.value);

            //todo проверку на заполненость полей
            if (checkTeams(teams.value)) {
                actions.changeTitle(tournamentName.value);
                actions.createTournament(tournamentName.value, tournamentType.value, teams.value);
                actions.displayError('');

                redirect = true;
            } else {
                actions.displayError(`Укажите правильное количество команд! 
                Минимальное количество - ${teamsConts.MIN_TEAMS_COUNTER}, 
                максимальное - ${teamsConts.MAX_TEAMS_COUNTER}`);
            }

            // dispatch(actions.changeTitle(tournamentName.value));
            // changeTitle(tournamentName.value);
            // store.dispatch({type: 'saveTournament', tournament: {
            //     name: tournamentName,
            //     type: tournamentType,
            //     teams: teamsList
            // }});
        }

        return redirect ?
            <Redirect to='/bracket'/>
            : (<form onSubmit={handleSubmit}>
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
                    <label htmlFor="team-list" className='error' ref={(input) => {
                        errorLabel = input
                    }}>
                        {error}
                    </label>
                    <textarea
                        id='team-list'
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
)(CreateTournament);
