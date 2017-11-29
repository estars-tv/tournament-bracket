import actions from '../constants/action-types';
import removeEmptyElements from '../utils';

function changeTitle(title) {
    return {
        type: actions.CHANGE_TITLE,
        title: title
    };
}

function createTournament(name, type, teams) {
    const teamsArr = removeEmptyElements(teams.split('\n')),
        counter = teamsArr.length,
        tournamentType = parseInt(type);

    return {
        type: actions.CREATE_TOURNAMENT,
        tournamentName: name,
        tournamentType: tournamentType,
        teams: teamsArr,
        counter: counter,
        tours: []
    };
}

export {changeTitle, createTournament};