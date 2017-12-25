import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import JSOG from 'jsog';
import _ from 'underscore';

import * as BracketGame from '../components/bracket-game';
import BracketGenerator from '../components/bracket-generator';

// team1
// team2
// team3
// team4
// team5
// team6
// team7
// team8
// team9
// team10
// team11
// team12
// team13
// team14
// team15
// team16
// team17
// team18
// team19
// team20
// team21
// team22
// team23
// team24
// team25
// team26
// team27
// team28
// team29
// team30
// team31
// team32
// team33
// team34
// team35
// team36
// team37
// team38
// team39
// team40
// team41
// team42
// team33
// team44
// team45
// team46
// team47
// team48
// team49
// team50
// team51
// team52
// team53
// team54
// team55
// team56
// team57
// team58
// team59
// team60
// team61
// team62
// team63
// team64
// team65
// team66
// team67
// team68
// team69
// team70
// team71
// team72
// team73
// team74
// team75
// team76
// team77
// team78
// team79
// team80


// const DEMO_DATA = {
//     upper: [
//         {
//             "@id": "0",
//             "id": "0",
//             "sides": {
//                 "teamGuest": {
//                     "name": 'team1',
//                     "score": 21,
//                     "sourceGame": null
//                 },
//                 "teamOwner": {
//                     "name": 'team2',
//                     "score": 42,
//                     "sourceGame": null
//                 }
//             }
//         },
//         {
//             "@id": "1",
//             "id": "1",
//             "sides": {
//                 "teamGuest": {
//                     "name": 'team3',
//                     "score": 21,
//                     "sourceGame": null
//                 },
//                 "teamOwner": {
//                     "name": 'team4',
//                     "score": 42,
//                     "sourceGame": null
//                 }
//             }
//         },
//         {
//             "@id": "2",
//             "id": "2",
//             "sides": {
//                 "teamGuest": {
//                     "name": 'team5',
//                     "score": 21,
//                     "sourceGame": null
//                 },
//                 "teamOwner": {
//                     "name": 'team6',
//                     "score": 42,
//                     "sourceGame": null
//                 }
//             }
//         },
//         {
//             "@id": "3",
//             "id": "3",
//             "sides": {
//                 "teamGuest": {
//                     "name": 'team7',
//                     "score": 21,
//                     "sourceGame": null
//                 },
//                 "teamOwner": {
//                     "name": 'team8',
//                     "score": 42,
//                     "sourceGame": null
//                 }
//             }
//         },
//         {
//             "@id": "4",
//             "id": "4",
//             "sides": {
//                 "teamGuest": {
//                     "name": 'team2',
//                     "score": 32,
//                     "sourceGame": {"@ref": "0"}
//                 },
//                 "teamOwner": {
//                     "name": 'team4',
//                     "score": 42,
//                     "sourceGame": {"@ref": "1"}
//                 }
//             }
//         },
//         {
//             "@id": "5",
//             "id": "5",
//             "sides": {
//                 "teamGuest": {
//                     "name": 'team6',
//                     "score": '42',
//                     "sourceGame": {"@ref": "2"}
//                 },
//                 "teamOwner": {
//                     "name": 'team8',
//                     "score": '0',
//                     "sourceGame": {"@ref": "3"}
//                 }
//             }
//         },
//         {
//             "@id": "6",
//             "id": "6",
//             "sides": {
//                 "teamGuest": {
//                     "name": 'team4',
//                     "score": '42',
//                     "sourceGame": {"@ref": "4"}
//                 },
//                 "teamOwner": {
//                     "name": 'team6',
//                     "score": '16',
//                     "sourceGame": {"@ref": "5"}
//                 }
//             }
//         },
//         {
//             "@id": "7",
//             "id": "7",
//             "sides": {
//                 "teamGuest": {
//                     "name": 'team1',
//                     "score": 21,
//                     "sourceGame": {'@ref': '0'}
//                 },
//                 "teamOwner": {
//                     "name": 'team3',
//                     "score": 42,
//                     "sourceGame": {'@ref': '1'}
//                 }
//             }
//         },
//         {
//             "@id": "8",
//             "id": "8",
//             "sides": {
//                 "teamGuest": {
//                     "name": 'team5',
//                     "score": 21,
//                     "sourceGame": {'@ref': '2'}
//                 },
//                 "teamOwner": {
//                     "name": 'team7',
//                     "score": 42,
//                     "sourceGame": {'@ref': '3'}
//                 }
//             }
//         },
//         {
//             "@id": "9",
//             "id": "9",
//             "sides": {
//                 "teamGuest": {
//                     "name": 'team8',
//                     "score": 21,
//                     "sourceGame": {'@ref': '4'}
//                 },
//                 "teamOwner": {
//                     "name": 'team5',
//                     "score": 42,
//                     "sourceGame": {'@ref': '7'}
//                 }
//             }
//         },
//         {
//             "@id": "10",
//             "id": "10",
//             "sides": {
//                 "teamGuest": {
//                     "name": 'team2',
//                     "score": 21,
//                     "sourceGame": {'@ref': '5'}
//                 },
//                 "teamOwner": {
//                     "name": 'team3',
//                     "score": 42,
//                     "sourceGame": {'@ref': '8'}
//                 }
//             }
//         },
//         {
//             "@id": "11",
//             "id": "11",
//             "sides": {
//                 "teamGuest": {
//                     "name": 'team3',
//                     "score": 32,
//                     "sourceGame": {"@ref": "0"}
//                 },
//                 "teamOwner": {
//                     "name": 'team6',
//                     "score": 42,
//                     "sourceGame": {"@ref": "1"}
//                 }
//             }
//         },
//         {
//             "@id": "12",
//             "id": "12",
//             "sides": {
//                 "teamGuest": {
//                     "name": 'team3',
//                     "score": 32,
//                     "sourceGame": {"@ref": "11"}
//                 },
//                 "teamOwner": {
//                     "name": 'team4',
//                     "score": 42,
//                     "sourceGame": {"@ref": "6"}
//                 }
//             }
//         }
//     ],
//     lower: [
//         {
//             "@id": "7",
//             "id": "7",
//             "sides": {
//                 "teamGuest": {
//                     "name": 'team1',
//                     "score": 21,
//                     "sourceGame": {'@ref': '0'}
//                 },
//                 "teamOwner": {
//                     "name": 'team3',
//                     "score": 42,
//                     "sourceGame": {'@ref': '1'}
//                 }
//             }
//         },
//         {
//             "@id": "8",
//             "id": "8",
//             "sides": {
//                 "teamGuest": {
//                     "name": 'team5',
//                     "score": 21,
//                     "sourceGame": {'@ref': '2'}
//                 },
//                 "teamOwner": {
//                     "name": 'team7',
//                     "score": 42,
//                     "sourceGame": {'@ref': '3'}
//                 }
//             }
//         },
//         {
//             "@id": "9",
//             "id": "9",
//             "sides": {
//                 "teamGuest": {
//                     "name": 'team8',
//                     "score": 21,
//                     "sourceGame": {'@ref': '4'}
//                 },
//                 "teamOwner": {
//                     "name": 'team5',
//                     "score": 42,
//                     "sourceGame": {'@ref': '7'}
//                 }
//             }
//         },
//         {
//             "@id": "10",
//             "id": "10",
//             "sides": {
//                 "teamGuest": {
//                     "name": 'team2',
//                     "score": 21,
//                     "sourceGame": {'@ref': '5'}
//                 },
//                 "teamOwner": {
//                     "name": 'team3',
//                     "score": 42,
//                     "sourceGame": {'@ref': '8'}
//                 }
//             }
//         },
//         {
//             "@id": "11",
//             "id": "11",
//             "sides": {
//                 "teamGuest": {
//                     "name": 'team3',
//                     "score": 32,
//                     "sourceGame": {"@ref": "0"}
//                 },
//                 "teamOwner": {
//                     "name": 'team6',
//                     "score": 42,
//                     "sourceGame": {"@ref": "1"}
//                 }
//             }
//         },
//         {
//             "@id": "12",
//             "id": "12",
//             "sides": {
//                 "teamGuest": {
//                     "name": 'team3',
//                     "score": 32,
//                     "sourceGame": {"@ref": "11"}
//                 },
//                 "teamOwner": {
//                     "name": 'team4',
//                     "score": 42,
//                     "sourceGame": {"@ref": "6"}
//                 }
//             }
//         }
//     ]
// };

