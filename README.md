# mongo-query-cli

## How to install

Start from installing package via npm globally:

```bash
$: npm install -g mongo-query-cli
```

## Commands

Normally you would like to start with existing default connection or create your own:


### mq connections

Returns all connections available and stored.

```bash
$: mq connections
```

### mq create

You can create new database connection and save it to settings, questions will be prompted:

```bash
$: mq create
Connection name: yourName
Connection url: mongodb://user:pass@example.com:37017
Database name: production

New connection "yourName" was successfully created
```

### mq remove <connection name>

Removes database connection from settings, name is required:

```bash
$: mq remove yourName
```

### mq set [options] <connection name>

Changes data in existing connection,

Options available:

- ``--db <new name>`` - change db name,
- ``--url <new url>`` - change connection url,
- ``--name <new name>`` - change connection name,
- ``--active`` - set this connection as active

## Help

You can find descriptions of all commands with:

``mq --help``

## Why?!

Because it's sometimes very annoying to type long queries in mongo shell, and I don't like GUI apps for that :)