# System Design Documentation

## 1. Entity Relationship Diagram (ERD)

Based on the `db_lms.sql` schema and `dummy-data.ts`.

```mermaid
erDiagram
    Users {
        string id PK
        string email UK
        string password
        enum role "student, teacher, admin_..."
        string name
        int grade
        string school_name
    }

    Students {
        string id PK
        string student_id UK
        string name
        string email UK
        string class_name
        string major
        decimal gpa
        decimal attendance_rate
        string risk_status
    }

    Modules {
        string id PK
        string teacher_id FK
        string title
        string description
        enum type "video, pdf, quiz, document"
        string content_url
    }

    Grades {
        string id PK
        string student_id FK
        string subject
        string type "Tugas, Kuis"
        string title
        decimal score
        decimal max_score
        string grade_letter
    }

    Attendance {
        string id PK
        string student_id FK
        datetime date
        enum status "present, absent, late"
        string subject
    }

    Activities {
        string id PK
        string student_id FK
        string type
        datetime timestamp
        string description
    }

    %% Relationships
    Users ||--o{ Modules : "uploads (as teacher)"
    Students ||--o{ Grades : "receives"
    Students ||--o{ Attendance : "records"
    Students ||--o{ Activities : "logs"
    %% Implicit link: Students are a subset of Users conceptually, though stored separately in this schema
    Users |{--|| Students : "corresponds to (if role=student)"
```

## 2. DFD Level 0 (Context Diagram)

High-level overview of the interaction between external entities and the LMS System.

```mermaid
graph TD
    %% Entities
    S[Student]
    T[Teacher]
    AS[Admin Sekolah]
    AL[Admin Langganan]

    %% System
    SYSTEM(LMS System)

    %% Flows Student
    S -->|Login Credentials| SYSTEM
    S -->|Assignment Submissions| SYSTEM
    S -->|Quiz Answers| SYSTEM
    SYSTEM -->|Course Content| S
    SYSTEM -->|Grades & Feedback| S
    SYSTEM -->|Attendance Records| S

    %% Flows Teacher
    T -->|Login Credentials| SYSTEM
    T -->|Course Materials| SYSTEM
    T -->|Grades & Feedback| SYSTEM
    T -->|Attendance Logs| SYSTEM
    SYSTEM -->|Student Submissions| T
    SYSTEM -->|Performance Reports| T

    %% Flows Admin Sekolah
    AS -->|Manage Teachers/Students| SYSTEM
    AS -->|School Schedule| SYSTEM
    SYSTEM -->|School Reports| AS

    %% Flows Admin Langganan
    AL -->|Manage Schools| SYSTEM
    AL -->|Subscription Settings| SYSTEM
    SYSTEM -->|Global Usage Stats| AL
```

## 3. DFD Level 1 (System Decomposition)

Breakdown of the main functional modules.

```mermaid
graph TD
    %% External Entities
    S[Student]
    T[Teacher]
    A[Admin]

    %% Processes
    P1(1.0 Authentication)
    P2(2.0 Course Management)
    P3(3.0 Grading & Assessment)
    P4(4.0 User Management)
    P5(5.0 Reporting/Dashboard)

    %% Data Stores
    D1[(Users DB)]
    D2[(Modules DB)]
    D3[(Grades/Subs DB)]

    %% Auth Flows
    S -->|Credentials| P1
    T -->|Credentials| P1
    A -->|Credentials| P1
    P1 <--> D1
    P1 -->|Token/Session| S
    P1 -->|Token/Session| T

    %% Course Flows
    T -->|Upload Material| P2
    P2 -->|Save Module| D2
    D2 -->|Fetch Content| P2
    P2 -->|View Material| S

    %% Grading Flows
    S -->|Submit Assignment| P3
    P3 -->|Save Submission| D3
    T -->|Input Grade| P3
    P3 -->|Update Score| D3
    D3 -->|Get Grades| P3
    P3 -->|View Report Card| S

    %% Admin Flows
    A -->|Create/Edit User| P4
    P4 -->|Update User| D1
    D1 -->|User Stats| P5
    D3 -->|Performance Stats| P5
    P5 -->|View Dashboard| A
    P5 -->|View Risk Analysis| T
```

## 4. DFD Level 2 (Detailed Process: Assignment Submission & Grading)

Focusing on Process 3.0 (Grading & Assessment).

```mermaid
graph TD
    %% Entities
    S[Student]
    T[Teacher]

    %% Sub-processes
    P3_1(3.1 Create Assignment)
    P3_2(3.2 Submit Work)
    P3_3(3.3 Grade Submission)
    P3_4(3.4 Calculate Stats)

    %% Data Stores
    D_MOD[(Modules/Assignments)]
    D_SUB[(Submissions)]
    D_GRD[(Grades)]

    %% Flows
    T -->|Define Assignment Details| P3_1
    P3_1 -->|Save Config| D_MOD

    D_MOD -->|Show Assignment| S
    S -->|Upload File/Text| P3_2
    P3_2 -->|Save Submission| D_SUB

    D_SUB -->|Retrieve Submission| P3_3
    T -->|Review & Score| P3_3
    P3_3 -->|Save Grade| D_GRD

    D_GRD -->|Trigger Recalc| P3_4
    P3_4 -->|Update Averages| D_GRD
    D_GRD -->|Show Result| S
```

## 5. Flowmap / User Journey (Student Assignment Submission)

Sequence of interactions for a student submitting an assignment.

```mermaid
graph TD
    subgraph Student User
        Start((Start)) --> Login[Login to System]
        Login --> Dash[View Dashboard]
        Dash --> SelectMapel[Select Subject/Course]
        SelectMapel --> ViewDetail[View Course Details]
        ViewDetail --> SelectTugas[Click Assignment Item]
        SelectTugas --> ReadInstr[Read Instructions]
        ReadInstr --> Upload[Upload File]
        Upload --> Submit[Click Submit]
        Submit --> Wait[Wait for Grade]
    end

    subgraph Frontend UI
        Login -->|POST /api/login| API_Auth
        Dash -->|GET /dashboard| API_Dash
        ViewDetail -->|GET /courses/:id| API_Course
        SelectTugas -->|Show Modal/Page| UI_Tugas
        Submit -->|POST /api/assignments/:id/submit| API_Submit
    end

    subgraph Backend API
        API_Auth -->|Verify| DB_Auth
        API_Dash -->|Fetch Stats| DB_Stats
        API_Course -->|Fetch Modules| DB_Content
        API_Submit -->|Process File| FileSys[File Storage]
        API_Submit -->|Create Record| DB_Sub
    end

    subgraph Database
        DB_Auth[(Users Table)]
        DB_Stats[(Student/Grades Table)]
        DB_Content[(Modules Table)]
        DB_Sub[(Grades/Submission Table)]
    end
```
