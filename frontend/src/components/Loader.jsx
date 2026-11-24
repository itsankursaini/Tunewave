function Loader({ text = "Loading..." }) {
  return (
    <div className="loader">
      <div className="bars">
        <span /><span /><span /><span />
      </div>
      <p>{text}</p>
    </div>
  );
}

export default Loader;
