import { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import CategoryFilter from './CategoryFilter';
import AddTaskModal from './AddTaskModal';

import './TaskBoard.css';

// Initial empty column structure
const initialColumns = {
  not_started: { name: 'Not Started', color: 'var(--orange)', items: [] },
  in_progress: { name: 'In Progress', color: 'var(--yellow)', items: [] },
  done: { name: 'Done', color: 'var(--green)', items: [] }
};

export default function TaskBoard() {
  const [columns, setColumns] = useState(initialColumns);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState('not_started');


  // ✅ Fetch tasks on first load
  useEffect(() => {
    axios.get('http://localhost:3000/tasks')
      .then((res) => {
        const tasks = res.data;
        const updated = { ...initialColumns };

        tasks.forEach((task) => {
          const status = task.status || 'not_started';
          if (!updated[status]) {
            updated[status] = { name: status, color: 'gray', items: [] };
          }

          updated[status].items.push({
            id: task.id.toString(),
            title: task.title,
            description: task.description,
            category: task.category_name,
            category_id: task.category_id,
            status: task.status
          });
        });

        setColumns(updated);
      })
      .catch((err) => {
        console.error('Error fetching tasks:', err);
      });
  }, []);

  // ✅ Handle drag & update column state
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const sourceItems = [...sourceCol.items];
    const destItems = [...destCol.items];
    const [movedItem] = sourceItems.splice(source.index, 1);
    movedItem.status = destination.droppableId; // update local task status
    destItems.splice(destination.index, 0, movedItem);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceCol,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destCol,
        items: destItems
      }
    });

    // ✅ OPTIONAL: Send PATCH to backend (you can uncomment this later)
    /*
    axios.put(`http://localhost:3000/tasks/${movedItem.id}`, {
      ...movedItem,
      status: destination.droppableId
    }).catch((err) => console.error('Error updating status:', err));
    */
  };

  // ✅ Handle deleting a task
  const handleDelete = (taskId, colId) => {
    const updated = { ...columns };
    updated[colId].items = updated[colId].items.filter(task => task.id !== taskId);
    setColumns(updated);

    axios.delete(`http://localhost:3000/tasks/${taskId}`)
      .catch((err) => console.error('Error deleting task:', err));
  };

  return (
    <div className="task-board">
      <h2 className="board-title">To-Do</h2>
      <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board-columns">
          {Object.entries(columns).map(([columnId, column]) => (
            <Droppable key={columnId} droppableId={columnId}>
              {(provided) => (
                <div
                  className="column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="column-header">
                    <span className="dot" style={{ backgroundColor: column.color }}></span>
                    <h3>{column.name}</h3>
                  </div>

                  <div className="droppable-area">
                    {column.items
                      .filter(item =>
                        selectedCategory === 'All' || item.category === selectedCategory
                      )
                      .map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id.toString()}
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
                                onDelete={() => handleDelete(item.id, columnId)}
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
        <AddTaskModal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  currentColumn={activeColumn}
  onAdd={() => {
    // ✅ Re-fetch tasks after adding to get fresh, correct data
    axios.get('http://localhost:3000/tasks')
      .then((res) => {
        const tasks = res.data;
        const updated = { ...initialColumns };

        tasks.forEach((task) => {
          const status = task.status || 'not_started';
          if (!updated[status]) {
            updated[status] = { name: status, color: 'gray', items: [] };
          }

          updated[status].items.push({
            id: task.id.toString(),
            title: task.title,
            description: task.description,
            category: task.category_name,
            category_id: task.category_id,
            status: task.status
          });
        });

        setColumns(updated);
      })
      .catch((err) => {
        console.error('Error re-fetching tasks after add:', err);
      });
  }}
/>


      </DragDropContext>


    </div>

  );
}
