
**Student Name:** Huiseon Yi 

**Student Number:**  10599161

**Module:** Advanced Programming (B8IT150)

**Lecturer:** Paul Laird

---

## 📚 Documentation
**Google Docs Link:** https://docs.google.com/document/d/1ZdpxEJkm0rWf6x-e28wwlwvCubOeQxV2J4zNFa6sdmc/edit?usp=sharing

---

# 🧸📝 Childcare Smart Notebook

## System Requirements
1.1 Organisation Selection  

**Organisation:** Daycare Centre  

**Why I chose this organisation:**  
- I worked at a daycare centre and experienced the problem first-hand  
- Currently, teachers manually write in booklets for each child (arrival, departure, nappy, nap time, meals)  
- Teachers also write the same information in a main book (double work)  
- Parents often forget to bring the booklet back the next day  
- When inspectors visit, it's difficult to quickly check a child's attendance rate  

**The Problem:**  
- ❌ Paper-based system is inefficient  
- ❌ Teachers waste time writing duplicate information  
- ❌ Lost booklets = lost data  
- ❌ Hard to generate attendance reports for inspectors  

**The Solution:**  
- ✅ Digital tracking system  
- ✅ Parents can view online (no lost booklets)  
- ✅ Director can generate attendance reports instantly  
- ✅ Inspectors can verify if children meet minimum attendance requirements  

---

1.2 Functional Requirements  

| ID | Requirement | CRUD Type | Actor |
|----|-------------|-----------|-------|
| FR1 | Teacher can record child arrival time | CREATE | Teacher |
| FR2 | Teacher can record child departure time | UPDATE | Teacher |
| FR3 | Teacher can view today's attendance list | READ | Teacher |
| FR4 | Teacher can edit incorrect arrival/departure times | UPDATE | Teacher |
| FR5 | Director can generate attendance report by date range | READ | Director |
| FR6 | Director can download/print report for inspector | READ | Director |
| FR7 | Parent can view their child's attendance status | READ | Parent |
| FR8 | System prevents duplicate check-in (validation) | Validation | System |

**CRUD Mapping:**  
- **CREATE** → Check-in (arrival time)  
- **READ** → View attendance, Generate reports, Parent view  
- **UPDATE** → Check-out (departure time), Edit times  
- **DELETE** → Not required (departure time marks the end of record)

1.3 Non-functional Requirements  

| Category | Requirement | Why Important |
|----------|-------------|----------------|
| Architecture | API-first design with no page refresh | Smooth user experience |
| Performance | Check-in/out should take < 2 seconds | Teachers are busy with children |
| Usability | Simple swipe gestures for mobile | Teachers use phones/tablets |
| Availability | System accessible 8am-6pm (daycare hours) | Core operating hours |
| Data Persistence | Data saved even if server restarts | No lost attendance records |
| Mobile-Friendly | Works on tablets and phones | Teachers move around |
| Accuracy | Timestamps must be accurate | Legal requirement for attendance |
| Security | Parents can only see their own child | Privacy requirement |

---


1.4 Data requirements 

1.5 Use Cases  

---

## 🧑‍🤝‍🧑 Actors

| Actor | Type | Description |
|-------|------|------|
| Teacher | Primary |Records child arrival, departure, and edits attendance times |
| Director | Primary |Generates and downloads attendance reports for inspectors |
| Parent | Primary |Views their child's attendance status |
| Inspector | Stakeholder|Reviews attendance reports (not a direct system user) |

---

## 📋 Use Cases

| Use Case | Primary Actor |
|----------|----------------|
| Record Arrival | Teacher |
| Record Departure | Teacher |
| Edit Attendance Time | Teacher |
| View Today's Attendance List | Teacher |
| Generate Report | Director |
| Download Report | Director |
| View Child Status | Parent |


---

## 🔗  Actor-Use Case Relationships

| Actor | Use Case |
|-------|----------|
| Teacher | Record Arrival |
| Teacher | Record Departure |
| Teacher | Edit Attendance Time |
| Teacher | View Today's Attendance List |
| Director | Generate Report |
| Director | Download Report (extends Generate Report) |
| Parent | View Child Status |

---

## 📖 Detailed Use Cases

### 1️⃣ Use Case: Record Arrival

| Element | Description |
|---------|-------------|
| Use Case Name | Record Arrival |
| Primary Actor | Teacher |
| Precondition | Child has not been checked in today |
| Postcondition | Child's arrival time is recorded in the system |

**Main Flow:**

| Step | Action |
|------|--------|
| 1 | Teacher clicks **"Attendance"** tab |
| 2 | System displays list of all children with OFF buttons (all children show as not check in). |
| 3 | Teacher swipes a child's button **left→right** |
| 4 | Button changes color to ON state(green) |
| 5 | System automatically saves current time as child's arrival time |
| 6 | Teacher can see at a glance which children have arrived |

---

### 2️⃣ Use Case: Record Departure

