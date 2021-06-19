class HTTPRequestHandler {


    static domainName = 'http://localhost:3080';

    /**
     * 
     * @param {*} requestBody 
     * @returns 
     */

    static doSignup = async (requestBody) =>{
      const response = await fetch( HTTPRequestHandler.domainName + '/api/customer/signup', {
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
     * 
     * @returns  Returns List of retaurants 
     */

  static getAllRestaurants = async () =>{
        const restaurantList = await fetch(HTTPRequestHandler.domainName + '/api/restaurant');
        return restaurantList;
    }

}

export default HTTPRequestHandler;