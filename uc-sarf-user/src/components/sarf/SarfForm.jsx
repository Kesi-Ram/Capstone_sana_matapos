import { useMemo, useState } from 'react'
import { FormContext } from './FormContext'
import { CheckGroup, Input, RadioGroup, SignBlock, TextArea } from './fields'
import SupportCard from './SupportCard'
import {
  ACTIVITY_TYPES, PARTICIPANTS, CHECKLIST, BMO, LMO, ITSS, ADMIN, CHARGES,
  INSURANCE_COLUMNS, INSURANCE_ROWS,
} from '../../data/sarfOptions'
import { clearDraft, loadDraft, saveDraft, saveRequest } from '../../utils/storage'

const EMPTY_FORM = {
  participants: [], checklist: [], bmo: [], lmo: [], itss: [], admin: [], charges: [],
}

export default function SarfForm() {
  const [values, setValues] = useState(() => ({ ...EMPTY_FORM, ...(loadDraft() || {}) }))
  const [message, setMessage] = useState(null)
  const [formKey, setFormKey] = useState(0) // bump to also clear the file input

  const api = useMemo(() => ({
    values,
    setField: (name, value) => setValues((v) => ({ ...v, [name]: value })),
    // force: true = ensure ticked, false = ensure unticked, undefined = flip
    toggleItem: (name, value, force) =>
      setValues((v) => {
        const list = v[name] ?? []
        const has = list.includes(value)
        const next = force ?? !has
        if (next === has) return v
        return { ...v, [name]: next ? [...list, value] : list.filter((x) => x !== value) }
      }),
  }), [values])

  function show(type, text) {
    setMessage({ type, text })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleSaveDraft() {
    const ok = saveDraft(values)
    show(ok ? 'ok' : 'error', ok
      ? 'Draft saved in this browser. You can continue on this device.'
      : 'Could not save the draft. Check that browser storage is enabled.')
  }

  function handleSubmit(e) {
    e.preventDefault() // native `required` checks have already passed at this point
    if (new Date(values.end) <= new Date(values.start)) {
      show('error', 'Activity end date/time must be later than the start date/time.')
      return
    }
    const id = `SARF-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    saveRequest({
      id,
      title: values.title,
      venue: values.venue,
      date: new Date(values.start).toLocaleString(),
      status: 'Pending',
      stage: 'President/Organizer',
      data: values,
      submittedAt: new Date().toISOString(),
    })
    clearDraft()
    setValues(EMPTY_FORM)
    setFormKey((k) => k + 1)
    show('ok', `SARF submitted in this browser prototype. Control No.: ${id}. This does not yet send the request to UC signatories.`)
  }

  return (
    <FormContext.Provider value={api}>
      <div className="page-heading">
        <div>
          <div className="eyebrow">UC-AR-FORM-36 · March 29, 2021 · Rev.01</div>
          <h1>Student Activity Request Form for On-Campus</h1>
          <p>Online version of the two-page UC form</p>
        </div>
        <button className="btn secondary" type="button" onClick={() => window.print()}>
          Print / Save as PDF
        </button>
      </div>

      {message && (
        <div id="message" className={`alert ${message.type}`} role="status">{message.text}</div>
      )}

      <form id="sarfForm" key={formKey} onSubmit={handleSubmit}>
        {/* ================= PAGE 1 ================= */}
        <div className="box sheet-head">
          <strong>VICE PRESIDENT FOR ACADEMICS AND RESEARCH</strong>
          <Input name="college" label="College" required />
        </div>

        <div className="cols">
          <div className="box txt">
            This SARF is to be used by colleges, offices, recognized student organizations, student
            councils and faculty members for requesting approval of student activities in the campus.
            Submit SARF in Triplicate, two (2) weeks prior to start date of activity.
          </div>
          <div className="box">
            <span className="lb">Type of Activity <em>*</em></span>
            <RadioGroup name="activityType" options={ACTIVITY_TYPES} required />
          </div>
        </div>

        <div className="cols">
          {/* LEFT COLUMN */}
          <div className="col">
            <div className="box">
              <Input name="organization" label="Name of Organization/Office/College" required />
              <Input name="title" label="Title of Activity Program" required />
              <TextArea name="nature" label="Nature of Activity" required />
              <span className="lb">Activity Date/Time <em>*</em></span>
              <Input name="start" label="Start" type="datetime-local" required />
              <Input name="end" label="End" type="datetime-local" required />
              <Input name="venue" label="Venue/Location" required />
            </div>

            <div className="box">
              <span className="lb">Participants</span>
              <CheckGroup name="participants" options={PARTICIPANTS} />
              <Input className="ln mt" name="participantsTotal" label="Estimated Total No of Participants" type="number" min="1" required />
            </div>

            <div className="box">
              <Input name="budgetSource" label="Source of Budget" />
              <Input name="budget" label="Estimated Total Budget" type="number" min="0" step="0.01" />
            </div>

            <div className="box">
              <div className="box-title">IN-CHARGE OF ACTIVITY</div>
              <Input name="personName" label="Name" required />
              <Input name="personDesignation" label="Designation" required />
              <Input name="personContact" label="Contact" required />
              <Input name="personEmail" label="Email" type="email" required />
            </div>

            <div className="box">
              <div className="box-title">
                LIABILITY WAIVER<small>(To be accomplished by the Adviser/Coordinator)</small>
              </div>
              <p className="txt">
                I certify that the undersigned will stay with the student-organizers and participants
                for the duration of the aforementioned activity. Further, I acknowledge that as an
                Adviser of the organizing body, I am fully liable to any untoward events that may arise
                during the conduct of the above activity. My signature below indicates that I have read
                the policy stated in this Liability Waiver Form, and that I agree to abide by this policy.
              </p>
              <SignBlock label="Signature:" title="ADVISER/COORDINATOR" nameKey="adviserName" dateKey="adviserDate" />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col">
            <div className="box">
              <TextArea name="remarks" label="Remarks/Conditions" />
            </div>

            <div className="box">
              <span className="lb">Checklist: (For Review Use Only)</span>
              <CheckGroup name="checklist" options={CHECKLIST} />
              <label className="lb mt">
                Attach supporting documents
                <input type="file" name="attachments" multiple />
              </label>
              <small className="muted">Prototype note: attachments are not uploaded or stored on a server yet.</small>
            </div>

            <div className="box">
              <div className="box-title">SIGNATURES: (Printed Name and Signature, Date)</div>
              <SignBlock label="Submitted by:" title="President/Organizer" nameKey="presidentName" dateKey="presidentDate" />
              <SignBlock label="Noted by:" title="Adviser/Coordinator" nameKey="adviserNotedName" dateKey="adviserNotedDate" />
              <SignBlock label="Recommending Approval:" title="Academic Dean/Prog. Chair" nameKey="deanName" dateKey="deanDate" />
              <SignBlock label="Approved by:" title="VP for Academics and Research" nameKey="vpAcadName" dateKey="vpAcadDate" />
              <SignBlock label="Venue Reserved:" title="Campus Facilities, Planning & Dev’t Officer" nameKey="venueReservedName" dateKey="venueReservedDate" />
            </div>
          </div>
        </div>

        <div className="box">
          <div className="box-title">Amount of insurance per insured individual (PhP)</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>{INSURANCE_COLUMNS.map((c) => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {INSURANCE_ROWS.map(([who, ...amounts]) => (
                  <tr key={who}>
                    <th>{who}</th>
                    {amounts.map((a, i) => <td key={i}>{a}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= PAGE 2 ================= */}
        <div className="page-break" />
        <p className="section-sub">Page 2 – Support Requirements. Complete only the sections that apply.</p>

        <div className="cols">
          <SupportCard prefix="bmo" title="For BMO Support: (if applicable)" venueField
            listLabel="Technical Requirements:" options={BMO} approver="Personnel In-Charge" />
          <SupportCard prefix="lmo" title="For LMO Support: (if applicable)"
            listLabel="Property Requirements:" options={LMO} approver="Head, LMO" />
          <SupportCard prefix="itss" title="For ITSS Support: (if applicable)"
            listLabel="Support Requirements:" options={ITSS} approver="Director" />
          <SupportCard prefix="admin" title="For ADMINISTRATIVE Support: (if applicable)"
            listLabel="Support Requirements:" options={ADMIN} approver="VP for Admin. and Acad. Services">
            <TextArea className="lb mt" name="greenBoardText" label="Green board posting text / details" />
          </SupportCard>
        </div>

        {/* FMO */}
        <div className="box card">
          <div className="card-head">For FMO Use:</div>
          <div className="fmo">
            <div>
              <span className="lb">Applicable Charges: (if any)</span>
              <CheckGroup name="charges" options={CHARGES} />
              <Input className="ln mt" name="chargeTotal" label="TOTAL:" />
            </div>
            <div>
              <TextArea name="fmoOtherRequirements" label="Other requirements" />
              <TextArea name="fmoRemarks" label="Remarks" />
            </div>
            <div>
              <div className="box-title">Service Agreement</div>
              <p className="txt">
                I have read and discussed with the Director of FMO the policies and guidelines on the
                use of UC facilities and accept personal responsibility to abide by them. I understand
                that the use of UC facilities is contingent upon the approval of the concerned
                officials. I also understand that there may be additional charges as enumerated here.
              </p>
              <p className="txt">
                By signing here, I acknowledge responsibility for the care and condition of facilities
                and equipment used during the activity.
              </p>
              <SignBlock label="Signature:" title="In-charge of Activity" nameKey="fmoInChargeName" dateKey="fmoInChargeDate" />
            </div>
          </div>
          <SignBlock label="Approved and Reserved:" title="Campus Facilities, Planning & Dev’t Officer"
            nameKey="fmoApprovedandReserved" dateKey="fmoApprovalDate" />
        </div>

        <div className="form-actions">
          <a className="btn secondary" href="#/">Cancel</a>
          <div>
            <button className="btn secondary" type="button" onClick={handleSaveDraft}>Save Draft</button>{' '}
            <button className="btn" type="submit">Submit SARF</button>
          </div>
        </div>

        <p className="notice">
          Prototype only: this version saves drafts and submitted requests in this browser's local
          storage. It does not yet send email, upload attachments, collect verified e-signatures, or
          reserve a venue. Online submission does not replace UC's official filing requirements until
          authorized by the University.
        </p>
      </form>
    </FormContext.Provider>
  )
}
