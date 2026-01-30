# Smart Reconciliation System

A full-stack automated reconciliation dashboard that processes bank statements, identifies discrepancies against system data, and provides visual analytics with a complete audit trail for manual corrections.

## Architecture
* **Frontend** : React (Vite) + Tailwind CSS + Recharts
* **Backend API** : Express.js
* **Background Worker** : BullMQ + Node.js
* **Queue** : Redis
* **Database** : MongoDB (Mongoose)

*Flow* : `Frontend (Upload)` → `API` → `Redis Queue` → `Worker (Parse & Match)` → `DB` → `API (Polling)` → `Frontend (Dashboard)`

#### Local Setup (Recommended)

Prerequisites :

* `Node.js` 18+
* `Redis` *(Required for BullMQ queue)*
* `MongoDB` *(Local or Cloud Atlas URL)*

#### Clone Repository

Bash
```
git clone https://github.com/abhinm7/Smart-Reconciliation-System.git
cd smart-reconciliation-system
```
### [Backend Setup](./BACKEND_SETUP.md)
> *Go here to set up the API and Background Worker.*

### [Frontend Setup](./FRONTEND_SETUP.md)
> *Go here to set up the React.js client and environment.*