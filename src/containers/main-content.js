import React, {Component} from 'react';
import {Route} from 'react-router-dom';

import CreateTournament from '../components/tournament-form';
// import Bracket from "./bracket";

import Bracket from '../containers/bracket';

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
                return (<Bracket {...props} tournament={tournament}/>);
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
