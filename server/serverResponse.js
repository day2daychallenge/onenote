module.exports  = class ServerResponse {
    constructor({headers  = {}, status = 200, body = {}}) {
        this.headers = {
            ...headers,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
            "Content-Type": "application/json"
        }

        this.status  =  status;
        this.body = {
            ...body
        }
    }
}