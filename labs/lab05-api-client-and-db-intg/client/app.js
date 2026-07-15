const API_BASE_URL = "http://localhost:3000";

const loadButton = document.querySelector("#load-items");
const loadTypesButton = document.querySelector("#load-types");
const itemList = document.querySelector("#items");
const form = document.querySelector("#add-item-form");
const removeForm = document.querySelector("#remove-item-form");
const updateForm = document.querySelector("#update-item-form");
const itemNameInput = document.querySelector("#item-name");
const itemQuantityInput = document.querySelector("#item-quantity");
const statusBox = document.querySelector("#status");

function setStatus(message) {
  statusBox.textContent = message;
}

function renderItems(items) {
  itemList.replaceChildren();

  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = `${item.id}: ${item.name} (${item.quantity}) Type: ${item.type?.name ?? "None"}`;
    itemList.appendChild(li);
  }
}

async function loadItems() {
  setStatus("Loading items...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items`);

    if (!response.ok) {
      throw new Error(`GET /api/items failed with status ${response.status}`);
    }

    const data = await response.json();
    renderItems(data.items);
    setStatus("Items loaded.");
  } catch (error) {
    setStatus(error.message);
  }
}

async function addItem(name, quantity) {
  setStatus("Adding item...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, quantity })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? `POST /api/items failed with status ${response.status}`);
    }

    setStatus(`Added item: ${data.item.name}`);
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

async function removeItem(id) {
  setStatus("Removing item...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      method: "DELETE",
    });

    const data = await response;

    if (!response.ok) {
      throw new Error(data.message ?? `DELETE /api/items/${id} failed with status ${response.status}`);
    }

    setStatus(`Removed item: ${id}`);
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

async function loadTypes() {
  setStatus("Loading types...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/types`);

    if (!response.ok) {
      throw new Error(`GET /api/types failed with status ${response.status}`);
    }

    const data = await response.json();
    itemList.replaceChildren();
    for (const t of data.types) {
      const li = document.createElement("li");
      li.textContent = `${t.id}: ${t.name}`;
      itemList.appendChild(li);
    }
    setStatus("Types loaded.");
  } catch (error) {
    setStatus(error.message);
  }
}

loadButton.addEventListener("click", loadItems);
loadTypesButton.addEventListener("click", loadTypes);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = itemNameInput.value.trim();
  const quantity = Number(itemQuantityInput.value);

  if (!name || !Number.isInteger(quantity) || quantity < 0) {
    setStatus("Enter a name and a non-negative integer quantity.");
    return;
  }

  itemNameInput.value = "";
  itemQuantityInput.value = "0";
  await addItem(name, quantity);
});

removeForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = Number(document.querySelector("#remove-item-id").value);

  if (!Number.isInteger(id) || id < 0) {
    setStatus("Enter a non-negative integer ID.");
    return;
  }

  await removeItem(id);
});

async function updateItem(id, name, quantity, type) {
  setStatus("Updating item...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, quantity, type })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? `PUT /api/items/${id} failed with status ${response.status}`);
    }

    setStatus(`Updated item: ${data.item.name}`);
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

updateForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = Number(document.querySelector("#update-item-id").value);
  const name = document.querySelector("#update-item-name").value.trim();
  const quantity = Number(document.querySelector("#update-item-quantity").value);
  const type = document.querySelector("#update-item-type").value.trim() || undefined;

  if (!Number.isInteger(id) || id < 0) {
    setStatus("Enter a non-negative integer ID.");
    return;
  }

  if (!name || !Number.isInteger(quantity) || quantity < 0) {
    setStatus("Enter a name and a non-negative integer quantity.");
    return;
  }

  await updateItem(id, name, quantity, type);
});