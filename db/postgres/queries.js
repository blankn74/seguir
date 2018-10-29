var st = require('string-template');
var queries = {};

/**
 * Definitions of queries are referenced in the structure documentation in ../setup/index
 * They exist here so they can be kept up to date with the queries;
 */
var q = function (keyspace, name, data) {
  data = data || {};
  data.KEYSPACE = keyspace; // Keyspace important and so explicit in method call
  return st(queries[name] || '', data);
};

queries.insertSchemaVersion = 'INSERT INTO {KEYSPACE}.schema_version (version, applied, description) VALUES ($1, $2, $3)';
queries.selectSchemaVersions = 'SELECT version, applied FROM {KEYSPACE}.schema_version ORDER BY version DESC';

/**
 * @apiDefine ExamplePostgresAccounts
 */
queries.upsertAccount = 'INSERT INTO {KEYSPACE}.accounts (account, name, isadmin, enabled) VALUES ($1, $2, $3, $4)';
queries.selectAccounts = 'SELECT account, name, isadmin, enabled FROM {KEYSPACE}.accounts';
queries.selectAccount = 'SELECT account, name, isadmin, enabled FROM {KEYSPACE}.accounts WHERE account = $1';
queries.selectAccountByName = 'SELECT account, name, isadmin, enabled FROM {KEYSPACE}.accounts WHERE name = $1';
queries.updateAccount = 'UPDATE {KEYSPACE}.accounts SET name = $1, isadmin = $2, enabled = $3 WHERE account = $4';

/**
 * @apiDefine ExamplePostgresAccountUsers
 */
queries.upsertAccountUser = 'INSERT INTO {KEYSPACE}.account_users (account, username, password, enabled) VALUES($1, $2, $3, $4)';
queries.selectAccountUsers = 'SELECT account, username, enabled FROM {KEYSPACE}.account_users WHERE account = $1';
queries.selectAccountUserByName = 'SELECT account, username, password, enabled FROM {KEYSPACE}.account_users WHERE username = $1';
queries.updateAccountUser = 'UPDATE {KEYSPACE}.account_users SET password = $1, enabled = $2 WHERE account = $3 AND username = $4';

/**
 * @apiDefine ExamplePostgresApplications
 */
queries.upsertApplication = 'INSERT INTO {KEYSPACE}.applications (account, name, appkeyspace, appid, enabled) VALUES($1, $2, $3, $4, $5)';
queries.checkApplication = 'SELECT account, name, appkeyspace, appid, enabled FROM {KEYSPACE}.applications WHERE appid = $1';
queries.selectApplications = 'SELECT account, name, appkeyspace, appid, enabled FROM {KEYSPACE}.applications WHERE account = $1';
queries.updateApplication = 'UPDATE {KEYSPACE}.applications SET name = $1, enabled = $2 WHERE appid = $3';

/**
 * @apiDefine ExamplePostgresApplicationTokens
 */
queries.upsertApplicationToken = 'INSERT INTO {KEYSPACE}.application_tokens (appid, appkeyspace, tokenid, tokensecret, description, enabled) VALUES($1, $2, $3, $4, $5, $6)';
queries.checkApplicationToken = 'SELECT appid, appkeyspace, tokenid, tokensecret, description, enabled FROM {KEYSPACE}.application_tokens WHERE tokenid = $1';
queries.selectApplicationTokens = 'SELECT appid, appkeyspace, tokenid, tokensecret, description, enabled FROM {KEYSPACE}.application_tokens WHERE appid = $1';
queries.updateApplicationToken = 'UPDATE {KEYSPACE}.application_tokens SET enabled = $1, description = $2 WHERE tokenid = $3';
queries.updateApplicationTokenSecret = 'UPDATE {KEYSPACE}.application_tokens SET tokensecret = $1 WHERE tokenid = $2';
queries.removeApplicationToken = 'DELETE FROM {KEYSPACE}.application_tokens WHERE tokenid = $1';

/**
 * @apiDefine ExamplePostgresUser
 */
