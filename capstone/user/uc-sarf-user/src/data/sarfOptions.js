// Option lists for the checkbox groups.
// qty  = a number input shown before the label (the "____ pcs of ..." items)
// text = a text input shown after the label ("others: ____")
// before/hint = extra wording around the inputs

export const ACTIVITY_TYPES = ['Academic', 'Non-Academic', 'College/Institutional']

export const PARTICIPANTS = [
  'members/office staff only',
  'with other UC students/employees',
  'open to Public/Outsiders',
]

export const CHECKLIST = [
  'Copy of Letter of Invitation/MOA (if with outside partner)',
  'Speaker/Facilitator Resume',
  'Organizing Committee',
  'Budget Request Form',
  'Copy of USC/CSC/Alternative Resolution',
  'Copy of Program/Schedule of Activities',
  'Copy of Promotional Materials/Posters',
  'Excuse Letter for Students',
  'List of Participants',
  'Venue Floor Plan/Physical Set-up',
  'Curfew Form (If Applicable)',
]

export const BMO = [
  { value: 'wireless microphones', qty: 'bmoWirelessQty', label: 'pcs of wireless microphones' },
  { value: 'wired microphones', qty: 'bmoWiredQty', label: 'pcs of wired microphones' },
  { value: 'microphone stands', qty: 'bmoStandsQty', label: 'pcs of microphone stands' },
  { value: 'laptop', label: 'Laptop' },
  { value: 'projector', label: 'Projector' },
  { value: 'PA system', label: 'PA system' },
  { value: 'AV mixer', label: 'AV mixer' },
  { value: 'par lights', qty: 'bmoParQty', label: 'par lights' },
  { value: 'moving intelligent lights', label: 'Moving intelligent lights' },
  { value: 'follow spot', label: 'Follow spot' },
  { value: 'others', label: 'others:', text: 'bmoOther' },
]

export const LMO = [
  { value: 'podium', label: 'podium' },
  { value: 'Philippine flag', label: 'Philippine flag' },
  { value: 'UC flag', label: 'UC flag' },
  { value: 'flagpoles', label: 'flagpoles' },
  { value: 'long tables', qty: 'lmoLongTablesQty', label: 'pcs of long tables' },
  { value: 'teacher tables', qty: 'lmoTeacherTablesQty', label: 'pcs of teacher tables' },
  { value: 'platforms', qty: 'lmoPlatformsQty', label: 'pcs of platforms' },
  { value: 'chairs', qty: 'lmoChairsQty', label: 'pcs of chairs' },
  { value: 'trashbins', qty: 'lmoTrashbinsQty', label: 'pcs of trashbins' },
  { value: 'others', label: 'others:', text: 'lmoOther' },
]

export const ITSS = [
  { value: 'internet connection', label: 'internet connection' },
  { value: 'desktop station', label: 'desktop station' },
  { value: 'intranet network support', label: 'intranet network support' },
  { value: 'web/FB posting', label: 'web/FB posting' },
  { value: 'additional media equipment', label: 'additional media equipment' },
  { value: 'others', label: 'others:', text: 'itssOther' },
]

export const ADMIN = [
  { value: 'medical/first-aid', label: 'medical/first-aid' },
  { value: 'security guards', label: 'security guards' },
  { value: 'parking for vehicles', before: 'parking for', qty: 'adminParkingQty', label: 'vehicles' },
  { value: 'other personnel/staff', label: 'other personnel/staff:', text: 'adminPersonnel' },
  { value: 'transportation', label: 'transportation:', text: 'adminTransport' },
  {
    value: 'green board posting',
    label: 'green board posting',
    hint: '(write text below, all subject to approval and editing)',
  },
]

export const CHARGES = [
  { value: 'Janitorial', label: 'Janitorial:', text: 'chargeJanitorial' },
  { value: 'House lights', label: 'House lights:', text: 'chargeLights' },
  { value: 'Technical', label: 'Technical:', text: 'chargeTechnical' },
  { value: 'Water', label: 'Water:', text: 'chargeWater' },
  { value: 'Staff OT', label: 'Staff OT:', text: 'chargeStaffOT' },
  { value: 'Others', label: 'Others:', text: 'chargeOthers' },
]

export const INSURANCE_COLUMNS = [
  'Description of Persons to be Covered',
  'Basic Life',
  'Accidental Death & Dismemberment or Disablement',
  'Double Indemnity for Public Conveyance',
  'Accident Medical Expense',
  'Daily Accident Hospital Benefit',
  'Unprovoked Murder and Assault',
]

export const INSURANCE_ROWS = [
  ['All Eligible Students', '15,000', '150,000', '300,000', '50,000', '500', '150,000'],
]
