# Firebase Security Specification - Leads Collection

## 1. Data Invariants

For any document in the `leads` collection:
- It must have exactly these keys upon creation: `name`, `email`, `company`, `selectedExperience`, `budgetRange`, `projectDescription`, `status`, `createdAt`.
- Type requirements:
  - `name`: string (1 to 100 characters)
  - `email`: string (1 to 100 characters)
  - `company`: string (1 to 100 characters)
  - `selectedExperience`: string (one of "Love Story Experience", "Birthday Experience", "Proposal Experience", "Wedding Experience", "Memorial Experience", "Custom Experience")
  - `budgetRange`: string (one of "$99 - $249", "$249 - $500", "$500+")
  - `projectDescription`: string (1 to 5000 characters)
  - `status`: string (one of "new", "qualified", "proposal_sent", "won", "lost")
  - `createdAt`: string (1 to 100 characters) or valid map/timestamp format.
- Anyone can submit a lead (create operation is public), but it must strictly pass validation rules to prevent "Denial of Wallet" and Spam attacks.
- Reading, updating, and deleting is allowed in the demo sandbox space; however, we enforce update checks to prevent shadow fields or unauthorized state manipulation.

---

## 2. The "Dirty Dozen" Payloads (Anti-Vulnerability Test Cases)

1. **Payload 1: Shadow Fields / Extra Keys Attack (Create)**
   - Attempting to slide in `isAdmin: true` or `bounty: 100000`.
   - Result: `PERMISSION_DENIED` [Exact key size and presence verification].

2. **Payload 2: Missing Required Field (Create)**
   - Omitting `selectedExperience`.
   - Result: `PERMISSION_DENIED` [Schema integrity verified].

3. **Payload 3: Selected Experience Injection / Bad Value (Create)**
   - Setting `selectedExperience` to `"Super-Secret-Hacker-Class"`.
   - Result: `PERMISSION_DENIED` [Enum restriction validated].

4. **Payload 4: Budget Range Poisoning (Create)**
   - Setting `budgetRange` to `"Free Forever"`.
   - Result: `PERMISSION_DENIED` [Enum validation failed].

5. **Payload 5: Spam Resource Exhaustion (Name size > 100)**
   - Injecting 1 MB of junk as `name`.
   - Result: `PERMISSION_DENIED` [Character limit validation].

6. **Payload 6: Empty Field Validation (Company size == 0)**
   - Attempting to pass empty company `""`.
   - Result: `PERMISSION_DENIED` [Size range check].

7. **Payload 7: Unapproved Field Update (Update)**
   - Attempting to update `email` of an existing lead from the pipeline dashboard.
   - Result: `PERMISSION_DENIED` [Modifications restricted to `status` only].

8. **Payload 8: Terminal State Status Shift (Won Status Lock Bypass)**
   - Attempting to move a lead with terminal status (`won` or `lost`) back to `new`.
   - Result: `PERMISSION_DENIED` [Locked pipeline status].

9. **Payload 9: Path ID Injection Poisoning**
   - Attempting to execute single-document read/write on a lead ID with invalid characters.
   - Result: `PERMISSION_DENIED` [Id pattern and size enforcement].

10. **Payload 10: Value Type Mismatch (Budget Range as Integer)**
    - Passing `budgetRange: 500` instead of a string.
    - Result: `PERMISSION_DENIED` [Type safety constraint].

11. **Payload 11: Spoofed Timestamps**
    - Passing a futuristic or altered timestamp string.
    - Result: `PERMISSION_DENIED` [Time synchronization verification].

12. **Payload 12: Blank Status Injection**
    - Submitting a lead with empty/undefined `status`.
    - Result: `PERMISSION_DENIED`.
