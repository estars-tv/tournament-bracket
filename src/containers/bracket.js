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
        "name": "B1",
        "sides": {
            "visitor": {
                "team": 'team1',
                "score": 21,
                "sourceGame": null,
                "seed": {}
            },
            "home": {
                "team": 'team2',
                "score": 42,
                "sourceGame": null,
                "seed": {}
            }
        }
    },
    {
        "@id": "1",
        "id": "1",
        "name": "B1",
        "sides": {
            "visitor": {
                "team": 'team3',
                "score": 21,
                "sourceGame": null,
                "seed": {}
            },
            "home": {
                "team": 'team3',
                "score": 42,
                "sourceGame": null,
                "seed": {}
            }
        }
    },
    {
        "@id": "2",
        "id": "2",
        "name": "B1",
        "sides": {
            "visitor": {
                "team": 'team3',
                "score": 21,
                "sourceGame": null,
                "seed": {}
            },
            "home": {
                "team": 'team3',
                "score": 42,
                "sourceGame": null,
                "seed": {}
            }
        }
    },
    {
        "@id": "3",
        "id": "3",
        "name": "B1",
        "sides": {
            "visitor": {
                "team": 'team3',
                "score": 21,
                "sourceGame": null,
                "seed": {}
            },
            "home": {
                "team": 'team3',
                "score": 42,
                "sourceGame": null,
                "seed": {}
            }
        }
    },
    {
        "@id": "4",
        "id": "4",
        "name": "B1",
        "sides": {
            "visitor": {
                "team": 'team3',
                "score": 42,
                "sourceGame": {"@ref": "0"},
                "seed": {}
            },
            "home": {
                "team": 'team3',
                "score": 42,
                "sourceGame": {"@ref": "1"},
                "seed": {}
            }
        }
    },
    {
        "@id": "5",
        "id": "5",
        "name": "B1",
        "sides": {
            "visitor": {
                "team": 'team3',
                "score": 42,
                "sourceGame": {"@ref": "2"},
                "seed": {}
            },
            "home": {
                "team": 'team3',
                "score": 42,
                "sourceGame": {"@ref": "3"},
                "seed": {}
            }
        }
    },
    {
        "@id": "6",
        "id": "6",
        "name": "B1",
        "sides": {
            "visitor": {
                "team": 'team3',
                "score": 42,
                "sourceGame": {"@ref": "4"},
                "seed": {}
            },
            "home": {
                "team": 'team3',
                "score": 42,
                "sourceGame": {"@ref": "5"},
                "seed": {}
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
