
# Part 1 - Conceptual Foundations

1. Authentication vs. Authorization
Explain the difference between authentication and authorization. Then describe what an API should return in each situation:

    Authentication: Proving who you are, generally using a password 
    Authorization: Having access to a particular resource, generally after you have authenticated

The request does not contain valid authentication credentials.

    401 Unauthorized

The caller is authenticated but does not have permission to perform the requested operation.

    403 Forbidden


2. Passwords, Sessions, and Tokens
An application allows users to log in with a username and password.

Explain:

why the application should never store passwords as plain text, what the server should store instead, how a session-based login differs from a token-based login, one advantage of each approach.

    An application should never store passwords as plaintext so that nobody can read the passwords inside of the database. Instead, they should hash the passwords which are non-reversible and prevents people from reading them.
    Additionally, session-based logins store a session token within the web session of the user. This session token is usually a key to a database designating the session that the user is connected to, it is a stateful implementation of login that the server must keep track of. This has the advantage of allowing more complex session rules while not increasing the complexity of data stored to the end user.
    Token-based logins create a signed token by the server which can be decoded/verified by the server and used immediately. This is a stateless approach, and has the advantage of having flexibility within the server itself in not having to keep track of previous sessions.


3. JSON Web Tokens
Describe the purpose and structure of a JSON Web Token (JWT). Your answer should include:

the three major parts of a JWT, the difference between signing and encrypting a token, why a server must validate a JWT before trusting its claims, one risk of using JWTs with excessively long expiration times.

    The three parts of the JWT are the header, payload, and the signature. The header contains information about the algorithm used for the JWT, the payload contains encoded content (usually Base64) and the signature is the signed payload via the server's secret key.
    Signing a token means doing sign(content, secret_key) -> content, signature, meanwhile encryption is encrypt(content, secret_key) -> encrypted_content. The difference is the signature being returned in plaintext attesting that the content is untampered with.
    The server must validate this token before trusting anything about it, because the only segment that contains any information about if the token is trusted is the signature.
    One risk of having an excessively long expiry time is having a very old, partially stale token get stolen by somebody who doesn't know the login and having free reign for a very long time.


4. OAuth
Explain the purpose of OAuth. Your answer should distinguish among:

the resource owner, the client application, the authorization server, the resource server, the access token. Also explain why giving a third-party application an OAuth access token is safer than giving it the user’s password.

    The resource owner is also the end-user, the client application is whatever application you're attempting to authenticate against. The authorization server, while often packaged with the application server is the server that will grant your access token on behalf of the user to be able to access the client application. Finally the resource server is the one that the application actually accesses. It will verify the access token against the authorization server.

    Generally, a user will authenticate against the authorization server, and the resource server will specifically communicate with the authorization server. This ensures that the token is active at all times. The only time a user password (or usually a client ID/client secret pair) is transmitted is to the authorization server. This is safer purely because the password is transmitted less times and short-scoped and short-lived tokens are used instead. So any old requests captured between the user and resource server are safe.


5. PKI and Certificates
Explain how a digital certificate helps a client establish a secure connection to an API server. Your answer should include:

the purpose of the server’s public and private keys, the role of a certificate authority, what the client verifies in the certificate, what could happen if certificate validation were skipped.

    The purpose of having public/private keypairs as a server is for the client to receieve your public key and validate communications where are signed with the private key of the web server. After this exchange takes place, a session key is used with a specific cryptographic suite and communications are encrypted.
    A certificate authority can be used to verify a server's public key to ensure that it is still valid. A client must reach out to the CA to validate the signature of a cert to validate it's trustworthyness. Things like OCSP stapling help improve this process by making the validation response forward at the beginning of the TLS handshake.
    If certificate validation were skipped, it could lead to the creation of a session that is unsafe, and may have a leaked private key or a re-used private key meaning your communications can be decrypted by an untrusted third party.


6. Databases, Messages, and Asynchronous Processing
An API receives a request to generate a large report. Producing the report may take several minutes.

