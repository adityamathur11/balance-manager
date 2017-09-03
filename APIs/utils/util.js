/**
 * Created by Aditya on 03-Sep-17.
 */
var fs = require('fs');

module.exports = {
    validateInputs : function (model, inputParams) {
        for(key in model){
            if(model[key].required){
                if(inputParams[key] === undefined){
                    return false;
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
            if(inputParams[key]){
                newObj[key] = inputParams[key];
            }
        }
        return newObj;
    }
};