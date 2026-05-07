- Booking verification endpoint (GET /verify-booking/:id)

  Admin panel (/admin):
  - JWT-based login with timing-safe credential comparison
  - Movie CRUD with image upload (poster + wide banner)
  - Session CRUD with bulk date creation (pick multiple days for same time/hall)
  - Session detail view showing all reservations with a seat-map visualization
  - Protected routes with auto-redirect on 401

  ---
  Security Concerns

  Critical:

  1. .env is in the repo — The backend .env file at cinema-dj-be/.env contains a real admin password (admin123) and the JWT secret. If this repo is ever pushed publicly, the secret is compromised.
  2. database.db is committed — The SQLite database (32KB) at cinema-dj-be/database.db contains all bookings, including customer names, emails, phone numbers, and IP addresses. This is a PII breach waiting to happen.
  3. Race condition in booking (server.ts:667-749) — The duplicate check runs before the transaction starts. Two concurrent bookings can both pass the duplicate check, then both try to insert. The UNIQUE(session_id, seat) constraint would
  block one, but the error is caught generically as a 500 rather than as a proper conflict response.
  4. No rate limiting — Zero protection on /admin/login (brute force) or /book (abuse/spam).
  5. IP-based duplicate detection hurts legitimate users — checkForDuplicateBooking (server.ts:424-455) blocks bookings from the same IP or phone number for the same session. This means:
    - Two people behind the same NAT (coworkers, family, cafe) can't both book
    - Same person can't book for themselves and a friend
    - But it's trivially bypassed by using a different device/network
  6. Error messages leak internals — handleDbError (server.ts:234-240) returns raw error details to the client, which can expose database schema info and query structure.

  Moderate:

  7. No seat expiry/cancellation — The UI says "come 1 hour before or your reservation will be cancelled" but there is zero backend enforcement. Seats are permanently reserved once booked.
  8. No CSRF protection — API uses credentials: true CORS but no CSRF tokens. The JWT from localStorage is sent automatically by axios, making it vulnerable to CSRF if the origin check is bypassed.
  9. No email verification — Users receive no confirmation email; the only proof of booking is a QR code in a modal. No way to recover a lost booking.
  10. File upload path in originalname — While Multer prepends a timestamp, the original filename is used in the stored path without sanitization beyond the MIME check (server.ts:28-35).
  11. No HTTPS security headers — No helmet, HSTS, or other security headers in Express.

  Low:

  12. transfer_link field accepts any valid URL — could be exploited to display phishing links.
  13. serveIndex not explicitly disabled for express.static('uploads'), potentially allowing directory listing.

  ---
  Logic Issues

  1. Seat state clobbering (TheaterSeating.tsx:100-124) — handleReserveSeats resets the entire seat map including the selected state when it re-runs via useEffect. If a user is mid-selection when a refetch fires, their selections get wiped.
  2. No pagination — GET /movies, GET /sessions, and admin session details return unfiltered full result sets. This won't scale past a few hundred records.
  3. Movie deletion orphans images (server.ts:948-992) — Deleting a movie cascades through sessions and bookings but never removes the uploaded image files from disk (./uploads).
  4. Phone number built from parts (TheaterSeating.tsx:191-192) — The frontend strips the 77 prefix for user input, then re-adds it at submission. If someone pastes a full number, they get 7777.... The backend validates with .length(8) for the
   full number, so this is fragile.
  5. String comparison for dates (HomePage.tsx:52) — sessionDate >= todayIsoDate relies on ISO string ordering, which works but is fragile — any format change breaks it silently.
  6. formatDate drops the day name (utils/date.ts:30) — When noD=true, it returns date month year — but the condition test is just a truthy check on a boolean default.
  7. No transaction for session creation — AddSession fires multiple POST requests in parallel with Promise.allSettled. If some succeed and some fail (hall/date/time conflict), there's no rollback — the user gets a partial batch.
  8. Wrong route param for booking — The URL is /movie/booking/:id but the id param is actually the session ID, not the movie ID. The naming is misleading.