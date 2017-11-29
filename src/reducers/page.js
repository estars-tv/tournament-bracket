import actions from '../constants/action-types';

const initialState = {
    title: 'Создайте турнирную сетку'
};

export default function page(state = initialState, action) {
    switch (action.type) {
        case actions.CHANGE_TITLE:
            return {...state, title: action.title}

        default:
            return state;
    }
};