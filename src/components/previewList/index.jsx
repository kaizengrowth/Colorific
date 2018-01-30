import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { blindSettings } from 'utils/blindSettings';
import chroma, { contrast } from 'chroma-js';
import blind from 'color-blind';
import style from './style.css';

class PreviewList extends Component {
  static propTypes = {
    background: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    foreground: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
  }

  render() {
    const {
      background,
      foreground
    } = this.props;

    return (
      <div className={style.container}>
        <ul className={style.resultsList}>
          <PreviewResult
            label='Common'
            background={chroma(background)}
            foreground={chroma(foreground)}
            />
          {Object.keys(blindSettings).map((setting) => blindSettings[setting].map((type) => {
            const set = blind[type];
            const setBackground = set(background);
            const setForeground = set(foreground);
            return (
              <PreviewResult
                key={type}
                label={type}
                background={setBackground}
                foreground={setForeground}
                />
            )
          })
        )}
        </ul>
      </div>
    );
  }
}


class PreviewResult extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    background: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    foreground: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
  }

  render() {
    const {
      label,
      background,
      foreground,
    } = this.props;

    let ranking, explainer;
    const rating = contrast(chroma(foreground), chroma(background));

    if (rating >= 7) {
      ranking = 'AAA';
      explainer = 'These colors compensate for the loss in contrast sensitivity usually experienced by users with vision loss equivalent to approximately 20/80 vision.';
    } else if (rating >= 4.5) {
      ranking = 'AA';
      explainer = 'These colors compensate for the loss in contrast sensitivity usually experienced by users with vision loss equivalent to approximately 20/40 vision';
    } else if (rating >= 3) {
      ranking = 'Fail';
      explainer = 'These colors fail to reach the minium requirements for contrast sensitivity';
    } else {
      ranking = 'Fail';
      explainer = 'These colors fail to reach the minium requirements for contrast sensitivity';
    }

    return (
      <li
        className={style.result}
        style={{
          backgroundColor: chroma(background),
          color: chroma(foreground),
        }}>
        <ul className={style.ratings}>
          <li className={style.blindType}>
            {label}
          </li>
          <li className={style.blindRank}>
            {ranking}
          </li>
          <li
            className={style.ratio}
            aria-label={`contrast ratio: ${rating.toFixed(3)} to 1`}
            >
            <span aria-hidden>
              {rating.toFixed(3)}:1
            </span>
          </li>
        </ul>
      </li>
    );
  }
}

function mapStateToProps(state) {
  return {
    background: state.colors.background,
    foreground: state.colors.foreground,
  };
}

export default connect(
  mapStateToProps,
)(PreviewList);