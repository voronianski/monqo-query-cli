# mongo-query-cli

## How to install

Start from installing package via npm globally:

```bash
$ npm install -g mongo-query-cli
```

## Commands

Normally you would like to start with existing default connection or create your own:


### mq connections

Returns all connections available and stored.

```bash
$ mq connections
```

### mq create

You can create new database connection and save it to settings, questions will be prompted:

```bash
$ mq create
Connection name: yourName
Connection url: mongodb://user:pass@example.com:37017
Database name: production

New connection "yourName" was successfully created
```

### mq remove <connection name>

Removes database connection from settings, name is required:

```bash
$ mq remove yourName
```

### mq set [options] <connection name>

Changes data in existing connection,

Options available:

- ``--db <new name>`` - change db name,
- ``--url <new url>`` - change connection url,
- ``--name <new name>`` - change connection name,
- ``--active`` - set this connection as active

### mq --help

You can find descriptions of all commands.

---

mq

-h --help
-s --save filename

mq connections
mq create
mq setup --db <dbname> --url <dburi> --name <connectionname> --active
mq delete <connectionname>

mq show dbs
mq show collections
mq show info

mq find -c <cname> "query" --count
mq update -c <cname> -f "query" -u "query" --count
mq remove -c <cname> "query" --one

query = string ""

example queries:
"_id: 100" / "_id: 100 && name: 'John'" / "exist('field')" / "notExist('field')"

$type operator helpers implementation:
-isString('field')
-isArray('field')
-isObject('field')
-isBoolean('field')
-isBinary('field')
-isDate('field')
-isObjectId('field')
-isTimestamp('field')
-isNull('field')
-isRegexp'field'

$exists operator:
-exist('field')
-notExist('field')

$ne operator:
not('field: data')

$and:
&&

$or:
||

---

(c) 2013 MIT License
