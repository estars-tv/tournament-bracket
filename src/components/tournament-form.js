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
            const upperBracket = tours.upper;

            for (let i = 1; i < upperBracket.length; i++) {
                // tours.lower[i] = [];

                const currUpperTour = upperBracket[i],
                    currUpperCount = currUpperTour.length;

                console.log('currUpperCount', currUpperCount);

                if (currUpperCount === 1) {
                    const firstWinnersTour = upperBracket[i - 1],
                        countFirstWinnersTour = firstWinnersTour.length;

                    for (let n = 0; n < countFirstWinnersTour / 2; n++) {
                        const firstMatch = firstWinnersTour[n],
                            secondMath = firstWinnersTour[n + 1],
                            firstMatchLoser = getMatchLoser(firstMatch),
                            secondMatchLoser = getMatchLoser(secondMath),
                            winnersId = upperBracket[i].length > 0 ?
                                upperBracket[i][upperBracket[i].length - 1].id + 1 : firstWinnersTour[countFirstWinnersTour - 1].id + 1,
                            losersId = winnersId,
                            losers = {
                                id: losersId,
                                sides: {
                                    teamOwner: {
                                        name: firstMatchLoser,
                                        score: null,
                                        sourceGame: null
                                    },
                                    teamGuest: {
                                        name: secondMatchLoser,
                                        score: null,
                                        sourceGame: null
                                    }
                                }
                            };

                        // tours.lower[i].push(losers);
                    }

                    function losersFinal() {
                        // console.log('tours', tours);
                        // console.log('upper', tours.upper);
                        // console.log('lower', tours.lower);
                        // console.log('upper w', tours.upper[i][0]);
                        // console.log('lower w', tours.lower[i][0]);

                        const lowerMatch = tours.lower[i][0],
                            upperMatch = tours.upper[i][0],
                            firstMatchWinner = getMatchWinner(lowerMatch),
                            secondMatchLoser = getMatchLoser(upperMatch),
                            firstMatchSource = lowerMatch.id,
                            secondMatchSource = upperMatch.id,
                            losers = {
                                id: lowerMatch.id + 1,
                                sides: {
                                    teamOwner: {
                                        name: secondMatchLoser,
                                        score: null,
                                        sourceGame: {
                                            '@ref': secondMatchSource
                                        }
                                    },
                                    teamGuest: {
                                        name: firstMatchWinner,
                                        score: null,
                                        sourceGame: {
                                            '@ref': firstMatchSource
                                        }
                                    }
                                }
                            };

                        console.log('losers', losers);

                        // if (!tours.lower[i + 1]) tours.lower[i + 1] = [];
                        // tours.lower[i + 1].push(losers);
                        tours.lower[i].push(losers);
                    }

                    function final() {
                        const losersMatch = tours.lower[i][tours.lower[i].length - 1],
                            winnersMatch = tours.upper[i][tours.upper[i].length - 1],
                            firstMatchWinner = getMatchWinner(losersMatch),
                            secondMatchWinner = getMatchWinner(winnersMatch),
                            firstMatchSource = losersMatch.id,
                            losers = {
                                id: losersMatch.id + 1,
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
                                        sourceGame: null
                                    }
                                }
                            };

                        console.log('losers', losers);

                        tours.lower[i].push(losers);
                    }

                    // losersFinal();
                    // final();
                } else {
                    const winners = upperBracket[i - 1];
                    // losers = tours.lower[i];

                    let prevMatchId;

                    tours.lower[1] = [];

                    function firstLowerTour() {
                        for (let n = 0; n < winners.length; n += 2) {
                            const firstLoserMatch = winners[n],
                                secondLoserMatch = winners[n + 1],
                                firstLoserName = getMatchLoser(firstLoserMatch),
                                secondLoserName = getMatchLoser(secondLoserMatch),
                                lastUpperTour = upperBracket[upperBracket.length - 1],
                                lastUpperMatch = lastUpperTour[lastUpperTour.length - 1],
                                prevMatchId = prevMatchId ? prevMatchId + 1 : lastUpperMatch.id + 1,
                                losers = {
                                    id: prevMatchId,
                                    sides: {
                                        teamOwner: {
                                            name: firstLoserName,
                                            score: null,
                                            sourceGame: null
                                        },
                                        teamGuest: {
                                            name: secondLoserName,
                                            score: null,
                                            sourceGame: null
                                        }
                                    }
                                };

                            // console.log('upperBracket.length ', upperBracket.length);
                            // console.log('upperBracket[upperBracket.length - 1] ', upperBracket[upperBracket.length - 1]);
                            // console.log('upperBracket[upperBracket.length - 1].id', upperBracket[upperBracket.length - 1].id);

                            tours.lower[i].push(losers);

                            // console.log('firstLoserMatch', firstLoserMatch);
                            // console.log('secondLoserMatch', secondLoserMatch);

                            debugger;
                        }
                    }

                    firstLowerTour();
                    winnersFromLowerLosersFromUpper();

                    function winnersFromLowerLosersFromUpper() {
                        const countLower = tours.lower.length;

                        for (let n = 0; n < countLower; n++) {
                            const winners = tours.upper[countLower - 1][n],
                                losers = tours.lower[countLower - 1][n],
                                firstMatchLoser = getMatchLoser(winners),
                                secondMatchWinner = getMatchWinner(losers),
                                lastLowerTour = tours.lower[countLower - 1],
                                countLowerTourMatches = lastLowerTour.length,
                                matchId = lastLowerTour[countLowerTourMatches - 1].id,
                                match = {
                                    id: matchId + 1,
                                    sides: {
                                        teamOwner: {
                                            name: firstMatchLoser,
                                            score: null,
                                            sourceGame: null
                                        },
                                        teamGuest: {
                                            name: secondMatchWinner,
                                            score: null,
                                            sourceGame: {
                                                '@ref': losers.id
                                            }
                                        }
                                    }
                                };

                            console.log('winnersFromLower winners', winners);
                            console.log('winnersFromLower losers', losers);

                            tours.lower[countLower - 1].push(match);

                            debugger;
                            prevMatchId = matchId + 1;
                        }


                        // for (let n = 0; n < winners.length; n += 2) {
                        //     const upperMatch = tours.upper[i][n],
                        //         lowerMatch = tours.lower[i][n];
                        //
                        //     console.log('upperMatch', upperMatch);
                        //     console.log('lowerMatch', lowerMatch);
                        //     debugger;
                        //     firstMatchWinner = getMatchWinner(lowerMatch),
                        //     secondMatchLoser = getMatchLoser(upperMatch),
                        //     firstMatchSource = lowerMatch.id,
                        //     secondMatchSource = upperMatch.id,
                        //     losers = {
                        //         id: lowerMatch.id + 1,
                        //         sides: {
                        //             teamOwner: {
                        //                 name: secondMatchLoser,
                        //                 score: null,
                        //                 sourceGame: {
                        //                     '@ref': secondMatchSource
                        //                 }
                        //             },
                        //             teamGuest: {
                        //                 name: firstMatchWinner,
                        //                 score: null,
                        //                 sourceGame: {
                        //                     '@ref': firstMatchSource
                        //                 }
                        //             }
                        //         }
                        //     };
                        //
                        //     tours.lower[i].push(losers);
                        // }
                    }

//                     for (let n = 0; n < currUpperCount; n++) {
// debugger;
//                         const firstLoserMatch = currUpperTour[increment],
//                             secondLoserMatch = currUpperTour[increment + 1],
//                             firstLoserName = getMatchLoser(firstLoserMatch),
//                             secondLoserName = getMatchLoser(secondLoserMatch),
//                             firstMatchSource = firstLoserMatch.id,
//                             secondMatchSource = secondLoserMatch.id,
//                             matchId = tours.lower.length > 0 ? tours.lower[tours.lower.length - 1].id
//                                 : upperBracket[upperBracket.length - 1][currUpperCount - 1].id,
//                             losers = {
//                                 id: matchId,
//                                 sides: {
//                                     teamOwner: {
//                                         name: firstLoserName,
//                                         score: null,
//                                         sourceGame: null
//                                     },
//                                     teamGuest: {
//                                         name: secondLoserName,
//                                         score: null,
//                                         sourceGame: null
//                                     }
//                                 }
//                             };
//                         debugger;
//                         tours.lower[i].push(losers);
//
//                         debugger;
//
//                         // const upperLoser = upper[i + 1][n],
//                         //     lowerWinner = match,
//                         //     m2 = {
//                         //         upperLoser: upperLoser,
//                         //         lowerWinner: lowerWinner
//                         //     };
//                         //
//                         // tours.lower[i + 1].push(m2);
//
//                         increment += 2;
//                     }
                }
            }

            let prevMatchId;

            for (let i = 2; i < tours.upper.length; i++) {
                const currentUpperTour = tours.upper[i],
                    currentLowerTour = tours.lower[i - 1];
                debugger;
                tours.lower[i] = [];

                for (let n = 0; n < currentLowerTour.length; n += 2) {
                    debugger;
                    const firstWinnerMatch = currentLowerTour[n],
                        secondWinnerMatch = currentLowerTour[n + 1],
                        firstWinnerName = getMatchWinner(firstWinnerMatch),
                        secondWinnerName = getMatchWinner(secondWinnerMatch),
                        lastLowerTour = currentLowerTour,
                        countLowerTourMatches = lastLowerTour.length,
                        matchId = lastLowerTour[countLowerTourMatches - 1].id,
                        winners = {
                            id: prevMatchId ? prevMatchId + 1 : matchId + 1,
                            sides: {
                                teamOwner: {
                                    name: firstWinnerName,
                                    score: null,
                                    sourceGame: {
                                        '@ref': firstWinnerMatch.id
                                    }
                                },
                                teamGuest: {
                                    name: secondWinnerName,
                                    score: null,
                                    sourceGame: {
                                        '@ref': secondWinnerMatch.id
                                    }
                                }
                            }
                        },
                        countCurrentUpperTour = currentUpperTour.length;
                    debugger;

                    console.log('countCurrentUpperTour', countCurrentUpperTour);

                    tours.lower[i].push(winners);
                    prevMatchId = matchId + 1;

                    if (countCurrentUpperTour > 1) {
                        const upperLoser = getMatchLoser(currentUpperTour[n]),
                            lowerWinner = getMatchWinner(winners),
                            match = {
                                id: prevMatchId + 1,
                                sides: {
                                    teamOwner: {
                                        name: upperLoser,
                                        score: null,
                                        sourceGame: null
                                    },
                                    teamGuest: {
                                        name: lowerWinner,
                                        score: null,
                                        sourceGame: {
                                            '@ref': winners.id
                                        }
                                    }
                                }
                            };

                        if (!tours.lower[i + 1]) tours.lower[i + 1] = [];

                        tours.lower[i + 1].push(match);
                        prevMatchId = prevMatchId + 1;
                    } else {
                        const upperLoser = getMatchLoser(currentUpperTour[0]),
                            lowerWinner = getMatchWinner(winners),
                            match = {
                                id: prevMatchId + 1,
                                sides: {
                                    teamOwner: {
                                        name: upperLoser,
                                        score: null,
                                        sourceGame: null
                                    },
                                    teamGuest: {
                                        name: lowerWinner,
                                        score: null,
                                        sourceGame: {
                                            '@ref': winners.id
                                        }
                                    }
                                }
                            };

                        if (!tours.lower[i + 1]) tours.lower[i + 1] = [];

                        tours.lower[i + 1].push(match);
                        prevMatchId = prevMatchId + 1;
                    }

                    debugger;
                }
            }

            console.log('lower tours', tours);
        }


        // function generateLosers(tours) {
        //     console.log('generateLosers tours', tours);
        //
        //     const upperTours = tours.upper,
        //         countUpperTours = upperTours.length,
        //         lowerTours = tours.lower,
        //         countLowerTours = lowerTours.length;
        //
        //     console.log('countUpperTours', countUpperTours);
        //     console.log('countLowerTours', countLowerTours);
        //
        //     for (let i = 0; i < countUpperTours; i++) {
        //         const upperTour = upperTours[countUpperTours - 1],
        //             countUpperTour = upperTour.length;
        //
        //         tours.lower[i] = [];
        //
        //         if (i === 0) {
        //             const firstWinnersTour = upperTours[0],
        //                 countFirstWinnersTour = firstWinnersTour.length;
        //
        //             for (let n = 0; n < countFirstWinnersTour / 2; n++) {
        //                 const firstMatch = firstWinnersTour[n],
        //                     secondMath = firstWinnersTour[n + 1],
        //                     // firstMatchWinner = getMatchWinner(firstMatch),
        //                     // secondMatchWinner = getMatchWinner(secondMath),
        //                     firstMatchLoser = getMatchLoser(firstMatch),
        //                     secondMatchLoser = getMatchLoser(secondMath),
        //                     firstMatchSource = firstMatch.id,
        //                     secondMatchSource = secondMath.id,
        //                     winnersId = upperTours[i].length > 0 ?
        //                         upperTours[i][upperTours[i].length - 1].id + 1 : firstWinnersTour[countFirstWinnersTour - 1].id + 1,
        //                     losersId = winnersId + 1,
        //                     losers = {
        //                         id: losersId,
        //                         sides: {
        //                             teamOwner: {
        //                                 name: firstMatchLoser,
        //                                 score: null,
        //                                 sourceGame: null
        //                                 // sourceGame: {
        //                                 //     '@ref': firstMatchSource
        //                                 // }
        //                             },
        //                             teamGuest: {
        //                                 name: secondMatchLoser,
        //                                 score: null,
        //                                 sourceGame: null
        //                                 // sourceGame: {
        //                                 //     '@ref': secondMatchSource
        //                                 // }
        //                             }
        //                         }
        //                     };
        //
        //                 tours.lower[i].push(losers);
        //             }
        //         }
        //
        //         if (countUpperTour === 1 && i > 0) {
        //             /*если впервые в N туре количество матчей равно 1, то строим в такой последовательности:
        //             сверху снизу, и финал сверху снизу (для 4 команд не подходит из-за впервые,
        //                 возможно спасет иф)*/
        //
        //             function losersFinal() {
        //                 // console.log('tours', tours);
        //                 // console.log('upper', tours.upper);
        //                 // console.log('lower', tours.lower);
        //                 // console.log('upper w', tours.upper[i][0]);
        //                 // console.log('lower w', tours.lower[i - 1][0]);
        //
        //                 const lowerMatch = tours.lower[i - 1][0],
        //                     upperMatch = tours.upper[i][0],
        //                     firstMatchWinner = getMatchWinner(lowerMatch),
        //                     secondMatchLoser = getMatchLoser(upperMatch),
        //                     firstMatchSource = lowerMatch.id,
        //                     secondMatchSource = upperMatch.id,
        //                     winnersId = upperTours[i].length > 0 ?
        //                         upperTours[i][upperTours[i].length - 1].id + 1 : lowerMatch.id + 1,
        //                     losersId = winnersId + 1,
        //                     losers = {
        //                         id: losersId,
        //                         sides: {
        //                             teamOwner: {
        //                                 name: secondMatchLoser,
        //                                 score: null,
        //                                 sourceGame: {
        //                                     '@ref': secondMatchSource
        //                                 }
        //                             },
        //                             teamGuest: {
        //                                 name: firstMatchWinner,
        //                                 score: null,
        //                                 sourceGame: {
        //                                     '@ref': firstMatchSource
        //                                 }
        //                             }
        //                         }
        //                     };
        //
        //                 console.log('losers', losers);
        //
        //                 // if (!tours.lower[i + 1]) tours.lower[i + 1] = [];
        //                 // tours.lower[i + 1].push(losers);
        //                 tours.lower[i].push(losers);
        //             }
        //
        //             function finalMatch() {
        //                 console.log('finalMatch tours', tours);
        //
        //                 const losersMatch = tours.lower[i][0],
        //                     winnersMatch = tours.upper[i][0],
        //                     firstMatchWinner = getMatchWinner(losersMatch),
        //                     secondMatchWinner = getMatchWinner(winnersMatch),
        //                     firstMatchSource = losersMatch.id,
        //                     winnersId = upperTours[i].length > 0 ?
        //                         upperTours[i][upperTours[i].length - 1].id + 1 : losersMatch.id + 1,
        //                     losersId = winnersId + 2,
        //                     losers = {
        //                         id: losersId,
        //                         sides: {
        //                             teamOwner: {
        //                                 name: firstMatchWinner,
        //                                 score: null,
        //                                 sourceGame: {
        //                                     '@ref': firstMatchSource
        //                                 }
        //                             },
        //                             teamGuest: {
        //                                 name: secondMatchWinner,
        //                                 score: null,
        //                                 sourceGame: null
        //                             }
        //                         }
        //                     };
        //
        //                 console.log('losers', losers);
        //
        //                 tours.lower[i].push(losers);
        //             }
        //
        //             losersFinal();
        //             finalMatch();
        //         }
        //
        //         if (countLowerTours > 0 && i > 0) {
        //
        //                 // firstMatchWinner = getMatchWinner(lowerMatch),
        //                 // secondMatchLoser = getMatchLoser(upperMatch),
        //             debugger;
        //         }
        //     }
        //
        //     console.log('losers tours', tours);
        // }

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
                                secondLoserName = getMatchWinner(secondLoser),
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
                    const lastLowerTour = lower[lower.length - 1],
                        firstWinner = lastLowerTour[0],
                        secondWinner = lastLowerTour[1],
                        firstWinnerName = getMatchWinner(firstWinner),
                        secondWinnerName = getMatchWinner(secondWinner);

                    if (!tours.lower[i + 1]) tours.lower[i + 1] = [];

                    const winnersOfLosers = createMatch({
                        id: matchIdIncrement,
                        ownerName: firstWinnerName,
                        guestName: secondWinnerName,
                        ownerSource: {'@ref': firstWinner.id},
                        guestSource: {'@ref': secondWinner.id}
                    });

                    tours.lower[i + 1].push(winnersOfLosers);

                    matchIdIncrement++;

                    //финал лузеров
                    const lastUpperTour = upper[upper.length - 1],
                        upperLoser = lastUpperTour[0],
                        upperWinner = lastUpperTour[0],
                        upperLoserName = getMatchLoser(upperLoser),
                        upperWinnerName = getMatchWinner(upperWinner),
                        lowerWinnerName = getMatchWinner(winnersOfLosers);

                    const losersFinal = createMatch({
                        id: matchIdIncrement,
                        ownerName: upperLoserName,
                        guestName: lowerWinnerName,
                        guestSource: {'@ref': winnersOfLosers.id}
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
                    winners = generateTours(matches),
                    tours = {
                        upper: winners,
                        lower: []
                    };
                // losers = generateLosers(tours),
                // bracketModel = modelToGraph(tours);

                lowerBracket(tours);

                console.log('tours onclick', tours);

                // generateDE(tours);

                // console.log('matches', matches);
                // console.log('tours', tours);

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
