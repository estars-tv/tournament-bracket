import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Redirect} from 'react-router-dom';

import * as actions from '../actions/actions';
import {removeEmptyElements} from '../utils';
import {bracket as bracketConsts, teams as teamsConsts} from '../constants/bracket';

let redirect = false;

class CreateTournament extends Component {
    render() {
        const actions = this.props.actions,
            error = this.props.page.errorLabel;

        console.log('props', this.props);

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
                countMatches = matches.length;

            console.debug('matches', matches);
            console.debug('tours', tours);

            let matchIdIncrement = countMatches,
                toursDecrement = countMatches,
                i = 1;

            while (toursDecrement / 2 >= 1) {
                const lastTour = tours[i - 1],
                    lastTourMatches = lastTour.length;

                let t = 0;

                tours[i] = [];

                for (let n = 0; n < lastTourMatches / 2; n++) {
                    const firstMatch = lastTour[t],
                        secondMath = lastTour[t + 1],
                        firstMatchWinner = getMatchWinner(firstMatch),
                        secondMatchWinner = getMatchWinner(secondMath),
                        firstMatchSource = firstMatch.id,
                        secondMatchSource = secondMath.id,
                        winnersId = tours[i].length > 0 ?
                            tours[i][tours[i].length - 1].id + 1 : lastTour[lastTourMatches - 1].id + 1,
                        winners = {
                            id: winnersId,
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
                        winners.sides.teamOwner.score = 0;
                        winners.sides.teamGuest.score = 1;
                    } else if (secondMatchWinner === teamsConsts.EMPTY_TEAM_NAME) {
                        winners.sides.teamOwner.score = 1;
                        winners.sides.teamGuest.score = 0;
                    }

                    tours[i].push(winners);

                    t = t + 2;
                    matchIdIncrement++;
                }

                toursDecrement /= 2;
                i++;
            }

            console.log('tours', tours);

            return tours;
        }

        /**
         * @name createMatch - создание матча
         * @param obj
         * @returns {{id: (number|null), sides: {teamOwner: {name: (String|null), score: (*|null), sourceGame: (ownerSource|{@ref}|null)},
          * teamGuest: {name: (String|*|null), score: (*|null), sourceGame: (guestSource|{@ref}|null)}}}}
         */
        function createMatch(obj) {
            return {
                id: obj.id || null,
                sides: {
                    teamOwner: {
                        name: obj.ownerName || null,
                        score: obj.ownerScore || null,
                        sourceGame: obj.ownerSource || null,
                    },
                    teamGuest: {
                        name: obj.guestName || null,
                        score: obj.guestScore || null,
                        sourceGame: obj.guestSource || null,
                    }
                }
            }
        }

