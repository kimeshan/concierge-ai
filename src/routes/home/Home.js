import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
import { stringify } from 'query-string';

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      visionResult: {},
      visionInProgress: {},
    };
  }

  async detectPin(index) {
    const pinExists = this.props && this.props.pins && this.props.pins[index];
    if (pinExists) {
      const pin = this.props.pins[index];
      this.setState({
        visionInProgress: {
          ...this.state.visionInProgress,
          [pin.id]: true,
        },
      });
      const resp = await this.props.fetch('/graphql', {
        body: JSON.stringify({
          query: `{vision {pinId, detected, descriptions, scores} }`,
          variables: { pin, userId: this.props.userId },
        }),
      });
      const { data, errors } = await resp.json();
      if (errors) console.log('ERROR', errors);
      else {
        this.setState({
          visionResult: {
            ...this.state.visionResult,
            [data.vision.pinId]: data.vision,
          },
          visionInProgress: {
            ...this.state.visionInProgress,
            [data.vision.pinId]: false,
          },
        });
      }
    }
  }

  async startDetection() {
    const hasPins = this.props && this.props.pins && this.props.pins.length > 0;
    const pins = this.props.pins;
    pins.forEach(async (pin, index) => {
      const elem = document.getElementById(pin.id);
      elem.scrollTop = elem.scrollHeight;
      await this.detectPin(index);
    });
  }

  render() {
    const hasPins = this.props && this.props.pins && this.props.pins.length > 0;
    return (
      <div className="container is-fluid">
        <section className="section" style={{ paddingBottom: '0px' }}>
          <div className="container">
            <h1>1. Connect your Pinterest account</h1>
            <div className="column is-half is-offset-one-quarter">
              <a className={s.pinterest} onClick={this.pinterestAuth}>
                <svg
                  className={s.icon}
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                >
                  <path
                    d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Log in with Pinterest</span>
              </a>
            </div>
          </div>
        </section>
        {hasPins ? (
          <section className="section">
            <div className="container">
              <h1>2. Now for some magic</h1>
              <div className="columns">
                <div className="column">
                  <span
                    className="button is-info is-large"
                    onClick={this.startDetection.bind(this)}
                  >
                    Start Image Vision
                  </span>
                </div>
              </div>
              <div className="columns is-multiline">
                {this.props.pins.map((pin, idx) => (
                  <div
                    className={`column is-3 ${s.colBg}`}
                    key={pin.id}
                    id={pin.id}
                  >
                    <div className={s.detectButton}>
                      {this.state.visionResult[pin.id] ? (
                        <span>
                          {this.state.visionResult[pin.id].detected
                            ? this.state.visionResult[pin.id].descriptions
                                .map(
                                  (res, idx) =>
                                    `${res} (${this.state.visionResult[pin.id]
                                      .scores[idx]})`,
                                )
                                .join(', ')
                            : 'No location detected'}
                        </span>
                      ) : (
                        <span
                          className={`button is-warning ${this.state
                            .visionInProgress[pin.id]
                            ? 'is-loading'
                            : ''}`}
                          onClick={this.detectPin.bind(this, idx)}
                        >
                          Detect
                        </span>
                      )}
                    </div>
                    <div className="image">
                      <img className={s.image} src={pin.imageUrl} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}
        {hasPins ? (
          <section className="section">
            <div className="container">
              <h1>3. When do you want to travel?</h1>
              <div className="buttons">
                <span className="button is-info is-large">
                  This coming weekend
                </span>
                <span className="button is-info is-large">
                  Weekend after that
                </span>
                <span className="button is-info is-large">
                  3rd weekend from now
                </span>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    );
  }
}

export default withStyles(s)(Home);