Explain why the API should normally use asynchronous processing instead of keeping the HTTP request open. Describe a reasonable design that includes:

a database record representing the requested job, a message queue, a background worker, an immediate HTTP response, a way for the client to check the job’s status.

Include the successful HTTP status code for submitting the job and the successful status code for retrieving its current status.

    The RESTful standard does designate that requests should be short lived due to its stateless design. For that reason, a reasonable asynchronous model must be introduced for resource requests that may take some time to compile/process. Conceptually, this can be thought of as the resource that is beign created being a task. The ideal system works as follows:
        * The end-user makes a request to a resource which will create a task. `GET /creates_a_task/`
        * The backend creates an asynchronous task (in practice many people use KeyDB, Redis, etc) that will be picked up by a worker.
        * The API immediately returns a 201 Created response along with a task ID. `201 CREATED {"id": 123}`
        * The end-user can check task status at another endpoint. `GET /task/:id` `202 ACCEPTED {"status": "running"}`
        * Whenever the task is finished the previous response will return content about the task, and potentially another URL for picking up content related to the output. `200 OK {"task": "content"}`


# Part 2 - Secure API Design
1. Authentication and Authorization
For each request below, state whether it should be allowed or rejected. If it is rejected, provide the appropriate HTTP status code.

| Request | Decision and Status Code |
| --- | --- |
| A request contains no access token | Rejected 401 UNAUTHORIZED   |
| A request contains an expired JWT | Rejected 401 UNAUTHORIZED |
| A student requests one of their own tasks | Accepted 200 OK |
| A student requests another student’s task | Rejected 403 FORBIDDEN |
| An instructor requests a task belonging to any student | Accepted 200 OK |

Briefly explain where authentication ends and authorization begins when processing these requests.

    Authentication ends whenever the JWT is accepted, authorization begins whenever checking permissions for tasks.


2. OAuth, JWT, and PKI Design
Describe how the API should use OAuth, JWTs, and PKI when handling a request. Your design should identify:

who issues the access token, how the client sends the token to the API, what the API must validate before trusting the JWT, how HTTPS and the server’s certificate protect the connection, why the API must not trust a role supplied in the request body.

    In this example, a user would reach out with their credential to the authentication server, which would forward a JWT token of the session to the client. This API must then validate the signature of the JWT against the content. During this entire process HTTPS (TLS) is used overal it all the encrypt each communication with the server. This is done by communicating a session key over the TLS protocol, then using that cryptography to protect the communications. The API must not trust a role supplied in a request body because any user can forge or lie about whatever role they are.


3. Database and Asynchronous Report Processing
Design the report-generation portion of the API. Provide:

a method and URI for requesting a new report, the database record created for the report job, the message placed on the queue, the immediate HTTP status code and response body, a method and URI for checking the report’s status, the changes made by the background worker when processing succeeds or fails.

Your design must not keep the original HTTP request open while the report is generated.

    - URI for requesting a report: `/students/jc0248/report`
    - Database record created:
        ```
        id: 1234
        studentId: jc0248
        status: pending
        downloadUrl: null
        ```
    - Message placed in task queue:
        ```
        id: 4321 
        taskId: 1234
        type: generate_report
        studentId: jc0248
        ```
    - Immediate response from `/students/{id}/report` -> `201 CREATED {"taskId": "1234"}`
    - Checking the task status `GET /reports/{id}/`
    - Changes made by background worker on:
        - Success: The task is marked as status: success, downloadURL is populated.
        - Failure: The task is marked as status: failed, task is removed from queue.


# Part 3 - Authentication and Authorization Implementation

4. Error Classification

| Situation | Status Code |
| --- | --- |
| No access token was provided | 401 UNAUTHORIZED | 
| The JWT has expired | 401 UNAUTHORIZED |
| The JWT signature is invalid | 401 UNAUTHORIZED |
| A validly authenticated student attempts an instructor-only operation | 403 FORBIDDEN |

# Part 4 - Database Integration and Async/Await

2. Database and Asynchronous Behavior

