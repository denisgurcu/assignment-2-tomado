import { useEffect, useState } from 'react';
import axios from 'axios';
// this is for drag an drop
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import CategoryFilter from './CategoryFilter';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import CategoryManagerModal from './CategoryManagerModal';
import './TaskBoard.css';

// setting up the structure for your 3 columns on the board
const initialColumns = {
  not_started: { name: 'Not Started', color: 'var(--orange)', items: [] },
  in_progress: { name: 'In Progress', color: 'var(--yellow)', items: [] },
  done: { name: 'Done', color: 'var(--green)', items: [] }
};

export default function TaskBoard() {
  // states for managing tasks, categories, modals etc.
  const [columns, setColumns] = useState(initialColumns);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState('not_started');
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);


  // Get all tasks from the backend and put them into the right column
  const fetchTasks = () => {
    axios.get('http://localhost:3000/tasks')
      .then(res => {
        console.log(' Tasks returned:', res.data);
        const freshColumns = {
          not_started: { name: 'Not Started', color: 'var(--orange)', items: [] },
          in_progress: { name: 'In Progress', color: 'var(--yellow)', items: [] },
          done: { name: 'Done', color: 'var(--green)', items: [] }
        };


        res.data.forEach(task => {
          const status = task.status || 'not_started';
          if (!freshColumns[status]) {
            freshColumns[status] = { name: status, color: 'gray', items: [] };
          }

          // Organize each task under its column
          freshColumns[status].items.push({
            id: task.id, //  keep it numeric
            title: task.title,
            description: task.description,
            category: task.category_name,
            category_id: task.category_id,
            category_emoji: task.category_emoji,
            image: task.file_name,      //  Add image
            status: task.status
          });
        });

        setColumns(freshColumns);
      })
      .catch(err => console.error('Error fetching tasks:', err));
  };

  // get categories from the backend
  const fetchCategories = () => {
    axios.get('http://localhost:3000/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error fetching categories:', err));
  };

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  // this handles what happens when you drag and drop a task
  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    // move the task in the frontend
    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const sourceItems = [...sourceCol.items];
    const destItems = [...destCol.items];
    const [movedItem] = sourceItems.splice(source.index, 1);
    movedItem.status = destination.droppableId;
    destItems.splice(destination.index, 0, movedItem);

    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceCol, items: sourceItems },
      [destination.droppableId]: { ...destCol, items: destItems }
    });

    // update the task status in the backend as well
    axios.put(`http://localhost:3000/tasks/${movedItem.id}`, {
      title: movedItem.title,
      description: movedItem.description,
      category_id: movedItem.category_id,
      status: movedItem.status
    }).catch(err => {
      console.error("Error updating task status:", err);
      alert("Failed to update task status.");
    });
  };

  // delete a task on the board itself both from frontend and backend
  const handleDelete = (taskId) => {
    const numericId = parseInt(taskId); // 
    axios.delete(`http://localhost:3000/tasks/${numericId}`)
      .then(() => {
        fetchTasks(); // Refresh from backend
      })
      .catch((err) => {
        console.error('Error deleting task:', err);
        alert('Failed to delete task from the backend.');
      });
  };


  return (
    <div className="task-board">
      <h2 className="board-title">TO-DO LIST</h2>
      <p className="board-subtitle">
  Add tasks, attach images, assign categories, and <span className="highlight">drag</span> & <span className="highlight">drop</span> them as you move forward. You can also filter, add, delete, and customize categories to keep things organized your way.
</p>

      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        onManageClick={() => setShowCategoryManager(true)}
      />

      <CategoryManagerModal
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
        categories={categories}
        onCategoryChange={fetchCategories}
        onCategoryDeleted={fetchTasks}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board-columns">
          {Object.entries(columns).map(([columnId, column]) => (
            <Droppable key={columnId} droppableId={columnId}>
              {(provided) => (
                <div className="column" ref={provided.innerRef} {...provided.droppableProps}>
                  <div className="column-header">
                    <span className="dot" style={{ backgroundColor: column.color }}></span>
                    <h3>{column.name}</h3>
                  </div>

                  <div className="droppable-area">
                    {column.items
                      .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
                      .map((item, index) => (
                        <Draggable
                          key={item.id} 
                          draggableId={`task-${item.id}`} 
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard
                                task={item}
                                onDelete={() => handleDelete(item.id)}
                                onEdit={() => {
                                  setSelectedTask(item);
                                  setEditModalOpen(true);
                                }}
                              />

                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                    <button className="new-task" onClick={() => {
                      setModalOpen(true);
                      setActiveColumn(columnId);
                    }}>+ New</button>
                  </div>
                </div>
              )}


            </Droppable>
          ))}

          {/* Edit Modal OUTSIDE the map */}
          {editModalOpen && selectedTask && (
            <EditTaskModal
              isOpen={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              task={selectedTask}
              onUpdate={() => {
                fetchTasks();
                setEditModalOpen(false);
              }}
            />
          )}
        </div>
      </DragDropContext>

      <AddTaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentColumn={activeColumn}
        onAdd={fetchTasks}
      />
    </div>
  );
}