queries._userSelectFields = '{ALIAS}.user AS "{PREFIX}user", {ALIAS}.altid as {PREFIX}altid, {ALIAS}.username as {PREFIX}username, {ALIAS}.userdata as {PREFIX}userdata';
queries.upsertUser = 'INSERT INTO {KEYSPACE}.users ("user", username, altid, userdata) VALUES($1, $2, $3, $4);';
queries.selectUser = 'SELECT u.user, ' + q(null, '_userSelectFields', { ALIAS: 'u' }) + ' FROM {KEYSPACE}.users u WHERE u.user = $1';
queries.selectUserByUsername = 'SELECT u.user, ' + q(null, '_userSelectFields', { ALIAS: 'u' }) + ' FROM {KEYSPACE}.users u WHERE u.username = $1';
queries.selectUserByAltId = 'SELECT u.user, ' + q(null, '_userSelectFields', { ALIAS: 'u' }) + ' FROM {KEYSPACE}.users u WHERE u.altid = $1';
queries.updateUser = 'UPDATE {KEYSPACE}.users SET username = $1, altid = $2, userdata = $3 WHERE "user" = $4';
queries.removeUser = 'DELETE FROM {KEYSPACE}.users WHERE "user" = $1';

/**
 * @apiDefine ExamplePostgresPosts
 */
queries._postSelectFields = 'p.post AS {PREFIX}post, p.content AS {PREFIX}content, p.content_type AS {PREFIX}content_type, p."user" AS "{PREFIX}user", p.posted AS {PREFIX}posted, p.visibility AS {PREFIX}visibility, p.altid as {PREFIX}altid';
queries.selectPost = 'SELECT ' + q(null, '_postSelectFields') + ', ' + q(null, '_userSelectFields', { ALIAS: 'u', PREFIX: 'user_' }) + ' FROM {KEYSPACE}.posts p, {KEYSPACE}.users u where u.user = p.user AND p.post = $1';
queries.selectPostByAltid = 'SELECT ' + q(null, '_postSelectFields') + ', ' + q(null, '_userSelectFields', { ALIAS: 'u', PREFIX: 'user_' }) + ' FROM {KEYSPACE}.posts p, {KEYSPACE}.users u where u.user = p.user AND p.altid = $1';
queries.upsertPost = 'INSERT INTO {KEYSPACE}.posts (post, "user", content, content_type, posted, visibility, altid) VALUES($1, $2, $3, $4, $5, $6, $7);';
queries.removePost = 'DELETE FROM {KEYSPACE}.posts WHERE post = $1';
queries.removePostByAltid = 'DELETE FROM {KEYSPACE}.posts WHERE altid = $1';
queries.updatePost = 'UPDATE {KEYSPACE}.posts SET content = $1, content_type = $2, visibility = $3 WHERE post = $4';
queries.updatePostByAltid = 'UPDATE {KEYSPACE}.posts SET content = $1, content_type = $2, visibility = $3 WHERE altid = $4';

/**
 * @apiDefine ExamplePostgresFriends
 */
queries._friendSelectFields = 'f.friend AS {PREFIX}friend, f."user" AS "{PREFIX}user", f.user_friend AS {PREFIX}user_friend, f.since AS {PREFIX}since, f.visibility AS {PREFIX}visibility';
queries.selectFriend = 'SELECT ' + q(null, '_friendSelectFields') + ', ' + q(null, '_userSelectFields', { ALIAS: 'u', PREFIX: 'user_' }) + ', ' + q(null, '_userSelectFields', { ALIAS: 'uf', PREFIX: 'user_friend_' }) + ' FROM {KEYSPACE}.friends f, {KEYSPACE}.users u, {KEYSPACE}.users uf WHERE f.user = u.user AND f.user_friend = uf.user AND f.friend = $1';
queries.selectFriends = 'SELECT user_friend, since from {KEYSPACE}.friends WHERE "user" = $1';
queries.upsertFriend = 'INSERT INTO {KEYSPACE}.friends (friend, "user", user_friend, since, visibility) VALUES($1, $2, $3, $4, $5)';
queries.removeFriend = 'DELETE FROM {KEYSPACE}.friends WHERE "user" = $1 AND user_friend=$2';
queries.isFriend = 'SELECT friend, since from {KEYSPACE}.friends WHERE "user" = $1 AND user_friend = $2';

