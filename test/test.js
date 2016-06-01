/**
 * npm install mocha chai --save-dev
 */
var chai = require('chai');
var assert = chai.assert,
    expect = chai.expect;
var fs  = require("fs");
var _   = require("lodash");

var datadir = './data/';

// Test input file and generated files
describe("Test input and generated files", function() {
    it('xlsx file exists', function(done) {
        fs.access("./input_src/060509 Données EPFL.xlsx",  fs.R_OK | fs.W_OK, function(err, data) {
            if (err) {
                console.log(err);
                throw "Unable to read input file 060509 Données EPFL.xlsx";
            }
            done();
        });
    });

    var filesRaw = ["Finances", "Formation", "Origin", "Personnel", "Ranking"];
    var filesOut = ["Finance", "Formation", "Origin", "Staff", "Ranking"];

    filesRaw.forEach(function (item, index) {
        describe(item + " raw and data files exist", function() {

            it('raw exists', function(done) {
                fs.access(datadir + item + "_raw_data.json",  fs.R_OK | fs.W_OK, function(err, data) {
                    if (err) {
                        throw "Unable to read file: " + datadir + "/" + item + "_raw_data.json";
                    } else {
                        done();
                    }
                });
            });

            it('data exists', function(done) {
                fs.access(datadir + "data" + filesOut[index] + ".json",  fs.R_OK | fs.W_OK, function(err, data) {
                    if (err) {
                        throw "Unable to read file: " + datadir + "/" + "data" + filesOut[index] + ".json";
                    } else {
                        done();
                    }
                });
            });
        });
    });
});


