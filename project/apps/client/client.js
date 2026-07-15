async function get_health() {
    console.log("Getting Health")
    const response = await fetch("http://localhost:3000/health");
    const data = await response.text();
    console.log(`HEALTH: ${data}`);
    return data;
}

async function get_db_health() {
    console.log("Getting Health")
    const response = await fetch("http://localhost:3000/db-health");
    const data = await response.text();
    console.log(`DB HEALTH: ${data}`);
    return data;
}

async function create_task() {
    console.log("Creating Task")
    const task = {
        title: "New Task",
        course: "CS553",
        completed: "false"
    };

    const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    const data = await response.json();
    console.log(data);
    return data;
}

async function list_tasks() {
    console.log("Listing Tasks")
    const response = await fetch("http://localhost:3000/tasks");
    const data = await response.json();
    console.log(data);
    return data;
}

async function get_task(id) {
    console.log(`Getting Task with ID: ${id}`)
    const response = await fetch(`http://localhost:3000/tasks/${id}`);
    const data = await response.json();
    console.log(data);
    return data;
}

async function update_task(id) {
    console.log(`Updating Task with ID: ${id}`)
    const updatedTask = {
        title: "Updated Task",
        course: "CS553",
        completed: true
    };

    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedTask)
    });

    const data = await response.json();
    console.log(data);
    return data;
};

async function delete_task(id) {
    console.log(`Deleting Task with ID: ${id}`)
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE"
    });

    if (response.status === 204) {
        console.log({ deleted: true });
        return { deleted: true };
    }

    const data = await response.json();
    console.log(data);
    return data;
};

async function missing_task() {
    console.log("Missing task returns 404")
    const missingId = 999999;
    const response = await fetch(`http://localhost:3000/tasks/${missingId}`);

    if (response.status === 404) {
        console.log("Missing task returned 404", await response.json());
    } else {
        console.error(`Expected 404, got ${response.status}`, await response.json());
    }
}

async function create_no_title() {
    console.log("Creating task without title returns 400")
    const badTask = {
        description: "No title provided"
    };

    const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(badTask)
    });

    if (response.status === 400) {
        console.log("Missing title returned 400", await response.json());
    } else {
        console.error(`Expected 400, got ${response.status}`, await response.json());
    }
}

async function main() {
    await get_health();
    await get_db_health();
    const task = await create_task();
    await list_tasks();

    if (task && task.id) {
        const id = task.id;
        await get_task(id);
        await update_task(id);
        await delete_task(id);
    }

    await missing_task();
    await create_no_title();
}

main();