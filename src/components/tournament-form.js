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

                teams.splice(0, 2);
            }

            return matches;
        }

        /**
         * @name generateLosers
         * @param tours - туры виннеров
         *
         team1
         team2
         team3
         team4
         */
        function generateLosers(tours) {
            console.log('generateLosers tours', tours);

            debugger;
            const upperTours = tours.upper,
                countTours = upperTours.length;

            console.log('countTours', countTours);

            for (let i = 0; i < countTours; i++) {
                const upperTour = upperTours[countTours - 1],
                    countUpperTour = upperTour.length;

                tours.lower[i] = [];

                debugger;

                if (i === 0) {
                    const firstWinnersTour = upperTours[0],
                        countFirstWinnersTour = firstWinnersTour.length;

                    for (let n = 0; n < countFirstWinnersTour / 2; n++) {
                        const firstMatch = firstWinnersTour[n],
                            secondMath = firstWinnersTour[n + 1],
                            // firstMatchWinner = getMatchWinner(firstMatch),
                            // secondMatchWinner = getMatchWinner(secondMath),
                            firstMatchLoser = getMatchLoser(firstMatch),
                            secondMatchLoser = getMatchLoser(secondMath),
                            firstMatchSource = firstMatch.id,
                            secondMatchSource = secondMath.id,
                            winnersId = upperTours[i].length > 0 ?
                                upperTours[i][upperTours[i].length - 1].id + 1 : firstWinnersTour[countFirstWinnersTour - 1].id + 1,
                            losersId = winnersId + 1,
                            losers = {
                                id: losersId,
                                sides: {
                                    teamOwner: {
                                        name: firstMatchLoser,
                                        score: null,
                                        sourceGame: null
                                        // sourceGame: {
                                        //     '@ref': firstMatchSource
                                        // }
                                    },
                                    teamGuest: {
                                        name: secondMatchLoser,
                                        score: null,
                                        sourceGame: null
                                        // sourceGame: {
                                        //     '@ref': secondMatchSource
                                        // }
                                    }
                                }
                            };

                        tours.lower[i].push(losers);
                    }
                }

                if (countUpperTour === 1 && i > 0) {
                    debugger;

                    /*если впервые в N туре количество матчей равно 1, то строим в такой последовательности:
                    сверху снизу, и финал сверху снизу (для 4 команд не подходит из-за впервые,
                        возможно спасет иф)*/

                    function losersFinal() {
                        console.log('tours', tours);
                        console.log('upper', tours.upper);
                        console.log('lower', tours.lower);
                        console.log('upper w', tours.upper[i][0]);
                        console.log('lower w', tours.lower[i - 1][0]);

                        const losersMatch = tours.lower[i - 1][0],
                            winnersMatch = tours.upper[i][0],
                            firstMatchWinner = getMatchWinner(losersMatch),
                            secondMatchWinner = getMatchWinner(winnersMatch),
                            firstMatchSource = losersMatch.id,
                            secondMatchSource = winnersMatch.id,
                            winnersId = upperTours[i].length > 0 ?
                                upperTours[i][upperTours[i].length - 1].id + 1 : losersMatch.id + 1,
                            losersId = winnersId + 1,
                            losers = {
                                id: losersId,
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

                        console.log('losers', losers);

                        debugger;

                        // if (!tours.lower[i + 1]) tours.lower[i + 1] = [];

                        // tours.lower[i + 1].push(losers);
                        tours.lower[i].push(losers);
                    }

                    losersFinal();

                    debugger;
                } else if (countUpperTour > 1) {
                    debugger;
                }
            }

            console.log('losers tours', tours);
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

            // console.debug('teamsConsts.MIN_TEAMS_COUNTER', teamsConsts.MIN_TEAMS_COUNTER);
            console.debug('matches', matches);
            console.debug('tours', tours);
            // console.debug('countMatches', countMatches);
            // console.debug('matchesCounter', matchesCounter);

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
                        firstMatchLoser = getMatchLoser(firstMatch),
                        secondMatchLoser = getMatchLoser(secondMath),
                        firstMatchSource = firstMatch.id,
                        secondMatchSource = secondMath.id,
                        winnersId = tours[i].length > 0 ?
                            tours[i][tours[i].length - 1].id + 1 : lastTour[lastTourMatches - 1].id + 1,
                        losersId = winnersId + 1,
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
                        },
                        losers = {
                            id: losersId,
                            sides: {
                                teamOwner: {
                                    name: firstMatchLoser,
                                    score: null,
                                    sourceGame: null
                                    // sourceGame: {
                                    //     '@ref': firstMatchSource
                                    // }
                                },
                                teamGuest: {
                                    name: secondMatchLoser,
                                    score: null,
                                    sourceGame: null
                                    // sourceGame: {
                                    //     '@ref': secondMatchSource
                                    // }
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

                    // console.log('tours', tours);
                    // console.log('i', i);
                    // console.log('nextMatch', nextMatch);

                    tours[i].push(winners);
                    // tours[i].push(losers);
                    // matches.push(nextMatch);

                    // console.log('i', i);

                    t = t + 2;
                    matchIdIncrement++;
                }

                toursDecrement /= 2;
                i++;
            }

            const currentLastTour = tours.length - 1,
                lastTour = tours[currentLastTour],
                countLastTour = lastTour.length;

            console.log('lastTour', lastTour);

            // if (countLastTour > 2) {
            //     let winnerIterator = 0,
            //         loserIterator  = 1;
            //
            //     for (let i = 0; i < countLastTour; i++) {
            //         const winnersMatch = lastTour[winnerIterator],
            //             losersMath = lastTour[loserIterator],
            //             winnersMatchLoser = getMatchLoser(winnersMatch),
            //             losersMatchWinner = getMatchWinner(losersMath),
            //             match = {
            //                 id: lastTour.length,
            //                 sides: {
            //                     teamOwner: {
            //                         name: winnersMatchLoser,
            //                         score: null,
            //                         sourceGame: null
            //                     },
            //                     teamGuest: {
            //                         name: losersMatchWinner,
            //                         score: null,
            //                         sourceGame: {
            //                             '@ref': losersMath.id
            //                         }
            //                     }
            //                 }
            //             };
            //
            //         tours[currentLastTour].push(match);
            //
            //         winnerIterator += 2;
            //         loserIterator += 2;
            //     }
            // }

            // if (countLastTour === 2) {
            //     //финал лузеров
            //     const winnersMatch = lastTour[0],
            //         losersMath = lastTour[1],
            //         winnersMatchLoser = getMatchLoser(winnersMatch),
            //         winnersMatchWinner = getMatchWinner(winnersMatch),
            //         losersMatchWinner = getMatchWinner(losersMath),
            //         losersFinal = {
            //             id: losersMath.id + 1,
            //             sides: {
            //                 teamOwner: {
            //                     name: winnersMatchLoser,
            //                     score: null,
            //                     sourceGame: null
            //                 },
            //                 teamGuest: {
            //                     name: losersMatchWinner,
            //                     score: null,
            //                     sourceGame: {
            //                         '@ref': losersMath.id
            //                     }
            //                 }
            //             }
            //         },
            //         final = {
            //             id: losersMath.id + 2,
            //             sides: {
            //                 teamOwner: {
            //                     name: winnersMatchWinner,
            //                     score: null,
            //                     sourceGame: {
            //                         '@ref': winnersMatch.id
            //                     }
            //                 },
            //                 teamGuest: {
            //                     name: getMatchWinner(losersFinal),
            //                     score: null,
            //                     sourceGame: {
            //                         '@ref': losersMath.id + 1
            //                     }
            //                 }
            //             }
            //         };
            //
            //     tours[currentLastTour].push(losersFinal);
            //
            //     //final
            //
            //     // tours[currentLastTour + 1] = [];
            //     // tours.push(final);
            //
            //     tours[currentLastTour + 1] = [final];
            // }

            // generateFinal(tours);

            console.log('tours', tours);
            // console.log('upper', upper);
            // console.log('lower', lower);
            // console.log('matches', matches);

            return tours;
        }

        /**
         * @name getMatchWinner - получение победителя в матче
         * @param match - матч
         * @return {String}
         */
        function getMatchWinner(match) {
            debugger;
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

                // if (teamGuest.name === tba) {
                //     return sides[notEmpty['teamGuest']].name;
                // } else if (teamOwner.name === tba) {
                //     return sides[notEmpty['teamOwner']].name;
                // } else {
                //     return teamsConsts.MATCH_WINNER.toValue(match.id);
                // }
            }
        }

        function getMatchLoser(match) {
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
            debugger;
            const model = [];

            for (const bracket in tours) {
                debugger;
                if (Object.prototype.hasOwnProperty.call(tours, bracket)) {
                    for (let i = 0; i < tours[bracket].length; i++) {
                        debugger;
                        for (const key in tours[bracket][i]) {
                            debugger;
                            if (Object.prototype.hasOwnProperty.call(tours[bracket][i], key)) {
                                const obj = {
                                    '@id': tours[bracket][i][key].id,
                                    'tour': i
                                };
                                debugger;

                                model.push(Object.assign(obj, tours[bracket][i][key]));
                                debugger;
                            }
                        }
                    }
                }
            }

            return model;
        }

        /**
         * @name generateDE - генерация сетки Double Elimination
         * @param {Array} tours - массив туров для сетки Single Elimination
         */
        function generateDE(tours) {
            const countTours = tours.length,
                toursDE = tours.slice(),
                countMatches = tours.forEach(function (tour) {
                    console.log('element', tour);
                });

            console.log('toursDE', toursDE);

            for (let i = 1; i < countTours; i++) {
                const countCurrentTour = tours[i].length,
                    prevTour = tours[i - 1],
                    countPrevTour = prevTour.length;

                let matchIdIncrement = countPrevTour;

                for (let n = 0; n < countPrevTour; n += 2) {
                    const firstMatch = prevTour[n],
                        secondMath = prevTour[n + 1],
                        firstMatchLoser = getMatchLoser(firstMatch),
                        secondMatchLoser = getMatchLoser(secondMath),
                        firstMatchSource = firstMatch.id,
                        secondMatchSource = secondMath.id,
                        nextMatch = {
                            id: matchIdIncrement,
                            sides: {
                                teamOwner: {
                                    name: firstMatchLoser,
                                    score: null,
                                    sourceGame: null
                                    // sourceGame: {
                                    //     '@ref': firstMatchSource
                                    // }
                                },
                                teamGuest: {
                                    name: secondMatchLoser,
                                    score: null,
                                    sourceGame: null
                                    // sourceGame: {
                                    //     '@ref': secondMatchSource
                                    // }
                                }
                            }
                        };

                    toursDE[i].push(nextMatch);

                    matchIdIncrement++;
                }

                console.log('toursDE', toursDE);
            }

            // generateFinal(toursDE);
        }

        function generateFinal(tours) {
            const lastTour = tours[tours.length - 1],
                countLastTour = lastTour.length;

            if (countLastTour > 1) {
                const newTours = tours.slice();

                for (let i = 0; i < countLastTour; i++) {
                    const firstMatch = lastTour[i],
                        secondMath = lastTour[i + 1],
                        firstMatchLoser = getMatchWinner(firstMatch),
                        secondMatchLoser = getMatchLoser(secondMath);
                }
            } else {
                return tours;
            }
        }

        function handleSubmit(e) {
            e.preventDefault();

            console.log('tournamentName', tournamentName.value);
            console.log('tournamentType', tournamentType.value);
            console.log('teams', teams.value);

            //todo проверку на заполненость полей
            if (checkTeams(teams.value)) {
                const isDouble = true;

                const teamsList = drawTeams(),
                    matches = generateMatches(teamsList),
                    // tours = isDouble ? generateDE(generateTours(matches)) : generateTours(matches),
                    tours = {
                        upper: generateTours(matches),
                        lower: []
                    },
                    losers = generateLosers(tours),
                    bracketModel = modelToGraph(tours);

                console.log('tours onclick', tours);

                debugger;

                // generateDE(tours);

                // console.log('matches', matches);
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
