## API Endpoints

### 1. Authentication

#### 1.1 Register

**Endpoint:** `POST /auth/register`

**Description:** Create a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "createdAt": "2025-11-28T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- `400` – Invalid input or user already exists.
- `500` – Server error.

**Frontend Usage:**

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

async function register(name, email, password) {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
}
```

---

#### 1.2 Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate and get a JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "createdAt": "2025-11-28T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- `401` – Invalid credentials.
- `500` – Server error.

**Frontend Usage:**

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  localStorage.setItem("token", data.token);
  return data;
}
```

---

### 2. Users

#### 2.1 Get Profile

**Endpoint:** `GET /users/profile` [Protected]

**Description:** Fetch current logged-in user's profile (name, email, createdAt).

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2025-11-28T10:00:00Z"
  }
}
```

**Frontend Usage:**

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

async function getProfile() {
  const { data } = await api.get("/users/profile");
  return data;
}
```

---

#### 2.2 Get Dashboard

**Endpoint:** `GET /users/dashboard` [Protected]

**Description:** Fetch dashboard data including pending invitations, active elections (with candidate vote counts), and recent activities.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "invitations": [
      {
        "id": 5,
        "type": "DEPARTMENT",
        "email": "john@example.com",
        "status": "PENDING",
        "createdAt": "2025-11-28T10:00:00Z",
        "respondedAt": null,
        "departmentId": 1,
        "department": {
          "id": 1,
          "name": "Mathematics",
          "description": "Math department",
          "createdAt": "2025-11-28T10:00:00Z"
        }
      }
    ],
    "activeElections": [
      {
        "id": 2,
        "title": "Best Math Teacher",
        "description": "Vote for the best teacher",
        "startDate": "2025-11-28T09:00:00Z",
        "endDate": "2025-11-28T17:00:00Z",
        "status": "ACTIVE",
        "departmentId": 1,
        "createdAt": "2025-11-28T10:00:00Z",
        "candidates": [
          {
            "id": 1,
            "name": "Alice",
            "description": "Senior Math Teacher",
            "votes": 3,
            "percentage": 60
          },
          {
            "id": 2,
            "name": "Bob",
            "description": "Junior Math Teacher",
            "votes": 2,
            "percentage": 40
          }
        ]
      }
    ],
    "recentActivities": []
  }
}
```

**Frontend Usage:**

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

async function getDashboard() {
  const { data } = await api.get("/users/dashboard");
  return data;
}
```

---

### 3. Departments

#### 3.1 Create Department

**Endpoint:** `POST /departments` [Protected]

**Description:** Create a new department. The creator automatically becomes a manager member.

**Request Body:**

```json
{
  "name": "Mathematics",
  "description": "Department of Mathematics"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Mathematics",
    "description": "Department of Mathematics",
    "createdAt": "2025-11-28T10:00:00Z",
    "updatedAt": "2025-11-28T10:00:00Z",
    "members": [
      {
        "id": 1,
        "userId": 1,
        "departmentId": 1,
        "isManager": true,
        "createdAt": "2025-11-28T10:00:00Z"
      }
    ]
  }
}
```

**Frontend Usage:**

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

async function createDepartment(name, description) {
  const { data } = await api.post("/departments", { name, description });
  return data;
}
```

---

#### 3.2 Get User's Departments

**Endpoint:** `GET /departments` [Protected]

**Description:** Fetch all departments where the user is a member.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Mathematics",
      "description": "Department of Mathematics",
      "createdAt": "2025-11-28T10:00:00Z",
      "updatedAt": "2025-11-28T10:00:00Z"
    },
    {
      "id": 2,
      "name": "Physics",
      "description": "Department of Physics",
      "createdAt": "2025-11-28T10:00:00Z",
      "updatedAt": "2025-11-28T10:00:00Z"
    }
  ]
}
```

**Frontend Usage:**

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

