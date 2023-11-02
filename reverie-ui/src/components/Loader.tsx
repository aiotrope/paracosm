const Loader = () => {
  return (
    <div role="status" className="grid">
      <div aria-busy="true"></div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default Loader
