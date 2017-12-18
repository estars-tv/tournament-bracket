import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import JSOG from 'jsog';
import _ from 'underscore';

import * as BracketGame from '../components/bracket-game';
import BracketGenerator from '../components/bracket-generator';

const DEMO_DATA = [
    {
        "@id": "0",
        "id": "0",
        "sides": {
            "teamGuest": {
                "name": 'team1',
                "score": 21,
                "sourceGame": null
            },
            "teamOwner": {
                "name": 'team2',
                "score": 42,
                "sourceGame": null
            }
        }
    },
    {
        "@id": "1",
        "id": "1",
        "sides": {
            "teamGuest": {
                "name": 'team3',
                "score": 21,
                "sourceGame": null
            },
            "teamOwner": {
                "name": 'team3',
                "score": 42,
                "sourceGame": null
            }
        }
    },
    {
        "@id": "2",
        "id": "2",
        "sides": {
            "teamGuest": {
                "name": 'team3',
                "score": 21,
                "sourceGame": null
            },
            "teamOwner": {
                "name": 'team3',
                "score": 42,
                "sourceGame": null
            }
        }
    },
    {
        "@id": "3",
        "id": "3",
        "sides": {
            "teamGuest": {
                "name": 'team3',
                "score": 21,
                "sourceGame": null
            },
            "teamOwner": {
                "name": 'team3',
                "score": 42,
                "sourceGame": null
            }
        }
    },
    {
        "@id": "4",
        "id": "4",
        "sides": {
            "teamGuest": {
                "name": 'team3',
                "score": 42,
                "sourceGame": {"@ref": "0"}
            },
            "teamOwner": {
                "name": 'team3',
                "score": 42,
                "sourceGame": {"@ref": "1"}
            }
        }
    },
    {
        "@id": "5",
        "id": "5",
        "sides": {
            "teamGuest": {
                "name": 'team3',
                "score": 42,
                "sourceGame": {"@ref": "2"}
            },
            "teamOwner": {
                "name": 'team3',
                "score": 42,
                "sourceGame": {"@ref": "3"}
            }
        }
    },
    {
        "@id": "6",
        "id": "6",
        "sides": {
            "teamGuest": {
                "name": 'team3',
                "score": 42,
                "sourceGame": {"@ref": "4"}
            },
            "teamOwner": {
                "name": 'team3',
                "score": 42,
                "sourceGame": {"@ref": "5"}
            }
        }
    }
];

const GAMES = JSOG.decode(DEMO_DATA);
const ROOT = _.findWhere(GAMES, {'id': '6'});

console.log('GAMES', GAMES);
console.log('ROOT', ROOT);

const changeHoveredTeamId = hoveredTeamId => this.setState({hoveredTeamId});

const handleClick = game => alert('clicked game: ' + game.name);

const gameComponent = props => {
    return (
        <BracketGame
            {...props}
            onHoveredTeamIdChange={hoveredTeamId => this.setState({hoveredTeamId})}
            onClick={() => this.handleClick(props.game)}
            hoveredTeamId={this.state.hoveredTeamId}/>
    );
};

class TournamentBracket extends Component {
    render() {
        const tournament = this.props.tournament;
        const {gameComponent: GameComponent} = this;

        return tournament.tours.length === 0 ?
            <Redirect to='/'/> :
            <div>
                <h1>bracket is there!</h1>
                <BracketGenerator GameComponent={GameComponent} games={GAMES}/>
            </div>
    }
}

export default TournamentBracket;
