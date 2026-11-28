import { useEffect, useMemo, useState } from 'react'
import { FormContext } from './FormContext'
import { CheckGroup, Input, RadioGroup, TextArea } from './fields'
import SupportCard from './SupportCard'
import DateTimePicker from './DateTimePicker'
import {
  ACTIVITY_TYPES, PARTICIPANTS, CHECKLIST, BMO, LMO, ITSS, ADMIN, CHARGES,
  INSURANCE_COLUMNS, INSURANCE_ROWS,
} from '../../data/sarfOptions'
import { rangeConflicts } from '../../utils/schedule'
import { clearDraft, loadDraft, saveDraft } from '../../utils/storage'
import { submitSarf } from '../../api/requests'
const EMPTY_FORM = {
  facilityId:'', participants: [], checklist: [], bmo: [], lmo: [], itss: [], admin: [], charges: [],
}

export default function SarfForm() {
  const [values, setValues] = useState(() => ({ ...EMPTY_FORM, ...(loadDraft() || {}) }))
  const [message, setMessage] = useState(null)
  const [formKey, setFormKey] = useState(0) // bump to also clear the file input

  const API_BASE_URL = '/api'

  const [facilities, setFacilities] = useState([])
  const [facilitiesLoading, setFacilitiesLoading] = useState(true)
  const [facilitiesError, setFacilitiesError] = useState('')

  const [bookings, setBookings] = useState([])
  const [availabilityLoading, setAvailabilityLoading] = useState(false)
  const [availabilityError, setAvailabilityError] = useState('')

useEffect(() => {
  async function loadFacilities() {
    try {
      const response = await fetch(`${API_BASE_URL}/facilities.php`)

      if (!response.ok) {
        throw new Error('Could not load facilities.')
      }

      const facilityList = await response.json()
      setFacilities(facilityList)
    } catch (error) {
      setFacilitiesError('Could not load the facility list.')
    } finally {
      setFacilitiesLoading(false)
    }
  }

  loadFacilities()
}, [])



useEffect(() => {
  let cancelled = false

  async function loadAvailability() {
    // Clear old bookings when the facility changes.
    setBookings([])
    setAvailabilityError('')

    // Don't fetch if no facility is selected.
    if (!values.facilityId) {
      setAvailabilityLoading(false)
      return
    }

    setAvailabilityLoading(true)

    try {
      const response = await fetch(
        `${API_BASE_URL}/availability.php?facility_id=${encodeURIComponent(values.facilityId)}`
      )

      if (!response.ok) {
        throw new Error('Could not load facility availability.')
      }

      // PHP returns an array of reservations.
      const bookingRows = await response.json()

      // Convert the date strings into JavaScript Date objects.
      const calendarBookings = bookingRows.map((booking) => {
        return {
          start: new Date(booking.start),
          end: new Date(booking.end),
        }
      })

      console.log('Loaded bookings:', calendarBookings)

      if (!cancelled) {
        setBookings(calendarBookings)
      }

    } catch (error) {
      console.error('Availability error:', error)

      if (!cancelled) {
        setBookings([])
        setAvailabilityError(error.message)
      }

    } finally {
      if (!cancelled) {
        setAvailabilityLoading(false)
      }
    }
  }

  loadAvailability()

  return () => {
    cancelled = true
  }
}, [values.facilityId])



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


  function handleStartChange(v) {
    api.setField('start', v)
    // an end that is no longer after the new start would be invalid
    if (values.end && new Date(values.end) <= new Date(v)) api.setField('end', '')
  }

  function show(type, text) {
    setMessage({ type, text })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleSaveDraft() {
  saveDraft(values)
  show('ok', 'Draft saved.')
}

  async function handleSubmit(e) {
    e.preventDefault() // native `required` checks have already passed at this point
    if (!values.start || !values.end) {
      show('error', 'Select the activity start and end date/time.')
      return
    }
    if (new Date(values.end) <= new Date(values.start)) {
      show('error', 'Activity end date/time must be later than the start date/time.')
      return
    }
    if (availabilityLoading || availabilityError) {
      show('error', 'Wait for the facility availability to load before submitting.')
      return
    }
    if (rangeConflicts(bookings, new Date(values.start), new Date(values.end))) {
      show('error', 'The selected schedule overlaps a booked time slot. Choose another time.')
      return
    }


try {
  const result = await submitSarf(values)
  console.log("SARF values before submission:", values);

  console.log("SARF RESPONSE:", result)

  clearDraft()
  setValues(EMPTY_FORM)
  setFormKey((key) => key + 1)
  show("ok",`Request submitted successfully! Request ID: ${result.requestId}`)

} catch (error) {
  show('error', error.message)
}
  }

  return (
    <FormContext.Provider value={api}>
      <div className="page-heading">
        <div>
          <h1>Student Activity Request Form for On-Campus</h1>
        </div>
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
              <small className="muted">Taken slots follow the venue entered below. With no venue entered, all campus bookings are shown.</small>
              <label className="ln">Venue/Location <em>*</em>
                <select
                  name="facilityId"
                  value={values.facilityId ?? ''}
                  onChange={(event) => api.setField('facilityId', event.target.value)}
                  required
                  disabled={facilitiesLoading || Boolean(facilitiesError)}
                >
                  <option value="" required>
                  {facilitiesLoading ? 'Loading facilities...' : 'Select a venue'}
                  </option>
                      {facilities.map((facility) => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name}
                  </option>
                  ))}
                </select>
              </label>
              <DateTimePicker label="Start" mode="start" value={values.start} onChange={handleStartChange} bookings={bookings} />
              <DateTimePicker label="End" mode="end" value={values.end} minValue={values.start} onChange={(value) => api.setField('end', value)} bookings={bookings}/>
          </div>

                {facilitiesError && <small className="error">{facilitiesError}</small>}
                {availabilityLoading && <small className="muted">Checking availability...</small>}
                {availabilityError && <small className="error">{availabilityError}</small>}

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
          </div>

          {/* RIGHT COLUMN */}
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
              <input type="checkbox" name="serviceAgreement" id="serviceAgreement" required />
              <label htmlFor="serviceAgreement">I agree to the terms and conditions</label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <a className="btn secondary" href="#/">Cancel</a>
          <div>
            <button className="btn secondary" type="button" onClick={handleSaveDraft}>Save Draft</button>{' '}
            <button className="btn" type="submit" onClick={submitSarf}>Submit SARF</button>
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