/**
 * @apiDefine ExamplePostgresFriendRequests
 */
queries._friendRequestSelectFields = 'fr.friend_request AS {PREFIX}friend_request, fr."user" AS "{PREFIX}user", fr.user_friend AS {PREFIX}user_friend, fr.message AS {PREFIX}message, fr.since AS {PREFIX}since, fr.visibility AS {PREFIX}visibility';
queries._selectFriendRequestBase = 'SELECT ' + q(null, '_friendRequestSelectFields') + ', ' + q(null, '_userSelectFields', { ALIAS: 'u', PREFIX: 'user_' }) + ', ' + q(null, '_userSelectFields', { ALIAS: 'uf', PREFIX: 'user_friend_' }) + ' FROM {KEYSPACE}.friend_request fr, {KEYSPACE}.users u, {KEYSPACE}.users uf WHERE fr.user = u.user AND fr.user_friend = uf.user';
queries.selectFriendRequest = queries._selectFriendRequestBase + ' AND fr.friend_request = $1';
queries.selectIncomingFriendRequests = queries._selectFriendRequestBase + ' AND fr.user_friend = $1';
queries.selectOutgoingFriendRequests = queries._selectFriendRequestBase + ' AND fr."user" = $1';
queries.upsertFriendRequest = 'INSERT INTO {KEYSPACE}.friend_request (friend_request, "user", user_friend, message, since, visibility) VALUES($1, $2, $3, $4, $5, $6)';
queries.acceptFriendRequest = 'DELETE FROM {KEYSPACE}.friend_request WHERE friend_request = $1';

/**
 * @apiDefine ExamplePostgresFollows
 */
queries._followSelectFields = 'fl.follow AS {PREFIX}follow, fl."user" AS "{PREFIX}user", fl.user_follower AS {PREFIX}user_follower, fl.since AS {PREFIX}since, fl.visibility AS {PREFIX}visibility';
queries._followSelectBase = 'SELECT ' + q(null, '_followSelectFields') + ', ' + q(null, '_userSelectFields', { ALIAS: 'u', PREFIX: 'user_' }) + ', ' + q(null, '_userSelectFields', { ALIAS: 'uf', PREFIX: 'user_follower_' }) + ' FROM {KEYSPACE}.followers fl, {KEYSPACE}.users u, {KEYSPACE}.users uf WHERE fl.user = u.user AND fl.user_follower = uf.user';
queries.selectFollow = queries._followSelectBase + ' AND fl.follow = $1';
queries.selectFollowFromTimeline = queries._followSelectBase + ' AND fl.user = $1 AND fl.user_follower = $2';
queries.selectFollowers = queries._followSelectBase + ' AND fl."user" = $1';
queries.selectFollowersTimeline = queries._followSelectBase + ' AND fl."user" = $1 AND (fl."visibility" = \'{PUBLIC}\' OR fl."visibility" = \'{PERSONAL}\' OR fl."visibility" = \'{PRIVATE}\') ORDER BY since DESC';
queries.selectFollowingTimeline = queries._followSelectBase + ' AND fl."user_follower" = $1 AND (fl."visibility" = \'{PUBLIC}\' OR fl."visibility" = \'{PERSONAL}\' OR fl."visibility" = \'{PRIVATE}\') ORDER BY since DESC';
queries.upsertFollower = 'INSERT INTO {KEYSPACE}.followers (follow, "user", user_follower, since, visibility) VALUES($1, $2, $3, $4, $5);';
queries.upsertFollowerTimeline = null;
queries.upsertFollowingTimeline = null;
queries.removeFollower = 'DELETE FROM {KEYSPACE}.followers WHERE "user" = $1 AND user_follower = $2';
queries.removeFollowerTimeline = null;
queries.removeFollowingTimeline = null;
queries.isFollower = 'SELECT follow, "user", user_follower, since, visibility from {KEYSPACE}.followers WHERE "user" = $1 AND user_follower = $2';
queries.selectFollowersCount = 'SELECT count(*) as "count" FROM {KEYSPACE}.followers WHERE "user" = $1';
queries.selectFollowingCount = 'SELECT count(*) as "count" FROM {KEYSPACE}.followers WHERE "user_follower" = $1';

