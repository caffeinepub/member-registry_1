# Member Registry App

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Member registration form with fields: Name, Mobile Number, Address, District (dropdown), Union (dropdown), Assembly (dropdown), Member ID
- Backend storage for member records
- Report/Analysis page with search by Assembly, Member ID, and Name
- Admin page to manage dropdown options: add/edit District, Union, and Assembly values

### Modify
- (none)

### Remove
- (none)

## Implementation Plan

### Backend (Motoko)
- `Member` record type: id (auto-generated), name, mobile, address, districtId, unionId, assemblyId, memberId, createdAt
- `DropdownOption` type: id, label, category (district | union | assembly)
- CRUD for members: addMember, getMembers, getMemberById
- Search functions: searchByAssembly, searchByMemberId, searchByName
- CRUD for dropdown options: addOption, updateOption, deleteOption, getOptionsByCategory
- Seed a few default districts/unions/assemblies

### Frontend
- Bottom navigation with 3 tabs: Registration, Report, Manage Dropdowns
- Registration tab: form with all 7 fields, dropdowns populated from backend, Submit button
- Report tab: search bar with filter toggle (Assembly / Member ID / Name), results list showing full member details
- Manage Dropdowns tab: three sections (District, Union, Assembly) each with a list of current options and Add/Edit/Delete actions
- Mobile-first layout, large touch targets, simple clean design
