import config from './config';

const connnectPinterest = () => {
  const url = 'https://api.pinterest.com/v1/oauth/token';
  const paramsString = 'q=URLUtils.searchParams&topic=api';
  const searchParams = new URLSearchParams(paramsString);
  const request = new Request(url, {
    method: 'POST',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'text/plain',
    }),
  });
  // Now use it!
  fetch(request).then(() => {
    /* handle response */
  });
};

export default connnectPinterest;
