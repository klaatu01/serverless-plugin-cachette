# serverless-plugin-cachette
[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)

Serverless plugin for retreiving and caching files in lambda file system.

## Features

Supported Runtimes:
* [x] http
* [ ] s3

## Install

### Serverless

```sh
serverless plugin install --name serverless-plugin-cachette
```

### Manually

```sh
yarn add --dev serverless-plugin-cachette
# or
npm install -D serverless-plugin-cachette
```

Add the following plugin to your `serverless.yml`:

```yaml
plugins:
  - serverless-plugin-cachette
```

#### Example Configuration:

```yaml
custom:
  cachette:
    - type: http
      fileName: test.json
      url: "https://test.com/my-file.json"
      method: post
      headers:
        api-key: mysecret
        anotherHeader: content
```

For more information on Cachette and configuring look at its [repo](https://www.github.com/klaatu01/cachette)

### Including/Excluding functions

If no `include` or `exclude` list is specified this will apply the cache to all layers by default.
If you would like to apply a cache to one or more functions: add the function name to an `include` list.
If you would like to not apply a cache to one or more functions: add the function name to the `exclude` list.

note: you cannot have both an `include` and `exclude` list on the same cache.


```yaml
functions:
  functionA:
    handler: handler.handler
    events:
      - http:
          method: get
          path: a
  functionB:
    handler: handler.handler
    events:
      - http:
          method: get
          path: b

custom:
  cachette:
    - type: http
      ...
      include:
        - functionA
    - type: http
      ...
      exclude:
        - functionA
    - type: http
      ...
```

### Target Types

Here are some of the methods you can use to pull and store data.

#### HTTP Target

Will make a HTTP request to a provided `url` and store the response body as bytes to `/tmp/<fileName>`

```yaml
type: http
fileName: <fileName>
url: <url>
method: <post|get|...>
headers: # This is optional
  <header-key>: <header-value>
```
