# 📚 DronaNotes — Submission Repository

> A community-driven platform where students share and access academic resources like notes, papers, syllabus, and practicals.

Contribute easily via Pull Requests — everything is automatically processed and published. 🚀

---

## 🚀 How to Contribute (Step-by-Step)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yajatkaul/DronaGIT.git
cd DronaGIT
```

---

### 2️⃣ Create a New Branch

```bash
git checkout -b add-your-resource
```

> 💡 Always create a separate branch for your contribution.

---

### 3️⃣ Create a Folder in `submissions/`

Inside the `submissions/` directory, create a folder with a **clear and descriptive name**:

```
submissions/cse3-data-structures-paper/
```

---

### 4️⃣ Add Your Files

Your folder must contain:

```
submissions/cse3-data-structures-paper/
  ├── paper.pdf
  └── metadata.json
```

> 📌 Only **one PDF per folder** is allowed.

---

### 5️⃣ Fill in `metadata.json`

Use the correct structure based on your resource type:

#### 📋 Required Fields

| Field       | Required        | Description                                          |
| ----------- | --------------- | ---------------------------------------------------- |
| `type`      | ✅               | `notes`, `papers`, `syllabus`, `practicals`          |
| `title`     | ✅               | Title of the resource                                |
| `subject`   | ✅               | Subject name                                         |
| `branch`    | ✅               | e.g. `CSE`, `AIML`, `ECE`                            |
| `semester`  | ✅               | Semester number                                      |
| `year`      | ✅ (papers only) | Year of paper                                        |
| `paperType` | ✅ (papers only) | `Sessional`, `University`, `Pre University`, `Other` |

---

### 📝 Example — Notes

```json
{
  "type": "notes",
  "title": "Data Structures Unit 2",
  "subject": "ADS",
  "branch": "AIML",
  "semester": "3"
}
```

---

### 📄 Example — Paper

```json
{
  "type": "papers",
  "title": "Data Structures End Term 2023",
  "subject": "ADS",
  "branch": "AIML",
  "semester": "3",
  "year": "2023",
  "paperType": "University"
}
```

---

### 6️⃣ Commit Your Changes

```bash
git add .
git commit -m "Add: CSE3 Data Structures paper"
```

---

### 7️⃣ Push to GitHub

```bash
git push origin add-your-resource
```

---

### 8️⃣ Open a Pull Request

* Go to your fork on GitHub
* Click **“Compare & Pull Request”**
* Submit it to the `main` branch

🎉 Once merged, your resource will be **automatically published**.

---

## 📋 Contribution Rules

* 📄 Only **one PDF per folder**
* 📁 Folder must include a valid `metadata.json`
* 🚫 No duplicate submissions
* 🏷️ Only allowed `type` values will be accepted

---

## 📜 License

MIT License — open source and community-driven ❤️
