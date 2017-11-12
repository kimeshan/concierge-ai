/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Home from './Home';
import App from '../../components/App';
import Layout from '../../components/Layout';

async function action(props) {
  // assumes the user is connected to pinterest and access_token is stored
  const userId = 1;
  const resp = await props.fetch('/graphql', {
    body: JSON.stringify({
      query: `{pins {id, imageUrl} }`,
      variables: {userId},
    }),
  });
  const {data} = await resp.json();
  return {
    chunks: ['home'],
    title: 'AI Concierge',
    component: (
      <Layout>
        <Home pins={data.pins} {...props}/>
      </Layout>
    ),
  };
}

export default action;