// дабл на 4 команды

// const DEMO_DATA = {
//     upper: [
//         {
//             "@id": "0",
//             "id": "0",
//             "sides": {
//                 "teamOwner": {
//                     "name": 'team1',
//                     "score": 42,
//                     "sourceGame": null
//                 },
//                 "teamGuest": {
//                     "name": 'team2',
//                     "score": 21,
//                     "sourceGame": null
//                 }
//             }
//         },
//         {
//             "@id": "1",
//             "id": "1",
//             "sides": {
//                 "teamOwner": {
//                     "name": 'team3',
//                     "score": 16,
//                     "sourceGame": null
//                 },
//                 "teamGuest": {
//                     "name": 'team4',
//                     "score": 21,
//                     "sourceGame": null
//                 }
//             }
//         },
//         {
//             "@id": "2",
//             "id": "2",
//             "sides": {
//                 "teamOwner": {
//                     "name": 'team1',
//                     "score": 10,
//                     "sourceGame": {"@ref": "0"}
//                 },
//                 "teamGuest": {
//                     "name": 'team4',
//                     "score": 32,
//                     "sourceGame": {"@ref": "1"}
//                 }
//             }
//         },
//         {
//             "@id": "3",
//             "id": "3",
//             "sides": {
//                 "teamOwner": {
//                     "name": 'team2',
//                     "score": 10,
//                     "sourceGame": null
//                 },
//                 "teamGuest": {
//                     "name": 'team3',
//                     "score": 32,
//                     "sourceGame": null
//                 }
//             }
//         },
//         {
//             "@id": "4",
//             "id": "4",
//             "sides": {
//                 "teamOwner": {
//                     "name": 'team1',
//                     "score": 42,
//                     "sourceGame": null
//                 },
//                 "teamGuest": {
//                     "name": 'team3',
//                     "score": 52,
//                     "sourceGame": {"@ref": "3"}
//                 }
//             }
//         },
//         {
//             "@id": "5",
//             "id": "5",
//             "sides": {
//                 "teamOwner": {
//                     "name": 'team4',
//                     "score": null,
//                     "sourceGame": {"@ref": "2"}
//                 },
//                 "teamGuest": {
//                     "name": 'team3',
//                     "score": null,
//                     "sourceGame": {"@ref": "4"}
//                 }
//             }
//         }
//     ],
//     lower: []
// };

