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

### Notes

#### 1

To fix the c14n issue canonicalization needs to be part of packaging process itself. 

But, canonicalization results in an _ordered_ list of NQuads. This ordering needs to be maintained through the packaging process. It can't be that the c14n NQuads are processed further in a 
pipeline and result in a different order.

This will make a toolchain ordering dependent, for which there are no guarantees.

#### 2

It is unclear how to package lists. E.g.

```
:Alice :counts (1 2).
```

Should this be packaged as:

```
:MyPackage :contains (
    ( :Alice :counts (1 2) )
) .
```

or

```
:MyPackage :contains (
   ( :Alice :counts _:bn0 )
   ( _:bn0 rdf:first 1 )
   ( _:bn0 rdf:rest _:bn1 )
   ( _:bn1 rdf:first 2 )
   ( _:bn1 rdf:rest rdf:nil )
) .
```

Both lead to a different canonicalization result. This proves that canoncalization should be
external to the packaging process, plus the result of the canonicalization needs to have 
an agreement how to be written into rdflingua format (if further nested packaging is required).

#### 3

Should

```
:Alice :sends { :Alice :likes :Bob }.
```

be packaged as:

```
:MyPackage :contains (
    ( :Alice :sends ( :Alice :likes :Bob ) )
).
```

the longer first rest version.

And. have the same package result as:

```
:Alice :sends ( :Alice :likes :Bob ).
```

If N3 GraphTerms are not supported in the to be packaged format, how can N3-Built-ins then be transported?