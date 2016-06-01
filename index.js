/**
 * Convert the XLSX file to JSON formatted files
 *
 * @date        2016-05-30
 * @version     0.0.4
 * @author      Nicolas Borboën <nicolas.borboen@epfl.ch>
 * @author      EPFL-Dojo <epfl-dojo@groupes.epfl.ch>
 * @log         v0.0.1      Extract from excel
 *              v0.0.2      Restructured Data
 *              v0.0.3      Log with findNested()
 *              v0.0.4      Exported reformatted data (./data/dataXXX.json)
 *              v0.0.5      Tests
 * @todo        - restructure + export data from the extract loop
 */

// https://www.npmjs.com/package/xlsx
if(typeof require !== 'undefined') XLSX = require('xlsx');
var     fs  = require("fs"),
        _   = require("lodash"),
    debug   = require("debug"),
    datadir = './data/';

var extract = true; // set to true for new extract
if (extract){
    // Load the XLSX file
    var workbook = XLSX.readFile('./input_src/060509 Données EPFL.xlsx');

    // Be sure that datadir exists
    if (!fs.existsSync(datadir)){
      fs.mkdirSync(datadir);
    }

    // For each workbook, export the JSON file
    workbook.SheetNames.forEach(
      function(index) {
        var tmp = XLSX.utils.sheet_to_json(workbook.Sheets[index], {header:0});
        fs.writeFileSync(datadir + index + "_raw_data.json", JSON.stringify(tmp, null, 2), 'utf-8');
      }
    );
}

function SmartDict(){}

SmartDict.prototype.set = function(key){
    var vals = Array.prototype.slice.call(arguments, 1);
    if (vals.length == 1) {
        this[key] = vals[0];
    } else {
        if(! this[key]) {
            this[key] = new SmartDict();
        }
        this[key].set.apply(this[key], vals);
    }
};

SmartDict.prototype.map = function (f) {
    var self = this;
    return _.keys(self).sort().map(function (k) {
        // return f(k, self[k]);
        // return f.call({}, k, self[k]);
        return f.call(self, k, self[k]);
    })
};

// List all (including deep nested) values by key
// Usage ex: console.log(findNested(result, 'label4'));
// http://stackoverflow.com/questions/15642494/find-property-by-name-in-a-deep-object
function findNested(obj, key, memo) {
    var i,
        proto = Object.prototype,
        ts = proto.toString,
        hasOwn = proto.hasOwnProperty.bind(obj);

    if ('[object Array]' !== ts.call(memo)) memo = [];

    for (i in obj) {
        if (hasOwn(i)) {
            if (i === key) {
                memo.push(obj[i]);
            } else if ('[object Array]' === ts.call(obj[i]) || '[object Object]' === ts.call(obj[i])) {
                findNested(obj[i], key, memo);
            }
        }
    }
    return memo;
}

/**
 * Finances Data
 */
var dataFinance = JSON.parse(fs.readFileSync(datadir + 'Finances_raw_data.json', 'utf8'));
var d = new SmartDict();
dataFinance.map(function (entry) {
    d.set(entry["Année"],
        entry["Source"],
        entry[" Montant "],
        entry);
});
var resultFinance = d.map(function (year, v) {
    return {
        "Year": year,
        "label1" : "/" + year,
        "Sources": v.map(function (source, v) {
            return {
                "source": source.trim(),
                "label2" : "/" + year + "/" + source.trim(),
                "Amount": v.map(function (amount, v) {
                    correctAmount = parseFloat(Math.round(Number(amount.replace(",",'')) * 100) / 100).toFixed(2);
                    correctAmount = isNaN(correctAmount) ? 'undef' : correctAmount;
                    return {
                        "amount" : amount,
                        "amount" : correctAmount,
                        "label3" : "/" + year + "/" + source.trim() + "/" + correctAmount,
                        "data": v
                    }
                })
            }
        })
    }
});
if (extract) {
    fs.writeFileSync(datadir + "dataFinance.json", JSON.stringify(resultFinance, null, 2), 'utf-8');
}
debug(resultFinance);
debug(findNested(resultFinance, 'label3'));