        function lowerBracket(tours) {
            const upper = tours.upper,
                lower = tours.lower;

            let matchIdIncrement;

            for (let i = 0; i < upper.length; i++) {
                const currentUpperTourCount = upper[i].length;

                if (currentUpperTourCount > 1) {
                    if (i === 0) {
                        for (let n = 0; n < currentUpperTourCount; n += 2) {
                            const firstLoser = upper[i][n],
                                secondLoser = upper[i][n + 1],
                                firstLoserName = getMatchLoser(firstLoser),
                                secondLoserName = getMatchLoser(secondLoser),
                                lastUpperTour = upper[upper.length - 1],
                                lastUpperTourCount = lastUpperTour.length;

                            matchIdIncrement = matchIdIncrement ? matchIdIncrement : lastUpperTour[lastUpperTourCount - 1].id + 1;

                            if (!tours.lower[i + 1]) tours.lower[i + 1] = [];

                            tours.lower[i + 1].push(createMatch({
                                id: matchIdIncrement,
                                ownerName: firstLoserName,
                                guestName: secondLoserName
                            }));

                            matchIdIncrement++;
                        }
                    } else {
                        for (let n = 0; n < currentUpperTourCount; n++) {
                            const upperLoser = upper[i][n],
                                lowerWinner = lower[i][n],
                                upperLoserName = getMatchLoser(upperLoser),
                                lowerWinnerName = getMatchWinner(lowerWinner);

                            if (!tours.lower[i + 1]) tours.lower[i + 1] = [];

                            tours.lower[i + 1].push(createMatch({
                                id: matchIdIncrement,
                                ownerName: upperLoserName,
                                guestName: lowerWinnerName,
                                guestSource: {'@ref': lowerWinner.id}
                            }));

                            matchIdIncrement++;
                        }
                    }
                } else {
                    const lastLowerTour = lower[lower.length - 1].length;
                    debugger;

                    if (lastLowerTour > 1) {
                        const lastLowerTour = lower[lower.length - 1],
                            firstWinner = lastLowerTour[0],
                            secondWinner = lastLowerTour[1],
                            firstWinnerName = getMatchWinner(firstWinner),
                            secondWinnerName = getMatchWinner(secondWinner);

                        if (!tours.lower[i + 1]) tours.lower[i + 1] = [];

                        tours.lower[i + 1].push(createMatch({
                            id: matchIdIncrement,
                            ownerName: firstWinnerName,
                            guestName: secondWinnerName,
                            ownerSource: {'@ref': firstWinner.id},
                            guestSource: {'@ref': secondWinner.id}
                        }));

                        matchIdIncrement++;
                    }

                    //финал лузеров
                    const lastUpperTour = upper[upper.length - 1],
                        upperLoser = lastUpperTour[0],
                        upperWinner = lastUpperTour[0],
                        lastTour = lower[lower.length - 1],
                        lastTourCount = lastTour.length,
                        lowerWinner = lastTour[lastTourCount - 1],
                        upperLoserName = getMatchLoser(upperLoser),
                        upperWinnerName = getMatchWinner(upperWinner),
                        lowerWinnerName = getMatchWinner(lowerWinner);
debugger;
                    const losersFinal = createMatch({
                        id: matchIdIncrement,
                        ownerName: upperLoserName,
                        guestName: lowerWinnerName,
                        guestSource: {'@ref': lowerWinner.id}
                    });

                    if (!tours.lower[i + 1]) tours.lower[i + 1] = [];

                    tours.lower[i + 1].push(losersFinal);

                    matchIdIncrement++;

                    //финал
                    if (!tours.lower[i + 2]) tours.lower[i + 2] = [];

                    tours.lower[i + 2].push(createMatch({
                        id: matchIdIncrement,
                        ownerName: upperWinnerName,
                        guestName: getMatchWinner(losersFinal),
                        ownerSource: {'@ref': upperWinner.id},
                        guestSource: {'@ref': losersFinal.id}
                    }));
                }
            }
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

            console.log('winners match', match);

            if (teamGuest && teamOwner) {
                return teamGuest.name === tba ? sides[notEmpty['teamGuest']].name : teamOwner.name === tba ?
                    sides[notEmpty['teamOwner']].name : teamsConsts.MATCH_WINNER.toValue(match.id);
            }
        }

        /**
         * @name getMatchLoser - получение проигравшего в матче
         * @param match
         * @returns {*}
         */
        function getMatchLoser(match) {
            console.log('getMatchLoser', match);
            const tba = teamsConsts.EMPTY_TEAM_NAME,
                sides = match.sides,
                teamGuest = sides.teamGuest,
                teamOwner = sides.teamOwner;

            if (teamGuest && teamOwner) {
                return teamGuest.name === tba ? sides['teamGuest'].name : teamOwner.name === tba ?
                    sides['teamOwner'].name : teamsConsts.MATCH_LOSER.toValue(match.id);
            }
        }

        /**
         * @name modelToGraph - преобразование модели в граф
         * @param tours
         * @return {Array}
         */
        function modelToGraph(tours) {
            const model = [];

            for (const bracket in tours) {
                if (Object.prototype.hasOwnProperty.call(tours, bracket)) {
                    for (let i = 0; i < tours[bracket].length; i++) {
                        for (const key in tours[bracket][i]) {
                            if (Object.prototype.hasOwnProperty.call(tours[bracket][i], key)) {
                                const obj = {
                                    '@id': tours[bracket][i][key].id,
                                    'tour': i
                                };

                                model.push(Object.assign(obj, tours[bracket][i][key]));
                            }
                        }
                    }
                }
            }

            return model;
        }

        function handleSubmit(e) {
            e.preventDefault();

            //todo проверку на заполненость полей
            if (checkTeams(teams.value)) {
                const isDouble = true;

                const teamsList = drawTeams(),
                    matches = generateMatches(teamsList),
                    // tours = isDouble ? generateDE(generateTours(matches)) : generateTours(matches),
                    winners = generateTours(matches),
                    tours = {
                        upper: winners,
                        lower: []
                    };
                // losers = generateLosers(tours),
                // bracketModel = modelToGraph(tours);

                lowerBracket(tours);

                actions.changeTitle(tournamentName.value);
                actions.createTournament(tournamentName.value, tournamentType.value, teamsList, tours, modelToGraph(tours));
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
