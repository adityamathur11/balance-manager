/**
 * Created by aditya on 23/9/17.
 */

var ResponseCodes = {
    ResourceConflict : {
        code : 409,
        message : {
            message : "Resource Conflict"
        }
    },
    InvalidParameters : {
        code : 400,
        message : {
            message : "Invalid Parameters"
        }
    },
    NoToken : {
        code : 403,
        message : {
            message : "Authorization Token Required"
        }
    },
    InvalidTokenn : {
        code : 403,
        message :{
            message : "Invalid Authorization Token"
        }
    },
    TokenExpired : {
        code : 403,
        message : {
            message : "Token Expired"
        }
    },
    InternalServerError :  {
        code : 500,
        message : {
            message : "Internal Server Error"
        }
    },
    InvalidCredentials : {
       code : 400,
        message : {
           message : "Inavild Credentials"
        }
    },

    ResourceNotFound : {
        code : 404,
        message : {
            message : 'Resource Not Found'
        }
    },
    Success : {
        code : 200,
        message : {
            message : "Success"
        }
    },
    Created : {
        code : 201,
        message : {
            message : "Resource Created"
        }
    }
};

module.exports = ResponseCodes;
