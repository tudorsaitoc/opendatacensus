var Promise = require('bluebird');
var model = require('../lib/model').OpenDataCensus;
var models = require('../models');

var reloadEntities = {
  setConfigUrl: function (req, res, next) {
    var originalUrl = getOriginalUrl(req);
    if (originalUrl && checkIfReloadActions(originalUrl)) {
      var subDomain = req.subDomain;
      return findSubDomainInRegistry(subDomain).spread(function (err, searchResult) {
        if (err) {

        } else {
          req.registryConfig = getConfigFromRegistry(searchResult);
          next();
        }
      });

    } else {
      next();
    }
  }
};

function getOriginalUrl(req) {
  var originalUrl = req['headers']['referer'] || false;
  return originalUrl;
}

function checkIfReloadActions(url) {
  if (url.indexOf('reload') > -1) {
    return true;
  } else {
    return false;
  }
}

function findSubDomainInRegistry(subDomain) {
  var searchQuery = {where: {id: subDomain}};
  return models.Registry.find(searchQuery).then(function (searchResult) {
    var data = searchResult['dataValues'] || false;
    return [false, data];
  });
}

function getConfigFromRegistry(registry) {
  var configUrl = registry['settings']['configurl'] || false;
  return configUrl;
}


module.exports = reloadEntities;
