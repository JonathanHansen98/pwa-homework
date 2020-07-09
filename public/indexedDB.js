// Step - 1
let db;
const dbRequest = indexedDB.open("budget_db", 1);
dbRequest.onupgradeneeded = (event) => {
  console.log("Initializing database");
  console.log(event.target);

  const db = event.target.result;

  const store = db.createObjectStore("transactionsStore", {
    autoIncrement: true,
  });
  console.log(store);
  store.createIndex("valueIndex", "value", { unique: false });
};

dbRequest.onsuccess = (event) => {
  db = event.target.result;
  console.log(`Successfully opened connection to db: ${db.name}`);
};

dbRequest.onerror = (event) => {
  console.log(`error opening db: ${event.target.error}`);
};

const saveRecord = (transaction) => {
  const tx = db.transaction("transactionsStore", "readwrite"),
    store = tx.objectStore("transactionsStore");
  console.log(`Post saved offline: ${JSON.stringify(transaction)}`);
  console.log(navigator.onLine);

  store.put(transaction);
};

const syncDB = () => {
  console.log("sync");
  console.log(navigator.onLine);

  const tx = db.transaction("transactionsStore", "readwrite"),
    store = tx.objectStore("transactionsStore");
  const transactions = store.getAll();

    transactions.onsuccess = function () {
      if (transactions.result.length > 0) {
        fetch("/api/transaction/bulk", {
          method: "POST",
          body: JSON.stringify(transactions.result),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then(() => {
            const transaction = db.transaction(
              ["transactionsStore"],
              "readwrite"
            );

            const store = transaction.objectStore("transactionsStore");

            store.clear();
          });
      }
    };
};

window.addEventListener("online", () => {
  if (db !== undefined) {
      console.log('from evt listener');
      
    syncDB();
  }
});
