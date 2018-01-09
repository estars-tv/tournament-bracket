import React, {Component, PropTypes, PureComponent} from "react";
import _ from "underscore";
import winningPathLength from "../utils/winning-path-length";
import BracketGame from "./bracket-game";
import Tours from "./tours";

const toBracketGames = ({GameComponent, game, x, y, gameDimensions, roundSeparatorWidth, round, lineInfo, homeOnTop, ...rest}) => {
    const {width: gameWidth, height: gameHeight} = gameDimensions;

    const ySep = gameHeight * Math.pow(2, round - 2);

    return [
        <g key={`${game.id}-${y}`}>
            <GameComponent
                {...rest} {...gameDimensions}
                key={game.id} homeOnTop={homeOnTop} game={game} x={x} y={y}/>
        </g>
    ].concat(
        _.chain(game.sides)
            .map((obj, side) => ({...obj, side}))
            .filter(({sourceGame}) => sourceGame !== null)
            .map(
                ({sourceGame, side}) => {

                    const isTop = side === 'teamOwner' ? homeOnTop : !homeOnTop,
                        multiplier = isTop ? -1 : 1;

                    const pathInfo = [
                        `M${x - lineInfo.separation} ${y + gameHeight / 2 + lineInfo.yOffset + multiplier * lineInfo.homeVisitorSpread}`,
                        `H${x - (roundSeparatorWidth / 2)}`,
                        `V${y + gameHeight / 2 + lineInfo.yOffset + ((ySep / 2) * multiplier)}`,
                        `H${x - roundSeparatorWidth}`
                    ];

                    //линия между матчами
                    return [
                        <path key={`${game.id}-${side}-${y}-path`} d={pathInfo.join(' ')} fill="transparent"
                              stroke="#fff" style={{transform: 'translateX(0px)'}}/>
                    ]
                        .concat(
                            toBracketGames(
                                {
                                    GameComponent,
                                    game: sourceGame,
                                    homeOnTop,
                                    lineInfo,
                                    gameDimensions,
                                    roundSeparatorWidth,
                                    //x: x - gameWidth - roundSeparatorWidth,
                                    x: x - gameWidth,
                                    y: y + ((ySep / 2) * multiplier),
                                    round: round - 1,
                                    ...rest
                                }
                            )
                        );
                }
            )
            .flatten(true)
            .value()
    );
};

/**
 * Displays the bracket that culminates in a particular finals game
 */
export default class Bracket extends Component {
    //todo propTypes

    static defaultProps = {
        GameComponent: BracketGame,

        homeOnTop: true,

        gameDimensions: {
            height: 80,
            width: 256
        },

        svgPadding: 20, // отступ между сетками (svg)
        roundSeparatorWidth: 15, // отступ до изгиба линии

        /**
         * lineInfo.separation - отступ между линиями и командами
         */
        lineInfo: {
            yOffset: -6,
            separation: 0,
            homeVisitorSpread: 0
        }
    };

    render() {
        const {GameComponent, game, countTours, gameDimensions, svgPadding, roundSeparatorWidth, ...rest} = this.props;

        const numRounds = winningPathLength(game);

        const svgDimensions = {
            height: (gameDimensions.height * Math.pow(2, numRounds - 1)) + svgPadding * 2,
            //height: (gameDimensions.height * Math.pow(2, numRounds - 1)),
            //width: (numRounds * (gameDimensions.width + roundSeparatorWidth)) + svgPadding * 2
            //width: numRounds * gameDimensions.width + svgPadding
            width: numRounds * gameDimensions.width
        };

        return (
            <div className="tours">
                <Tours count={countTours} svgHeight={svgDimensions.height}/>
                <svg {...svgDimensions} style={{position: 'absolute', top: '55px', left: 0}}>
                    <g>
                        {
                            toBracketGames(
                                {
                                    GameComponent,
                                    gameDimensions,
                                    roundSeparatorWidth,
                                    game,
                                    round: numRounds,
                                    //x: svgDimensions.width - svgPadding - gameDimensions.width, //отступ справа
                                    x: svgDimensions.width - gameDimensions.width, //отступ справа
                                    y: (svgDimensions.height / 2) - gameDimensions.height / 2, //вертикальное выравнивание
                                    ...rest
                                }
                            )
                        }
                    </g>
                </svg>
            </div>
        );
    }
}