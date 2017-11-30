import actions from '../constants/action-types';
import removeEmptyElements from '../utils';

function displayError(errorText) {
    return {
        type: actions.DISPLAY_ERROR,
        errorLabel: errorText
    };
}

function changeTitle(title) {
    return {
        type: actions.CHANGE_TITLE,
        title: title
    };
}

function createTournament(name, type, teams) {
    const tournamentType = parseInt(type),
        teamsCounter = teams.length;

    return {
        type: actions.CREATE_TOURNAMENT,
        tournamentName: name,
        tournamentType: tournamentType,
        teams: teams,
        counter: teamsCounter,
        tours: []
    };
}

export {changeTitle, createTournament, displayError};