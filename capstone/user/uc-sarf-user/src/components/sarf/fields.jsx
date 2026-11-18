import { useSarf } from './FormContext'

export function Input({ name, label, required, className = 'ln', ...rest }) {
  const { values, setField } = useSarf()
  return (
    <label className={className}>
      {label}
      {required && <em>*</em>}
      <input
        name={name}
        value={values[name] ?? ''}
        onChange={(e) => setField(name, e.target.value)}
        required={required}
        {...rest}
      />
    </label>
  )
}

export function TextArea({ name, label, required, className = 'lb' }) {
  const { values, setField } = useSarf()
  return (
    <label className={className}>
      {label}
      {required && <em>*</em>}
      <textarea
        className="ta"
        name={name}
        value={values[name] ?? ''}
        onChange={(e) => setField(name, e.target.value)}
        required={required}
      />
    </label>
  )
}

export function RadioGroup({ name, options, required }) {
  const { values, setField } = useSarf()
  return (
    <div className="cb">
      {options.map((opt) => (
        <label key={opt}>
          <input
            type="radio"
            name={name}
            value={opt}
            checked={values[name] === opt}
            onChange={() => setField(name, opt)}
            required={required}
          />
          {opt}
        </label>
      ))}
    </div>
  )
}

// Checkbox list. Options are plain strings or { value, label, before, qty, text, hint }.
// Typing in a quantity / text box ticks its checkbox automatically.
export function CheckGroup({ name, options }) {
  const { values, setField, toggleItem } = useSarf()
  const selected = values[name] ?? []

  return (
    <div className="cb">
      {options.map((o) => {
        const opt = typeof o === 'string' ? { value: o, label: o } : o
        return (
          <label key={opt.value}>
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={() => toggleItem(name, opt.value)}
            />
            <span>
              {opt.before}
              {opt.qty && (
                <input
                  className="inline-input qty"
                  type="number"
                  min="1"
                  aria-label={`Quantity: ${opt.label}`}
                  value={values[opt.qty] ?? ''}
                  onChange={(e) => {
                    setField(opt.qty, e.target.value)
                    toggleItem(name, opt.value, e.target.value !== '')
                  }}
                />
              )}
              {opt.label}
              {opt.text && (
                <input
                  className="inline-input"
                  aria-label={opt.label}
                  value={values[opt.text] ?? ''}
                  onChange={(e) => {
                    setField(opt.text, e.target.value)
                    toggleItem(name, opt.value, e.target.value.trim() !== '')
                  }}
                />
              )}
              {opt.hint && <small>{opt.hint}</small>}
            </span>
          </label>
        )
      })}
    </div>
  )
}

// Signature line (left) + date on a line (right). The signature space is left blank.
export function SignBlock({ label, title, nameKey, dateKey }) {
  const { values, setField } = useSarf()
  return (
    <div className="sign-block">
      <div className="sign-col">
        <span className="sign-label">{label}</span>
        <div className="sign-space" />
        <div className="sign-line" />
        <input
          className="sign-name"
          placeholder="Type name"
          aria-label={`Printed name of ${title}`}
          value={values[nameKey] ?? ''}
          onChange={(e) => setField(nameKey, e.target.value)}
        />
        <span className="sign-title">{title}</span>
      </div>
      <div className="sign-col">
        <span className="sign-label">Date:</span>
        <input
          className="sign-date"
          type="date"
          aria-label={`Date signed by ${title}`}
          value={values[dateKey] ?? ''}
          onChange={(e) => setField(dateKey, e.target.value)}
        />
        <div className="sign-line" />
      </div>
    </div>
  )
}
