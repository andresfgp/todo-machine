import React, {useState} from 'react';
import useLocalStorage from './useLocalStorage'
import useLocalStorageInit from './useLocalStorageInit'

const TodoContext= React.createContext();

  function generateUUID() { // Public Domain/MIT
    let d = new Date().getTime();//Timestamp
    let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = Math.random() * 16;//random number between 0 and 16
      if (d > 0) { //Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else { //Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r && 0x3 | 0x8)).toString(16);
    });
  }

function TodoProvider(props){

    const { children } = props;
    const [openModal,setOpenModal]=useState(false);
    
    const [openModalInit,setOpenModalInit]=useState(true);

    const {
        item: todos,
        saveItem: saveTodos,
        loading,
        error,
    } = useLocalStorage('TODOS_V1', []); //nuevo Hook para localStorageItem

    const [init,saveInit] = useLocalStorageInit('INIT_V1', openModalInit); //nuevo Hook para localStorageItem


    const [searchValue,setSearchValue]=useState(''); //props input for Search
    let searchedTodos=[];
    !searchValue.length>0?searchedTodos=todos:searchedTodos=todos.filter(item=>item.text.toLowerCase().includes(searchValue.toLowerCase())); //filter Search text

    const [searchCompletedValues,setSearchCompletedValues]=useState(false); //state search completed
    let searchedCompletedTodos=[];
    !searchCompletedValues?searchedCompletedTodos=searchedTodos:searchedCompletedTodos=searchedTodos.filter(item=>item.completed); //filter Search

    const [searchNoCompletedValues,setSearchNoCompletedValues]=useState(false); //state search completed
    let searchedNoCompletedTodos=[];
    !searchNoCompletedValues?searchedNoCompletedTodos=searchedCompletedTodos:searchedNoCompletedTodos=searchedCompletedTodos.filter(item=>!item.completed); //filter Search
    
    const [searchImportantValues,setSearchImportantValues]=useState(false); //state search important
    let searchedImportantTodos=[];
    !searchImportantValues?searchedImportantTodos=searchedNoCompletedTodos:searchedImportantTodos=searchedNoCompletedTodos.filter(item=>item.important); //filter Search
    
    const completedTodos=todos.filter(item=> !!item.completed).length; // filter completed ToDos number
    const totalTodos= todos.length; //Total ToDos number
    
    const [importantNewValue,setImportantNewValue]=useState(false); //state important
    const [taskExists,setTaskExists]=useState(false); //setImportantNewValue]=useState(false); //state important
    
    const completeTodos=(text)=>{ // New array with complete true or false
      const todoIndex=todos.findIndex(item=>item.text===text);
      const newTodos=[...todos]; //nueva lista
      newTodos[todoIndex].completed=!newTodos[todoIndex].completed;
      saveTodos(newTodos) //setTodos change for saveTodos
    }
    
    const deleteTodos=(text)=>{ // New array with delete ToDos
      const newTodos=todos.filter(item=>item.text!==text); //nueva lista
      saveTodos(newTodos) //setTodos change for saveTodos
    }
    const importantTodos=(text)=>{ // New array with important true or false
      const todoIndex=todos.findIndex(item=>item.text===text);
      const newTodos=[...todos]; //nueva lista
      newTodos[todoIndex].important=!newTodos[todoIndex].important;
      saveTodos(newTodos) //setTodos change for saveTodos
    }
    const addTodos=(text)=>{ // New array with important true or false
      const newTodos=[...todos]; //nueva 
      if (!newTodos.some((item) => item.text.toLowerCase() === text.toLowerCase())){
        newTodos.push({
          completed:false,
          text:text,
          important:importantNewValue,
          id:generateUUID()});
        saveTodos(newTodos) //setTodos change for saveTodos
        saveInit(openModalInit)
        setOpenModal(false)
        setTaskExists(false)
      }else{
        setTaskExists(true)
      }
    }
    return(
        <TodoContext.Provider value={{
            loading,
            error,
            totalTodos,
            completedTodos,
            searchValue,
            searchedTodos,
            searchedImportantTodos,
            searchImportantValues,
            searchCompletedValues,
            searchNoCompletedValues,
            importantNewValue,
            openModal,
            init,
            taskExists,
            setSearchValue,
            setSearchImportantValues,
            setImportantNewValue,
            setOpenModal,
            setOpenModalInit,
            setTaskExists,
            setSearchCompletedValues,
            setSearchNoCompletedValues,
            completeTodos,
            deleteTodos,
            importantTodos,
            addTodos,
        }}>
            {children}
        </TodoContext.Provider>
    )
}

export {TodoContext, TodoProvider}