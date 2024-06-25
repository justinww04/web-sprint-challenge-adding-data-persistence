const db = require("../../data/dbConfig")

module.exports = {
    findAll,
    create
}

async function findAll() {
    const result = await db("tasks as t")
    .join("projects as p","t.project_id","p.project_id");
    const returnResult = result.map(n => {
        if (!n.task_completed) {
            return { ...n, task_completed: false }
        } else if (n.task_completed) {
            return { ...n, task_completed: true }
        } else {
            return n;
        }
    })
    return returnResult;
}



async function create(createdTask) {
    const new_task_id = await db("tasks").insert(createdTask);
    const interimValue = await db("tasks").where("task_id", new_task_id[0]);
    const returnValue = interimValue.map(n => {
        if (n.task_completed) {
            return { ...n, task_completed: true }
        } else if (!n.task_completed) {
            return { ...n, task_completed: false }
        } else {
            return n
        }
    })
    return returnValue[0];
}