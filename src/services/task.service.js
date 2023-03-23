const db = require('../../_helpers/db');
const Task = db.Task;

module.exports = {
  create,
  modify,
  deleteTask,
  getById,
  getAll,
};

//CREATE
async function create(userParam) {
  const task = new Task(userParam);

  await task.save();

  return task;
}

//MODIFY
async function modify(id, changes) {
  const task = await Task.findOneAndUpdate(
    { _id: id },
    { $set: changes },
    { returnNewDocument: true },
    (err, task) => {
      if (err) throw err;
      return task;
    }
  );

  if (task === null)
    return {
      errors: [
        {
          msg: 'There is no task with that ID.',
          location: 'body',
        },
      ],
    };
  else return task;
}

//DELETE
async function deleteTask(id) {
  const task = await Task.deleteOne({ _id: id });

  if (task.n === 0)
    return {
      errors: [
        {
          msg: 'There is no task with that ID.',
          location: 'body',
        },
      ],
    };
  else return { message: 'The specified task was deleted.' };
}

//GET TASK
async function getById(id) {
  const task = await Task.findById(id);
  if (!task) return {
    errors: [
      {
        msg: 'There is no task with that ID.',
        location: 'body',
      },
    ],
  };
  else return task;
}

//GET ALL TASKS
async function getAll(queryParams) {
  // defaults/formats the page and limit parameters
  let page = Number(queryParams.page),
    limit = Number(queryParams.limit);

  !limit || limit < 1 || (isNaN(limit) && (limit = 10));

  !page || page <= 1 || isNaN(page) ? (page = 0) : (page = (page - 1) * limit);

  // filtering options
  const filter = {};

  queryParams.name &&
    (filter.name = { $regex: queryParams.name, $options: 'i' });

  queryParams.description &&
    (filter.description = { $regex: queryParams.description, $options: 'i' });

  queryParams.completed && (filter.completed = { $eq: queryParams.completed });

  //db query
  return await Task.find(filter).sort({ createdAt: 1 }).skip(page).limit(limit);
}
