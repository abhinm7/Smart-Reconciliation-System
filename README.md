# Smart Reconciliation System

A full-stack automated reconciliation dashboard that processes bank statements, identifies discrepancies against system data, and provides visual analytics with a complete audit trail for manual corrections.

## Architecture
* **Frontend** : React (Vite) + Tailwind CSS + Recharts
* **Backend API** : Express.js
* **Background Worker** : BullMQ + Node.js
* **Queue** : Redis
* **Database** : MongoDB (Mongoose)

*Flow* : `Frontend (Upload)` → `API` → `Redis Queue` → `Worker (Parse & Match)` → `DB` → `API (Polling)` → `Frontend (Dashboard)`

## Design Decisions (Assumptions, Trade-offs & Limitations)
### Assumptions :
* CSV Schema: The system assumes consistent headers: TransactionID, Amount, Date, and Description.
* Currency: All transactions are processed in a single currency (USD).
* Single Tenant: The application is designed for single-organization use.
### Trade-offs :
* #### Polling vs. WebSockets:
  **Decision**: Used 2-second interval polling for job status.
  *Why* : Significantly reduces infrastructure overhead and complexity while maintaining a highly responsive UX for typical file processing times.
* #### Background Workers (BullMQ): 
  **Decision** : Offloaded parsing to a separate worker process.
  *Why*: Ensures the main API remains responsive and prevents request timeouts during heavy data reconciliation tasks.
### Limitations
* **Audit Snapshot**: User data (email/name) is snapshotted into the audit log. While this preserves history, live profile links would break if a user is deleted from the system.
* **File Scaling**: Currently optimized for files up to ~50MB. Further scaling would require a transition to stream-based parsing to avoid memory spikes.
* **Write Latency (Indexing)***: High-speed read queries for Dashboards and Analytics are prioritized by triple-indexing, which introduces a calculated trade-off of slight overhead during bulk insertions.
  
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