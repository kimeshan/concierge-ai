import React from 'react';
import PropTypes from 'prop-types';

const ContextType = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: PropTypes.func.isRequired,
  // Universal HTTP client
  fetch: PropTypes.func.isRequired,
};

class App extends React.PureComponent {
  static propTypes = {
    context: PropTypes.shape(ContextType).isRequired,
    children: PropTypes.element.isRequired,
  };

  static childContextTypes = ContextType;
  getChildContext() {
    return this.props.context;
  }
  render() {
    return React.cloneElement(this.props.children, { ...this.props.context });
  }
}

export default App;
