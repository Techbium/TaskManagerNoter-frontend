import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskModal from './TaskModal';
import axios from 'axios';

const columns = ['To Do', 'In Progress', 'Done'];

function TaskBoard({ tasks, setTasks }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId) return;

    const task = tasks.find((t) => t.id.toString() === result.draggableId);
    const updatedTask = { ...task, status: destination.droppableId };

    try {
      await axios.put(
        `https://taskmanagernoter.onrender.com/tasks/${task.id}`,
        { status: updatedTask.status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const openModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4">
      <button
        onClick={() => openModal()}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Task
      </button>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((col) => (
            <Droppable key={col} droppableId={col}>
              {(provided) => (
                <div
                  className="bg-gray-200 p-4 rounded-lg"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <h3 className="text-lg font-semibold mb-4">{col}</h3>
                  {tasks
                    .filter((task) => task.status === col)
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="bg-white p-3 mb-2 rounded shadow cursor-pointer"
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            onClick={() => openModal(task)}
                          >
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-gray-600">{task.description}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
        setTasks={setTasks}
      />
    </div>
  );
}

export default TaskBoard;