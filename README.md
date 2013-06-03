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

### --dbs

Shows available databases on your current connection

```bash
dmitri$: mq --dbs

// output will look like
local
test
development
```

### --collections

Shows available databases on your current connection

### --find, -F

Find documents in your mongodb

```bash
dmitri$: mq collection --find "_id: 123" "name: John"

// will output specific document
{
	"_id" : ObjectId("5188c15eb685650d05000079"),
	"name" : "John",
	"email" : "john@example.com",
}
```

### --update, -U

Use it together with ``--find`` to specify document:

```bash
dmitri$: mq collection --find "_id: 123" --update "name: Simon"

// will output updated document in your bash
{
	"_id" : ObjectId("5188c15eb685650d05000079"),
	"name" : "Simon",
	"email" : "john@example.com",
}
```

Or without ``--find`` query will update all documents in collection:

```bash
dmitri$: mq collection --update "easy: true"

// will output number of documents updated
updated 1500 documents in collection 'yourCollectionName'
```

Of course you can try something more complicated:

```bash
dmitri$: mq collection --update "data.paymentTerm: { date: new Date(), title: 'My title' }"

// will output updated document in your bash
{
	"_id" : ObjectId("5188c15eb685650d05000079"),
	"title" : "My title"
	"data" : {
		"paymentTerm" : ISODate("2013-05-07T08:54:54.604Z")
	},
	"email" : "john@example.com"
}
```

### --save -S

Save output to the file:

```bash
dmitri$: mq collection --find "_id: 123" --save "test.log"

// will output
document saved to test.log
```

## Why?!

Because it's sometimes very annoying to type long queries in mongo shell, and I don't like GUI apps for that :)