| Element | Description |
|---------|-------------|
| Use Case Name | Record Departure |
| Primary Actor | Teacher |
| Precondition | Child is currently checked in (ON state) |
| Postcondition | Child's departure time is recorded in the system |

**Main Flow:**

| Step | Action |
|------|--------|
| 1 | Teacher clicks **"Attendance"** tab |
| 2 | System displays list of all children with their current on/off status|
| 3 | Teacher swipes a child who is ON  **right→left** |
| 4 | The button returns to OFF state(red) |
| 5 | System automatically saves current time as the child's departure time |

**Exception Flow (No arrival record):**

| Step | Action |
|------|--------|
| 1 | Teacher tries to swipe OFF a child who is already OFF |
| 2 | Button stays OFF (nothing happens) |
| 3 | Teacher swipes **left→right**  to turn ON first |

---

### 3️⃣ Use Case : Edit Attendance Time

| Element | Description |
|---------|-------------|
| Use Case Name | Edit Attendance Time |
| Primary Actor | Teacher |
| Precondition | An attendance record exists for the child on the selected date |
| Postcondition | The arrival and/or departure time is updated in the system |


**Main Flow:**

| Step | Action |
|------|--------|
| 1 | Teacher clicks on child's **name / profile** |
| 2 | System shows arrival and departure times |
| 3 | Teacher edits time manually |
| 4 | Teacher clicks **Save** |
| 5 | System confirms update |

---

### 4️⃣ Use Case : Generate Report

| Element | Description |
|---------|-------------|
| Use Case Name | Generate Report |
| Primary Actor | Director |
| Precondition | Director is logged into the system |
| Postcondition | An attendance report is generated and displayed |

**Main Flow:**

| Step | Action |
|------|--------|
| 1 | Director selects **date range** (from – to) |
| 2 | Director selects **report type** (attendance summary, daily log) |
| 3 | System generates report based on recorded activities |
| 4 | System displays preview or ready status |

**Exception Flow (No data in range):**

| Step | Action |
|------|--------|
| 1 | If no records exist for selected date range |
| 2 | System shows: *"No records found. Please adjust date range."* |

---

### 5️⃣ Use Case : Download Report

| Element | Description |
|---------|-------------|
| Use Case Name | Download Report |
| Primary Actor | Director |
| Precondition | A report has been generated |
| Postcondition | The report is downloaded as a file (printable format) |

**Main Flow:**

| Step | Action |
|------|--------|
| 1 | After **Generate Report**, Director clicks **"Download"** |
| 2 | System exports report as **PDF** |
| 3 | System confirms download complete |

**Exception Flow (Download fails):**

| Step | Action |
|------|--------|
| 1 | If PDF generation fails |
| 2 | System shows: *"Download failed. Please try again."* |

---

### 6️⃣ Use Case:  View Child Status

| Element | Description |
|---------|-------------|
| Use Case Name | View Child Status |
| Primary Actor | Parent |
| Precondition | Parent has a valid email address registered in the system |
| Postcondition | Parent sees their child's attendance status for today |

**Main Flow:**

| Step | Action |
|------|--------|
| 1 | Parent enters their email address.  |
| 2 | System displays their child or children from the list. |
| 3 | System displays: arrival time, departure time, current status |

**Exception Flow (No record for today):**

| Step | Action |
|------|--------|
| 1 | If no attendance record exists for today |
| 2 | System shows: *"No attendance recorded for today yet."* |

---

##### 7️⃣ Use Case: View Today's Attendance List

| Element | Description |
|---------|-------------|
| Use Case Name | View Today's Attendance List |
| Primary Actor | Teacher |
| Precondition | Teacher is logged into the system |
| Postcondition | Teacher sees all children and their current check-in status |

**Main Flow:**

| Step | Action |
|------|--------|
| 1 | Teacher clicks **"Attendance"** tab |
| 2 | System displays list of all children |
| 3 | For each child, system shows: name, arrival time (if checked in), current status (ON/OFF) |
| 4 | Children who have arrived appear with **green (ON)** status |
| 5 | Children not yet arrived appear with **red (OFF)** status |
| 6 | List automatically refreshes every 30 seconds |

**Exception Flow (No children enrolled):**

| Step | Action |
|------|--------|
| 1 | If no children are enrolled in the system |
| 2 | System shows: *"No children found. Please contact director."* |


## 2. CRUD Operations

| Operation | Description | API Endpoint |
|-----------|-------------|--------------|
| Create | Record arrival time | `POST /api/attendance/checkin` |
| Read | View today's attendance | `GET /api/attendance/today` |
| Read | Generate report | `GET /api/attendance/report?from=` |
| Update | Record departure time | `PUT /api/attendance/checkout/:id` |
| Update | Edit arrival/departure | `PUT /api/attendance/:id` |
| Delete | (Not required) | N/A |

---

## 3. System Architecture

### 3.1 API Endpoints
### 3.2 Tech Stack
### 3.3 Database

---

## 4. Testing

---

## 5. Additional Features

---

## 6. Attributions


