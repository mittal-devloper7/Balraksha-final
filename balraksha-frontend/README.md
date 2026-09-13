# BalRaksha Frontend

Production-oriented React/Vite frontend for the existing BalRaksha Node/Express backend.

## Run

1. Start the backend from the repository root:
   `npm install && npm run dev`
2. In another terminal:
   `cd frontend`
   `npm install`
   `npm run dev`
3. Open the Vite URL shown in the terminal (normally http://localhost:5173).

## Environment

`frontend/.env`:
- `VITE_API_URL=http://localhost:5000/api`
- `VITE_SOCKET_URL=http://localhost:5000`

## Integration notes

- Auth uses `/api/auth/register`, `/api/auth/login`, `/api/auth/me` with JWT bearer tokens.
- Child report creation uses `/api/reports`; coordinator report listing/details/status uses the protected report endpoints.
- Threat analysis uses `/api/threat/analyze` and does not calculate a second frontend risk score.
- Evidence uses `/api/evidence/:id` and the backend's 5 MB/file-type constraints.
- Coordinator metrics use `/api/coordinator/dashboard` and `/api/coordinator/high-priority`.
- Help uses the existing help REST endpoints and Socket.IO events `join-help`, `send-message`, and `new-message`.
- The frontend never automatically uploads conversation text. The Scan Chat screen expects a structured analysis to be intentionally shared by the extension through `sessionStorage.balraksha_extension_analysis` before calling the backend threat endpoint.
