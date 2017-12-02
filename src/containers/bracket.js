import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

class Bracket extends Component {
    render() {
        const tournament = this.props.tournament;

        return tournament.name === "" || tournament.tours.length === 0 ?
            <Redirect to='/'/> :
            <h1>bracket is there!</h1>;
    }
}

export default Bracket;
