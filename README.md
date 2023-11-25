# RDF-CANON

An RDF canonicalization experiment.

## INSTALL

```
npm install
```

## RUN

Make a canoncalization of an RDF model in N-Quads `examples/alice/alice.nq`:

```
node index.js examples/alice/alice.nq
```

Compare the result with the same RDF model in Tutle `examples/alice/alice.ttl`:

```
node index.js examples/alice/alice.ttl
```

The canonicalization and the MD5 hash of this result should be the same for both serializations.

## PACKAGE

Package is an attempt to package an RDF model in RDF using lists.

Create a package out of the files above:

```
node package.js examples/alice/alice.nq > examples/package/alice_nq_package.ttl
node package.js examples/alice/alice.ttl > examples/package/alice_ttl_package.ttl
```

Observe how the RDF packaging creates different models due to the ordering of triples in the different serializations (which has effect on the ordering of triples in the lists).

Check that also after canonicalization the checksums differ:

```
node package.js examples/package/alice_nq_package.ttl
node package.js examples/package/alice_ttl_package.ttl
```