const Select = props => {
    return(
        <div className={`${props.clases ? `${props.clases} has-validation mb-3` : 'has-validation mb-3'}`}>
            <label htmlFor={props.id}>{props.label}</label>
            <select {...props.register} id={props.id} className="form-select" onChange={props.handleOnChange}>
                <option>{props.placeholder}</option>
                {props.options.map((option) => ( <option key={option.value} value={option.value}>{option.texto}</option> ))}
            </select>
            <div className='invalid-feedback'>{props.error ? props.error.mensaje : ''}</div>
        </div>
    )
}

export default Select