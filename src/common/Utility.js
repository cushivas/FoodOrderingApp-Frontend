

class Utility {

    /**
     *  Utility to validate email address
     * @param {*} email 
     * @returns 
     */

    static validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    /**
     * Utility to validate Password
     * @param {*} password 
     * @returns 
     */

    static validatePassword(password) {
        const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,}$/;
        return re.test(password)
    }

    /**
     * Utility to validate phone
     * @param {*} phone 
     * @returns 
     */

    static validatePhone(phone) {
        const re = /^\d{10}$/;
        return re.test(phone);
    }

    /**
     * Utility to validate  Pincode
     * @param {*} pincode 
     * @returns 
     */

    static validatePincode (pincode) {
        if (pincode !== undefined && pincode.length !== 6) {
            return false;
        } else if (!isNaN(pincode) && pincode.length === 6) {
            return true;
        } else {
            return false;
        }
    }

}

export default Utility;