/**
 * @apiDefine ExamplePostgresCounts
 */
queries.updateCounter = null; // We use table counts, the null means no query is executed.
queries.selectCount = 'SELECT count(*) as "count" FROM {KEYSPACE}.{TYPE} WHERE "{ITEM}" = $1';

/**
 * @apiDefine ExamplePostgresLikes
 */
queries._likeSelectFields = 'l."like" AS "{PREFIX}like", l.item AS {PREFIX}item, l."user" AS "{PREFIX}user", l.since AS {PREFIX}since, l.visibility AS {PREFIX}visibility';
queries.selectLike = 'SELECT ' + q(null, '_likeSelectFields') + ', ' + q(null, '_userSelectFields', { ALIAS: 'u', PREFIX: 'user_' }) + ' FROM {KEYSPACE}.likes l, {KEYSPACE}.users u WHERE l.user = u.user AND l."like" = $1';
queries.checkLike = 'SELECT "like", "user", since FROM {KEYSPACE}.likes WHERE "user" = $1 AND item = $2';
queries.upsertLike = 'INSERT INTO {KEYSPACE}.likes ("like", "user", item, since, visibility) VALUES($1, $2, $3, $4, $5);';
queries.removeLike = 'DELETE FROM {KEYSPACE}.likes WHERE "user" = $1 AND item = $2';

/**
 * @apiDefine ExamplePostgresFeed
 */
queries.selectTimeline = 'SELECT tl."user", tl.time, tl.time as date, tl.item, tl.type, tl.visibility, tl.from_follow, ' +
                         q(null, '_userSelectFields', { ALIAS: 'u', PREFIX: 'user_' }) + ', ' +
                         q(null, '_postSelectFields', { PREFIX: 'post_' }) + ', ' +
                         q(null, '_likeSelectFields', { PREFIX: 'like_' }) + ', ' +
                         q(null, '_friendSelectFields', { PREFIX: 'friend_' }) + ', ' +
                         q(null, '_followSelectFields', { PREFIX: 'follow_' }) + ' ' +
                         'FROM {KEYSPACE}.{TIMELINE} tl ' +
                         'INNER JOIN {KEYSPACE}.users u ON (tl."user" = u."user") ' +
                         'LEFT OUTER JOIN {KEYSPACE}.posts p ON (tl.item = p.post and tl.type = \'post\') ' +
                         'LEFT OUTER JOIN {KEYSPACE}.likes l ON (tl.item = l.like and tl.type = \'like\') ' +
                         'LEFT OUTER JOIN {KEYSPACE}.friends f ON (tl.item = f.friend and tl.type = \'friend\') ' +
                         'LEFT OUTER JOIN {KEYSPACE}.followers fl ON (tl.item = fl.follow and tl.type = \'follow\') ' +
                         'WHERE tl."user" = $1{TYPEQUERY}{OLDERTHANQUERY}' +
                         'ORDER BY time DESC';

queries.upsertUserTimeline = 'INSERT INTO {KEYSPACE}.{TIMELINE} ("user", item, type, time, visibility, from_follow) VALUES($1, $2, $3, $4, $5, $6);';
queries.removeFromTimeline = 'DELETE FROM {KEYSPACE}.{TIMELINE} WHERE "user" = $1 AND time = $2';
queries.selectAllItems = 'SELECT "user", time FROM {KEYSPACE}.{TIMELINE} WHERE item = $1';
queries.selectAllFollowItems = 'SELECT "user", time FROM {KEYSPACE}.{TIMELINE} WHERE from_follow = $1';
queries.typeQuery = ' AND tl.type = $2';
queries.olderThanQuery = ' AND tl.time <= $2';

module.exports = q;
