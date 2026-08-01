// Global user vars for simple testing
var user1 = null; 
var user2 = null;
var admin_user = null;

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}


async function get_health() {
    console.log("Getting Health")
    const response = await fetch("http://localhost:3000/health");
    const data = await response.text();
    console.log(`HEALTH: ${data}`);
    return data;
}

async function get_db_health() {
    console.log("Getting DB Health")
    const response = await fetch("http://localhost:3000/db-health");
    const data = await response.text();
    console.log(`DB HEALTH: ${data}`);
    return data;
}

// Fufills Checkpoint 2 reuqirements: 
// A protected route rejects a request without a token.
// A protected route accepts a valid token.
async function create_task(project_id, assigned_to, user_token) {
    console.log("Creating Task")
    const task = {
        title: "New Task",
        description: "CS553",
        project_id: project_id
    };

    if (assigned_to !== undefined && assigned_to !== null) {
        task.assigned_to = assigned_to;
    }

    const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user_token}`
        },
        body: JSON.stringify(task)
    });

    const data = await response.json();
    console.log(data);
    return data;
}

async function list_tasks(user_token) {
    console.log("Listing Tasks")
    const response = await fetch("http://localhost:3000/tasks", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user_token}`
        }
    });
    const data = await response.json();
    console.log(data);
    return data;
}

async function get_task(id, user_token) {
    console.log(`Getting Task with ID: ${id}`)
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user_token}`
        }
    });
    const data = await response.json();
    console.log(data);
    return data;
}

async function update_task(id, user_token) {
    console.log(`Updating Task with ID: ${id}`)
    const updatedTask = {
        title: "Updated Task",
        status: "in_progress"
    };

    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user_token}`
        },
        body: JSON.stringify(updatedTask)
    });

    const data = await response.json();
    console.log(data);
    return data;
};

async function delete_task(id, user_token) {
    console.log(`Deleting Task with ID: ${id}`)
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${user_token}`
        }
    });

    if (response.status === 204) {
        console.log({ deleted: true });
        return { deleted: true };
    }

    const data = await response.json();
    console.log(data);
    return data;
};

async function missing_task(user_token) {
    console.log("Missing task returns 404")
    const missingId = 999999;
    const response = await fetch(`http://localhost:3000/tasks/${missingId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user_token}`
        }
    });

    const data = await response.json();
    assert(response.status === 404, `Expected 404, got ${response.status}`);
    assert(data.error === "Task not found", "Expected Task not found error for missing task");
    console.log("Missing task returned 404", data);
}

async function create_no_title() {
    console.log("Creating task without title returns 400")
    const badTask = {
        description: "No title provided"
    };

    const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user1.token}`
        },
        body: JSON.stringify(badTask)
    });

    const data = await response.json();
    assert(response.status === 400, `Expected 400, got ${response.status}`);
    assert(data.error === "title is required", "Expected title is required validation error");
    console.log("Missing title returned 400", data);
}

//A user can register.
async function register_user(username, password) {
    const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: username,
            email: `${username}@example.com`,
            password: password
        })
    });

    const data = await response.json();
    console.log(data);
    return { status: response.status, data };
}

//A registered user can log in.
//Login returns a JWT.
// Incorrect login credentials are rejected.
async function login_user(username, password) {
    const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: `${username}@example.com`,
            password: password
        })
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
        return { error: data.error || "Login failed", status: response.status };
    }

    return {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        token: data.accessToken
    };
}

// Admin-only endpoint
async function get_project_admin_all(user_token) {
    const response = await fetch("http://localhost:3000/projects/admin/all", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user_token}`
        }
    });

    const data = await response.json();
    console.log(data);
    return data;
}

// Test create project
async function create_project(user_token) {
    const headers = {
        "Content-Type": "application/json"
    };

    if (user_token) {
        headers.Authorization = `Bearer ${user_token}`;
    }

    const response = await fetch("http://localhost:3000/projects", {
        method: "POST",
        headers,
        body: JSON.stringify({ name: "New Project" })
    });

    const data = await response.json();
    console.log(data);
    return data;
}

async function list_projects(user_token) {
    const response = await fetch("http://localhost:3000/projects", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user_token}`
        }
    });

    const data = await response.json();
    console.log(data);
    return data;
}

async function get_project(id, user_token) {
    const response = await fetch(`http://localhost:3000/projects/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user_token}`
        }
    });

    const data = await response.json();
    console.log(data);
    return { status: response.status, data };
}


async function main() {
    await get_health();
    await get_db_health();

    // tests login for seeded users
    user1 = await login_user("user1", "password");
    console.log("User1 login response:", user1);
    assert(user1.token, "Expected user1 login to return a token");

    admin_user = await login_user("admin", "password");
    assert(admin_user.token, "Expected admin login to return a token");

    // optional registration smoke test for user2 (allows reruns)
    const registerResult = await register_user("user2", "password");
    assert(
        registerResult.status === 201 || registerResult.status === 409,
        "Expected register to return 201 (created) or 409 (already exists) not a fail because already created",
    );

    user2 = await login_user("user2", "password");
    assert(user2.token, "Expected user2 login to return a token");

    // tests without a token
    // Also tests 401
    var data = await create_project(null);
    assert(
        data.error === "Authentication required",
        "Expected auth error when creating project without token",
    );

    // tests with a token (protected route accepts a valid token) & (project can be created by authenticated user)
    const project_data = await create_project(user1.token);
    assert(project_data.name === "New Project", "Expected project name to be 'New Project'");

    // project visibility: user1 should be able to list and retrieve owned project
    const user1Projects = await list_projects(user1.token);
    assert(Array.isArray(user1Projects), "Expected list_projects to return an array");
    assert(user1Projects.some((p) => p.id === project_data.id), "Expected user1 project to be visible to user1");

    const projectAsUser1 = await get_project(project_data.id, user1.token);
    assert(projectAsUser1.status === 200, "Expected user1 to retrieve owned project");

    // user2 should not have read access to user1-owned project
    const projectAsUser2 = await get_project(project_data.id, user2.token);
    assert(projectAsUser2.status === 404, "Expected user2 to receive 404 for project owned by user1");

    // admin-only function (normal user cannot access)
    data = await get_project_admin_all(user1.token);
    assert(data.error === "Forbidden", "Expected Forbidden error when accessing admin route with normal user token");

    // admin-only (admin user can access)
    data = await get_project_admin_all(admin_user.token);
    assert(Array.isArray(data), "Expected an array of projects when accessing admin route with admin token");

    // A task can be created by authenticated user, can be associated with a project, and can be listed and retrieved
    const task = await create_task(project_data.id, user1.id, user1.token);
    assert(task.project_id === project_data.id, "Expected task to be associated with the created project");
    console.log("Task created successfully:", task);

    // User2 cannot modify the previous task (A user cannot modify a resource they do not own or control)
    // Also tests 403
    const resp = await update_task(task.id, user2.token);
    assert(resp.error === "Forbidden", "Expected Forbidden error when user2 attempts to update a task they do not own");

    // Test a random 404
    const missingTaskResponse = await get_task(999999, user1.token);
    assert(missingTaskResponse.error === "Task not found", "Expected Task not found error when retrieving a non-existent task");


    // Old Tests
    await list_tasks(user1.token);

    if (task && task.id) {
        const id = task.id;
        await get_task(id, user1.token);
        const updatedTask = await update_task(id, user1.token);
        assert(updatedTask.title === "Updated Task", "Expected user1 to update their task");
        await delete_task(id, user1.token);
    }

    await missing_task(user1.token);
    await create_no_title();
}

main();