describe("Test JSON files", function () {
    var dataFiles = ["Finance", "Formation", "Origin", "Staff", "Ranking"];
        dataFiles["Finance"] = JSON.parse(fs.readFileSync(datadir + 'dataFinance.json', 'utf8'));
        dataFiles["Formation"] = JSON.parse(fs.readFileSync(datadir + 'dataFormation.json', 'utf8'));
        dataFiles["Origin"] = JSON.parse(fs.readFileSync(datadir + 'dataOrigin.json', 'utf8'));
        dataFiles["Staff"] = JSON.parse(fs.readFileSync(datadir + 'dataStaff.json', 'utf8'));
        dataFiles["Ranking"] = JSON.parse(fs.readFileSync(datadir + 'dataRanking.json', 'utf8'));

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

    dataFiles.forEach(function (item, index) {
        //console.log(item);
        describe(item + ' data', function() {
            it('should be an array', function(){
                assert.isArray(dataFiles[item], "data["+item+"] is not array (" + typeof dataFiles[item] + ")");
            });
            describe('length of array', function() {
                it('should be > 1', function() {
                    assert.isAbove(dataFiles[item].length, 1);
                });
                it('should be >= 15', function() {
                    assert.isAtLeast(dataFiles[item].length, 15);
                });
            });

            if (item == "Finance") {
                describe('#indexOf()', function() {
                    var test = findNested(dataFiles[item], 'label3');
                    //console.log(test);
                    it('should return -1 when the value is not present', function() {
                        assert.equal(-1, _.indexOf(test, '/dummy/label/data'));
                    });
                    it('should return 2 when /1982/FNS/6988.00', function() {
                        assert.equal(2, _.indexOf(test, '/1982/FNS/6988.00'));
                    });
                    it('should /1985/CTI/3143.00', function() {
                        assert.isAbove(_.indexOf(test, '/1985/CTI/3143.00'), 0);
                    });
                    it('should /2003/Sect. Public./13348.90', function() {
                        assert.isAbove(_.indexOf(test, '/2003/Sect. Public./13348.90'), 0);
                    });
                    it('should /2014/Budget Conf./644722.40', function() {
                        assert.isAbove(_.indexOf(test, '/2014/Budget Conf./644722.40'), 0);
                    });
                });
            }

            if (item == "Formation") {
                describe('#indexOf()', function() {
                    var test = findNested(dataFiles[item], 'label4');
                    //console.log(test);
                    it('should return -1 when the value is not present', function() {
                        assert.equal(-1, _.indexOf(test, '/dummy/label/data'));
                    });
                    it('should /1982/Diplômés/MAS/Etrangers', function() {
                        assert.equal(0, _.indexOf(test, '/1982/Diplômés/MAS/Etrangers'));
                    });
                    it('should /1983/Diplômés/MAS/Femmes', function() {
                        assert.isAbove(_.indexOf(test, '/1983/Diplômés/MAS/Femmes'), 0);
                    });
                    it('should /1984/Diplômés/MAS/Total', function() {
                        assert.isAbove(_.indexOf(test, '/1984/Diplômés/MAS/Total'), 0);
                    });
                    it('should /1985/Diplômés/Master/Etrangers', function() {
                        assert.isAbove(_.indexOf(test, '/1985/Diplômés/Master/Etrangers'), 0);
                    });
                    it('should /1986/Diplômés/Master/Femmes', function() {
                        assert.isAbove(_.indexOf(test, '/1986/Diplômés/Master/Femmes'), 0);
                    });
                    it('should /1987/Diplômés/Master/Total', function() {
                        assert.isAbove(_.indexOf(test, '/1987/Diplômés/Master/Total'), 0);
                    });
                    it('should /1986/Diplômés/PhD/Etrangers', function() {
                        assert.isAbove(_.indexOf(test, '/1986/Diplômés/PhD/Etrangers'), 0);
                    });
                    it('should /1989/Diplômés/PhD/Femmes', function() {
                        assert.isAbove(_.indexOf(test, '/1989/Diplômés/PhD/Femmes'), 0);
                    });
                    it('should /1990/Diplômés/PhD/Total', function() {
                        assert.isAbove(_.indexOf(test, '/1990/Diplômés/PhD/Total'), 0);
                    });
                    it('should /1991/Etudiants/BS+MS/Etrangers', function() {
                        assert.isAbove(_.indexOf(test, '/1991/Etudiants/BS+MS/Etrangers'), 0);
                    });
                    it('should /1992/Etudiants/BS+MS/Femmes', function() {
                        assert.isAbove(_.indexOf(test, '/1992/Etudiants/BS+MS/Femmes'), 0);
                    });
                    it('should /1993/Etudiants/BS+MS/Total', function() {
                        assert.isAbove(_.indexOf(test, '/1993/Etudiants/BS+MS/Total'), 0);
                    });
                    it('should /1994/Etudiants/Bachelor/Etrangers', function() {
                        assert.isAbove(_.indexOf(test, '/1994/Etudiants/Bachelor/Etrangers'), 0);
                    });
                    it('should /1995/Etudiants/Bachelor/Femmes', function() {
                        assert.isAbove(_.indexOf(test, '/1995/Etudiants/Bachelor/Femmes'), 0);
                    });
                    it('should /1996/Etudiants/Bachelor/Total', function() {
                        assert.isAbove(_.indexOf(test, '/1996/Etudiants/Bachelor/Total'), 0);
                    });
                    it('should /1997/Etudiants/MAS/Etrangers', function() {
                        assert.isAbove(_.indexOf(test, '/1997/Etudiants/MAS/Etrangers'), 0);
                    });
                    it('should /1998/Etudiants/MAS/Femmes', function() {
                        assert.isAbove(_.indexOf(test, '/1998/Etudiants/MAS/Femmes'), 0);
                    });
                    it('should /1999/Etudiants/MAS/Total', function() {
                        assert.isAbove(_.indexOf(test, '/1999/Etudiants/MAS/Total'), 0);
                    });
                    it('should /2000/Etudiants/Master/Etrangers', function() {
                        assert.isAbove(_.indexOf(test, '/2000/Etudiants/Master/Etrangers'), 0);
                    });
                    it('should /2001/Etudiants/Master/Femmes', function() {
                        assert.isAbove(_.indexOf(test, '/2001/Etudiants/Master/Femmes'), 0);
                    });
                    it('should /2002/Etudiants/PhD/Etrangers', function() {
                        assert.isAbove(_.indexOf(test, '/2002/Etudiants/PhD/Etrangers'), 0);
                    });
                    it('should /2003/Etudiants/PhD/Femmes', function() {
                        assert.isAbove(_.indexOf(test, '/2003/Etudiants/PhD/Femmes'), 0);
                    });
                    it('should /2004/Etudiants/PhD/Total', function() {
                        assert.isAbove(_.indexOf(test, '/2004/Etudiants/PhD/Total'), 0);
                    });
                    it('should /2005/Etudiants/Total/Etrangers', function() {
                        assert.isAbove(_.indexOf(test, '/2005/Etudiants/Total/Etrangers'), 0);
                    });
                    it('should /2006/Etudiants/Total/Femmes', function() {
                        assert.isAbove(_.indexOf(test, '/2006/Etudiants/Total/Femmes'), 0);
                    });
                    it('should /2007/Etudiants/Total/Tota', function() {
                        assert.isAbove(_.indexOf(test, '/2007/Etudiants/Total/Total'), 0);
                    });
                    it('should /2008/New/Total/Etrangers', function() {
                        assert.isAbove(_.indexOf(test, '/2008/New/Total/Etrangers'), 0);
                    });
                    it('should /2009/Etudiants/PhD/Total', function() {
                        assert.isAbove(_.indexOf(test, '/2009/Etudiants/PhD/Total'), 0);
                    });
                    it('should /2010/New/Total/Femmes', function() {
                        assert.isAbove(_.indexOf(test, '/2010/New/Total/Femmes'), 0);
                    });
                    it('should 2011/New/Total/Total', function() {
                        assert.isAbove(_.indexOf(test, '/2011/New/Total/Total'), 0);
                    });
                });
            }

            if (item == "Origin") {
                describe('#indexOf()', function() {
                    var test = findNested(dataFiles[item], 'label2');
                    //console.log(test);
                    it('should return -1 when the value is not present', function() {
                        assert.equal(-1, _.indexOf(test, '/dummy/label/data'));
                    });
                    it('should /1982/Doctorants', function() {
                        assert.equal(0, _.indexOf(test, '/1982/Doctorants'));
                    });
                    it('should /2015/Doctorants', function() {
                        assert.isAbove(_.indexOf(test, '/2015/Doctorants'), 0);
                    });
                    it('should /2015/Formation continue MAS', function() {
                        assert.isAbove(_.indexOf(test, '/2015/Formation continue MAS'), 0);
                    });
                    it('should /2015/Total étudiants', function() {
                        assert.isAbove(_.indexOf(test, '/2015/Total étudiants'), 0);
                    });
                    it('should /2015/Voie diplôme/bachelor+master (sans CMS)', function() {
                        assert.isAbove(_.indexOf(test, '/2015/Voie diplôme/bachelor+master (sans CMS)'), 0);
                    });
                });
            }

            if (item == "Ranking") {
                describe('#indexOf()', function() {
                    var test = findNested(dataFiles[item], 'label2');
                    //console.log(test);
                    it('should return -1 when the value is not present', function() {
                        assert.equal(-1, _.indexOf(test, '/dummy/label/data'));
                    });
                    it('should /ARWU - Chemistry/EPFL', function() {
                         assert.equal(0, _.indexOf(test, '/ARWU - Chemistry/EPFL'));
                    });
                    it('should /ARWU - Computer Science/EPFL', function() {
                        assert.isAbove(_.indexOf(test, '/ARWU - Computer Science/EPFL'), 0);
                    });
                    it('should /ARWU - Engineering/EPFL', function() {
                        assert.isAbove(_.indexOf(test, '/ARWU - Engineering/EPFL'), 0);
                    });
                    it('should /ARWU - Life sciences/EPFL', function() {
                        assert.isAbove(_.indexOf(test, '/ARWU - Life sciences/EPFL'), 0);
                    });
                    it('should /ARWU - Maths/EPFL', function() {
                        assert.isAbove(_.indexOf(test, '/ARWU - Maths/EPFL'), 0);
                    });
                    it('should /ARWU - Physics/EPFL', function() {
                        assert.isAbove(_.indexOf(test, '/ARWU - Physics/EPFL'), 0);
                    });
                    it('should /ARWU - Science/EPFL', function() {
                        assert.isAbove(_.indexOf(test, '/ARWU - Science/EPFL'), 0);
                    });
                    it('should /QS - Engineering/EPFL', function() {
                        assert.isAbove(_.indexOf(test, '/QS - Engineering/EPFL'), 0);
                    });
                    it('should /QS - Humanities/EPFL', function() {
                        assert.isAbove(_.indexOf(test, '/QS - Humanities/EPFL'), 0);
                    });
                    it('should /QS - Life Sciences/EPFL', function() {
                        assert.isAbove(_.indexOf(test, '/QS - Life Sciences/EPFL'), 0);
                    });
                    it('should /QS - Natural Sciences/EPFL', function() {
                        assert.isAbove(_.indexOf(test, '/QS - Natural Sciences/EPFL'), 0);
                    });
                    it('should /QS - Soc. sci & Mgmt/EPFL', function() {
                        assert.isAbove(_.indexOf(test, '/QS - Soc. sci & Mgmt/EPFL'), 0);
                    });
                    it('should /THE - Engineering/IT/EPFL', function() {
                        assert.isAbove(_.indexOf(test, '/THE - Engineering/IT/EPFL'), 0);
                    });
                    it('should /THE - Life Sci/EPFL', function() {
                        assert.isAbove(_.indexOf(test, '/THE - Life Sci/EPFL'), 0);
                    });
                    it('should /THE - Phys. Sci/EPFL', function() {
                        assert.isAbove(_.indexOf(test, '/THE - Phys. Sci/EPFL'), 0);
                    });
                    it('should /THE - Reputation/EPFL', function() {
                        assert.isAbove(_.indexOf(test, '/THE - Reputation/EPFL'), 0);
                    });
                    it('should /THE - Under 50/EPFL', function() {
                        assert.isAbove(_.indexOf(test, '/THE - Under 50/EPFL'), 0);
                    });
                    it('should /ARWU - Global/EPFL', function() {
                        assert.isAbove(_.indexOf(test, '/ARWU - Global/EPFL'), 0);
                    });
                    it('should /Leiden - Global/EPFL', function() {
                        assert.isAbove(_.indexOf(test, '/Leiden - Global/EPFL'), 0);
                    });
                    it('should /QS - Global/EPFL', function() {
                        assert.isAbove(_.indexOf(test, '/QS - Global/EPFL'), 0);
                    });
                    it('should /THE - Global/EPFL', function() {
                        assert.isAbove(_.indexOf(test, '/THE - Global/EPFL'), 0);
                    });
                });
            }

            if (item == "Staff") {
                describe('#indexOf()', function() {
                    var test = findNested(dataFiles[item], 'label2');
                    //console.log(test);
                    it('should return -1 when the value is not present', function() {
                        assert.equal(-1, _.indexOf(test, '/dummy/label/data'));
                    });
                    it('should /1982/Assistants', function() {
                        assert.equal(0, _.indexOf(test, '/1982/Assistants'));
                    });
                    it('should /2006/Coll.Adm.', function() {
                        assert.isAbove(_.indexOf(test, '/2006/Coll.Adm.'), 0);
                    });
                    it('should /2007/Coll.Sci.', function() {
                        assert.isAbove(_.indexOf(test, '/2007/Coll.Sci.'), 0);
                    });
                    it('should /2008/Coll.Tech.', function() {
                        assert.isAbove(_.indexOf(test, '/2008/Coll.Tech.'), 0);
                    });
                    it('should /2009/MER', function() {
                        assert.isAbove(_.indexOf(test, '/2009/MER'), 0);
                    });
                    it('should /2010/PA/PBFN', function() {
                        assert.isAbove(_.indexOf(test, '/2010/PA/PBFN'), 0);
                    });
                    it('should /2011/PATT', function() {
                        assert.isAbove(_.indexOf(test, '/2011/PATT'), 0);
                    });
                    it('should /2012/PAss', function() {
                        assert.isAbove(_.indexOf(test, '/2012/PAss'), 0);
                    });
                    it('should /2013/PO', function() {
                        assert.isAbove(_.indexOf(test, '/2013/PO'), 0);
                    });
                    it('should /2014/Ptit', function() {
                        assert.isAbove(_.indexOf(test, '/2014/Ptit'), 0);
                    });

                });
            }
        });
    });
});