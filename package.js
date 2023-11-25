const N3 = require('n3');
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

    let listNode = blankNode();

    outstore.add(
        quad(
            namedNode(`${EX}MyPackage`),
            namedNode(`${EX}contains`),
            listNode
        )
    );

    let listNodes = [];

    for (const q of instore) {

        // Nested lists...
        let bn = blankNode() ;

        addAsList(outstore,bn,[ q.subject, q.predicate, q.object ]);

        listNodes.push(bn);
    }

    addAsList(outstore,listNode,listNodes);

    console.log(await rdfTransformStore(outstore,'text/turtle'));
}

function addAsList(store,subject,nodes) {
    const RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';

    let bn = subject;

    for (let i = 0 ; i < nodes.length ; i++) {
        let node = nodes[i];
       
        store.add(
            quad(
               bn,
               namedNode(`${RDF}first`),
               node
            )
        );

        let bnext = blankNode();

        if (i < nodes.length - 1 ) {
            store.add(
                quad(
                bn,
                namedNode(`${RDF}rest`),
                bnext               
                )
            );
        }
        else {
            store.add(
                quad(
                   bn,
                   namedNode(`${RDF}rest`),
                   namedNode(`${RDF}nil`)
                )
            );
        }

        bn = bnext;
    }
}