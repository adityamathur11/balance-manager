/**
 * Created by Aditya on 03-Sep-17.
 */
var fs = require('fs');

module.exports = {
    validateInputs : function (model, inputParams) {
        var i = 0;
        for(var key in model){
            if(model[key].required){
                if(inputParams[key] === undefined
                    || typeof(inputParams[key]) !== model[key].type){
                    return false;
                }


            }
            else {
                if(inputParams[key]!== undefined){
                    if(typeof(inputParams[key]) !== model[key].type){
                        return false;
                    }
                }
            }
            if(typeof (inputParams[key]) === "object"){
                switch (model[key].primitive_type){
                    case 'array' :
                        if(model[key].element_type){
                            for(var x = 0; x < inputParams[key].length ; x++){
                                if(typeof (inputParams[key][x]) !== model[key].element_type){
                                    return false;
                                }
                            }
                        }
                        if(model[key].unique){
                            var map = {};
                            for(var x = 0 ; x < inputParams[key].length; x++){
                                if(map[inputParams[key][x]]){
                                    return false;
                                }
                                map[inputParams[key][x]] = true;
                            }
                        }
                        break;
                    default :
                        break;
                }
            }
        }
        return true;
    },

    getModel : function (Entity) {
        var modelPath = "./APIs/models/"+Entity+"/"+Entity+".json";
        return new Promise(function (resolve, reject) {
            fs.readFile(modelPath, 'utf8', function (err, data) {
                if(err) throw err;
                else if(data) {
                    var result = JSON.parse(data);
                    resolve(result);
                } else{
                    reject();
                }
            })
        });
    },

    getPostObject : function (model, inputParams) {
        var newObj = {};
        for(key in model){

            if(inputParams[key] !== undefined){
                newObj[key] = inputParams[key];
            }
        }
        return newObj;
    }
};