import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Redirect} from 'react-router-dom';

import * as actions from '../actions/actions';
import {removeEmptyElements} from '../utils';
import {teams as teamsConsts, bracket as bracketConsts} from '../constants/bracket';

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

        //TODO вынести все из рендера

        let tournamentName = '',
            tournamentType = null,
            teams = '',
            errorLabel = '',
            teamsArr = [],
            teamsCount = null,
            bracketTeamsLimit = null;

        /**
         * @name checkTeams - проверка минимального / максимального количества команд
         * @param {String} teams - список команд
         * @returns {boolean}
         */
        function checkTeams(teams) {
            teamsArr = removeEmptyElements(teams.split('\n'));

            bracketLimit(teamsArr);

            return teamsConsts.MIN_TEAMS_COUNTER <= teamsArr.length && teamsConsts.MAX_TEAMS_COUNTER >= teamsArr.length;
        }

        /**
         * @name bracketLimit - получение размера турнирной сетки по количеству команд
         * @param {Array} teamsArr - список команд
         * @returns {number}
         */
        function bracketLimit(teamsArr) {
            teamsCount = teamsArr.length;
            bracketTeamsLimit = bracketConsts.BRACKET_LIMITS.find((element) => element >= teamsCount);

            // console.log('teamsCount', teamsCount);
            // console.log('bracketTeamsLimit', bracketTeamsLimit);

            return bracketTeamsLimit;
        }

        /**
         * @name drawTeams - распределение команд
         * @return {Array}
         */
        function drawTeams() {
            const emptyTeams = bracketTeamsLimit - teamsCount;

            // console.log('drawTeams func');
            // console.log('bracketTeamsLimit', teamsCount);
            // console.log('teamsCount', teamsCount);
            // console.log('emptyTeams', emptyTeams);

            if (emptyTeams > 0) {
                const firstEmptyPosition = bracketTeamsLimit / 2 - emptyTeams + 2;

                // console.log('firstEmptyPosition', firstEmptyPosition);

                return addEmptyTeams(emptyTeams, firstEmptyPosition);
            } else {
                return teamsArr;
            }
        }

        /**
         * @name addEmptyTeams - добавление команд-пустышек
         * @param emptyTeams
         * @param firstEmptyPosition
         * @return {Array}
         */
        function addEmptyTeams(emptyTeams, firstEmptyPosition) {
            for (let i = 0; i < emptyTeams; i++) {
                teamsArr.splice(firstEmptyPosition, 0, teamsConsts.EMPTY_TEAM_NAME);

                firstEmptyPosition = firstEmptyPosition + 2;
            }

            // console.log('addEmptyTeams', teamsArr);

            return teamsArr;
        }

        /**
         * @name generateMatches - генерируем начальные матчи
         * @param teamsList
         * @return {Array}
         */
        function generateMatches(teamsList) {
            console.log('teamsList', teamsList);

            const matches = [],
                teams = teamsList.slice(),
                tba = teamsConsts.EMPTY_TEAM_NAME;

            // console.log(teams);
            console.log('teams count', teams.length);

            for (let i = 0; i < teamsList.length / 2; i++) {
                const firstTeam = teams[0],
                    secondTeam = teams[1];

                // console.log(matches);
                // console.log('_teams', teams);

                matches.push({
                    id: i,
                    sides: {
                        teamOwner: {
                            name: firstTeam,
                            score: firstTeam === tba ? '0' : secondTeam === tba ? '1' : null,
                            sourceGame: null
                        },
                        teamGuest: {
                            name: secondTeam,
                            score: secondTeam === tba ? '0' : firstTeam === tba ? '1' : null,
                            sourceGame: null
                        }
                    }
                });

                debugger;

                teams.splice(0, 2);
            }

            return matches;
        }

        /**
         * @name generateTours - разделение на туры
         * @param matches - список начальных матчей
         * @return {Array}
         */
        function generateTours(matches) {
            //TODO se de зависимость
            const tours = [matches],
                countMatches = matches.length,
                matchesCounter = teamsConsts.MIN_TEAMS_COUNTER / 2 === countMatches ? countMatches / 2 + 1 : countMatches / 2;

            console.debug('teamsConsts.MIN_TEAMS_COUNTER', teamsConsts.MIN_TEAMS_COUNTER);
            console.debug('matches', matches);
            console.debug('tours', tours);
            console.debug('countMatches', countMatches);
            console.debug('matchesCounter', matchesCounter);

            let matchIdIncrement = countMatches,
                toursDecrement = countMatches,
                i = 1;

            // for (let i = 1; i < matchesCounter; i++) {
            while (toursDecrement / 2 >= 1) {
                const prevTour = tours[i - 1],
                    prevTourMatches = prevTour.length;

                tours[i] = [];

                let t = 0;

                for (let n = 0; n < prevTourMatches / 2; n++) {
                    const firstMatch = prevTour[t],
                        secondMath = prevTour[t + 1],
                        firstMatchWinner = getMatchWinner(firstMatch),
                        secondMatchWinner = getMatchWinner(secondMath),
                        firstMatchSource = firstMatch.id,
                        secondMatchSource = secondMath.id,
                        nextMatch = {
                            id: matchIdIncrement,
                            sides: {
                                teamOwner: {
                                    name: firstMatchWinner,
                                    score: null,
                                    sourceGame: {
                                        '@ref': firstMatchSource
                                    }
                                },
                                teamGuest: {
                                    name: secondMatchWinner,
                                    score: null,
                                    sourceGame: {
                                        '@ref': secondMatchSource
                                    }
                                }
                            }
                        };

                    if (firstMatchWinner === teamsConsts.EMPTY_TEAM_NAME) {
                        nextMatch.sides.teamOwner.score = 0;
                        nextMatch.sides.teamGuest.score = 1;
                    } else if (secondMatchWinner === teamsConsts.EMPTY_TEAM_NAME) {
                        nextMatch.sides.teamOwner.score = 1;
                        nextMatch.sides.teamGuest.score = 0;
                    }

                    console.log('tours', tours);
                    console.log('i', i);
                    console.log('nextMatch', nextMatch);

                    tours[i].push(nextMatch);
                    // matches.push(nextMatch);

                    // console.log('i', i);

                    t = t + 2;
                    matchIdIncrement++;
                }

                toursDecrement /= 2;
                i++;
            }

            console.log('tours', tours);
            // console.log('matches', matches);

            return tours;
        }

        /**
         * @name getMatchWinner - получение победителя в матче
         * @param match - матч
         * @return {String}
         */
        function getMatchWinner(match) {
            const notEmpty = {
                    teamGuest: 'teamOwner',
                    teamOwner: 'teamGuest'
                },
                tba = teamsConsts.EMPTY_TEAM_NAME,
                sides = match.sides,
                teamGuest = sides.teamGuest,
                teamOwner = sides.teamOwner;

            if (teamGuest && teamOwner) {
                return teamGuest.name === tba ? sides[notEmpty['teamGuest']].name : teamOwner.name === tba ?
                    sides[notEmpty['teamOwner']].name : teamsConsts.MATCH_WINNER.toValue(match.id);

                // if (teamGuest.name === tba) {
                //     return sides[notEmpty['teamGuest']].name;
                // } else if (teamOwner.name === tba) {
                //     return sides[notEmpty['teamOwner']].name;
                // } else {
                //     return teamsConsts.MATCH_WINNER.toValue(match.id);
                // }
            }
        }

        /**
         * @name modelToGraph - преобразование модели в граф
         * @param tours
         * @return {Array}
         */
        function modelToGraph(tours) {
            const model = [];

            for (let i = 0; i < tours.length; i++) {
                for (const key in tours[i]) {
                    if (Object.prototype.hasOwnProperty.call(tours[i], key)) {
                        const obj = {
                            '@id': tours[i][key].id,
                            'tour': i
                        };

                        model.push(Object.assign(obj, tours[i][key]));
                    }
                }
            }

            return model;
        }

        function handleSubmit(e) {
            e.preventDefault();

            console.log('tournamentName', tournamentName.value);
            console.log('tournamentType', tournamentType.value);
            console.log('teams', teams.value);

            //todo проверку на заполненость полей
            if (checkTeams(teams.value)) {
                const teamsList = drawTeams(),
                    matches = generateMatches(teamsList),
                    tours = generateTours(matches),
                    bracketModel = modelToGraph(tours);

                console.log('matches', matches);
                // console.log('tours', tours);

                actions.changeTitle(tournamentName.value);
                actions.createTournament(tournamentName.value, tournamentType.value, teamsList, tours, bracketModel);
                actions.displayError('');

                redirect = true;
            } else {
                actions.displayError(`Укажите правильное количество команд! 
                Минимальное количество - ${teamsConsts.MIN_TEAMS_COUNTER}, 
                максимальное - ${teamsConsts.MAX_TEAMS_COUNTER}`);
            }
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
