import { useState , useEffect} from 'react'
import {BrowserRouter as Router, Route }from 'react-router-dom'
import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'
import background from "./images/1.jpeg"
/*for class method, import React from 'react*/
function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState( [
    {id: 1,
    text: 'Doctor Appointment',
    day: 'Feb 5th at 2:30pm',
    reminder: true},
    {id: 2,
        text: 'Dentist Appointment',
        day: 'Feb 7th at 1:30pm',
        reminder: true},
        {id: 3,
            text: 'Meeting',
            day: 'Feb 9th at 3:30pm',
            reminder: false}
    
    
    ])
//Add task
useEffect(() => {
 const getTasks = async () => {
   const tasksFromServer = await fetchTasks()
   setTasks(tasksFromServer)
 }
getTasks()
}, [])
//fetch  tasks
const fetchTasks = async (task) => {
  const res = await fetch ('http://localhost:5000/tasks')
const data  = await res.json()
return data}

//fetch  task
const fetchTask = async (id) => {
  const res = await fetch (`http://localhost:5000/tasks/${id}`)
const data  = await res.json()
return data}

const addTask = async (task) => {
  const res = await fetch ('http://localhost:5000/tasks',{
    method: 'POST', 
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(task),
  })

const data = await res.json()
setTasks([...tasks,data])
  //const id = Math.floor(Math.random()*1000) + 1
  // const newTask ={id, ...task}
  // setTasks([...tasks,newTask])
  
}
    //for deleting task
    const deleteTask = async(id) => {
await fetch(`http://localhost:5000/tasks/${id}`, {method : 'DELETE'})
      setTasks(tasks.filter((task) => task.id !== id))
    }
    //toggle reminder
    const toggleReminder =async (id) => {
const taskToToggle = await fetchTask(id)
const updTask ={...taskToToggle, reminder: !taskToToggle.reminder}
      const res  = await fetch(`http://localhost:5000/tasks/${id}`,{
        method : 'PUT',
        headers: {
          'content-type': 'application/json'},
          body:JSON.stringify(updTask)
        
      })
      const data = await res.json()
setTasks(tasks.map((task => task.id === id ? {...task, reminder: !data.reminder} : task)))
    }
  return (<Router>
    <div className="container" style ={{backgroundImage : `url(${background})`}}>
      <Header onAdd ={() => setShowAddTask(!showAddTask)} showAdd = {showAddTask}/>
     
     <Route path='/'exact render={(props => (<> {showAddTask && <AddTask onAdd={addTask} />}
      {tasks.length > 0 ? ( <Tasks tasks={tasks} onDelete={deleteTask} onToggle = {toggleReminder}/> ): ( 'No Tasks To Show' )  } </>))}/>
      <Route path ='/about' component = {About} />
      <Footer />
    </div>
  </Router>);
}
/*class App extends React.Component {
  render(){
    return <div> </div>
  }
}*/
export default App;
