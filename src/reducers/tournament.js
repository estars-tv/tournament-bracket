import actions from '../constants/action-types';

const initialState = {
    name: '',
    type: null,
    teams: [],
    counter: 0,
    tours: []
};

export default function tournament(state = initialState, action) {
    switch (action.type) {
        case actions.CREATE_TOURNAMENT:
            return {
                ...state,
                name: action.tournamentName,
                type: action.tournamentType,
                teams: action.teams,
                counter: action.counter,
                tours: action.tours
            };

        default:
            return state;
    }
};