// дабл на 8

//teams = 8
// teams / 2 = 4; матчей изначально
// 12 матчей всего
// первые up 4 = null, up 2 = ref, d 2 = null, up 1 ref, d 1 ref, d 1 ref null, final 1 ref ref;
// teams / 2

const DEMO_DATA =
    [
        {
            "@id": "0",
            "id": "0",
            "sides": {
                "teamOwner": {
                    "name": 'team1',
                    "score": 42,
                    "sourceGame": null
                },
                "teamGuest": {
                    "name": 'team2',
                    "score": 21,
                    "sourceGame": null
                }
            }
        },
        {
            "@id": "1",
            "id": "1",
            "sides": {
                "teamOwner": {
                    "name": 'team3',
                    "score": 16,
                    "sourceGame": null
                },
                "teamGuest": {
                    "name": 'team4',
                    "score": 21,
                    "sourceGame": null
                }
            }
        },
        {
            "@id": "2",
            "id": "2",
            "sides": {
                "teamOwner": {
                    "name": 'team5',
                    "score": 16,
                    "sourceGame": null
                },
                "teamGuest": {
                    "name": 'team6',
                    "score": 21,
                    "sourceGame": null
                }
            }
        },
        {
            "@id": "3",
            "id": "3",
            "sides": {
                "teamOwner": {
                    "name": 'team7',
                    "score": 16,
                    "sourceGame": null
                },
                "teamGuest": {
                    "name": 'team8',
                    "score": 21,
                    "sourceGame": null
                }
            }
        },
        {
            "@id": "5",
            "id": "5",
            "sides": {
                "teamOwner": {
                    "name": 'team1',
                    "score": 16,
                    "sourceGame": {'@ref': 0}
                },
                "teamGuest": {
                    "name": 'team4',
                    "score": 21,
                    "sourceGame": {'@ref': 1}
                }
            }
        },
        {
            "@id": "6",
            "id": "6",
            "sides": {
                "teamOwner": {
                    "name": 'team6',
                    "score": 16,
                    "sourceGame": {'@ref': 2}
                },
                "teamGuest": {
                    "name": 'team8',
                    "score": 21,
                    "sourceGame": {'@ref': 3}
                }
            }
        },
        {
            "@id": "7",
            "id": "7",
            "sides": {
                "teamOwner": {
                    "name": 'team2',
                    "score": 16,
                    "sourceGame": null
                },
                "teamGuest": {
                    "name": 'team3',
                    "score": 21,
                    "sourceGame": null
                }
            }
        },
        {
            "@id": "8",
            "id": "8",
            "sides": {
                "teamOwner": {
                    "name": 'team5',
                    "score": 16,
                    "sourceGame": null
                },
                "teamGuest": {
                    "name": 'team7',
                    "score": 21,
                    "sourceGame": null
                }
            }
        },
        {
            "@id": "9",
            "id": "9",
            "sides": {
                "teamOwner": {
                    "name": 'team4',
                    "score": 16,
                    "sourceGame": {'@ref': 5}
                },
                "teamGuest": {
                    "name": 'team8',
                    "score": 21,
                    "sourceGame": {'@ref': 6}
                }
            }
        },
        {
            "@id": "10",
            "id": "10",
            "sides": {
                "teamOwner": {
                    "name": 'team3',
                    "score": 16,
                    "sourceGame": {'@ref': 7}
                },
                "teamGuest": {
                    "name": 'team7',
                    "score": 21,
                    "sourceGame": {'@ref': 8}
                }
            }
        },
        {
            "@id": "11",
            "id": "11",
            "sides": {
                "teamOwner": {
                    "name": 'team4',
                    "score": 16,
                    "sourceGame": null
                },
                "teamGuest": {
                    "name": 'team7',
                    "score": 21,
                    "sourceGame": {'@ref': 10}
                }
            }
        },
        {
            "@id": "12",
            "id": "12",
            "sides": {
                "teamOwner": {
                    "name": 'team8',
                    "score": 16,
                    "sourceGame": {'@ref': 9}
                },
                "teamGuest": {
                    "name": 'team7',
                    "score": 21,
                    "sourceGame": {'@ref': 11}
                }
            }
        }
    ];


// const GAMES = JSOG.decode(DEMO_DATA);
// const ROOT = _.findWhere(GAMES, {'id': '6'});
//
// console.log('GAMES', GAMES);
// console.log('ROOT', ROOT);

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

        // <Redirect to='/'/> : ниже там где сейчас первый div

        return tournament.tours.length === 0 ?
            <div>
                <h1>bracket is there!</h1>
                <BracketGenerator GameComponent={GameComponent} games={JSOG.decode(DEMO_DATA)}/>
            </div> :
            <div>
                <h1>bracket is there!</h1>
                <BracketGenerator GameComponent={GameComponent} games={JSOG.decode(tournament.bracketModel)}/>
            </div>
    }
}

export default TournamentBracket;
