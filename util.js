const N3 = require('n3');
const stringifyStream = require('stream-to-string');
const streamifyString = require('streamify-string');
const rdfParser = require("rdf-parse").default;
const rdfSerializer = require("rdf-serialize").default;
const fs = require('fs');

async function rdfTransformString(data, fileName, outType) {
    const inStream = streamifyString(data);

    // Guess the content-type from the path name
    const quadStream = rdfParser.parse(inStream, { 
        path:fileName ,
    });

    const outStream = rdfSerializer.serialize(quadStream, { contentType: outType });

    return await stringifyStream(outStream);
}

async function parseAsN3Store(path) {
    const rdfData = '' + fs.readFileSync(path, {encoding:'utf8', flag:'r'});

    const n3Data = await rdfTransformString(rdfData, path, 'text/n3');
    
    const store = await parseStringAsN3Store(n3Data);

    return store;
}

async function parseStringAsN3Store(n3Data, options) {
    const parser       = new N3.Parser(options);
    const store        = new N3.Store();
  
    return new Promise((resolve, reject) => {
      parser.parse(n3Data, (error, quad, _) => {
        if (error) {
          reject(error);
        }
        else if (quad) {
          store.addQuad(quad);
        }
        else {
          resolve(store);
        }
      });
    });
}

async function rdfTransformStore(store, outType) {
    
    const outStream = rdfSerializer.serialize(
        store.match(undefined,undefined,undefined,undefined), { contentType: outType } 
    );

    return await stringifyStream(outStream);
}

module.exports = { rdfTransformString , rdfTransformStore , parseAsN3Store , parseStringAsN3Store };