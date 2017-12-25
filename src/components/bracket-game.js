import React, {PropTypes, PureComponent} from "react";
import controllable from "react-controllables";
import _ from "underscore";
// import moment from "moment";

import {RectClipped} from "./clipped";
import GameShape, {teamOwner, teamGuest} from "./game-shape";

class BracketGame extends PureComponent {
    // static propTypes = {
    //     game: GameShape.isRequired,
    //
    //     homeOnTop: PropTypes.bool,
    //
    //     hoveredTeamId: PropTypes.string,
    //     onHoveredTeamIdChange: PropTypes.func.isRequired,
    //
    //     styles: PropTypes.shape(
    //         {
    //             backgroundColor: PropTypes.string.isRequired,
    //             hoverBackgroundColor: PropTypes.string.isRequired,
    //             scoreBackground: PropTypes.string.isRequired,
    //             winningScoreBackground: PropTypes.string.isRequired,
    //             teamNameStyle: PropTypes.object.isRequired,
    //             teamScoreStyle: PropTypes.object.isRequired,
    //             gameNameStyle: PropTypes.object.isRequired,
    //             teamSeparatorStyle: PropTypes.object.isRequired
    //         }
    //     ),
    //
    //     topText: PropTypes.func,
    //     bottomText: PropTypes.func,
    // };

    static defaultProps = {
        homeOnTop: true,
        hoveredTeamId: null,

        styles: {
            backgroundColor: '#484848',
            hoverBackgroundColor: '#222',

            scoreBackground: '#757575',
            winningScoreBackground: '#ff7324',
            teamNameStyle: {fill: '#fff', fontSize: 12, textShadow: '1px 1px 1px #222'},
            teamScoreStyle: {fill: '#23252d', fontSize: 12},
            gameNameStyle: {fill: '#999', fontSize: 10},
            gameTimeStyle: {fill: '#999', fontSize: 10},
            teamSeparatorStyle: {stroke: '#2c2c2c', strokeWidth: 1}
        },

        // topText: ({scheduled}) => moment(scheduled).format('l LT'),
        topText: ({scheduled}) => scheduled,
        bottomText: ({name, bracketLabel}) => _.compact([name, bracketLabel]).join(' - '),
    };

    render() {
        const {
            game,

            hoveredTeamId,
            onHoveredTeamIdChange,

            styles: {
                backgroundColor,
                hoverBackgroundColor,
                scoreBackground,
                winningScoreBackground,
                teamNameStyle,
                teamScoreStyle,
                gameNameStyle,
                gameTimeStyle,
                teamSeparatorStyle
            },

            homeOnTop,

            topText, bottomText,

            ...rest
        } = this.props;

        const {sides} = game;

        debugger;

        const top = sides[homeOnTop ? teamOwner : teamGuest],
            bottom = sides[homeOnTop ? teamGuest : teamOwner];

        const winnerBackground = (top && bottom && top.score && bottom.score && top.score !== bottom.score) ?
            (
                top.score > bottom.score ?
                    <rect x="0" y="12" width="30" height="22.5" style={{fill: winningScoreBackground}} rx="3" ry="3"/> :
                    <rect x="0" y="34.5" width="30" height="22.5" style={{fill: winningScoreBackground}} rx="3" ry="3"/>
            ) :
            null;

        const Side = ({x, y, side, onHover}) => {
            // const tooltip = side.seed && side.team ? <title>{side.seed.displayName}</title> : null;
            const tooltip = side.name ? <title>{side.name}</title> : null;

            return (
                <g onMouseEnter={() => onHover(side && side.name ? side.name.id : null)}
                   onMouseLeave={() => onHover(null)}>
                    {/* trigger mouse events on the entire block */}
                    <rect x={x} y={y} height={22.5} width={200} fillOpacity={0}>
                        {tooltip}
                    </rect>

                    <RectClipped x={x} y={y} height={22.5} width={165}>
                        <text x={x + 5} y={y + 16}
                            // style={{ ...teamNameStyle, fontStyle: side.seed && side.seed.sourcePool ? 'italic' : null }}>
                              style={{...teamNameStyle, fontStyle: null}}>
                            {tooltip}
                            {/*{side.team ? side.team.name : (side.seed ? side.seed.displayName : null)}*/}
                            {side.name || null}
                        </text>
                    </RectClipped>

                    <text x={x / 2} y={y + 16} style={teamScoreStyle} textAnchor="middle">
                        {side.score ? side.score : null}
                    </text>
                </g>
            );
        };

        const topHovered = (top && top.name && top.name.id === hoveredTeamId),
            bottomHovered = (bottom && bottom.name && bottom.name.id === hoveredTeamId);

        return (
            <svg width="200" height="82" viewBox="0 0 200 82" {...rest}>
                {/*/!* game time *!/*/}
                {/*<text x="100" y="8" textAnchor="middle" style={gameTimeStyle}>*/}
                {/*{ topText(game) }*/}
                {/*</text>*/}

                {/* backgrounds */}

                {/* base background */}
                <rect x="0" y="12" width="200" height="45" fill={backgroundColor} rx="3" ry="3"/>

                {/* background for the top team */}
                <rect x="0" y="12" width="200" height="22.5" fill={topHovered ? hoverBackgroundColor : backgroundColor}
                      rx="3"
                      ry="3"/>
                {/* background for the bottom team */}
                <rect x="0" y="34.5" width="200" height="22.5"
                      fill={bottomHovered ? hoverBackgroundColor : backgroundColor}
                      rx="3" ry="3"/>

                {/* scores background */}
                <rect x="0" y="12" width="30" height="45" fill={scoreBackground} rx="3" ry="3"/>

                {/* winner background */}
                {winnerBackground}

                {/* the players */}
                {
                    top ? (
                        <Side x={30} y={12} side={top} onHover={onHoveredTeamIdChange}/>
                    ) : null
                }

                {
                    bottom ? (
                        <Side x={30} y={34.5} side={bottom} onHover={onHoveredTeamIdChange}/>
                    ) : null
                }

                <line x1="0" y1="34.5" x2="200" y2="34.5" style={teamSeparatorStyle}/>

                {/*/!* game name *!/*/}
                {/*<text x="100" y="68" textAnchor="middle" style={gameNameStyle}>*/}
                {/*{ bottomText(game) }*/}
                {/*</text>*/}
            </svg>
        );
    }
}

export default controllable(BracketGame, ['hoveredTeamId']);