const canonize = require('rdf-canonize');
const stringifyStream = require('stream-to-string');
const streamifyString = require('streamify-string');
const rdfParser = require("rdf-parse").default;
const rdfSerializer = require("rdf-serialize").default;
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

async function rdfTransformString(data, fileName, outType) {
    const inStream = streamifyString(data);

    // Guess the content-type from the path name
    const quadStream = rdfParser.parse(inStream, { 
        path:fileName ,
    });

    const outStream = rdfSerializer.serialize(quadStream, { contentType: outType });

    return await stringifyStream(outStream);
}