import faiss from 'faiss-node';
const index = new faiss.IndexFlatIP(3);
index.add([1,0,0, 0,1,0]);
const res = index.search([1,0,0], 1);
console.log(res);
