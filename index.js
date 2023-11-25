const canonize = require('rdf-canonize');
const { rdfTransformString } = require('./util.js');
const md5 = require('md5');
const fs = require('fs');

const input = process.argv[2];

if (! input) {
    console.error(`usage: index.js file`);
    process.exit(1);
}

main(input);

async function main(path) {
    const data = fs.readFileSync(path, { encoding: 'utf-8'});
    const nquads = await rdfTransformString(data,path,'application/n-quads');

    console.log(`# input nquads`);
    console.log(nquads);

    const canonical = await canonize.canonize(nquads, {
        algorithm: 'RDFC-1.0',
        inputFormat: 'application/n-quads'
    });

    console.log(`# output nquads`);
    console.log(canonical);

    console.log(`# checksum`);
    console.log(md5(canonical));
}
