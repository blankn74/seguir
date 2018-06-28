var _mapValues = require('lodash/mapValues');
var _zipObject = require('lodash/zipObject');

/**
 * This is a collection of methods that allow you to create, update and delete social items.
 *
 * These methods all exclude the 'loggedinuser' parameter as they are all carried out only by
 * the currently logged in user and / or system level calls (e.g. adding a user via integration
 * with an SSO flow).
 *
 */
module.exports = function (api) {
  var client = api.client;
  var q = client.queries;

  function addGroup (keyspace, groupName, supergroupId, options, next) {
    if (!next) {
      next = options;
      options = {};
    }

    var groupData = options.groupData || {};
    var group = client.isValidId(options.group) ? options.group : client.generateId();

    groupData = _mapValues(groupData, function (value) {
      return value.toString();
    }); // Always ensure our groupdata is <text,text>

    // Check group doesn't already exist with this name in this supergroup
    getGroupByNameWithinSupergroup(keyspace, groupName, supergroupId, function (err, existingGroup) {
      if (err && err.statusCode !== 404) { return next(err); }
      if (existingGroup) {
        return next({
          statusCode: 409,
          message: 'Group with groupname ' + groupName + ' already exists for supergroupId ' + supergroupId
        });
      }

      var groupValues = [group, groupData, groupName, supergroupId];

      client.execute(q(keyspace, 'upsertGroup'), groupValues, {}, function (err, result) {
        if (err) { return next(err); }
        next(null, _zipObject(['group', 'groupData', 'groupName', 'supergroupId'], groupValues));
      });
    });
  }

  function getGroupByNameWithinSupergroup (keyspace, groupName, supergroupId, next) {
    client.get(q(keyspace, 'selectGroupByNameAndSupergroup'), [groupName, supergroupId], {}, function (err, result) {
      if (err) { return next(err); }
      if (!result) { return next(api.common.error(404, 'Unable to find group by groupName: ' + groupName + ' and supergroupId ' + supergroupId)); }
      next(null, result);
    });
  }

  return {
    addGroup: addGroup
  };
};
