riakvm
======

[![Build
Status](https://travis-ci.org/wlaurance/riakvm.png)](https://travis-ci.org/wlaurance/riakvm)
[![Dependency
Status](https://david-dm.org/wlaurance/riakvm.png)](https://david-dm.org/wlaurance/riakvm)

cli to build riak instances

Dependencies besides package.json deps
--------------------------------------
* [Read building riak from
source](http://docs.basho.com/riak/1.3.0/tutorials/installation/Installing-Riak-from-Source/)


Usage
------
```
  Usage: riakvm [options] [command]

  Commands:

    create <version>       create riak instance of version
    ls [regex]             list remote versions of Riak

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -w, --where [dir]    where to create instance, defaults to cwd
    -n, --name [string]  name the output folder, defaults to untar name
    -d, --disco          add color to the download progress bar; alias riakvm="riakvm -d" to persist ;)
```

Know versions to work
---------------------
```
  riakvm create 1.4.0
  riakvm create 1.3.0
  riakvm create 1.2.0
```
