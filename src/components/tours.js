import React, {Component, PropTypes, PureComponent} from 'react';
import classNames from 'classnames';
import {tours as toursConst} from '../constants/bracket';

export default class Tours extends Component {
    render() {
        const {count, svgHeight} = this.props,
            columns = [];

        for (var i = 0; i < count; i++) {
            const tourNumber = i + 1,
                isPaired = number => !(number % 2),
                currentStyle = isPaired(tourNumber) ? 'light' : 'dark',
                tourClasses = classNames('tour', currentStyle);

            columns.push(<div className={tourClasses} style={{width: '225px', height: svgHeight}} key={i}>
                {toursConst.DEFAULT_TOUR_NAME.toValue(tourNumber)}
            </div>);
        }

        return (columns);
    }
}