Why should the task ID be supplied as a query parameter instead of being inserted directly into the SQL string?

    Task ID must be supplied as a query parameter instead of directly appended because it would otherwise be vulnerable to SQL Injection, returning or otherwise modifying the tables in an unauthorized manner

Why must the route use await when calling db.query()?

    `await db.query(...)` and the rout being asynchronous is done because db.query itself is an asynchronous function. You must invoke async functions within other async functions. This is generally done because the API doesn't have a constant access or rseponse time.


# Part 5 - Message Queues and Background Processing

why the API returns 202 Accepted instead of 200 OK or 201 Created

    202 Accepted instead of 200 OK or 201 Created is a standard response for an API who has accepted your data input and has begun doing something against it. 201 Created could also be a valid response if you want to indicate that the report record has been created. 202 is used when the job is returned instead.

one advantage of generating the report in a background worker instead of inside the route handler.

    Having a background worker just means that HTTP requests will be shorter lived and offload the processing power to the background worker.


# Part 7 - Reflection

1. Following a Request Through the System
Choose one protected API operation and trace it from the client’s request to the server’s response.

Explain how at least four of the following participate in processing the request identify one place where the request could fail and explain how the API should respond.


    Chosen route: GET /tasks/:id

    middleware: Middleware is something that is injected between the client's request and the server recieving the request. It can trasnsform data, verify payloads, and do anything prep-wise before the backend code recieves it. A good example is transforming a Task ID -> a Task object before the endpoint has it.

    authentication: Usually implemented as middleware (as is in this repo) which will take a JWT token and decode it -> a User object that is used to verify if they have access to a task.

    authorization: This is also usually implemented as a middleware but can realistically take place in different places of the request, checks if the user has access to the resource (the task) they are attempting to access. e.g an instructor can access all tasks but a student only accesses theirs.

    database access: Can take place at any part of the request, queries the database for data that is relevent to the request. e.g. mapping a task ID to a task object from the database.

    A place where requests can fail is inside of the authentication step, where the server should respond with 401 UNAUTHORIZED if the token is expired or improperly passed.


2. Synchronous vs. Asynchronous Processing

Describe one operation that should be completed directly in an HTTP request and one operation that would be better handled using a message queue and background worker.

why each processing model is appropriate, what the client receives, how failures would be handled, how a database could be used to track the operation’s result or status.

    Completed directly in HTTP request: An operation accessing a user's profile
        why: A users profile can be immediately queried and returned by the database.
        client recieves: The user profile object
        failures: If the database is down it can return 500 for internal server error, 403 for if the user doesn't have permission to read the data.
        database tracking: The database doesn't need to track the status of this request, it might log the access to the user

    Completed later using a message queue: Queueing an email that can be sent later.
        why: Email may or may not be immediately available to send or the email server might take time to process the request.
        client recieves: Task ID and pending status and link to view the result (email result will proably be debug from server connection.)
        failures: Task would be updated with failure status, could be re-queued depending on the infrastructure or the nature of the email.
        database tracking: Database would only need to track pending, in-progress, or completed.


3. Lessons Learned

Imagine that you must give a short “lessons learned” presentation to a development team building its first web API.
Identify three practices from this course that you would recommend. At least two must relate to topics from the second half of the course, for each practice, briefly explain what problem it prevents or helps solve.

    1. database integration: Database integration early and thoroughly is important for easy re-use of CRUD operations and easier data processing later in the workflow. A good lesson learned for this is to either create very thorough integrations and/or just use an ORM. This helps solve the issue of verifying an individual has access to a resource via easy data mapping, create relations more easily, and manage relations between models without as much hassle 

    2. authentication and authorization: This topic is super important as the implementation of it is the entire security posture of the application being created. Making these distinct, separated, and easy to read helps improve security posture and make things way easier to manage, especially when making a more complex or expanded authentication structure.

    3. PKI and HTTPS: Protecting HTTP requests with TLS (PKI is part of this) just ensures that communications with the server are fully secured. This is important more-so for the end-users protection and protecting the content.