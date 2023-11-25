const N3 = require('n3');
const fs = require('fs');
const { parseAsN3Store , rdfTransformStore } = require('./util.js');
const { DataFactory } = N3;
const { namedNode, blankNode, quad } = DataFactory;

const input = process.argv[2];

if (! input) {
    console.error(`usage: package.js file`);
    process.exit(1);
}

main(input);

async function main(path) {
    const instore = await parseAsN3Store(path);
    const outstore = new N3.Store();
    const EX = 'https://example.org/#';
    const RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';

    let listNode = blankNode();

    outstore.add(
        quad(
            namedNode(`${EX}MyPackage`),
            namedNode(`${EX}contains`),
            listNode
        )
    );

    let c = 0;

    for (const q of instore) {
        c++;
        let nextNode = blankNode();

        // Nested lists...
        let t1 = blankNode() ;
        let t2 = blankNode() ;
        let t3 = blankNode() ;

        outstore.add(
            quad(
                listNode,
                namedNode(`${RDF}first`),
                t1
            )
        )

        outstore.add(
            quad(
               t1,
               namedNode(`${RDF}first`),
               q.subject
            )
        );

        outstore.add(
            quad(
               t1,
               namedNode(`${RDF}rest`),
               t2               
            )
        );

        outstore.add(
            quad(
               t2,
               namedNode(`${RDF}first`),
               q.predicate
            )
        );

        outstore.add(
            quad(
               t2,
               namedNode(`${RDF}rest`),
               t3               
            )
        );

        outstore.add(
            quad(
               t3,
               namedNode(`${RDF}first`),
               q.object
            )
        );

        outstore.add(
            quad(
               t3,
               namedNode(`${RDF}rest`),
               namedNode(`${RDF}nil`)
            )
        );

        // End nesting
        
        if (c == instore.size) {
            outstore.add(
                quad(
                   listNode,
                   namedNode(`${RDF}rest`),
                   namedNode(`${RDF}nil`)
                )
            );
        }
        else {
            outstore.add(
                quad(
                   listNode,
                   namedNode(`${RDF}rest`),
                   nextNode
                )
            );
        }

        listNode = nextNode;
    }

    console.log(await rdfTransformStore(outstore,'text/turtle'));
}