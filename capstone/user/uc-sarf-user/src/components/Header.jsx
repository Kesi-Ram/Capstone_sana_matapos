export default function Header({ route }) {
  return (
    <header>
      <a className="brand" href="#/">
        <span className="logo">UC</span>
        <span>
          UNIVERSITY OF THE CORDILLERAS
          <br />
          <small>Student Activity Request Form</small>
        </span>
      </a>
      <nav>
        {route === 'sarf' ? (
          <>
            <a href="#/">← Dashboard</a>
            <a className="active" href="#/sarf">On-Campus SARF</a>
          </>
        ) : (
          <>
            <a className="active" href="#/">Dashboard</a>
            <a href="#/sarf">Create SARF</a>
          </>
        )}
      </nav>
    </header>
  )
}
