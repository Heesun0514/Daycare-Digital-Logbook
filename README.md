
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

| Actor | Type |
|-------|------|
| Teacher | Primary |
| Director | Primary |
| Parent | Primary |
| Inspector | Stakeholder (not direct actor) |

---

## 📋 Use Cases

| Use Case | Primary Actor |
|----------|----------------|
| Record Arrival | Teacher |
| Record Departure | Teacher |
| Generate Report | Director |
| Download Report | Director |
| View Child Status | Parent |
| Edit Attendance Time | Teacher |

---

## 🔗 Relationships

| Actor | Use Case |
|-------|----------|
| Teacher | Record Arrival |
| Teacher | Record Departure |
| Teacher | Edit Attendance Time |
| Director | Generate Report |
| Director | Download Report (extends Generate Report) |
| Parent | View Child Status |

---

## 📖 Detailed Use Cases

### 1️⃣ Record Arrival

**Primary Actor:** Teacher

**Main Flow:**

| Step | Action |
|------|--------|
| 1 | Teacher clicks **"Attendance"** tab |
| 2 | System displays list of children with ON/OFF buttons (all OFF) |
| 3 | Teacher swipes a child's button **left→right** |
| 4 | Button changes color to ON state |
| 5 | System automatically saves current time as arrival time |
| 6 | Teacher can see at a glance who has arrived |

---

### 2️⃣ Record Departure

**Primary Actor:** Teacher

**Main Flow:**

| Step | Action |
|------|--------|
| 1 | Teacher clicks **"Attendance"** tab |
| 2 | System displays list of children with ON/OFF status visible |
| 3 | Teacher swipes an ON child's button **right→left** |
| 4 | Button returns to OFF state |
| 5 | System automatically saves current time as departure time |

**Exception Flow (No arrival record):**

| Step | Action |
|------|--------|
| 1 | Teacher tries to swipe OFF a child who is already OFF |
| 2 | Button stays OFF (nothing happens) |
| 3 | Teacher swipes **left→right**  to turn ON first |

---

### 3️⃣ Edit Attendance Time

**Primary Actor:** Teacher

**Main Flow:**

| Step | Action |
|------|--------|
| 1 | Teacher clicks on child's **name / profile** |
| 2 | System shows arrival and departure times |
| 3 | Teacher edits time manually |
| 4 | Teacher clicks **Save** |
| 5 | System confirms update |

---

### 4️⃣ Generate Report

**Primary Actor:** Director

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

### 5️⃣ Download Report

**Primary Actor:** Director

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

### 6️⃣ View Child Status

**Primary Actor:** Parent

**Main Flow:**

| Step | Action |
|------|--------|
| 1 | Parent logs in |
| 2 | Parent selects their child from list |
| 3 | System displays: arrival time, departure time, current status |

**Exception Flow (No record for today):**

| Step | Action |
|------|--------|
| 1 | If no attendance record exists for today |
| 2 | System shows: *"No attendance recorded for today yet."* |

---

