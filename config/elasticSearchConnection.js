require('dotenv').config();
const elasticsearch = require("elasticsearch");

const elasticSearchConnection = () => {
    let esClient;

    if(esClient){
        return esClient;
    } else {
        esClient = elasticsearch.Client({
            host: process.env.ELASTICSEARCH_URL,
        });
        return esClient;
    }
}

module.exports = elasticSearchConnection();