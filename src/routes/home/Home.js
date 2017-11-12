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
      fullDetectionStatus: null,
      loadingTrip: null,
      topCountries: null,
      firstCountryCities: null,
      result: null,
    };
  }

  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  }

  async detectPin(index) {
    const pinExists = this.props && this.props.pins && this.props.pins[index];
    if (pinExists) {
      const pin = this.props.pins[index];
      await this.setStateAsync({
        visionInProgress: {
          ...this.state.visionInProgress,
          [pin.id]: true,
        },
      });
      const resp = await this.props.fetch('/graphql', {
        body: JSON.stringify({
          query: `{vision {pinId, detected, descriptions, scores, locality, country} }`,
          variables: { pin, userId: this.props.userId },
        }),
      });
      const { data, errors } = await resp.json();
      if (errors) {
        console.log('ERROR', errors);
        await this.setStateAsync({
          visionInProgress: {
            ...this.state.visionInProgress,
            [pin.id]: false,
          },
          visionResult: {
            ...this.state.visionResult,
            [pin.id]: { pinId: pin.id, detected: false },
          },
        });
      } else {
        await this.setStateAsync({
          visionResult: {
            ...this.state.visionResult,
            [pin.id]: data.vision,
          },
          visionInProgress: {
            ...this.state.visionInProgress,
            [pin.id]: false,
          },
        });
      }
    }
  }

  async startDetection() {
    await this.setStateAsync({ fullDetectionStatus: 'progress' });
    const hasPins = this.props && this.props.pins && this.props.pins.length > 0;
    const pins = this.props.pins;
    pins.forEach(async (pin, index) => {
      console.log('detecting pin', index);
      await this.detectPin(index);
      if (index === pins.length - 1)
        await this.setStateAsync({ fullDetectionStatus: 'complete' });
    });
  }

  async showTrip() {
    this.setState({ loadingTrip: true });
    const resp = await this.props.fetch('/graphql', {
      body: JSON.stringify({
        query: `{topDestinations {countries, firstCountryCities} }`,
        variables: { userId: this.props.userId },
      }),
    });
    const { data, errors } = await resp.json();
    this.setState({
        topCountriesAvailable: true,
        topCountries: data.topDestinations.countries,
        firstCountryCities: data.topDestinations.firstCountryCities,
    });
    // now call skyscanner endpoint
    const tripsResponse = await this.props.fetch('/graphql', {
      body: JSON.stringify({
        query: `{trip {destination, price, departDate, returnDate} }`,
        variables: {
          countries: data.topDestinations.countries,
          firstCountryCities: data.topDestinations.firstCountryCities
        },
      }),
    });
    const tripResult = await tripsResponse.json();
    this.setState({result: tripResult.data.trip, loadingTrip: false});
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
                    className={`button is-info is-large ${this.state
                      .fullDetectionStatus === 'progress'
                      ? 'is-loading'
                      : ''}`}
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
                                    `${res} (${Math.round(
                                      this.state.visionResult[pin.id].scores[
                                        idx
                                      ] * 10,
                                    ) / 10})`,
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
                    {this.state.visionResult[pin.id] &&
                    this.state.visionResult[pin.id].detected ? (
                      <span>
                        {`${this.state.visionResult[pin.id].locality}, ${this
                          .state.visionResult[pin.id].country}`}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}
        {this.state.fullDetectionStatus !== 'complete' ? (
          <section className="section">
            <div className="container">
            <h1>3. It's travel time!</h1>
              {this.state.loadingTrip!==null && this.state.topCountries!==null ?
                <div className="column">
                  <h2 className="title is-2">Your top two most pinned countries are:</h2>
                  <div className="column is-6">
                    <span className="tag is-success is-large is-rounded">{this.state.topCountries[0]}</span>
                  </div>
                  <div className="column is-6">  
                    <span className="tag is-success is-large is-rounded">{this.state.topCountries[1]}</span>
                  </div>  
                  <h2 className="title is-2">Your top pinned locations in {this.state.topCountries[0]} are:</h2>
                  {this.state.firstCountryCities.map((city)=> {
                    return <span className="tag is-warning is-large is-rounded" key={city}>{city}</span>
                  })}
                  {this.state.result!==null ? 
                    <div className="column is-12">
                      <h1 className="title is-2">Whoohoo! You're going from Geneva to: <b>{this.state.result.destination}</b></h1>
                      <h3 className="title is-3">Depart: {this.state.result.departDatae}</h3>
                      <h3 className="title is-3">Return: {this.state.result.returnDate}</h3>
                      <h4 className="title is-4">Price: CHF {this.state.result.price}</h4>
                    </div> : null
                  }
                </div> :
                <div className="column is-full is-offset-one-quarter">
                  <div className="buttons">
                    <span className="button is-info is-large">
                      This coming weekend
                    </span>
                    <span className="button is-info is-large is-outlined">
                      Weekend after that
                    </span>
                    <span className="button is-info is-large is-outlined">
                      3rd weekend from now
                    </span>
                  </div>
                </div>
              }
              <div className="column is-three-quarters is-offset-one-third">
                <span
                  className={`button is-success is-large ${this.state.loadingTrip ? "is-loading" : ""}`}
                  onClick={this.showTrip.bind(this)}
                >
                  {this.props.result ? "BOOK NOW" : "SHOW ME MY NEXT TRIP!"}
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
