import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import CategoryFilter from './CategoryFilter';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import CategoryManagerModal from './CategoryManagerModal';
import { fetchTasks, updateTask, deleteTask } from '../api/tasksApi';
import { fetchCategories } from '../api/categoriesApi';
import './TaskBoard.css';

// Initial column setup
const initialColumns = {
  not_started: { name: 'Not Started', color: 'var(--orange)', items: [] },
  in_progress: { name: 'In Progress', color: 'var(--yellow)', items: [] },
  done: { name: 'Done', color: 'var(--green)', items: [] }
};

export default function TaskBoard() {
  const [columns, setColumns] = useState(initialColumns);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState('not_started');
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Fetch tasks and organize them into columns
  const loadTasks = async () => {
    try {
      const tasks = await fetchTasks();
      const freshColumns = {
        not_started: { name: 'Not Started', color: 'var(--orange)', items: [] },
        in_progress: { name: 'In Progress', color: 'var(--yellow)', items: [] },
        done: { name: 'Done', color: 'var(--green)', items: [] }
      };

      tasks.forEach(task => {
        const status = task.status || 'not_started';
        if (!freshColumns[status]) {
          freshColumns[status] = { name: status, color: 'gray', items: [] };
        }

        freshColumns[status].items.push({
          id: task.id,
          title: task.title,
          description: task.description,
          category: task.category_name,
          category_id: task.category_id,
          category_emoji: task.category_emoji,
          image: task.file_name,
          status: task.status
        });
      });

      setColumns(freshColumns);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  // Fetch categories from the backend
  const loadCategories = async () => {
    try {
      const categories = await fetchCategories();
      setCategories(categories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Fetch tasks and categories on mount
  useEffect(() => {
    loadTasks();
    loadCategories();
  }, []);

  // Handle drag & drop functionality
  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

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

    try {
      await updateTask(movedItem.id, {
        title: movedItem.title,
        description: movedItem.description,
        category_id: movedItem.category_id,
        status: movedItem.status
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status.");
    }
  };

  // Delete a task from the frontend and backend
  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      loadTasks(); // Refresh tasks
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task from the backend.');
    }
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
        onCategoryChange={loadCategories}
        onCategoryDeleted={loadTasks}
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
        </div>
      </DragDropContext>

      <AddTaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentColumn={activeColumn}
        onAdd={loadTasks}
      />

      {editModalOpen && selectedTask && (
        <EditTaskModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          task={selectedTask}
          onUpdate={loadTasks}
        />
      )}
    </div>
  );
}