function ShowError({error}) {
  return (
    <div className='Error'>
      <pre>
        {error}
      </pre>
    </div>
  );
}

export default ShowError;