/**
 * Formation Data
 */
var dataFormation = JSON.parse(fs.readFileSync(datadir + 'Formation_raw_data.json', 'utf8'));
var d = new SmartDict();
dataFormation.map(function (entry) {
    d.set(entry["Année"],
        entry["Statistique"],
        entry["Etudes"],
        entry["Sexe/Origine"],
        entry);
});
var resultFormation = d.map(function (year, v) {
    return {
        "Year": year,
        "label1" : "/" + year,
        "Statistics": v.map(function (stat, v) {
            return {
                "stat": stat,
                "label2" : "/" + year + "/" + stat,
                "Studies": v.map(function (study, v) {
                    return {
                        "study" : study,
                        "label3" : "/" + year + "/" + stat + "/" + study,
                        "Minorities": v.map(function (minor, v) {
                            return {
                                "minor" : minor,
                                "label4" : "/" + year + "/" + stat + "/" + study  + "/" + minor,
                                "data": v
                            }

                        })
                    }

                })
            }
        })
    }
});

if (extract) {
    fs.writeFileSync(datadir + "dataFormation.json", JSON.stringify(resultFormation, null, 2), 'utf-8');
}
debug(resultFormation);
debug(findNested(resultFinance, 'label4'));

/**
 * Origin Data
 */
var dataOrigin = JSON.parse(fs.readFileSync(datadir + 'Origin_raw_data.json', 'utf8'));
var d = new SmartDict();
dataOrigin.map(function (entry) {
    d.set(entry["Année"],
        entry["Programme de formation"],
        entry);
});
var resultOrigin = d.map(function (year, v) {
    return {
        "Year": year,
        "label1" : "/" + year,
        "Studies": v.map(function (study, v) {
            return {
                "study": study,
                "label2" : "/" + year + "/" + study,
                "data": v
            }
        })
    }
});

if (extract) {
    fs.writeFileSync(datadir + "dataOrigin.json", JSON.stringify(resultOrigin, null, 2), 'utf-8');
}
debug(resultOrigin);
debug(findNested(resultOrigin, 'label2'));


/**
 * Personnel (staff) Data
 */
var dataStaff = JSON.parse(fs.readFileSync(datadir + 'Personnel_raw_data.json', 'utf8'));
var d = new SmartDict();
dataStaff.map(function (entry) {
    d.set(entry["Year"],
        entry["Poste"],
        entry["Sex/Origin"],
        entry);
});
var resultStaff = d.map(function (year, v) {
    return {
        "Year": year,
        "label1" : "/" + year,
        "Position": v.map(function (post, v) {
            return {
                "position": post,
                "label2" : "/" + year + "/" + post,
                "Minority": v.map(function (mino, v) {
                    return {
                        "minority": mino,
                        "label3" : "/" + year + "/" + post + "/" + mino ,
                        "data": v
                    }
                })
            }
        })
    }
});

if (extract) {
    fs.writeFileSync(datadir + "dataStaff.json", JSON.stringify(resultStaff, null, 2), 'utf-8');
}
debug(resultStaff);
debug(findNested(resultStaff, 'label2'));


/**
 * Ranking Data
 */
var dataRanking = JSON.parse(fs.readFileSync(datadir + 'Ranking_raw_data.json', 'utf8'));
var d = new SmartDict();
dataRanking.map(function (entry) {
    d.set(entry["Classement"],
        entry["Institution"],
        entry);
});
var resultRanking = d.map(function (rank, v) {
    return {
        "Ranking": rank.trim(),
        "label1" : "/" + rank,
        "Institution": v.map(function (inst, v) {
            return {
                "institution": inst,
                "label2" : "/" + rank.trim() + "/" + inst,
                "data": v
            }
        })
    }
});

if (extract) {
    fs.writeFileSync(datadir + "dataRanking.json", JSON.stringify(resultRanking, null, 2), 'utf-8');
}
debug(resultRanking);
debug(findNested(resultRanking, 'label2'));