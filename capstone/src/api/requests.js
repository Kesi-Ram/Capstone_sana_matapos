import { reservations, facilities } from '../data/mockData';

const db = structuredClone(reservations);

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const overlaps = (a, b) =>
  a.facility_id === b.facility_id &&
  a.start_datetime < b.end_datetime &&
  a.end_datetime > b.start_datetime;

const conflictsFor = (r) =>
  db.filter((x) => x.status === 'approved' && x.id !== r.id && overlaps(r, x));

const decorate = (r) => {
  const conflicts = r.status === 'pending' ? conflictsFor(r) : [];
  return {
    ...r,
    facility_name: facilities.find((f) => f.id === r.facility_id)?.name ?? 'Unknown',
    has_conflict: conflicts.length > 0,
    conflicts,
  };
};

const sorters = {
  pending: (a, b) => a.start_datetime.localeCompare(b.start_datetime),
  approved: (a, b) => b.decided_at.localeCompare(a.decided_at),
  rejected: (a, b) => b.decided_at.localeCompare(a.decided_at),
};

const findPending = (id) => {
  const r = db.find((x) => x.id === Number(id));
  if (!r) throw new Error('Request not found');
  if (r.status !== 'pending') throw new Error('Request is not pending');
  return r;
};

export async function getRequests(status = 'pending') {
  await delay();
  return db.filter((r) => r.status === status).sort(sorters[status]).map(decorate);
}

export async function getRequest(id) {
  await delay();
  const r = db.find((x) => x.id === Number(id));
  if (!r) throw new Error('Request not found');
  return decorate(r);
}

export async function approveRequest(id) {
  await delay();
  const r = findPending(id);
  if (conflictsFor(r).length > 0) throw new Error('Conflicts with an approved reservation');
  r.status = 'approved';
  r.decided_at = new Date().toISOString().slice(0, 19);
}

export async function rejectRequest(id, reason) {
  await delay();
  const r = findPending(id);
  if (!reason || !reason.trim()) throw new Error('A reason is required');
  r.status = 'rejected';
  r.reject_reason = reason.trim();
  r.decided_at = new Date().toISOString().slice(0, 19);
}