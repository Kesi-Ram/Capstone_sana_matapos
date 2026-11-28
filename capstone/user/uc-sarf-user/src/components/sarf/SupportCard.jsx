import { CheckGroup, Input,  TextArea } from './fields'

// One "For BMO / LMO / ITSS / ADMINISTRATIVE Support" card on page 2.
export default function SupportCard({ prefix, title, listLabel, options, venueField, children, approver }) {
  return (
    <div className="box card">
      <div className="card-head">
        {title}
        {venueField && <Input name={`${prefix}Venue`} label="Venue" />}
      </div>
      <div className="card-body">
        <div>
          <span className="lb">{listLabel}</span>
          <CheckGroup name={prefix} options={options} />
          {children}
        </div>
        <div>
          <TextArea name={`${prefix}OtherRequirements`} label="Other requirements" />
          <TextArea name={`${prefix}Remarks`} label="Remarks" />
        </div>
      </div>
    </div>
  )
}
