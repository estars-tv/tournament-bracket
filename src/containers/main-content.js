import React, {Component} from 'react';
import {Route} from 'react-router-dom';
// import Bracket from '../components/Bracket';
// import BracketGame from '../components/BracketGame';
// import BracketGenerator from '../components/BracketGenerator';
// import GameShape from '../components/GameShape';

import CreateTournament from '../components/tournament-form';
// import Bracket from "./bracket";

import TournamentBracket from '../containers/bracket';

class MainContent extends Component {
    render() {
        const actions = this.props.actions,
            tournament = this.props.tournament,
            WrappedCreateTournament = function (props) {
                // Конструкция "{...props}" нужна, чтобы не потерять
                // параметры, переданные от компонента Route
                return (<CreateTournament {...props} actions={actions}/>);
            },
            WrappedBracket = function (props) {
                // Конструкция "{...props}" нужна, чтобы не потерять
                // параметры, переданные от компонента Route
                return (<TournamentBracket {...props} tournament={tournament}/>);
            };

        return (
            <section className={'container'}>
                <Route exact={true} path='/' component={WrappedCreateTournament}/>
                <Route exact={true} path='/bracket' component={WrappedBracket}/>
            </section>
        );
    }
}

export default MainContent;