async function getDepartments() {
  const { data } = await api.get("/departments");
  return data;
}
```

---

### 4. Invitations

#### 4.1 Send Invitation

**Endpoint:** `POST /invitations` [Protected]

**Description:** Invite a user (by email) to a department.

**Request Body:**

```json
{
  "email": "jane@example.com",
  "departmentId": 1
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": 5,
    "type": "DEPARTMENT",
    "email": "jane@example.com",
    "status": "PENDING",
    "createdAt": "2025-11-28T10:00:00Z",
    "respondedAt": null,
    "createdById": 1,
    "departmentId": 1,
    "electionId": null
  }
}
```

**Frontend Usage:**

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

async function sendInvitation(email, departmentId) {
  const { data } = await api.post("/invitations", { email, departmentId });
  return data;
}
```

---

#### 4.2 List User's Invitations

**Endpoint:** `GET /invitations` [Protected]

**Description:** Fetch all pending invitations for the logged-in user (resolved by email).

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "type": "DEPARTMENT",
      "email": "john@example.com",
      "status": "PENDING",
      "createdAt": "2025-11-28T10:00:00Z",
      "respondedAt": null,
      "departmentId": 1,
      "department": {
        "id": 1,
        "name": "Mathematics",
        "description": "Department of Mathematics"
      },
      "electionId": null
    }
  ]
}
```

**Frontend Usage:**

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

async function listInvitations() {
  const { data } = await api.get("/invitations");
  return data;
}
```

---

#### 4.3 Respond to Invitation

**Endpoint:** `POST /invitations/respond` [Protected]

**Description:** Accept or refuse an invitation. On acceptance, user is added to the department as a member and automatically enrolled in ongoing elections.

**Request Body:**

```json
{
  "invitationId": 5,
  "accept": true
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 5,
    "type": "DEPARTMENT",
    "email": "john@example.com",
    "status": "ACCEPTED",
    "createdAt": "2025-11-28T10:00:00Z",
    "respondedAt": "2025-11-28T10:30:00Z",
    "departmentId": 1,
    "department": {
      "id": 1,
      "name": "Mathematics",
      "description": "Department of Mathematics"
    }
  }
}
```

**Frontend Usage:**

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

async function respondToInvitation(invitationId, accept) {
  const { data } = await api.post("/invitations/respond", {
    invitationId,
    accept,
  });
  return data;
}
```

---

### 5. Elections

#### 5.1 Create Election

**Endpoint:** `POST /elections` [Protected]

**Description:** Create an election with candidates. If a `departmentId` is provided, all current department members are automatically enrolled as participants.

**Request Body:**

```json
{
  "title": "Best Teacher 2025",
  "description": "Vote for the best teacher this year",
  "startDate": "2025-11-28T12:00:00Z",
  "endDate": "2025-11-28T18:00:00Z",
  "departmentId": 1,
  "candidateNames": ["Alice Johnson", "Bob Smith", "Charlie Brown"],
  "participantIds": []
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "Best Teacher 2025",
    "description": "Vote for the best teacher this year",
    "startDate": "2025-11-28T12:00:00Z",
    "endDate": "2025-11-28T18:00:00Z",
    "status": "UPCOMING",
    "createdAt": "2025-11-28T10:00:00Z",
    "updatedAt": "2025-11-28T10:00:00Z",
    "creatorId": 1,
    "departmentId": 1,
    "candidates": [
      {
        "id": 1,
        "name": "Alice Johnson",
        "description": "",
        "electionId": 2
      },
      {
        "id": 2,
        "name": "Bob Smith",
        "description": "",
        "electionId": 2
      },
      {
        "id": 3,
        "name": "Charlie Brown",
        "description": "",
        "electionId": 2
      }
    ],
    "participants": [
      {
        "id": 1,
        "electionId": 2,
        "userId": 1,
        "addedByDepartment": false
      }
    ]
  }
}
```

**Frontend Usage:**

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

async function createElection({
  title,
  description,
  startDate,
  endDate,
  departmentId,
  candidateNames,
  participantIds,
}) {
  const { data } = await api.post("/elections", {
    title,
    description,
    startDate,
    endDate,
    departmentId,
    candidateNames,
    participantIds,
  });
  return data;
}
```

**Notes:**

