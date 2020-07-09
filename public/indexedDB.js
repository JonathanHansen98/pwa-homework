// Step - 1
const dbRequest = indexedDB.open("toDoList_db", 1);

// Step - 4: Initialization or whenever the version is changed.
dbRequest.onupgradeneeded = (event) => {
    console.log("Initializing database");
    console.log(event.target);

    const db = event.target.result;

    const store = db.createObjectStore("transactions", { autoIncrement: true });

    store.createIndex("statusIndex", "status");
};

// Step - 2
dbRequest.onsuccess = event => {
    const db = event.target.result;
    console.log(`Successfully opened connection to db: ${db.name}`);
};

// Step - 3
dbRequest.onerror = event => {
    console.log(`error opening db: ${event.target.error}`);
};