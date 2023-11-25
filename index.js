const canonize = require('rdf-canonize');


const nquads = `
_:genid1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://rule.org/ForwardRule> .
_:genid1 <http://rule.org/premise> _:genid4 .
_:genid1 <http://rule.org/vars> _:genid2 .
_:genid2 <http://www.w3.org/1999/02/22-rdf-syntax-ns#first> _:genid3 .
_:genid2 <http://www.w3.org/1999/02/22-rdf-syntax-ns#rest> <http://www.w3.org/1999/02/22-rdf-syntax-ns#nil> .
_:genid5 <http://www.w3.org/1999/02/22-rdf-syntax-ns#first> _:genid3 .
_:genid5 <http://www.w3.org/1999/02/22-rdf-syntax-ns#rest> _:genid6 .
_:genid6 <http://www.w3.org/1999/02/22-rdf-syntax-ns#first> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> .
_:genid6 <http://www.w3.org/1999/02/22-rdf-syntax-ns#rest> _:genid7 .
_:genid7 <http://www.w3.org/1999/02/22-rdf-syntax-ns#first> _:genid8 .
_:genid7 <http://www.w3.org/1999/02/22-rdf-syntax-ns#rest> <http://www.w3.org/1999/02/22-rdf-syntax-ns#nil> .
_:genid4 <http://www.w3.org/1999/02/22-rdf-syntax-ns#first> _:genid5 .
_:genid4 <http://www.w3.org/1999/02/22-rdf-syntax-ns#rest> <http://www.w3.org/1999/02/22-rdf-syntax-ns#nil> .
`;

main();

async function main() {
    const canonical = await canonize.canonize(nquads, {
        algorithm: 'RDFC-1.0',
        inputFormat: 'application/n-quads'
    });

    console.log(canonical);
}