const tableService = require("./tables.service");

function tableExists(req, res, next){
const {tableId} = req.params
const table = await  tableService.read(tableId)
if(table){
    res.locals.table = table
    return next()
}
next({status:400, message: "Table cannot be found"})
}

function read (req, res, next){
const {table} = res.locals
res.json({ data: table})
}

module.exports = {
    read: [tableExists, read]
}