- `startDate` and `endDate` must be ISO 8601 strings (e.g., `"2025-11-28T12:00:00Z"`).
- The election status is automatically updated by the backend scheduler:
  - `UPCOMING` → `ACTIVE` (at startDate)
  - `ACTIVE` → `ENDED` (at endDate)

---

#### 5.2 Get User's Elections

**Endpoint:** `GET /elections?status=ACTIVE|UPCOMING|ENDED` [Protected]

**Description:** Fetch elections for the user (either as a direct participant or via department membership). Optionally filter by status.

**Query Parameters:**

- `status` (optional): `ACTIVE`, `UPCOMING`, or `ENDED`

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "title": "Best Teacher 2025",
      "description": "Vote for the best teacher this year",
      "startDate": "2025-11-28T12:00:00Z",
      "endDate": "2025-11-28T18:00:00Z",
      "status": "ACTIVE",
      "createdAt": "2025-11-28T10:00:00Z",
      "updatedAt": "2025-11-28T10:00:00Z",
      "creatorId": 1,
      "departmentId": 1
    }
  ]
}
```

**Frontend Usage:**

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

async function getElections(status = null) {
  const { data } = await api.get("/elections", {
    params: { status },
  });
  return data;
}
```

---

#### 5.3 Get Election Details

**Endpoint:** `GET /elections/:id` [Protected]

**Description:** Fetch full election details including all candidates.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "Best Teacher 2025",
    "description": "Vote for the best teacher this year",
    "startDate": "2025-11-28T12:00:00Z",
    "endDate": "2025-11-28T18:00:00Z",
    "status": "ACTIVE",
    "createdAt": "2025-11-28T10:00:00Z",
    "updatedAt": "2025-11-28T10:00:00Z",
    "creatorId": 1,
    "departmentId": 1,
    "candidates": [
      {
        "id": 1,
        "name": "Alice Johnson",
        "description": "",
        "electionId": 2
      },
      {
        "id": 2,
        "name": "Bob Smith",
        "description": "",
        "electionId": 2
      }
    ]
  }
}
```

**Frontend Usage:**

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

async function getElectionDetails(electionId) {
  const { data } = await api.get(`/elections/${electionId}`);
  return data;
}
```

---

#### 5.4 Get Election Participants

**Endpoint:** `GET /elections/:id/participants` [Protected]

**Description:** Fetch all users enrolled as participants in an election.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "createdAt": "2025-11-28T10:00:00Z"
    },
    {
      "id": 2,
      "email": "jane@example.com",
      "name": "Jane Doe",
      "createdAt": "2025-11-28T10:00:00Z"
    }
  ]
}
```

**Frontend Usage:**

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

async function getElectionParticipants(electionId) {
  const { data } = await api.get(`/elections/${electionId}/participants`);
  return data;
}
```

---

### 6. Votes

#### 6.1 Cast Vote

**Endpoint:** `POST /votes` [Protected]

**Description:** Cast a vote in an election. Only allowed during the election's active window. A user can vote only once per election.

**Request Body:**

```json
{
  "electionId": 2,
  "candidateId": 1
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": 3,
    "createdAt": "2025-11-28T10:15:00Z",
    "electionId": 2,
    "userId": 1,
    "candidateId": 1
  }
}
```

**Error Responses:**

- `400` / `403` – Election not active, user not a participant, or already voted.
- `404` – Election or candidate not found.

**Frontend Usage:**

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

async function castVote(electionId, candidateId) {
  const { data } = await api.post("/votes", { electionId, candidateId });
  return data;
}
```

---

#### 6.2 Get Election Results

**Endpoint:** `GET /votes/:electionId/results` [Protected]

**Description:** Fetch aggregated vote counts and percentages for all candidates in an election.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "candidate": {
        "id": 1,
        "name": "Alice Johnson",
        "description": "",
        "electionId": 2
      },
      "votes": 3,
      "percentage": 60
    },
    {
      "candidate": {
        "id": 2,
        "name": "Bob Smith",
        "description": "",
        "electionId": 2
      },
      "votes": 2,
      "percentage": 40
    }
  ]
}
```

**Frontend Usage:**

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

async function getElectionResults(electionId) {
  const { data } = await api.get(`/votes/${electionId}/results`);
  return data;
}
```
