class HTTPRequestHandler {


  static baseUrl = '';

  /**
   *  Call Signup API 
   * @param {*} requestBody 
   * @returns 
   */

  static doSignup = async (requestBody) => {
    const response = await fetch(HTTPRequestHandler.baseUrl + 'customer/signup', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(requestBody) // body data type must match "Content-Type" header
    })
    return response.json();
  }

  /**
   * Get list of all restaurants to be displayed on Home page
   * @returns  Returns List of retaurants 
   */

  static getAllRestaurants = async () => {
    const restaurantList = await fetch(HTTPRequestHandler.baseUrl + 'restaurant');
    return restaurantList.json();
  }

  /**
   *  get restaurant details api call utility
   * @param {*} id 
   * @returns 
   */
  static getRestaurantDetails = async (id) => {
    const restaurantDetails = await fetch(HTTPRequestHandler.baseUrl + 'restaurant/' + id);
    return restaurantDetails.json();
  }

  /**
   *  Utility to make login call
   * @param {*} authentication 
   * @returns 
   */

  async doLogin(authentication) {
    const responseData = await fetch(HTTPRequestHandler.baseUrl + 'customer/login', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'authorization': authentication
      },
      body: {}// no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }).then(response => {
      response.json();
      if (response.status === 200) {
        console.log(response.headers.get('access-token'));
        sessionStorage.setItem('uuid', response?.body?.id);
        sessionStorage.setItem('access-token', response.headers.get('access-token'));
      }
      return response;
    });
    return responseData;
  }

}

export default HTTPRequestHandler;